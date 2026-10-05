import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { Check } from 'lucide-react';
import { brazilStates } from '@/content/brazilMap';
import { logAlliance } from '@/content/content';
import { Chevron } from '@/components/brand/Chevron';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_EA } from '@/lib/motion';
import { cn } from '@/lib/cn';

/* ==========================================================================
   Cotação em tempo real (LogAlliance) — exemplo ilustrativo.
   A cada pedido: a rota sai do CD (Extrema/MG) em arco até a capital de
   destino, quatro transportadoras cotam, a mais barata sobe para o topo e é
   escolhida, e o pacote percorre a rota. Coordenadas no viewBox do mapa
   (projeção de Mercator, conferida com os estados).
   ========================================================================== */

const VB = { w: 613, h: 639 };
const HUB = { x: 432, y: 446 }; // Extrema/MG
const CARRIERS = ['A', 'B', 'C', 'D'] as const;

type Dest = { city: string; state: string; x: number; y: number; kg: string; table: number; quotes: number[] };

// Fretes ilustrativos: o escolhido gira em torno de R$ 9 e a economia sobre a
// tabela de balcão fica entre 34% e 40% (a promessa publicada é "até 40%").
const DESTS: Dest[] = [
  { city: 'Recife/PE', state: 'pe', x: 611, y: 207, kg: '0,8 kg', table: 16.8, quotes: [12.4, 10.15, 11.3, 13.05] },
  { city: 'Porto Alegre/RS', state: 'rs', x: 356, y: 571, kg: '1,2 kg', table: 14.6, quotes: [10.3, 9.4, 11.8, 9.95] },
  { city: 'Manaus/AM', state: 'am', x: 218, y: 131, kg: '0,5 kg', table: 21.5, quotes: [16.2, 14.1, 15.4, 17.8] },
  { city: 'Rio de Janeiro/RJ', state: 'rj', x: 481, y: 447, kg: '0,6 kg', table: 13.4, quotes: [9.2, 8.62, 10.1, 11.3] },
  { city: 'Salvador/BA', state: 'ba', x: 554, y: 285, kg: '0,9 kg', table: 15.2, quotes: [10.9, 9.85, 11.7, 12.4] },
  { city: 'Brasília/DF', state: 'df', x: 408, y: 330, kg: '0,7 kg', table: 13.9, quotes: [9.7, 10.4, 8.95, 11.1] },
  { city: 'Fortaleza/CE', state: 'ce', x: 554, y: 140, kg: '1,0 kg', table: 17.2, quotes: [12.1, 13.6, 10.85, 11.9] },
  { city: 'Curitiba/PR', state: 'pr', x: 386, y: 490, kg: '0,4 kg', table: 12.7, quotes: [8.9, 8.3, 9.7, 10.4] },
  { city: 'Belém/PA', state: 'pa', x: 398, y: 105, kg: '0,6 kg', table: 18.9, quotes: [13.4, 12.15, 14.7, 12.9] },
  { city: 'Belo Horizonte/MG', state: 'mg', x: 469, y: 398, kg: '0,5 kg', table: 12.1, quotes: [8.4, 7.95, 9.6, 10.2] },
];

const CYCLE_MS = 5200;
const CHOOSE_AT = 1500; // ms: cotações chegam, depois a melhor é escolhida
const TRAVEL = { delay: 1.7, duration: 1.5 }; // s: pacote percorre a rota
const ARRIVE_AFTER_CHOICE = TRAVEL.delay + TRAVEL.duration - CHOOSE_AT / 1000; // s

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
const pctOf = (d: Dest) => Math.round((1 - Math.min(...d.quotes) / d.table) * 100);
const bestOf = (d: Dest) => d.quotes.indexOf(Math.min(...d.quotes));
const orderNo = (i: number) => `#${(48213 + i * 137).toLocaleString('pt-BR')}`;

/** Arco (Bézier quadrática) do CD até o destino, bojo para "cima" do mapa. */
function arcOf(d: { x: number; y: number }) {
  const dx = d.x - HUB.x;
  const dy = d.y - HUB.y;
  const dist = Math.hypot(dx, dy) || 1;
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = Math.min(120, dist * 0.32);
  const c = { x: (HUB.x + d.x) / 2 + nx * bow, y: (HUB.y + d.y) / 2 + ny * bow };
  return { c, d: `M${HUB.x} ${HUB.y} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${d.x} ${d.y}` };
}
const pointAt = (c: { x: number; y: number }, to: { x: number; y: number }, t: number) => ({
  x: (1 - t) ** 2 * HUB.x + 2 * (1 - t) * t * c.x + t ** 2 * to.x,
  y: (1 - t) ** 2 * HUB.y + 2 * (1 - t) * t * c.y + t ** 2 * to.y,
});

