/**
 * Configuração vinda do tema Shopify. A seção `enviagora-home.liquid` imprime um
 * <script type="application/json" id="enviagora-config"> com os settings
 * editáveis no editor de tema. No dev/bolt não existe esse script e valem os
 * padrões abaixo. Campos vazios desligam o recurso (ex.: sem número de WhatsApp,
 * nenhum botão de WhatsApp aparece) — nada de dado inventado no site.
 */
export type SiteConfig = {
  hubspot: {
    portalId: string;
    formId: string;
    region: string;
    /** Link do agendador do HubSpot Meetings, exibido após o envio do formulário. */
    meetingsUrl: string;
  };
  whatsapp: {
    /** Só dígitos, com DDI (ex.: 5511999999999). Vazio = sem botões de WhatsApp. */
    number: string;
    message: string;
  };
};

const DEFAULTS: SiteConfig = {
  hubspot: {
    portalId: '44097462',
    formId: '909bd17e-13cd-40b2-b996-96f5817b8587',
    region: 'na1',
    meetingsUrl: '',
  },
  whatsapp: {
    // Número comercial usado hoje no formulário do site (GemPages).
    number: '5535936180694',
    message: 'Olá! Quero falar com um especialista da Enviagora sobre a minha operação.',
  },
};

function nonEmpty<T extends Record<string, unknown>>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v === 'string' && v.trim() !== ''),
  ) as Partial<T>;
}

function read(): SiteConfig {
  const el = typeof document !== 'undefined' ? document.getElementById('enviagora-config') : null;
  if (!el?.textContent) return DEFAULTS;
  try {
    const raw = JSON.parse(el.textContent) as { hubspot?: Partial<SiteConfig['hubspot']>; whatsapp?: { number?: string | null; message?: string | null } };
    const wa = raw.whatsapp;
    return {
      hubspot: { ...DEFAULTS.hubspot, ...nonEmpty(raw.hubspot) },
      whatsapp: {
        // Número apagado no editor de tema (null/"") = esconder o WhatsApp.
        number: wa && 'number' in wa ? (wa.number ?? '') : DEFAULTS.whatsapp.number,
        message: wa?.message?.trim() || DEFAULTS.whatsapp.message,
      },
    };
  } catch {
    return DEFAULTS;
  }
}

/** Lido a cada chamada: no editor de tema a seção pode ser re-renderizada. */
export const getSiteConfig = read;

/** Link wa.me pronto, ou `null` quando não há número configurado. */
export function whatsappHref(text?: string): string | null {
  const { number, message } = read().whatsapp;
  const digits = number.replace(/\D/g, '');
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text || message)}`;
}

/**
 * URL do agendador (HubSpot Meetings) em modo embed, já pré-preenchida com os
 * dados do lead. `null` quando não há link configurado.
 */
export function meetingsEmbedUrl(prefill: { firstName?: string; lastName?: string; email?: string } = {}): string | null {
  const raw = read().hubspot.meetingsUrl.trim();
  if (!/^https:\/\//i.test(raw)) return null;
  try {
    const url = new URL(raw);
    url.searchParams.set('embed', 'true');
    if (prefill.firstName) url.searchParams.set('firstName', prefill.firstName);
    if (prefill.lastName) url.searchParams.set('lastName', prefill.lastName);
    if (prefill.email) url.searchParams.set('email', prefill.email);
    return url.toString();
  } catch {
    return null;
  }
}
