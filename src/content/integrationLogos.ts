// Registro dos logos oficiais das plataformas integradas.
// Cada logo é o "miolo" da marca e vira um app icon: fica centralizado dentro de
// um quadradinho arredondado, com respiro (padding) em relação às bordas.
//  - bg define a cor da caixinha. Padrão = branco.
//    Mercado Livre usa o amarelo oficial; TikTok Shop e SHEIN usam preto
//    (marcas monocromáticas que precisam de fundo escuro para aparecer).
export type IntegrationLogo = {
  /** Nome acessível da plataforma. */
  label: string;
  /** Caminho do arquivo em /public. */
  file: string;
  /** Cor de fundo da caixinha (quando diferente do branco padrão). */
  bg?: string;
};

const BASE = '/brand/integracoes';

export const integrationLogos: Record<string, IntegrationLogo> = {
  // Plataformas de vendas
  shopify: { label: 'Shopify', file: `${BASE}/shopify.avif` },
  nuvemshop: { label: 'Nuvemshop', file: `${BASE}/nuvemshop.avif`, bg: '#0450C4' },
  yampi: { label: 'Yampi', file: `${BASE}/yampi.avif` },
  payt: { label: 'Payt', file: `${BASE}/payt.avif`, bg: '#E7791E' },
  b4you: { label: 'B4You', file: `${BASE}/b4you.avif`, bg: '#21263C' },
  baggy: { label: 'Baggy', file: `${BASE}/baggy.avif`, bg: '#FB3D8A' },
  youshop: { label: 'Youshop', file: `${BASE}/youshop.avif` },
  vtext: { label: 'Vtex', file: `${BASE}/vtext.avif`, bg: '#F71A64' },

  // Marketplaces
  mercadolivre: { label: 'Mercado Livre', file: `${BASE}/mercadolivre.avif`, bg: '#FFE600' },
  shopee: { label: 'Shopee', file: `${BASE}/shopee.avif` },
  amazon: { label: 'Amazon', file: `${BASE}/amazon.avif` },
  tiktok: { label: 'TikTok Shop', file: `${BASE}/tiktok.avif`, bg: '#000000' },
  magalu: { label: 'Magalu', file: `${BASE}/magalu.avif` },
  shein: { label: 'SHEIN', file: `${BASE}/shein.webp`, bg: '#000000' },

  // ERPs
  bling: { label: 'Bling', file: `${BASE}/bling.avif`, bg: '#34AC62' },
  tiny: { label: 'Tiny', file: `${BASE}/tiny.svg` },
  omie: { label: 'Omie', file: `${BASE}/omie.avif` },
  sap: { label: 'SAP', file: `${BASE}/sap.avif` },
  totvs: { label: 'TOTVS', file: `${BASE}/totvs.avif` },
  linx: { label: 'Linx', file: `${BASE}/linx.avif` },
};
