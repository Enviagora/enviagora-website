import { motion, useReducedMotion } from 'framer-motion';
import { EASE_EA } from '@/lib/motion';

/* ==========================================================================
   RouteNetwork — assinatura visual do hero.
   Malha de rotas logísticas: nós de origem (esquerda) → CD/hub (centro) →
   entregas (direita). As linhas se desenham, os nós pulsam e "pacotes" viajam
   pela rede. Puro SVG + Framer Motion (transform/opacity) para 60fps.
   Fallback: com prefers-reduced-motion, mostra a malha estática.
   ========================================================================== */

const HUB = { x: 205, y: 152 };
const ORIGINS = [
  { x: 52, y: 66 },
  { x: 40, y: 152 },
  { x: 58, y: 238 },
];
const DESTS = [
  { x: 344, y: 54 },
  { x: 364, y: 120 },
  { x: 350, y: 210 },
  { x: 300, y: 252 },
  { x: 326, y: 88 },
];

type Pt = { x: number; y: number };
const inEdges = ORIGINS.map((o) => ({ from: o, to: HUB }));
const outEdges = DESTS.map((d) => ({ from: HUB, to: d }));
const allEdges = [...inEdges, ...outEdges];

// Pacotes que viajam pela rede (subset de rotas, com atrasos escalonados).
const packets: Array<{ from: Pt; to: Pt; delay: number; accent?: boolean }> = [
  { from: ORIGINS[0], to: HUB, delay: 0 },
  { from: ORIGINS[2], to: HUB, delay: 1.1 },
  { from: HUB, to: DESTS[0], delay: 0.6, accent: true },
  { from: HUB, to: DESTS[2], delay: 1.5, accent: true },
  { from: HUB, to: DESTS[3], delay: 2.2, accent: true },
];

export function RouteNetwork({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      role="img"
      aria-label="Rede de rotas logísticas conectando origem, centro de distribuição e entregas."
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Linhas da malha (desenham-se na entrada) */}
      <g stroke="var(--ea-creme-wm)" strokeOpacity={0.16} strokeWidth={1}>
        {allEdges.map((e, i) => (
          <motion.line
            key={i}
            x1={e.from.x}
            y1={e.from.y}
            x2={e.to.x}
            y2={e.to.y}
            initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
            animate={reduce ? undefined : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE_EA, delay: 0.15 + i * 0.08 }}
          />
        ))}
      </g>

      {/* Halo do hub (pulsa) */}
      {!reduce && (
        <motion.circle
          cx={HUB.x}
          cy={HUB.y}
          r={18}
          fill="var(--ea-neon)"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.9, 1.6, 0.9], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
          style={{ transformOrigin: `${HUB.x}px ${HUB.y}px`, transformBox: 'fill-box' }}
        />
      )}

      {/* Nós de origem e destino */}
      <g>
        {ORIGINS.map((n, i) => (
          <motion.circle
            key={`o${i}`}
            cx={n.x}
            cy={n.y}
            r={3.2}
            fill="var(--ea-creme-wm)"
            fillOpacity={0.7}
            initial={reduce ? undefined : { scale: 0 }}
            animate={reduce ? undefined : { scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_EA, delay: 0.3 + i * 0.1 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: 'fill-box' }}
          />
        ))}
        {DESTS.map((n, i) => (
          <motion.circle
            key={`d${i}`}
            cx={n.x}
            cy={n.y}
            r={3.2}
            fill="var(--ea-creme-wm)"
            fillOpacity={0.7}
            initial={reduce ? undefined : { scale: 0 }}
            animate={reduce ? undefined : { scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_EA, delay: 0.5 + i * 0.09 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: 'fill-box' }}
          />
        ))}
      </g>

      {/* Hub central (CD) */}
      <circle cx={HUB.x} cy={HUB.y} r={7} fill="var(--ea-neon)" />
      <circle cx={HUB.x} cy={HUB.y} r={7} stroke="var(--ea-petroleo)" strokeWidth={2} />

      {/* Pacotes viajando pela rede */}
      {!reduce &&
        packets.map((p, i) => (
          <motion.circle
            key={`p${i}`}
            r={2.6}
            fill={p.accent ? 'var(--ea-neon)' : 'var(--ea-creme-wm)'}
            initial={{ cx: p.from.x, cy: p.from.y, opacity: 0 }}
            animate={{
              cx: [p.from.x, p.to.x],
              cy: [p.from.y, p.to.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.4,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 1.2,
              delay: p.delay,
            }}
          />
        ))}
    </svg>
  );
}
