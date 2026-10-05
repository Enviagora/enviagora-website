import { getSiteConfig } from './siteConfig';

/**
 * Envio do formulário próprio para o MESMO formulário do HubSpot, pela API
 * pública de envios (Forms API v3 — não precisa de chave):
 * https://developers.hubspot.com/docs/api-reference/legacy/forms-v3-legacy/guide
 *
 * O lead cai no CRM como um envio normal do formulário 909bd17e… (mesmas
 * notificações e workflows). Atenção: o HubSpot recusa envios por API se o
 * formulário estiver com CAPTCHA ligado (erro FORM_HAS_RECAPTCHA_ENABLED) —
 * nesse caso a UI cai para o formulário oficial (ver LeadForm).
 */

/** Textos de consentimento (LGPD) — iguais aos do formulário no HubSpot. */
export const CONSENT = {
  subscriptionTypeId: 3362838547,
  communicationText:
    'Ao marcar a caixa abaixo, você concorda em receber comunicações da Enviagora. Você pode cancelar a inscrição a qualquer momento.',
  communicationLabel: 'Concordo em receber comunicações da Enviagora.',
  processingText:
    'Para atender à sua solicitação, precisamos da sua autorização para armazenar e tratar seus dados pessoais. Marque a caixa abaixo para confirmar seu consentimento:',
  processingLabel: 'Concordo que a Enviagora armazene e trate meus dados pessoais.',
  privacyText: 'A Enviagora respeita sua privacidade. Saiba como tratamos seus dados em nossa',
} as const;

export type LeadPayload = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  website: string;
  monthly_order_volume: string;
  erp_used: string;
  product_segment: string;
  primary_business_need: string;
  consentCommunications: boolean;
  consentProcessing: boolean;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'captcha' | 'invalid-email' | 'network' | 'other'; message?: string };

function cookie(name: string) {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1];
}

function endpoint() {
  const { portalId, formId, region } = getSiteConfig().hubspot;
  const host = region === 'na1' ? 'api.hsforms.com' : `api-${region}.hsforms.com`;
  return `https://${host}/submissions/v3/integration/submit/${portalId}/${formId}`;
}

export async function submitLead(data: LeadPayload): Promise<SubmitResult> {
  const fields = (
    [
      'firstname',
      'lastname',
      'email',
      'phone',
      'website',
      'monthly_order_volume',
      'erp_used',
      'product_segment',
      'primary_business_need',
    ] as const
  ).map((name) => ({ objectTypeId: '0-1', name, value: data[name] }));

  const hutk = cookie('hubspotutk'); // liga o lead à visita (origem, páginas vistas)
  const body = {
    submittedAt: Date.now(),
    fields,
    context: {
      ...(hutk ? { hutk } : {}),
      pageUri: window.location.href,
      pageName: document.title,
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: data.consentProcessing,
        text: CONSENT.processingText,
        communications: [
          {
            value: data.consentCommunications,
            subscriptionTypeId: CONSENT.subscriptionTypeId,
            text: CONSENT.communicationText,
          },
        ],
      },
    },
  };

  let res: Response;
  try {
    res = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, reason: 'network' };
  }
  if (res.ok) return { ok: true };

  let errors: { errorType?: string; message?: string }[] = [];
  try {
    errors = ((await res.json()) as { errors?: typeof errors }).errors ?? [];
  } catch {
    /* corpo vazio */
  }
  const types = errors.map((e) => e.errorType ?? '');
  if (types.includes('FORM_HAS_RECAPTCHA_ENABLED')) return { ok: false, reason: 'captcha' };
  if (types.some((t) => t.includes('EMAIL'))) return { ok: false, reason: 'invalid-email' };
  return { ok: false, reason: 'other', message: errors[0]?.message };
}
