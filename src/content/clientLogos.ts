// Logos dos clientes do carrossel "Marcas que confiam". Vieram coloridos dos
// arquivos oficiais e foram vetorizados como silhueta de uma cor só (SVG), então
// viram máscara CSS e ganham a cor da marca (verde profundo), uniformes entre si
// e nítidos em qualquer tela.
const FILES = import.meta.glob<string>('../assets/clientes/*.svg', { eager: true, import: 'default' });

// viewBox de cada SVG (largura × altura) e a fração da caixa coberta de tinta.
const NATIVE: Record<string, [w: number, h: number, density: number]> = {
  alwaysfit: [990, 170, 0.331],
  anasol: [952, 252, 0.307],
  aura: [863, 360, 0.167],
  bigboom: [1000, 338, 0.654],
  blessy: [994, 275, 0.36],
  bloom: [766, 666, 0.324],
  cicatribem: [914, 114, 0.436],
  dermasec: [997, 273, 0.261],
  guday: [998, 323, 0.736],
  gummy: [918, 330, 0.277],
  hidrabene: [1000, 141, 0.337],
  hiven: [887, 219, 0.27],
  maxfem: [998, 213, 0.345],
  popozuda: [624, 512, 0.477],
  renovabe: [974, 134, 0.357],
  zencial: [1000, 246, 0.247],
};

export type ClientLogo = { src: string; width: number; height: number };

/**
 * Caixa com "massa visual" parecida para logos de proporções e pesos
 * diferentes: a área fica perto de AREA px², um pouco maior para traços finos e
 * menor para letras pesadas (DENSITY_REF), com a altura limitada a MAX_H.
 */
const AREA = 4000;
const DENSITY_REF = 0.33;
const MAX_H = 44;

export function clientLogo(slug: string): ClientLogo {
  const hit = Object.entries(FILES).find(([path]) => path.endsWith(`/clientes/${slug}.svg`));
  const native = NATIVE[slug];
  if (!hit || !native) throw new Error(`Logo de cliente não encontrado: ${slug}`);
  const [w, h, density] = native;
  const ratio = w / h;
  const area = AREA * Math.sqrt(DENSITY_REF / density);
  const height = Math.min(MAX_H, Math.sqrt(area / ratio));
  return { src: hit[1], width: Math.round(height * ratio), height: Math.round(height) };
}
