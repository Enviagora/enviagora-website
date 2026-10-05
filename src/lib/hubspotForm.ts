import { getSiteConfig } from './siteConfig';
import { track, trackLead } from './analytics';

/**
 * Ponte com o formulário oficial do HubSpot (embed v4), via os "global form
 * events" e a API `HubSpotFormsV4`:
 * https://developers.hubspot.com/docs/api-reference/latest/marketing/forms/global-form-events
 */

/** Nomes internos dos campos do formulário 909bd17e… (definição do HubSpot). */
export const HS_FIELDS = {
  orderVolume: '0-1/monthly_order_volume',
  need: '0-1/primary_business_need',
  firstName: '0-1/firstname',
  lastName: '0-1/lastname',
  email: '0-1/email',
  phone: '0-1/phone',
  website: '0-1/website',
  erp: '0-1/erp_used',
  segment: '0-1/product_segment',
  consentCommunications: 'LEGAL_CONSENT.subscription_type_3362838547',
  consentProcessing: 'LEGAL_CONSENT.processing',
} as const;

/** Evento de janela disparado após um envio bem-sucedido do formulário. */
export const LEAD_EVENT = 'enviagora:lead';

/** Dados do lead repassados à UI (ex.: pré-preencher o agendamento). */
export type LeadDetail = {
  orderVolume?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

/** Opções do campo "Pedidos por mês" (valores exatos do HubSpot). */
export function orderVolumeOption(orders: number): string {
  if (orders < 1000) return 'Até 999';
  if (orders < 3000) return '1.000 a 2.999';
  if (orders < 5000) return '3.000 a 4.999';
  if (orders < 10000) return '5.000 a 9.999';
  if (orders <= 20000) return '10.000 a 20.000';
  return 'Mais de 20.000';
}

type FormEventDetail = { formId?: string; instanceId?: string };

const isOurs = (e: Event) =>
  (e as CustomEvent<FormEventDetail>).detail?.formId === getSiteConfig().hubspot.formId;

let pendingPrefill: Record<string, string | boolean> = {};
let formReady = false;
let installed = false;

function applyPrefill() {
  const forms = window.HubSpotFormsV4?.getForms?.() ?? [];
  const form = forms.find((f) => f.getFormId() === getSiteConfig().hubspot.formId);
  if (!form) return false;
  for (const [name, value] of Object.entries(pendingPrefill)) form.setFieldValue(name, value as string);
  pendingPrefill = {};
  return true;
}

/**
 * Instala (uma vez) os listeners de eventos do formulário:
 * - on-ready: marca como pronto e aplica pré-preenchimentos pendentes
 * - on-submission:success: dispara o Lead (Meta + dataLayer) e avisa a UI
 */
export function installHubSpotFormBridge() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('hs-form-event:on-ready', (e) => {
    if (!isOurs(e)) return;
    formReady = true;
    track('enviagora_form_ready');
    if (Object.keys(pendingPrefill).length) applyPrefill();
  });

  window.addEventListener('hs-form-event:on-submission:success', async (e) => {
    if (!isOurs(e)) return;
    const lead: LeadDetail = {};
    try {
      const form = window.HubSpotFormsV4?.getFormFromEvent(e);
      const get = async (name: string) => {
        const v = await form?.getFieldValue(name);
        return (Array.isArray(v) ? v.join(',') : (v ?? '')).trim();
      };
      lead.orderVolume = await get(HS_FIELDS.orderVolume);
      lead.firstName = await get(HS_FIELDS.firstName);
      lead.lastName = await get(HS_FIELDS.lastName);
      lead.email = await get(HS_FIELDS.email);
    } catch {
      /* o Lead é registrado mesmo sem os campos */
    }
    // Só o volume vai para o analytics (nada de dado pessoal no pixel).
    trackLead({ order_volume: lead.orderVolume || undefined });
    window.dispatchEvent(new CustomEvent<LeadDetail>(LEAD_EVENT, { detail: lead }));
  });

  window.addEventListener('hs-form-event:on-submission:failed', (e) => {
    if (isOurs(e)) track('enviagora_form_error');
  });
}

/** Evento de janela para o formulário próprio receber pré-preenchimentos. */
export const PREFILL_EVENT = 'enviagora:prefill';

/**
 * Pré-preenche um campo: no formulário próprio (via evento) e no do HubSpot
 * (agora, ou assim que ele carregar — usado no plano B).
 */
export function prefillField(name: string, value: string | boolean) {
  pendingPrefill[name] = value as string;
  if (formReady) applyPrefill();
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { name, value } }));
}
