import { useMemo } from 'react';
import * as THREE from 'three';
import wordmarkVerde from '@/assets/brand/wordmark-verde.png';
import simboloVerde from '@/assets/brand/simbolo-verde.png';
import { PETROLEO } from './layout';

/* ==========================================================================
   Texturas procedurais da cena (canvas → THREE.Texture). Nada é baixado da
   rede além das imagens oficiais da marca já empacotadas no tema.
   ========================================================================== */

/** Converte um canvas de altura (grayscale) em normal map (Sobel). */
export function heightToNormal(hc: HTMLCanvasElement, strength: number) {
  const s = hc.width;
  const hctx = hc.getContext('2d')!;
  const src = hctx.getImageData(0, 0, s, s).data;
  const nc = document.createElement('canvas');
  nc.width = nc.height = s;
  const nctx = nc.getContext('2d')!;
  const out = nctx.createImageData(s, s);
  const H = (x: number, y: number) => src[(((y + s) % s) * s + ((x + s) % s)) * 4] / 255;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const dx = (H(x - 1, y) - H(x + 1, y)) * strength;
      const dy = (H(x, y - 1) - H(x, y + 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * s + x) * 4;
      out.data[i] = ((dx / len) * 0.5 + 0.5) * 255;
      out.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      out.data[i + 2] = (1 / len) * 0.5 * 255 + 128;
      out.data[i + 3] = 255;
    }
  }
  nctx.putImageData(out, 0, 0);
  return new THREE.CanvasTexture(nc);
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

/**
 * Texturas da caixa Enviagora (kraft): base de papelão com fibras, desgaste nas
 * bordas, riscos e manchas, wordmark grande impresso (PNG oficial) e tagline.
 * A FITA neon NÃO é pintada aqui — é uma tira 3D separada sobre o topo (evita o
 * bug da fita nas faces e dá brilho de fita de verdade). Retorna cor/normal/rough.
 */
