import { useMemo } from 'react';
import * as THREE from 'three';
import wordmarkVerde from '@/assets/brand/wordmark-verde.png';
import simboloVerde from '@/assets/brand/simbolo-verde.png';
import { PETROLEO } from './layout';

/* ==========================================================================
   Texturas procedurais da cena (canvas → THREE.Texture), sem downloads.

   Desempenho: o grão/ruído é escrito direto no buffer de pixels (ImageData) —
   nada de milhares de fillRect com cor em string, que travavam o celular ao
   abrir a página. PRNG com semente → o resultado é sempre o mesmo.
   ========================================================================== */

/** PRNG determinístico (mulberry32). */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d', { willReadFrequently: true })! };
}

/** Grão por pixel: soma ruído uniforme (±amp) em RGB, de uma vez. */
function grain(ctx: CanvasRenderingContext2D, w: number, h: number, amp: number, rnd: () => number) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 2 * amp;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n * 0.9;
  }
  ctx.putImageData(img, 0, 0);
}

/** Manchas grandes e suaves (gradientes radiais — poucas chamadas). */
function blotches(
  ctx: CanvasRenderingContext2D,
  S: number,
  count: number,
  color: (a: number) => string,
  rMin: number,
  rMax: number,
  rnd: () => number,
) {
  for (let i = 0; i < count; i++) {
    const x = rnd() * S;
    const y = rnd() * S;
    const r = rMin + rnd() * (rMax - rMin);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color(0.05 + rnd() * 0.08));
    g.addColorStop(1, color(0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

/** Normal map a partir de um campo de altura (Sobel), direto em ImageData. */
function normalFromHeight(height: Float32Array, S: number, strength: number) {
  const { c, ctx } = canvas(S);
  const out = ctx.createImageData(S, S);
  const H = (x: number, y: number) => height[((y + S) % S) * S + ((x + S) % S)];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (H(x - 1, y) - H(x + 1, y)) * strength;
      const dy = (H(x, y - 1) - H(x, y + 1)) * strength;
      const inv = 1 / Math.hypot(dx, dy, 1);
      const i = (y * S + x) * 4;
      out.data[i] = (dx * inv * 0.5 + 0.5) * 255;
      out.data[i + 1] = (dy * inv * 0.5 + 0.5) * 255;
      out.data[i + 2] = inv * 127.5 + 127.5;
      out.data[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  return c;
}

/** Carrega (uma vez por URL) uma imagem da marca para carimbar nas texturas. */
const imageCache = new Map<string, Promise<HTMLImageElement | null>>();
function loadImage(src: string) {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

function tex(c: HTMLCanvasElement, srgb: boolean, anisotropy = 8) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  return t;
}

/**
 * Caixa Enviagora (kraft): fibras, manchas, desgaste nas bordas, vinco,
 * wordmark grande e tagline. A fita neon é uma peça 3D separada.
 */
export function useBoxTextures(S = 512) {
  return useMemo(() => {
    const rnd = prng(11);
    const k = S / 512;

    // ---- COR ----
    const { c: cc, ctx } = canvas(S);
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, '#d7b482');
    g.addColorStop(1, '#b98f56');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    grain(ctx, S, S, 9, rnd);
    blotches(ctx, S, 5, (a) => `rgba(70,45,20,${a})`, 20 * k, 80 * k, rnd);
    ctx.strokeStyle = 'rgba(255,248,230,0.10)';
    ctx.lineWidth = Math.max(1, k);
    for (let i = 0; i < 8; i++) {
      const yy = rnd() * S;
      ctx.beginPath();
      ctx.moveTo(rnd() * S * 0.3, yy);
      ctx.lineTo(rnd() * S * 0.3 + S * 0.5, yy + (rnd() - 0.5) * 20 * k);
      ctx.stroke();
    }
    const edge = 46 * k;
    const paintEdge = (gx0: number, gy0: number, gx1: number, gy1: number, rx: number, ry: number, rw: number, rh: number) => {
      const lg = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
      lg.addColorStop(0, 'rgba(40,26,10,0.5)');
      lg.addColorStop(1, 'rgba(40,26,10,0)');
      ctx.fillStyle = lg;
      ctx.fillRect(rx, ry, rw, rh);
    };
    paintEdge(0, 0, 0, edge, 0, 0, S, edge);
    paintEdge(0, S, 0, S - edge, 0, S - edge, S, edge);
    paintEdge(0, 0, edge, 0, 0, 0, edge, S);
    paintEdge(S, 0, S - edge, 0, S - edge, 0, edge, S);
    const ao = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.78);
    ao.addColorStop(0, 'rgba(50,32,14,0)');
    ao.addColorStop(1, 'rgba(45,28,12,0.28)');
    ctx.fillStyle = ao;
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = 'rgba(80,54,26,0.3)';
    ctx.fillRect(S / 2 - 1.5 * k, 0, 3 * k, S);
    ctx.fillStyle = 'rgba(255,248,228,0.08)';
    ctx.fillRect(S / 2 + 1.5 * k, 0, Math.max(1, k), S);
    ctx.fillStyle = 'rgba(18,51,54,0.66)';
    ctx.font = `500 ${17 * k}px Satoshi, Arial, sans-serif`;
    ctx.fillText('A ÚNICA LOGÍSTICA QUE FUNCIONA.', S * 0.09, S * 0.2);
    ctx.fillStyle = 'rgba(18,51,54,0.42)';
    ctx.font = `700 ${11 * k}px Satoshi, Arial, sans-serif`;
    ctx.fillText('ENVIAGORA.COM.BR', S * 0.09, S * 0.9);
    const map = tex(cc, true);
    loadImage(wordmarkVerde).then((img) => {
      if (!img) return;
      const bw = S * 0.64;
      ctx.drawImage(img, S * 0.09, S * 0.44, bw, bw / (img.width / img.height));
      map.needsUpdate = true;
    });

    // ---- NORMAL (grão de papel + vinco) ----
    const height = new Float32Array(S * S);
    for (let i = 0; i < height.length; i++) height[i] = 0.5 + (rnd() - 0.5) * 0.09;
    const crease = Math.round(S / 2);
    for (let y = 0; y < S; y++) {
      height[y * S + crease - 1] = 0.42;
      height[y * S + crease] = 0.42;
      height[y * S + crease + 1] = 0.6;
    }
    const normalMap = tex(normalFromHeight(height, S, 2.2), false);

    // ---- ROUGHNESS (fosco, com manchas levemente mais lisas) ----
    const { c: rc, ctx: r } = canvas(S);
    r.fillStyle = '#e9e9e9';
    r.fillRect(0, 0, S, S);
    blotches(r, S, 40, (a) => `rgba(150,150,150,${a * 4})`, 10 * k, 50 * k, rnd);
    const roughnessMap = tex(rc, false);

    return { map, normalMap, roughnessMap };
  }, [S]);
}

/** Etiqueta de envio (papel branco): cabeçalho, QR, dados e código de barras. */
export function useLabelTexture() {
  return useMemo(() => {
    const rnd = prng(23);
    const W = 176;
    const H = 128;
    const { c, ctx } = canvas(W, H);
    ctx.fillStyle = '#f4f1e9';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(18,51,54,0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    // Cabeçalho: wordmark pequeno em verde profundo (etiqueta não leva neon).
    ctx.fillStyle = PETROLEO;
    ctx.font = '700 11px Satoshi, Arial, sans-serif';
    ctx.fillText('ENVIAGORA', 9, 16);
    ctx.fillRect(9, 22, W - 18, 1);
    const qx = 9;
    const qy = 31;
    const qs = 42;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qx - 2, qy - 2, qs + 4, qs + 4);
    const cs = qs / 8;
    ctx.fillStyle = '#12191a';
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if (rnd() > 0.5) ctx.fillRect(qx + i * cs, qy + j * cs, cs, cs);
    ctx.fillStyle = 'rgba(18,51,54,0.55)';
    for (let q = 0; q < 4; q++) ctx.fillRect(60, 32 + q * 9, 62 + rnd() * 40, 3);
    ctx.fillStyle = '#12191a';
    ctx.fillRect(122, 30, 46, 20);
    let x = 9;
    while (x < W - 12) {
      const bw = 1 + Math.round(rnd() * 3);
      ctx.fillRect(x, 82, bw, 32);
      x += bw + 1 + Math.round(rnd() * 3);
    }
    ctx.fillStyle = 'rgba(18,51,54,0.5)';
    ctx.fillRect(9, H - 9, W - 70, 4);
    return tex(c, true);
  }, []);
}

/** Fita de vedação neon (cinta 3D que dá a volta na caixa) com o símbolo. */
export function useTapeTexture() {
  return useMemo(() => {
    const W = 512;
    const H = 128;
    const { c, ctx } = canvas(W, H);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#a3d836');
    g.addColorStop(0.5, '#cbff62');
    g.addColorStop(1, '#a3d836');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(0, H * 0.26, W, H * 0.12);
    ctx.fillStyle = 'rgba(40,70,15,0.26)';
    ctx.fillRect(0, 0, W, 3);
    ctx.fillRect(0, H - 3, W, 3);
    const t = tex(c, true);
    loadImage(simboloVerde).then((img) => {
      if (!img) return;
      const lh = H * 0.56;
      const lw = lh * (img.width / img.height);
      for (let xx = W * 0.03; xx < W; xx += lw + H * 1.1) ctx.drawImage(img, xx, (H - lh) / 2, lw, lh);
      t.needsUpdate = true;
    });
    return t;
  }, []);
}

/**
 * Piso de concreto polido: manchas, grão e juntas de dilatação; roughness
 * variável (áreas mais "lustradas" refletem as luminárias).
 */
export function useConcreteTextures(repeatX: number, repeatY: number, S = 512, withRoughness = true) {
  return useMemo(() => {
    const rnd = prng(37);
    const k = S / 512;
    const { c: cc, ctx: c } = canvas(S);
    c.fillStyle = '#7d8584';
    c.fillRect(0, 0, S, S);
    blotches(c, S, 40, (a) => `rgba(40,48,48,${a})`, 30 * k, 140 * k, rnd);
    blotches(c, S, 30, (a) => `rgba(210,215,210,${a})`, 20 * k, 100 * k, rnd);
    grain(c, S, S, 7, rnd);
    c.fillStyle = 'rgba(30,36,36,0.55)';
    c.fillRect(0, 0, S, 2);
    c.fillRect(0, 0, 2, S);
    const map = tex(cc, true);

    let roughnessMap: THREE.Texture | null = null;
    if (withRoughness) {
      const { c: rc, ctx: r } = canvas(S);
      r.fillStyle = '#8c8c8c';
      r.fillRect(0, 0, S, S);
      blotches(r, S, 35, (a) => `rgba(40,40,40,${a * 3})`, 40 * k, 160 * k, rnd);
      blotches(r, S, 25, (a) => `rgba(230,230,230,${a * 3})`, 30 * k, 120 * k, rnd);
      r.fillStyle = 'rgba(255,255,255,0.8)';
      r.fillRect(0, 0, S, 2);
      r.fillRect(0, 0, 2, S);
      roughnessMap = tex(rc, false);
    }
    for (const t of [map, roughnessMap]) {
      if (!t) continue;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX, repeatY);
    }
    return { map, roughnessMap };
  }, [repeatX, repeatY, S, withRoughness]);
}

/** Sombra de contato macia (retângulo arredondado com borda difusa). */
export function useContactShadowTexture() {
  return useMemo(() => {
    const S = 64;
    const { c, ctx } = canvas(S);
    const m = 13;
    // borda difusa por gradientes (o filtro blur do canvas não existe no Safari)
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.09 + i * 0.006})`;
      const p = m - 6 + i * 1.2;
      ctx.beginPath();
      ctx.roundRect(p, p, S - p * 2, S - p * 2, 8);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Halo radial (luminárias): branco quente no centro, some na borda. */
export function useGlowTexture() {
  return useMemo(() => {
    const S = 128;
    const { c, ctx } = canvas(S);
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(255,250,238,1)');
    g.addColorStop(0.12, 'rgba(255,246,228,0.55)');
    g.addColorStop(0.4, 'rgba(255,240,215,0.12)');
    g.addColorStop(1, 'rgba(255,240,215,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Feixe de luz no ar (cone): opaco no topo, some embaixo. */
export function useBeamTexture() {
  return useMemo(() => {
    const { c, ctx } = canvas(4, 128);
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, 'rgba(255,248,232,0.9)');
    g.addColorStop(0.35, 'rgba(255,248,232,0.25)');
    g.addColorStop(1, 'rgba(255,248,232,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Caixa master de cliente (pallets): kraft com filme stretch, fita e etiqueta. */
export function useCartonTexture() {
  return useMemo(() => {
    const rnd = prng(53);
    const S = 256;
    const { c, ctx } = canvas(S);
    ctx.fillStyle = '#b39572';
    ctx.fillRect(0, 0, S, S);
    grain(ctx, S, S, 8, rnd);
    ctx.fillStyle = 'rgba(140,105,65,0.45)';
    ctx.fillRect(0, S * 0.44, S, S * 0.12);
    ctx.fillStyle = 'rgba(235,238,236,0.12)';
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = '#efece4';
    ctx.fillRect(S * 0.62, S * 0.66, S * 0.26, S * 0.18);
    ctx.fillStyle = 'rgba(20,25,26,0.7)';
    for (let x = S * 0.64; x < S * 0.86; x += 3) ctx.fillRect(x, S * 0.75, 1.5, S * 0.07);
    const edge = ctx.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.75);
    edge.addColorStop(0, 'rgba(40,25,10,0)');
    edge.addColorStop(1, 'rgba(40,25,10,0.35)');
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, S, S);
    return tex(c, true, 4);
  }, []);
}
