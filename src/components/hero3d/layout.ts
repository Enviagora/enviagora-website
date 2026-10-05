/* ==========================================================================
   Medidas da cena (unidades ≈ metros). O topo dos roletes fica em y = 0; o
   piso do galpão em FLOOR_Y. As caixas andam no eixo +z, em direção à câmera.
   ========================================================================== */

export const PETROLEO = '#123336';
export const NEON = '#c4ff57';
export const CREME = '#fafaf5';

/** Fundo/neblina: verde profundo um pouco mais claro → profundidade de galpão. */
export const HAZE = '#16393c';

export const LANES = [-4.5, -1.5, 1.5, 4.5];
export const BELT_W = 2.2; // largura útil da esteira (comprimento dos roletes)
export const Z_NEAR = 15; // além da câmera: a caixa sai de quadro antes de reciclar
export const Z_FAR = -34;
export const LEN = Z_NEAR - Z_FAR;
export const Z_MID = (Z_NEAR + Z_FAR) / 2;
export const ACCENT_LANE = 2; // esteira com a fita de LED neon

export const FLOOR_Y = -0.92; // altura da esteira ≈ 92 cm
export const ROLLER_R = 0.055;

/** Porta-paletes dos dois lados do galpão. */
export const RACK_X = 10.2;
export const RACK_DEPTH = 1.1;
export const RACK_BAY = 2.7;
export const RACK_LEVELS = [0.15, 1.55, 2.95, 4.35]; // altura das longarinas (acima do piso)
export const RACK_HEIGHT = 5.6;

/** Luminárias industriais (high-bay) no teto. */
export const LAMP_Y = 6.4;
export const LAMP_ROWS_X = [-3, 3, -RACK_X + 2.6, RACK_X - 2.6];

export function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}
