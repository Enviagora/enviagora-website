import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ==========================================================================
   BrazilMap — hero variante "Mapa do Brasil ganhando vida".
   Silhueta simplificada do Brasil (pontilhada). Rotas acendem dos CDs
   (Extrema/MG + São Paulo) para as cidades; dots viajam; cidades pulsam.
   SVG + Framer Motion. Respeita prefers-reduced-motion (estático).
   ========================================================================== */

// Polígono simplificado do Brasil (viewBox 100 x 120). Estilizado, não cartográfico.
const BR: [number, number][] = [
  [46, 8], [56, 6], [62, 14], [58, 22], [70, 26], [78, 30], [86, 40], [84, 50],
  [80, 58], [76, 66], [70, 74], [66, 80], [60, 84], [54, 90], [50, 98], [44, 104],
  [40, 98], [38, 88], [34, 80], [28, 72], [24, 62], [18, 54], [12, 50], [16, 42],
  [22, 36], [26, 28], [32, 20], [38, 12],
];

const ORIGIN: [number, number] = [60, 72]; // CDs (Extrema/SP)
const CITIES: [number, number][] = [
  [26, 32], [56, 20], [78, 26], [84, 40], [78, 52], [54, 58],
  [48, 60], [64, 66], [66, 76], [54, 82], [48, 94], [36, 58],
];

function pointInPoly(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function BrazilMap() {
  const reduce = useReducedMotion();

  const path = useMemo(() => 'M' + BR.map((p) => p.join(',')).join(' L') + ' Z', []);
  const dots = useMemo(() => {
    const out: [number, number][] = [];
    for (let x = 8; x < 92; x += 3.1) {
      for (let y = 6; y < 108; y += 3.1) {
        if (pointInPoly(x, y, BR)) out.push([x + (((x * 7 + y) % 3) - 1) * 0.3, y]);
      }
    }
    return out;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ea-petroleo" aria-hidden>
      {/* glow ambiente */}
      <div
        className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(196,255,87,0.10), transparent 60%)' }}
      />
      <svg
        viewBox="0 0 100 120"
        className="absolute left-1/2 top-1/2 h-[92%] max-h-[820px] -translate-x-1/2 -translate-y-1/2"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* massa do país */}
        <path d={path} fill="rgba(27,65,69,0.55)" stroke="rgba(196,255,87,0.18)" strokeWidth={0.4} />

        {/* pontilhado */}
        <g fill="rgba(250,250,245,0.16)">
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.42} />
          ))}
        </g>

        {/* rotas + dots viajando + pulsos */}
        {CITIES.map(([cx, cy], i) => {
          const delay = i * 0.22;
          return (
            <g key={i}>
              <motion.line
                x1={ORIGIN[0]}
                y1={ORIGIN[1]}
                x2={cx}
                y2={cy}
                stroke="rgba(196,255,87,0.7)"
                strokeWidth={0.5}
                strokeLinecap="round"
                initial={reduce ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                animate={reduce ? undefined : { pathLength: [0, 1, 1], opacity: [0, 0.8, 0.15] }}
                transition={reduce ? undefined : { duration: 2.4, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 0.8, delay, ease: 'easeInOut' }}
              />
              {!reduce && (
                <motion.circle
                  r={0.9}
                  fill="#c4ff57"
                  initial={{ cx: ORIGIN[0], cy: ORIGIN[1], opacity: 0 }}
                  animate={{ cx: [ORIGIN[0], cx], cy: [ORIGIN[1], cy], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2, delay: delay + 0.3, ease: 'easeInOut' }}
                />
              )}
              {/* cidade */}
              <circle cx={cx} cy={cy} r={1.1} fill="#c4ff57" />
              {!reduce && (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={1.1}
                  fill="none"
                  stroke="#c4ff57"
                  strokeWidth={0.4}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 3.4], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: delay + 1.3, ease: 'easeOut' }}
                  style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'fill-box' }}
                />
              )}
            </g>
          );
        })}

        {/* CDs de origem */}
        <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r={2} fill="#c4ff57" />
        <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r={2} fill="none" stroke="#123336" strokeWidth={0.5} />
        {!reduce && (
          <motion.circle
            cx={ORIGIN[0]}
            cy={ORIGIN[1]}
            r={2}
            fill="none"
            stroke="#c4ff57"
            strokeWidth={0.5}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: [1, 4], opacity: [0.6, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
            style={{ transformOrigin: `${ORIGIN[0]}px ${ORIGIN[1]}px`, transformBox: 'fill-box' }}
          />
        )}
      </svg>
    </div>
  );
}