export function useBoxTextures() {
  return useMemo(() => {
    const S = 512;

    // ---- COR ----
    const cc = document.createElement('canvas');
    cc.width = cc.height = S;
    const ctx = cc.getContext('2d')!;
    // base kraft
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, '#d7b482');
    g.addColorStop(1, '#b98f56');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    // fibras / mottle (denso e fino)
    for (let i = 0; i < 14000; i++) {
      const a = Math.random() * 0.06;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(85,55,25,${a})` : `rgba(255,246,224,${a})`;
      ctx.fillRect(Math.random() * S, Math.random() * S, 1.3, 1.3);
    }
    // manchas / amassados suaves
    for (let i = 0; i < 5; i++) {
      const dx = Math.random() * S;
      const dy = Math.random() * S;
      const dr = 20 + Math.random() * 60;
      const dg = ctx.createRadialGradient(dx, dy, 0, dx, dy, dr);
      dg.addColorStop(0, `rgba(70,45,20,${0.05 + Math.random() * 0.06})`);
      dg.addColorStop(1, 'rgba(70,45,20,0)');
      ctx.fillStyle = dg;
      ctx.fillRect(dx - dr, dy - dr, dr * 2, dr * 2);
    }
    // riscos finos
    ctx.strokeStyle = 'rgba(255,248,230,0.10)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const yy = Math.random() * S;
      ctx.beginPath();
      ctx.moveTo(Math.random() * S * 0.3, yy);
      ctx.lineTo(Math.random() * S * 0.3 + S * 0.5, yy + (Math.random() - 0.5) * 20);
      ctx.stroke();
    }
    // desgaste/sujeira nas bordas (moldura escura em cada lado)
    const edge = 46;
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
    // AO central sutil
    const ao = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.78);
    ao.addColorStop(0, 'rgba(50,32,14,0)');
    ao.addColorStop(1, 'rgba(45,28,12,0.28)');
    ctx.fillStyle = ao;
    ctx.fillRect(0, 0, S, S);
    // vinco central (dobra dos flaps) com quina clara
    ctx.fillStyle = 'rgba(80,54,26,0.3)';
    ctx.fillRect(S / 2 - 1.5, 0, 3, S);
    ctx.fillStyle = 'rgba(255,248,228,0.08)';
    ctx.fillRect(S / 2 + 1.5, 0, 1, S);

    // tagline + url impressos (petróleo)
    ctx.fillStyle = 'rgba(18,51,54,0.66)';
    ctx.font = '500 17px Satoshi, Arial, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('A ÚNICA LOGÍSTICA QUE FUNCIONA.', S * 0.09, S * 0.2);
    ctx.fillStyle = 'rgba(18,51,54,0.42)';
    ctx.font = '700 11px Satoshi, Arial, sans-serif';
    ctx.fillText('ENVIAGORA.COM.BR', S * 0.09, S * 0.9);

    const map = new THREE.CanvasTexture(cc);
    map.anisotropy = 8;

    // Wordmark ENVIAGORA em verde profundo, em escala grande (regra de embalagem)
    loadImage(wordmarkVerde).then((img) => {
      if (!img) return;
      const ar = img.width / img.height;
      const bw = S * 0.64;
      const bh = bw / ar;
      ctx.drawImage(img, S * 0.09, S * 0.44, bw, bh);
      map.needsUpdate = true;
    });

    // ---- NORMAL (grão de papel + vinco) ----
    const hc = document.createElement('canvas');
    hc.width = hc.height = S;
    const h = hc.getContext('2d')!;
    h.fillStyle = '#808080';
    h.fillRect(0, 0, S, S);
    for (let i = 0; i < S * S * 0.45; i++) {
      const v = 128 + (Math.random() * 2 - 1) * 11;
      h.fillStyle = `rgb(${v},${v},${v})`;
      h.fillRect(Math.random() * S, Math.random() * S, 1, 1);
    }
    h.fillStyle = '#6a6a6a';
    h.fillRect(S / 2 - 1.5, 0, 3, S);
    h.fillStyle = '#9a9a9a';
    h.fillRect(S / 2 + 1.5, 0, 1, S);
    const normalMap = heightToNormal(hc, 2.2);
    normalMap.anisotropy = 8;

    // ---- ROUGHNESS (fosco com manchas levemente mais lisas) ----
    const rc = document.createElement('canvas');
    rc.width = rc.height = S;
    const r = rc.getContext('2d')!;
    r.fillStyle = '#e9e9e9';
    r.fillRect(0, 0, S, S);
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * S;
      const ry = Math.random() * S;
      const rr = 10 + Math.random() * 40;
      const rgd = r.createRadialGradient(rx, ry, 0, rx, ry, rr);
      rgd.addColorStop(0, 'rgba(150,150,150,0.5)');
      rgd.addColorStop(1, 'rgba(150,150,150,0)');
      r.fillStyle = rgd;
      r.fillRect(rx - rr, ry - rr, rr * 2, rr * 2);
    }
    const roughnessMap = new THREE.CanvasTexture(rc);

    return { map, normalMap, roughnessMap };
  }, []);
}

/** Etiqueta de envio (papel branco): cabeçalho, QR, dados e código de barras. */
export function useLabelTexture() {
  return useMemo(() => {
    const W = 176;
    const H = 128;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d')!;
    // papel
    ctx.fillStyle = '#f4f1e9';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(18,51,54,0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    // Cabeçalho da etiqueta: wordmark pequeno em verde profundo + régua fina.
    // Etiqueta de envio não leva neon (leitura de leitor óptico em primeiro lugar).
    ctx.fillStyle = PETROLEO;
    ctx.font = '700 11px Satoshi, Arial, sans-serif';
    ctx.fillText('ENVIAGORA', 9, 16);
    ctx.fillRect(9, 22, W - 18, 1);
    // QR fake
    const qx = 9;
    const qy = 31;
    const qs = 42;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qx - 2, qy - 2, qs + 4, qs + 4);
    const cells = 8;
    const cs = qs / cells;
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = '#12191a';
          ctx.fillRect(qx + i * cs, qy + j * cs, cs, cs);
        }
      }
    }
    // dados à direita do QR
    ctx.fillStyle = 'rgba(18,51,54,0.55)';
    for (let k = 0; k < 4; k++) {
      ctx.fillRect(60, 32 + k * 9, 62 + Math.random() * 40, 3);
    }
    // bloco preto (prioridade)
    ctx.fillStyle = '#12191a';
    ctx.fillRect(122, 30, 46, 20);
    // código de barras
    let x = 9;
    while (x < W - 12) {
      const bw = 1 + Math.round(Math.random() * 3);
      ctx.fillStyle = '#12191a';
      ctx.fillRect(x, 82, bw, 32);
      x += bw + 1 + Math.round(Math.random() * 3);
    }
    ctx.fillStyle = 'rgba(18,51,54,0.5)';
    ctx.fillRect(9, H - 9, W - 70, 4);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    return tex;
  }, []);
}

/** Fita de vedação neon (cinta 3D que dá a volta na caixa) com o wordmark. */
export function useTapeTexture() {
  return useMemo(() => {
    const W = 512;
    const H = 128;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d')!;
    // neon com centro mais claro (volume da fita)
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#a3d836');
    g.addColorStop(0.5, '#cbff62');
    g.addColorStop(1, '#a3d836');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // brilho especular (faixa clara ao longo da fita)
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(0, H * 0.26, W, H * 0.12);
    // bordas da fita levemente escuras
    ctx.fillStyle = 'rgba(40,70,15,0.26)';
    ctx.fillRect(0, 0, W, 3);
    ctx.fillRect(0, H - 3, W, 3);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    // Símbolo repetido ao longo da fita neon (logo monocromático escuro sobre neon)
    loadImage(simboloVerde).then((img) => {
      if (!img) return;
      const ar = img.width / img.height;
      const lh = H * 0.56;
      const lw = lh * ar;
      for (let x = W * 0.03; x < W; x += lw + H * 1.1) {
        ctx.drawImage(img, x, (H - lh) / 2, lw, lh);
      }
      tex.needsUpdate = true;
    });
    return tex;
  }, []);
}


/** Ruído de valor 2D simples (para manchas grandes e suaves). */
function blotches(ctx: CanvasRenderingContext2D, S: number, count: number, color: (a: number) => string, rMin: number, rMax: number) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const r = rMin + Math.random() * (rMax - rMin);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color(0.05 + Math.random() * 0.08));
    g.addColorStop(1, color(0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

/**
 * Piso de concreto polido: cor com manchas, poros e juntas de dilatação;
 * roughness variável (áreas mais "lustradas" refletem as luminárias).
 */
export function useConcreteTextures(repeatX: number, repeatY: number) {
  return useMemo(() => {
    const S = 512;
    const cc = document.createElement('canvas');
    cc.width = cc.height = S;
    const c = cc.getContext('2d')!;
    c.fillStyle = '#7d8584';
    c.fillRect(0, 0, S, S);
    blotches(c, S, 40, (a) => `rgba(40,48,48,${a})`, 30, 140);
    blotches(c, S, 30, (a) => `rgba(210,215,210,${a})`, 20, 100);
    for (let i = 0; i < 22000; i++) {
      const v = Math.random();
      c.fillStyle = v > 0.5 ? `rgba(255,255,255,${Math.random() * 0.05})` : `rgba(0,0,0,${Math.random() * 0.07})`;
      c.fillRect(Math.random() * S, Math.random() * S, 1.2, 1.2);
    }
    // juntas de dilatação (uma por tile)
    c.fillStyle = 'rgba(30,36,36,0.55)';
    c.fillRect(0, 0, S, 2);
    c.fillRect(0, 0, 2, S);
    const map = new THREE.CanvasTexture(cc);
    map.colorSpace = THREE.SRGBColorSpace;

    const rc = document.createElement('canvas');
    rc.width = rc.height = S;
    const r = rc.getContext('2d')!;
    r.fillStyle = '#8c8c8c'; // roughness ~0.55
    r.fillRect(0, 0, S, S);
    blotches(r, S, 35, (a) => `rgba(40,40,40,${a * 3})`, 40, 160); // áreas lustradas
    blotches(r, S, 25, (a) => `rgba(230,230,230,${a * 3})`, 30, 120); // áreas foscas
    r.fillStyle = 'rgba(255,255,255,0.8)';
    r.fillRect(0, 0, S, 2);
    r.fillRect(0, 0, 2, S);
    const roughnessMap = new THREE.CanvasTexture(rc);

    for (const t of [map, roughnessMap]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX, repeatY);
      t.anisotropy = 8;
    }
    return { map, roughnessMap };
  }, [repeatX, repeatY]);
}

/** Sombra de contato macia (retângulo arredondado com borda difusa). */
export function useContactShadowTexture() {
  return useMemo(() => {
    const S = 128;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const ctx = c.getContext('2d')!;
    ctx.filter = 'blur(10px)';
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    const m = 26;
    ctx.beginPath();
    ctx.roundRect(m, m, S - m * 2, S - m * 2, 10);
    ctx.fill();
    ctx.filter = 'none';
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);
}

/** Halo radial (luminárias): branco quente no centro, some na borda. */
export function useGlowTexture() {
  return useMemo(() => {
    const S = 128;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const ctx = c.getContext('2d')!;
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
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, 'rgba(255,248,232,0.9)');
    g.addColorStop(0.35, 'rgba(255,248,232,0.25)');
    g.addColorStop(1, 'rgba(255,248,232,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Caixa master de cliente (pallets): kraft liso, fita marrom e etiqueta branca. */
export function useCartonTexture() {
  return useMemo(() => {
    const S = 256;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#b39572';
    ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 5000; i++) {
      const a = Math.random() * 0.07;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(80,50,20,${a})` : `rgba(255,240,215,${a})`;
      ctx.fillRect(Math.random() * S, Math.random() * S, 1.2, 1.2);
    }
    // fita de vedação marrom no meio
    ctx.fillStyle = 'rgba(140,105,65,0.45)';
    ctx.fillRect(0, S * 0.44, S, S * 0.12);
    // filme stretch: véu claro e leve brilho
    ctx.fillStyle = 'rgba(235,238,236,0.12)';
    ctx.fillRect(0, 0, S, S);
    // etiqueta
    ctx.fillStyle = '#efece4';
    ctx.fillRect(S * 0.62, S * 0.66, S * 0.26, S * 0.18);
    ctx.fillStyle = 'rgba(20,25,26,0.7)';
    for (let x = S * 0.64; x < S * 0.86; x += 3) ctx.fillRect(x, S * 0.75, 1.5, S * 0.07);
    // escurece as bordas (sujeira/sombra)
    const edge = ctx.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.75);
    edge.addColorStop(0, 'rgba(40,25,10,0)');
    edge.addColorStop(1, 'rgba(40,25,10,0.35)');
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, S, S);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}
