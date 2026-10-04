/**
 * Configuração vinda do tema Shopify. A seção `enviagora-home.liquid` imprime um
 * <script type="application/json" id="enviagora-config"> com os settings
 * editáveis no editor de tema (ex.: IDs do formulário HubSpot). No dev/bolt não
 * existe esse script e valem os padrões abaixo — os mesmos do site atual.
 */
export type SiteConfig = {
  hubspot: {
    portalId: string;
    formId: string;
    region: string;
  };
};

const DEFAULTS: SiteConfig = {
  hubspot: {
    portalId: '44097462',
    formId: '909bd17e-13cd-40b2-b996-96f5817b8587',
    region: 'na1',
  },
};

function nonEmpty<T extends Record<string, unknown>>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => typeof v === 'string' && v.trim() !== '')) as Partial<T>;
}

function read(): SiteConfig {
  const el = typeof document !== 'undefined' ? document.getElementById('enviagora-config') : null;
  if (!el?.textContent) return DEFAULTS;
  try {
    const raw = JSON.parse(el.textContent) as Partial<SiteConfig>;
    return { hubspot: { ...DEFAULTS.hubspot, ...nonEmpty(raw.hubspot) } };
  } catch {
    return DEFAULTS;
  }
}

/** Lido a cada chamada: no editor de tema a seção pode ser re-renderizada. */
export const getSiteConfig = read;