/* ---------------------------- Câmera do mapa ---------------------------- */
type Box = { x: number; y: number; w: number; h: number };
const FULL: Box = { x: 0, y: 0, w: VB.w, h: VB.h };
const COMPACT_ASPECT = 1.55; // mobile: faixa baixa e larga (largura / altura)

/** Enquadra a rota (CD → destino, com a curva) na proporção da faixa mobile. */
function focusBox(d: Dest): Box {
  const { c } = arcOf(d);
  // Folga maior em cima (rótulo da cidade) e embaixo (rótulo do CD).
  const pad = { x: 50, top: 78, bottom: 56 };
  let x0 = Math.min(HUB.x, d.x, c.x) - pad.x;
  let y0 = Math.min(HUB.y, d.y, c.y) - pad.top;
  let w = Math.max(HUB.x, d.x, c.x) + pad.x - x0;
  let h = Math.max(HUB.y, d.y, c.y) + pad.bottom - y0;
  // zoom máximo: rotas curtas (ex.: BH) não ficam gigantes
  if (w < 250) {
    x0 -= (250 - w) / 2;
    w = 250;
  }
  if (w / h > COMPACT_ASPECT) {
    const nh = w / COMPACT_ASPECT;
    y0 -= (nh - h) / 2;
    h = nh;
  } else {
    const nw = h * COMPACT_ASPECT;
    x0 -= (nw - w) / 2;
    w = nw;
  }
  return { x: x0, y: y0, w, h };
}

function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return compact;
}

type Cam = { x: MotionValue<number>; y: MotionValue<number>; w: MotionValue<number>; h: MotionValue<number> };

/** Tamanho em unidades do mapa que se mantém constante na tela com o zoom. */
function useScaled(cam: Cam, base: number) {
  return useTransform(cam.w, (w) => base * (w / VB.w));
}

/** Rótulo HTML preso a um ponto do mapa (segue a câmera). */
function Pin({
  cam,
  x,
  y,
  dx,
  dy,
  className,
  children,
}: {
  cam: Cam;
  x: number;
  y: number;
  dx: number;
  dy: number;
  className?: string;
  children: ReactNode;
}) {
  const left = useTransform([cam.x, cam.w], ([cx, cw]: number[]) => `calc(${((x - cx) / cw) * 100}% + ${dx}px)`);
  const top = useTransform([cam.y, cam.h], ([cy, ch]: number[]) => `calc(${((y - cy) / ch) * 100}% + ${dy}px)`);
  return (
    <motion.span className={cn('absolute z-10', className)} style={{ left, top }}>
      {children}
    </motion.span>
  );
}

