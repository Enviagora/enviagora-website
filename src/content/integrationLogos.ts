// Registro dos logos oficiais das plataformas integradas.
// Cada logo vira um "app icon": um quadradinho arredondado.
//  - fit 'cover'  → o logo já é um ícone quadrado (fundo próprio) e preenche o tile.
//  - fit 'contain'→ o logo é transparente/monocromático; usamos `bg` como a caixinha
//    (branco por padrão; amarelo do Mercado Livre; preto do TikTok Shop).
export type IntegrationLogo = {
  /** Nome acessível da plataforma. */
  label: string;
  /** Caminho do arquivo em /public. */
  file: string;
  /** Cor de fundo do tile (quando o logo é transparente). */
  bg?: string;
  /** Como o logo ocupa o tile. */
  fit?: 'cover' | 'contain';
};

const BASE = '/brand/integracoes';

export const integrationLogos: Record<string, IntegrationLogo> = {
  // Plataformas de vendas
  shopify: { label: 'Shopify', file: `${BASE}/shopify.avif`, fit: 'cover' },
  nuvemshop: { label: 'Nuvemshop', file: `${BASE}/nuvemshop.avif`, fit: 'cover' },
  yampi: { label: 'Yampi', file: `${BASE}/yampi.avif`, fit: 'cover' },
  payt: { label: 'Payt', file: `${BASE}/payt.avif`, fit: 'cover' },
  b4you: { label: 'B4You', file: `${BASE}/b4you.avif`, fit: 'cover' },
  baggy: { label: 'Baggy', file: `${BASE}/baggy.avif`, fit: 'cover' },
  youshop: { label: 'Youshop', file: `${BASE}/youshop.avif`, fit: 'cover' },
  vtext: { label: 'Vtex', file: `${BASE}/vtext.avif`, fit: 'cover' },

  // Marketplaces
  mercadolivre: { label: 'Mercado Livre', file: `${BASE}/mercadolivre.avif`, fit: 'contain', bg: '#FFE600' },
  shopee: { label: 'Shopee', file: `${BASE}/shopee.avif`, fit: 'cover' },
  amazon: { label: 'Amazon', file: `${BASE}/amazon.avif`, fit: 'contain', bg: '#FFFFFF' },
  tiktok: { label: 'TikTok Shop', file: `${BASE}/tiktok.avif`, fit: 'contain', bg: '#000000' },
  magalu: { label: 'Magalu', file: `${BASE}/magalu.avif`, fit: 'contain', bg: '#FFFFFF' },
  shein: { label: 'SHEIN', file: `${BASE}/shein.webp`, fit: 'cover' },

  // ERPs
  bling: { label: 'Bling', file: `${BASE}/bling.avif`, fit: 'cover' },
  tiny: { label: 'Tiny', file: `${BASE}/tiny.svg`, fit: 'contain', bg: '#FFFFFF' },
  omie: { label: 'Omie', file: `${BASE}/omie.avif`, fit: 'contain', bg: '#FFFFFF' },
  sap: { label: 'SAP', file: `${BASE}/sap.avif`, fit: 'contain', bg: '#FFFFFF' },
  totvs: { label: 'TOTVS', file: `${BASE}/totvs.avif`, fit: 'contain', bg: '#FFFFFF' },
  linx: { label: 'Linx', file: `${BASE}/linx.avif`, fit: 'contain', bg: '#FFFFFF' },
};
