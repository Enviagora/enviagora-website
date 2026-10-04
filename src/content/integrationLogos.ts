// Registro dos logos oficiais das plataformas integradas.
// Cada logo é o "miolo" da marca e vira um app icon: fica centralizado dentro de
// um quadradinho arredondado, com respiro (padding) em relação às bordas.
//  - bg define a cor da caixinha. Padrão = branco.
//    Mercado Livre usa o amarelo oficial; TikTok Shop e SHEIN usam preto
//    (marcas monocromáticas que precisam de fundo escuro para aparecer).
export type IntegrationLogo = {
  /** Nome acessível da plataforma. */
  label: string;
  /** URL do arquivo (resolvida pelo Vite — funciona no dev e no CDN do Shopify). */
  file: string;
  /** Cor de fundo da caixinha (quando diferente do branco padrão). */
  bg?: string;
};

// Importados pelo Vite (não por caminho absoluto de /public): assim o bundle do
// tema resolve as URLs relativas ao próprio JS no CDN do Shopify.
const FILES = import.meta.glob<string>('../assets/integracoes/*.{webp,svg}', {
  eager: true,
  import: 'default',
});

function file(name: string): string {
  const hit = Object.entries(FILES).find(([path]) => path.includes(`/integracoes/${name}.`));
  if (!hit) throw new Error(`Logo de integração não encontrado: ${name}`);
  return hit[1];
}

export const integrationLogos: Record<string, IntegrationLogo> = {
  // Plataformas de vendas
  shopify: { label: 'Shopify', file: file('shopify') },
  nuvemshop: { label: 'Nuvemshop', file: file('nuvemshop'), bg: '#0450C4' },
  yampi: { label: 'Yampi', file: file('yampi') },
  payt: { label: 'Payt', file: file('payt'), bg: '#E7791E' },
  b4you: { label: 'B4You', file: file('b4you'), bg: '#21263C' },
  baggy: { label: 'Baggy', file: file('baggy'), bg: '#FB3D8A' },
  youshop: { label: 'Youshop', file: file('youshop') },
  vtext: { label: 'Vtex', file: file('vtext'), bg: '#F71A64' },

  // Marketplaces
  mercadolivre: { label: 'Mercado Livre', file: file('mercadolivre'), bg: '#FFE600' },
  shopee: { label: 'Shopee', file: file('shopee') },
  amazon: { label: 'Amazon', file: file('amazon') },
  tiktok: { label: 'TikTok Shop', file: file('tiktok'), bg: '#010101' },
  magalu: { label: 'Magalu', file: file('magalu') },
  shein: { label: 'SHEIN', file: file('shein'), bg: '#000000' },

  // ERPs
  bling: { label: 'Bling', file: file('bling'), bg: '#34AC62' },
  tiny: { label: 'Tiny', file: file('tiny') },
  omie: { label: 'Omie', file: file('omie') },
  sap: { label: 'SAP', file: file('sap') },
  totvs: { label: 'TOTVS', file: file('totvs') },
  linx: { label: 'Linx', file: file('linx') },
};
