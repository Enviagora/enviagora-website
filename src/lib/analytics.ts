/**
 * Rastreamento de conversão da home.
 *
 * - Tudo vai para `window.dataLayer` (GTM / Customer Events do Shopify podem ler).
 * - Meta Pixel (`fbq`, carregado pelo snippet enviagora-tracking) recebe o evento
 *   padrão `Lead` no envio do formulário — é o que permite ao Meta otimizar
 *   campanhas para lead — e `CTAClick` (custom) nos cliques de CTA.
 * - O tracking do HubSpot já registra o envio do formulário nativamente.
 */
type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    HubSpotFormsV4?: {
      getFormFromEvent: (e: Event) => {
        getFieldValue: (name: string) => Promise<string | string[]>;
        setFieldValue: (name: string, value: string) => void;
        getConversionId?: () => string;
      };
      getForms: () => {
        getFormId: () => string;
        setFieldValue: (name: string, value: string) => void;
      }[];
    };
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
}

export function trackCta(location: string, label: string, href: string) {
  track('enviagora_cta_click', { location, label, href });
  window.fbq?.('trackCustom', 'CTAClick', { location, label });
}

export function trackLead(props: Props) {
  track('enviagora_lead', props);
  window.fbq?.('track', 'Lead', { content_name: 'Formulário especialista', ...props });
}
