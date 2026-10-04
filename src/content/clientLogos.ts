// Logos dos clientes do carrossel "Marcas de sucesso" (mesmos arquivos do site
// atual). São silhuetas de uma cor só, então viram máscara CSS e ganham a cor
// da marca (verde profundo), uniformes entre si.
const FILES = import.meta.glob<string>('../assets/clientes/*.webp', { eager: true, import: 'default' });

// Tamanho nativo de cada arquivo (largura × altura) — define a proporção da caixa.
const NATIVE: Record<string, [number, number]> = {
  gummy: [131, 39],
  'envy-hair': [60, 44],
  maxfem: [158, 34],
  alwaysfit: [177, 31],
  popozuda: [78, 64],
  adeus: [115, 23],
  bloom: [71, 50],
};

export type ClientLogo = { src: string; width: number; height: number };

/**
 * Caixa com "massa visual" parecida para logos de proporções diferentes:
 * mantém a área próxima de AREA px², limitando a altura a MAX_H.
 */
const AREA = 4000;
const MAX_H = 44;

export function clientLogo(slug: string): ClientLogo {
  const hit = Object.entries(FILES).find(([path]) => path.endsWith(`/clientes/${slug}.webp`));
  const native = NATIVE[slug];
  if (!hit || !native) throw new Error(`Logo de cliente não encontrado: ${slug}`);
  const ratio = native[0] / native[1];
  const height = Math.min(MAX_H, Math.sqrt(AREA / ratio));
  return { src: hit[1], width: Math.round(height * ratio), height: Math.round(height) };
}
