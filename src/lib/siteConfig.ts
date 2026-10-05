/**
 * Configuração vinda do tema Shopify. A seção `enviagora-home.liquid` imprime um
 * <script type="application/json" id="enviagora-config"> com os settings
 * editáveis no editor de tema. No dev/bolt não existe esse script e valem os
 * padrões abaixo. Campos vazios desligam o recurso (ex.: sem link de agenda,
 * o pós-envio mostra só a confirmação) — nada de dado inventado no site.
 */
export type SiteConfig = {
  hubspot: {
    portalId: string;
    formId: string;
    region: string;
    /** Link do agendador do HubSpot Meetings, exibido após o envio do formulário. */
    meetingsUrl: string;
  };
  /** URL do blog da loja (resolvida no Liquid: setting da seção › menus › /blogs/posts). */
  blogUrl: string;
};

/** Marcador trocado por `{{ blog_url }}` no HTML pré-renderizado (scripts/prerender-theme.mjs). */
export const SSR_BLOG_URL = '__EA_BLOG_URL__';

const DEFAULTS: SiteConfig = {
  hubspot: {
    portalId: '44097462',
    formId: '909bd17e-13cd-40b2-b996-96f5817b8587',
    region: 'na1',
    meetingsUrl: '',
  },
  blogUrl: '/blogs/posts',
};

function nonEmpty<T extends Record<string, unknown>>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v === 'string' && v.trim() !== ''),
  ) as Partial<T>;
}

function read(): SiteConfig {
  // Pré-renderização (Node): o link do blog vira marcador e o Liquid preenche.
  if (typeof document === 'undefined') return { ...DEFAULTS, blogUrl: SSR_BLOG_URL };
  const el = document.getElementById('enviagora-config');
  if (!el?.textContent) return DEFAULTS;
  try {
    const raw = JSON.parse(el.textContent) as { hubspot?: Partial<SiteConfig['hubspot']>; blogUrl?: string | null };
    return {
      hubspot: { ...DEFAULTS.hubspot, ...nonEmpty(raw.hubspot) },
      blogUrl: raw.blogUrl?.trim() || DEFAULTS.blogUrl,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Lido a cada chamada: no editor de tema a seção pode ser re-renderizada. */
export const getSiteConfig = read;

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