export function FreightQuoteLive() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const compact = useCompact();

  // Estado inicial (HTML pré-renderizado): um pedido já cotado e entregue.
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(true);
  const [trail, setTrail] = useState<number[]>([9, 8, 7]);
  const [history, setHistory] = useState<number[]>([9, 8]);
  const started = useRef(false);
  const idxRef = useRef(0);

  // Ciclo de pedidos (só com a seção na tela).
  useEffect(() => {
    if (!inView) return;
    let chooseTimer = 0;
    const next = () => {
      started.current = true;
      const cur = idxRef.current;
      const n = (cur + 1) % DESTS.length;
      idxRef.current = n;
      setTrail((tr) => [cur, ...tr.filter((x) => x !== n && x !== cur)].slice(0, 4));
      setHistory((h) => [cur, ...h.filter((x) => x !== cur && x !== n)].slice(0, 3));
      setIdx(n);
      setChosen(false);
      chooseTimer = window.setTimeout(() => setChosen(true), CHOOSE_AT);
    };
    const first = window.setTimeout(next, 1600);
    const loop = window.setInterval(next, CYCLE_MS);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(chooseTimer);
      window.clearInterval(loop);
    };
  }, [inView]);

  const dest = DESTS[idx];
  const arc = arcOf(dest);
  const best = bestOf(dest);
  const maxQ = Math.max(...dest.quotes);

  // Pacote percorrendo a rota (t: 0 → 1).
  const t = useMotionValue(1);
  const arcRef = useRef({ arc, dest });
  arcRef.current = { arc, dest };
  const cx = useTransform(t, (v) => pointAt(arcRef.current.arc.c, arcRef.current.dest, v).x);
  const cy = useTransform(t, (v) => pointAt(arcRef.current.arc.c, arcRef.current.dest, v).y);
  useIsoLayoutEffect(() => {
    if (!started.current) return;
    t.set(0); // antes do paint: o pacote não "pisca" no destino novo
    const c = animate(t, 1, reduce ? { duration: 0 } : { ...TRAVEL, ease: [0.45, 0, 0.2, 1] });
    return () => c.stop();
  }, [idx, reduce, t]);

  // Câmera: mapa inteiro no desktop; no mobile, zoom na rota do pedido.
  const box = compact ? focusBox(dest) : FULL;
  const kT = box.w / VB.w; // escala do destino da câmera (para filtros/ondas)
  const cam: Cam = {
    x: useMotionValue(FULL.x),
    y: useMotionValue(FULL.y),
    w: useMotionValue(FULL.w),
    h: useMotionValue(FULL.h),
  };
  useEffect(() => {
    const opts = reduce || !started.current ? { duration: 0 } : { duration: 1.1, ease: EASE_EA };
    const runs = [animate(cam.x, box.x, opts), animate(cam.y, box.y, opts), animate(cam.w, box.w, opts), animate(cam.h, box.h, opts)];
    return () => runs.forEach((r) => r.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box.x, box.y, box.w, box.h, reduce]);
  const viewBox = useTransform([cam.x, cam.y, cam.w, cam.h], ([x, y, w, h]: number[]) => `${x} ${y} ${w} ${h}`);
  const glowW = useScaled(cam, 6);
  const routeW = useScaled(cam, 2.4);
  const dotR = useScaled(cam, 4.5);
  const trailR = useScaled(cam, 3);
  const pkgGlowR = useScaled(cam, 9);
  const pkgR = useScaled(cam, 4);
  const hubHalo = useScaled(cam, 14);
  const hubR = useScaled(cam, 6);
  const labelLeft = (dest.x - box.x) / box.w > 0.62;

  // Linhas da cotação: na ordem de chegada; ao escolher, ordenadas por preço.
  const rows = dest.quotes.map((q, i) => ({ carrier: CARRIERS[i], q, best: i === best }));
  const shown = chosen ? [...rows].sort((a, b) => a.q - b.q) : rows;
  const fresh = started.current; // a partir do 1º ciclo, tudo entra animado

  return (
    <div ref={ref} className="ea-on-dark relative overflow-hidden rounded-ea-lg bg-ea-petroleo text-ea-cremewm">
      <p className="sr-only">
        Exemplo ilustrativo: para cada pedido enviado do CD em Extrema/MG, a rede LogAlliance cota o frete em várias
        transportadoras e escolhe a mais barata para o destino.
      </p>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 border-b border-ea-cremewm/10 px-5 py-4 sm:px-7" aria-hidden>
        <span className="ea-kicker inline-flex items-center gap-2.5 text-ea-cremewm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ea-neon" />
          </span>
          Cotação ao vivo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex text-ea-neon">
            <Chevron className="h-4 w-4 rotate-90" />
            <Chevron className="-ml-2 h-4 w-4 rotate-90" />
          </span>
          <span className="text-sm font-bold tracking-tight">{logAlliance.brand}</span>
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr]" aria-hidden>
        {/* ======================= MAPA ======================= */}
        <div
          className="relative px-3 py-3 sm:px-8 sm:py-6"
          style={{ backgroundImage: 'radial-gradient(rgba(250,250,245,0.07) 1px, transparent 1.2px)', backgroundSize: '16px 16px' }}
        >
          <div
            className={cn('relative mx-auto w-full overflow-hidden sm:max-w-[460px] sm:overflow-visible', compact && 'rounded-ea-sm')}
            style={{ aspectRatio: compact ? `${COMPACT_ASPECT}` : `${VB.w} / ${VB.h}` }}
          >
            <motion.svg viewBox={viewBox} className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="ea-route" gradientUnits="userSpaceOnUse" x1={HUB.x} y1={HUB.y} x2={dest.x} y2={dest.y}>
                  <stop offset="0%" stopColor="#C4FF57" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C4FF57" stopOpacity="1" />
                </linearGradient>
                <filter id="ea-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={4 * kT} />
                </filter>
              </defs>

              {/* Estados (o de destino acende) */}
              {brazilStates.map((st) => (
                <motion.path
                  key={st.id}
                  d={st.path}
                  stroke="#FAFAF5"
                  strokeOpacity={compact ? 0.2 : 0.14}
                  strokeWidth={0.8}
                  vectorEffect="non-scaling-stroke"
                  fill="#C4FF57"
                  initial={false}
                  animate={{ fillOpacity: st.id === dest.state && chosen ? 0.16 : 0.025 }}
                  transition={{ duration: 0.6 }}
                />
              ))}

              {/* Rotas anteriores (rastro da rede) */}
              {trail.map((ti, k) => (
                <path
                  key={`trail-${ti}`}
                  d={arcOf(DESTS[ti]).d}
                  fill="none"
                  stroke="#C4FF57"
                  strokeOpacity={0.28 - k * 0.06}
                  strokeWidth={1.2}
                  strokeDasharray="3 5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {trail.map((ti) => (
                <motion.circle key={`tdot-${ti}`} cx={DESTS[ti].x} cy={DESTS[ti].y} r={trailR} fill="#C4FF57" fillOpacity={0.35} />
              ))}

              {/* Rota atual: brilho + traço que se desenha */}
              <motion.path
                key={`glow-${idx}`}
                d={arc.d}
                fill="none"
                stroke="#C4FF57"
                strokeOpacity={0.35}
                strokeWidth={glowW}
                filter="url(#ea-glow)"
                initial={fresh ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: EASE_EA }}
              />
              <motion.path
                key={`route-${idx}`}
                d={arc.d}
                fill="none"
                stroke="url(#ea-route)"
                strokeWidth={routeW}
                strokeLinecap="round"
                initial={fresh ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: EASE_EA }}
              />

              {/* Destino: ponto + onda de chegada */}
              <motion.circle cx={dest.x} cy={dest.y} r={dotR} fill="#C4FF57" />
              {fresh && (
                <motion.circle
                  key={`ripple-${idx}`}
                  cx={dest.x}
                  cy={dest.y}
                  fill="none"
                  stroke="#C4FF57"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  initial={{ r: 4 * kT, opacity: 0 }}
                  animate={{ r: [4 * kT, 26 * kT], opacity: [0.9, 0] }}
                  transition={{ delay: TRAVEL.delay + TRAVEL.duration - 0.05, duration: 1.1, ease: 'easeOut' }}
                />
              )}

              {/* Pacote viajando */}
              <motion.circle cx={cx} cy={cy} r={pkgGlowR} fill="#C4FF57" fillOpacity={0.25} filter="url(#ea-glow)" />
              <motion.circle cx={cx} cy={cy} r={pkgR} fill="#FAFAF5" stroke="#C4FF57" strokeWidth={2} vectorEffect="non-scaling-stroke" />

              {/* Hub: CD Extrema/MG */}
              <motion.circle cx={HUB.x} cy={HUB.y} r={hubHalo} fill="#C4FF57" fillOpacity={0.12} />
              <motion.circle cx={HUB.x} cy={HUB.y} r={hubR} fill="#C4FF57" />
            </motion.svg>

            {/* Rótulos em HTML (nítidos em qualquer zoom) */}
            <Pin cam={cam} x={HUB.x} y={HUB.y} dx={-12} dy={16} className="-translate-x-full -translate-y-1/2">
              <span className="block whitespace-nowrap rounded-pill border border-ea-neon/40 bg-ea-petroleo/90 px-2.5 py-1 text-[0.65rem] font-bold text-ea-neon">
                {compact ? 'CD Extrema' : 'CD Extrema/MG'}
              </span>
            </Pin>
            <AnimatePresence>
              {chosen && (
                <Pin
                  key={`label-${idx}`}
                  cam={cam}
                  x={dest.x}
                  y={dest.y}
                  dx={labelLeft ? -12 : 12}
                  dy={-18}
                  className={cn('-translate-y-1/2', labelLeft && '-translate-x-full')}
                >
                  <motion.span
                    className="block whitespace-nowrap rounded-pill bg-ea-cremewm px-2.5 py-1 text-[0.68rem] font-bold text-ea-petroleo"
                    initial={fresh ? { opacity: 0, y: 6 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: fresh ? ARRIVE_AFTER_CHOICE : 0, duration: 0.35 }}
                  >
                    {dest.city}
                  </motion.span>
                </Pin>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ======================= COTAÇÃO ======================= */}
        <div className="flex flex-col gap-4 border-t border-ea-cremewm/10 p-4 sm:gap-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between gap-3 sm:items-start">
            <div className="flex flex-col gap-1">
              <span className="hidden text-[0.65rem] font-bold uppercase tracking-label text-ea-soft-dark sm:block">
                Pedido {orderNo(idx)} · {dest.kg}
              </span>
              <span className="text-sm font-bold sm:text-base">
                Extrema<span className="hidden sm:inline">/MG</span> <span className="text-ea-neon">→</span> {dest.city}
              </span>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-pill px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-label transition-colors duration-300',
                chosen ? 'bg-ea-neon text-ea-petroleo' : 'bg-ea-cremewm/10 text-ea-cremewm',
              )}
            >
              {chosen ? 'Escolhida' : 'Cotando…'}
            </span>
          </div>

          <ul className="flex flex-col gap-1.5 sm:gap-2">
            {shown.map((r, i) => (
              <motion.li
                layout
                key={`${idx}-${r.carrier}`}
                transition={{ layout: { duration: 0.55, ease: EASE_EA } }}
                className={cn(
                  'grid grid-cols-[4.6rem_1fr_4.4rem] items-center gap-2.5 rounded-ea-sm px-2.5 py-1.5 transition-colors duration-300 sm:grid-cols-[5.5rem_1fr_4.6rem] sm:gap-3 sm:px-3 sm:py-2.5',
                  chosen && r.best ? 'bg-ea-neon/[0.12] ring-1 ring-ea-neon/50' : 'bg-ea-cremewm/[0.04]',
                  chosen && !r.best && 'opacity-45',
                )}
              >
                <span className={cn('flex items-center gap-1.5 text-xs font-medium', chosen && r.best && 'font-bold text-ea-neon')}>
                  {chosen && r.best && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  Transp. {r.carrier}
                </span>
                <span className="h-1.5 overflow-hidden rounded-full bg-ea-cremewm/10">
                  <motion.span
                    className={cn('block h-full rounded-full', chosen && r.best ? 'bg-ea-neon' : 'bg-ea-cremewm/45')}
                    initial={fresh ? { width: 0 } : false}
                    animate={{ width: `${(r.q / maxQ) * 100}%` }}
                    transition={{ delay: fresh ? 0.25 + i * 0.18 : 0, duration: 0.7, ease: EASE_EA }}
                  />
                </span>
                <motion.span
                  className={cn('ea-tnum text-right text-sm', chosen && r.best ? 'font-bold text-ea-neon' : 'text-ea-cremewm')}
                  initial={fresh ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ delay: fresh ? 0.45 + i * 0.18 : 0, duration: 0.3 }}
                >
                  {brl.format(r.q)}
                </motion.span>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-end justify-between gap-4 border-t border-ea-cremewm/10 pt-3 sm:pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-[0.65rem] font-bold uppercase tracking-label text-ea-soft-dark">Frete do pedido</span>
              <span className="text-xs text-ea-soft-dark">
                Tabela de balcão <span className="ea-tnum line-through">{brl.format(dest.table)}</span>
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className={cn('ea-metric text-2xl transition-colors duration-300 sm:text-3xl', chosen ? 'text-ea-neon' : 'text-ea-cremewm/30')}>
                {chosen ? brl.format(dest.quotes[best]) : '—'}
              </span>
              <span className={cn('text-xs font-bold transition-opacity duration-300', chosen ? 'opacity-100' : 'opacity-0')}>
                −{pctOf(dest)}% no frete
              </span>
            </div>
          </div>

          {/* Últimos envios (só em telas maiores) */}
          <div className="hidden flex-col gap-2 sm:flex">
            <span className="text-[0.65rem] font-bold uppercase tracking-label text-ea-soft-dark">Últimos envios</span>
            <ul className="flex flex-col">
              <AnimatePresence initial={false}>
                {history.map((h) => (
                  <motion.li
                    key={`h-${h}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE_EA }}
                    className="overflow-hidden"
                  >
                    <span className="flex items-center justify-between gap-3 border-b border-ea-cremewm/[0.07] py-1.5 text-xs">
                      <span className="text-ea-cremewm/80">{DESTS[h].city}</span>
                      <span className="ea-tnum text-ea-soft-dark">
                        {brl.format(Math.min(...DESTS[h].quotes))} <span className="text-ea-neon">−{pctOf(DESTS[h])}%</span>
                      </span>
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <p className="mt-auto text-[0.65rem] text-ea-soft-dark/80">Exemplo ilustrativo de cotação na rede LogAlliance.</p>
        </div>
      </div>
    </div>
  );
}
