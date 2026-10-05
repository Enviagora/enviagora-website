import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  CalendarClock,
  Check,
  LayoutDashboard,
  PackageCheck,
  Search,
  Settings,
  Truck,
} from 'lucide-react';
import { Arrow } from '@/components/brand/Arrow';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_EA } from '@/lib/motion';
import { cn } from '@/lib/cn';

/* ==========================================================================
   Painel ao vivo (ilustrativo) — mostra o que a marca acompanha no sistema:
   pedidos entrando e avançando de etapa, volume por hora, rastreio de um
   pedido, estoque com lotes/validades e avisos. Estado inicial fixo (bate com
   o HTML pré-renderizado); a "vida" roda só no navegador e com a seção na tela.
   ========================================================================== */

const nf = new Intl.NumberFormat('pt-BR');

const PRODUCTS = [
  'Whey Protein 900g',
  'Creatina 300g',
  'Sérum Vitamina C',
  'Colágeno 300g',
  'Kit Skincare',
  'Multivitamínico 60 caps',
  'Shampoo Antiqueda 300ml',
  'Vitamina D3 gotas',
  'Pré-treino 300g',
  'Hidratante Facial 50g',
];
const CITIES = [
  'São Paulo/SP',
  'Rio de Janeiro/RJ',
  'Belo Horizonte/MG',
  'Curitiba/PR',
  'Salvador/BA',
  'Recife/PE',
  'Porto Alegre/RS',
  'Brasília/DF',
  'Fortaleza/CE',
  'Campinas/SP',
  'Goiânia/GO',
  'Florianópolis/SC',
];
const CHANNELS = ['Shopify', 'Mercado Livre', 'TikTok Shop', 'Shopee', 'Nuvemshop', 'Amazon', 'Yampi'];
const STAGES = [
  { label: 'Recebido', cls: 'bg-ea-coolgrey text-ea-petroleo' },
  { label: 'Separação', cls: 'bg-ea-eucalipto/60 text-ea-petroleo' },
  { label: 'Embalado', cls: 'bg-ea-petroleo/10 text-ea-petroleo' },
  { label: 'Expedido', cls: 'bg-ea-neon text-ea-petroleo' },
];

type Order = { id: number; product: number; city: number; channel: number; stage: number };

const INITIAL_FEED: Order[] = [
  { id: 48912, product: 0, city: 0, channel: 0, stage: 0 },
  { id: 48911, product: 2, city: 5, channel: 2, stage: 1 },
  { id: 48910, product: 1, city: 2, channel: 1, stage: 1 },
  { id: 48909, product: 4, city: 3, channel: 3, stage: 2 },
  { id: 48908, product: 3, city: 7, channel: 4, stage: 3 },
  { id: 48907, product: 5, city: 1, channel: 0, stage: 3 },
];

// Pedidos por hora (8h → 14h; a última hora está "em andamento").
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const INITIAL_SERIES = [38, 84, 126, 158, 171, 149, 96];
const CH = { w: 600, h: 170, top: 14, bottom: 22, max: 200 };

const TRACK_STEPS = ['Pedido recebido', 'Separação', 'Embalagem', 'Coleta', 'Em trânsito', 'Entregue'];
const TRACK_TIMES = ['09:12', '09:41', '10:05', '13:30', '14:02', 'D+1'];

const STOCK = [
  { sku: 'Whey Protein 900g', units: 2480, cap: 3200, lot: 'L2391', exp: '03/2027' },
  { sku: 'Creatina 300g', units: 1120, cap: 2000, lot: 'C0815', exp: '11/2026', fefo: true },
  { sku: 'Sérum Vitamina C', units: 120, cap: 1000, lot: 'S0412', exp: '08/2027', low: true },
];

const TOASTS = [
  { icon: PackageCheck, title: 'Mercadoria recebida', body: '2.400 un. de Creatina 300g conferidas e endereçadas' },
  { icon: AlertTriangle, title: 'Estoque baixo', body: 'Sérum Vitamina C — 120 un. restantes' },
  { icon: CalendarClock, title: 'Lote próximo do vencimento', body: 'Creatina 300g · lote C0815 sai primeiro (FEFO)' },
  { icon: Truck, title: 'Coleta realizada', body: '312 pedidos coletados pela transportadora' },
];

/** PRNG com semente (determinístico entre recarregamentos). */
function prng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Curva suave (Catmull-Rom → Bézier) pelos pontos do gráfico. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}
const xAt = (i: number) => (i / (HOURS.length - 1)) * CH.w;
const yAt = (v: number) => CH.top + (1 - v / CH.max) * (CH.h - CH.top - CH.bottom);

/** Número que desliza até o novo valor. */
function Rolling({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => nf.format(Math.round(v)));
  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 0.8, ease: EASE_EA });
    return () => c.stop();
  }, [value, reduce, mv]);
  return <motion.span className={className}>{text}</motion.span>;
}

function useLiveState(running: boolean) {
  const [feed, setFeed] = useState<Order[]>(INITIAL_FEED);
  const [kpi, setKpi] = useState({ received: 1284, shipped: 1102 });
  const [series, setSeries] = useState<number[]>(INITIAL_SERIES);
  const [track, setTrack] = useState({ step: 4, order: 48876 });
  const [stock, setStock] = useState(STOCK.map((s) => s.units));
  const [toast, setToast] = useState<number | null>(null);
  const [clock, setClock] = useState(14 * 3600 + 32 * 60 + 8);
  const rnd = useRef(prng(20261005));
  const nextId = useRef(48913);

  useEffect(() => {
    if (!running) return;
    const r = rnd.current;

    // Novo pedido entra e os demais avançam de etapa.
    const tFeed = window.setInterval(() => {
      const fresh: Order = {
        id: nextId.current++,
        product: Math.floor(r() * PRODUCTS.length),
        city: Math.floor(r() * CITIES.length),
        channel: Math.floor(r() * CHANNELS.length),
        stage: 0,
      };
      setFeed((f) => [fresh, ...f.map((o) => ({ ...o, stage: Math.min(3, o.stage + (r() < 0.55 ? 1 : 0)) }))].slice(0, 6));
      const inc = 1 + Math.floor(r() * 3);
      setKpi((k) => ({ received: k.received + inc, shipped: Math.min(k.received + inc - 40, k.shipped + 1 + Math.floor(r() * 3)) }));
      setSeries((s) => [...s.slice(0, -1), Math.min(CH.max - 10, s[s.length - 1] + inc)]);
      setStock((st) => st.map((u, i) => Math.max(i === 2 ? 60 : 200, u - (r() < 0.5 ? 1 + Math.floor(r() * 3) : 0))));
    }, 1700);

    // Rastreio: o pedido percorre as etapas; ao entregar, entra outro.
    const tTrack = window.setInterval(() => {
      setTrack((t) => (t.step >= TRACK_STEPS.length - 1 ? { step: 0, order: t.order + 7 } : { ...t, step: t.step + 1 }));
    }, 1900);

    // Avisos.
    let i = 0;
    let hide = 0;
    const showToast = () => {
      setToast(i % TOASTS.length);
      i++;
      hide = window.setTimeout(() => setToast(null), 3800);
    };
    const first = window.setTimeout(showToast, 1800);
    const tToast = window.setInterval(showToast, 6200);

    const tClock = window.setInterval(() => setClock((c) => c + 1), 1000);

    return () => {
      window.clearInterval(tFeed);
      window.clearInterval(tTrack);
      window.clearInterval(tToast);
      window.clearInterval(tClock);
      window.clearTimeout(first);
      window.clearTimeout(hide);
    };
  }, [running]);

  return { feed, kpi, series, track, stock, toast, clock };
}

const fmtClock = (s: number) =>
  [Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');

const card = 'rounded-ea border border-ea-petroleo/10 bg-white';
const label = 'text-[0.62rem] font-bold uppercase tracking-label text-ea-soft';

export function LiveDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const { feed, kpi, series, track, stock, toast, clock } = useLiveState(inView);

  const pts = series.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const line = smoothPath(pts);
  const last = pts[pts.length - 1];
  const area = `${line} L${last.x.toFixed(1)} ${CH.h - CH.bottom} L0 ${CH.h - CH.bottom} Z`;
  const progress = track.step / (TRACK_STEPS.length - 1);
  const ToastIcon = toast !== null ? TOASTS[toast].icon : null;

  const kpis = [
    { k: 'Pedidos recebidos', short: 'Recebidos', v: kpi.received, note: 'hoje' },
    { k: 'Enviados', short: 'Enviados', v: kpi.shipped, note: 'hoje' },
    { k: 'Em separação', short: 'Separação', v: kpi.received - kpi.shipped, note: 'agora' },
  ];

  return (
    <div ref={ref} className="relative">
      <p className="sr-only">
        Ilustração do painel da Enviagora: pedidos entrando e avançando de etapa em tempo real, volume por hora, rastreio
        de pedido, estoque com lotes e validades e notificações.
      </p>

      <div
        className="relative flex overflow-hidden rounded-ea-lg border border-ea-petroleo/15 bg-ea-creme"
        style={{ boxShadow: '0 30px 80px -30px rgba(18,51,54,0.35)' }}
        aria-hidden
      >
        {/* Barra lateral */}
        <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 bg-ea-petroleo py-5 md:flex">
          <Arrow className="mb-4 h-6 w-6 text-ea-neon" />
          {[LayoutDashboard, Boxes, Truck, BarChart3, Bell, Settings].map((Icon, i) => (
            <span
              key={i}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-ea-sm',
                i === 0 ? 'bg-ea-neon text-ea-petroleo' : 'text-ea-cremewm/55',
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
          ))}
        </aside>

        <div className="min-w-0 flex-1">
          {/* Topo */}
          <div className="flex items-center justify-between gap-3 border-b border-ea-petroleo/10 bg-white px-4 py-3 sm:px-6">
            <div className="relative flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
              {/* Mobile: os avisos aparecem aqui (no lugar do título) para não cobrir o painel */}
              <span className="relative block h-5 min-w-0 flex-1 overflow-hidden sm:hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  {toast !== null && ToastIcon ? (
                    <motion.span
                      key={`t-${toast}`}
                      className="absolute inset-0 flex items-center gap-1.5 truncate text-xs font-bold text-ea-petroleo"
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_EA }}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-ea-neon">
                        <ToastIcon className="h-3 w-3" strokeWidth={2.2} />
                      </span>
                      <span className="truncate">{TOASTS[toast].title}</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="title"
                      className="absolute inset-0 flex items-center text-sm font-bold text-ea-petroleo"
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_EA }}
                    >
                      Visão geral
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="hidden text-sm font-bold text-ea-petroleo sm:inline">Visão geral</span>
              <span className="hidden items-center gap-2 rounded-pill bg-ea-creme px-3 py-1.5 text-xs text-ea-soft sm:flex">
                <Search className="h-3.5 w-3.5" /> Buscar pedido, SKU ou lote
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="ea-tnum hidden text-xs text-ea-soft sm:inline">{fmtClock(clock)}</span>
              <span className="flex items-center gap-1.5 rounded-pill bg-ea-petroleo px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-label text-ea-cremewm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ea-neon" />
                </span>
                Ao vivo
              </span>
            </div>
          </div>

          <div className="grid gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-[1fr_340px]">
            {/* ============ Coluna principal ============ */}
            <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
              {/* KPIs — mobile: uma faixa só, com 3 números e a curva do dia */}
              <div className={cn(card, 'overflow-hidden sm:hidden')}>
                <div className="grid grid-cols-3 divide-x divide-ea-petroleo/10">
                  {kpis.map((k) => (
                    <div key={k.k} className="flex flex-col gap-1 px-3 py-3">
                      <span className="text-[0.58rem] font-bold uppercase tracking-label text-ea-soft">{k.short}</span>
                      <Rolling value={k.v} className="ea-metric text-xl text-ea-petroleo" />
                    </div>
                  ))}
                </div>
                <div className="relative border-t border-ea-petroleo/10 px-3 pb-2 pt-2">
                  <span className="absolute left-3 top-2 text-[0.58rem] font-bold uppercase tracking-label text-ea-soft">
                    Pedidos por hora
                  </span>
                  <svg viewBox={`0 ${CH.top} ${last.x} ${CH.h - CH.top - CH.bottom}`} preserveAspectRatio="none" className="mt-4 block h-12 w-full overflow-visible">
                    <defs>
                      <linearGradient id="ea-area-m" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C4FF57" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#C4FF57" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path d={area} fill="url(#ea-area-m)" initial={false} animate={{ d: area }} transition={{ duration: 0.8, ease: EASE_EA }} />
                    <motion.path
                      d={line}
                      fill="none"
                      stroke="#123336"
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                      initial={false}
                      animate={{ d: line }}
                      transition={{ duration: 0.8, ease: EASE_EA }}
                    />
                  </svg>
                </div>
              </div>

              <div className="hidden gap-4 sm:grid sm:grid-cols-4">
                {kpis.map((k) => (
                  <div key={k.k} className={cn(card, 'flex flex-col gap-1.5 p-3.5 sm:p-4')}>
                    <span className={label}>{k.k}</span>
                    <Rolling value={k.v} className="ea-metric text-2xl text-ea-petroleo sm:text-[1.7rem]" />
                    <span className="text-[0.65rem] text-ea-soft">{k.note}</span>
                  </div>
                ))}
                <div className="flex flex-col gap-1.5 rounded-ea bg-ea-petroleo p-3.5 sm:p-4">
                  <span className="text-[0.62rem] font-bold uppercase tracking-label text-ea-soft-dark">Assertividade</span>
                  <span className="ea-metric text-2xl text-ea-neon sm:text-[1.7rem]">99,6%</span>
                  <span className="text-[0.65rem] text-ea-soft-dark">nos pedidos</span>
                </div>
              </div>

              {/* Gráfico: pedidos por hora */}
              <div className={cn(card, 'hidden p-4 sm:block')}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className={label}>Pedidos por hora</span>
                  <span className="text-xs text-ea-soft">
                    14h · <Rolling value={series[series.length - 1]} className="ea-tnum font-bold text-ea-petroleo" /> pedidos
                  </span>
                </div>
                <svg viewBox={`0 0 ${CH.w} ${CH.h}`} className="h-auto w-full overflow-visible">
                  <defs>
                    <linearGradient id="ea-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C4FF57" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#C4FF57" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 50, 100, 150].map((g) => (
                    <line key={g} x1={0} x2={CH.w} y1={yAt(g)} y2={yAt(g)} stroke="#123336" strokeOpacity={0.07} />
                  ))}
                  {/* Horas futuras: área tracejada vazia */}
                  <line x1={last.x} x2={CH.w} y1={CH.h - CH.bottom} y2={CH.h - CH.bottom} stroke="#123336" strokeOpacity={0.25} strokeDasharray="3 5" />
                  <motion.path
                    d={area}
                    fill="url(#ea-area)"
                    initial={false}
                    animate={{ d: area }}
                    transition={{ duration: 0.8, ease: EASE_EA }}
                  />
                  <motion.path
                    d={line}
                    fill="none"
                    stroke="#123336"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    initial={false}
                    animate={{ d: line }}
                    transition={{ duration: 0.8, ease: EASE_EA }}
                  />
                  <line x1={last.x} x2={last.x} y1={last.y} y2={CH.h - CH.bottom} stroke="#123336" strokeOpacity={0.3} strokeDasharray="2 3" />
                  <motion.circle cx={last.x} r={10} fill="#C4FF57" fillOpacity={0.35} initial={false} animate={{ cy: last.y }} transition={{ duration: 0.8, ease: EASE_EA }} />
                  <motion.circle cx={last.x} r={4.5} fill="#123336" stroke="#C4FF57" strokeWidth={2} initial={false} animate={{ cy: last.y }} transition={{ duration: 0.8, ease: EASE_EA }} />
                  {HOURS.filter((h) => h % 2 === 0).map((h) => (
                    <text key={h} x={xAt(HOURS.indexOf(h))} y={CH.h - 4} textAnchor="middle" fontSize={10} fill="#2a5b5f" fillOpacity={0.8}>
                      {h}h
                    </text>
                  ))}
                </svg>
              </div>

              {/* Rastreio de pedido */}
              <div className={cn(card, 'p-3.5 sm:p-4')}>
                <div className="mb-3 flex items-baseline justify-between gap-3 sm:mb-4">
                  <span className={label}>
                    Rastreio<span className="hidden sm:inline"> · pedido</span> #{nf.format(track.order)}
                  </span>
                  <span className="text-xs text-ea-soft">
                    <span className="hidden sm:inline">Extrema/MG </span>→ Curitiba/PR
                  </span>
                </div>
                <div className="relative px-2">
                  {/* trilho */}
                  <div className="absolute left-2 right-2 top-[11px] h-[3px] rounded-full bg-ea-petroleo/10" />
                  <motion.div
                    className="absolute left-2 top-[11px] h-[3px] rounded-full bg-ea-neon"
                    initial={false}
                    animate={{ width: `calc((100% - 1rem) * ${progress})` }}
                    transition={{ duration: 0.9, ease: EASE_EA }}
                  />
                  <motion.span
                    className="absolute top-[-4px] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-ea-petroleo text-ea-neon shadow-ea"
                    initial={false}
                    animate={{ left: `calc(0.5rem + (100% - 1rem) * ${progress})` }}
                    transition={{ duration: 0.9, ease: EASE_EA }}
                  >
                    <Truck className="h-4 w-4" strokeWidth={2} />
                  </motion.span>
                  <ol className="relative grid grid-cols-6">
                    {TRACK_STEPS.map((s, i) => {
                      const done = i <= track.step;
                      return (
                        <li key={s} className={cn('flex flex-col gap-1', i === 0 ? 'items-start' : i === TRACK_STEPS.length - 1 ? 'items-end text-right' : 'items-center text-center')}>
                          <span
                            className={cn(
                              'mt-[5px] h-4 w-4 rounded-full border-2 transition-colors duration-500',
                              done ? 'border-ea-neon bg-ea-neon' : 'border-ea-petroleo/20 bg-white',
                            )}
                          />
                          <span
                            className={cn(
                              'mt-2 hidden text-[0.68rem] font-bold leading-tight sm:block',
                              done ? 'text-ea-petroleo' : 'text-ea-soft/60',
                            )}
                          >
                            {s}
                          </span>
                          <span className="ea-tnum hidden text-[0.6rem] text-ea-soft sm:block">{i <= track.step ? TRACK_TIMES[i] : '—'}</span>
                        </li>
                      );
                    })}
                  </ol>
                  {/* Mobile: só a etapa atual (6 rótulos não cabem lado a lado) */}
                  <p className="mt-3 text-xs text-ea-soft sm:hidden">
                    <span className="font-bold text-ea-petroleo">{TRACK_STEPS[track.step]}</span> · {TRACK_TIMES[track.step]}
                  </p>
                </div>
              </div>
            </div>

            {/* ============ Coluna lateral ============ */}
            <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
              {/* Feed de pedidos */}
              <div className={cn(card, 'flex flex-col p-3.5 sm:p-4')}>
                <div className="mb-2 flex items-center justify-between sm:mb-3">
                  <span className={label}>Pedidos agora</span>
                  <span className="text-[0.62rem] text-ea-soft">todos os canais</span>
                </div>
                <ul className="relative flex flex-col">
                  <AnimatePresence initial={false}>
                    {feed.slice(0, 5).map((o, i) => (
                      <motion.li
                        key={o.id}
                        layout
                        initial={{ opacity: 0, y: -14, backgroundColor: 'rgba(196,255,87,0.35)' }}
                        animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(196,255,87,0)' }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, ease: EASE_EA, backgroundColor: { duration: 1.4 } }}
                        className={cn(
                          'items-center gap-3 rounded-ea-sm border-b border-ea-petroleo/[0.07] px-1.5 py-2 sm:py-2.5',
                          // mobile: só os 3 pedidos mais recentes
                          i >= 3 ? 'hidden sm:flex' : 'flex',
                        )}
                      >
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-xs font-bold text-ea-petroleo">{PRODUCTS[o.product]}</span>
                          <span className="truncate text-[0.65rem] text-ea-soft">
                            #{nf.format(o.id)} · {CHANNELS[o.channel]} · {CITIES[o.city]}
                          </span>
                        </div>
                        <motion.span
                          key={o.stage}
                          initial={{ scale: 0.85, opacity: 0.4 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.35, ease: 'backOut' }}
                          className={cn('inline-flex shrink-0 items-center gap-1 rounded-pill px-2 py-1 text-[0.6rem] font-bold', STAGES[o.stage].cls)}
                        >
                          {o.stage === 3 && <Check className="h-3 w-3" strokeWidth={3} />}
                          {STAGES[o.stage].label}
                        </motion.span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              {/* Estoque, lotes e validades */}
              <div className={cn(card, 'hidden flex-col gap-3 p-4 sm:flex')}>
                <span className={label}>Estoque · lotes e validades</span>
                {STOCK.map((s, i) => (
                  <div key={s.sku} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-xs font-bold text-ea-petroleo">{s.sku}</span>
                      <span className={cn('ea-tnum text-xs', s.low ? 'font-bold text-ea-petroleo' : 'text-ea-soft')}>
                        <Rolling value={stock[i]} /> un.
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-ea-petroleo/10">
                      <motion.div
                        className={cn('h-full rounded-full', s.low ? 'bg-ea-petroleo' : 'bg-ea-verde-500')}
                        initial={false}
                        animate={{ width: `${Math.max(4, (stock[i] / s.cap) * 100)}%` }}
                        transition={{ duration: 0.8, ease: EASE_EA }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[0.62rem] text-ea-soft">
                      <span>
                        Lote {s.lot} · val. {s.exp}
                      </span>
                      {s.fefo && <span className="rounded-pill bg-ea-neon px-1.5 py-0.5 font-bold text-ea-petroleo">sai primeiro</span>}
                      {s.low && <span className="rounded-pill bg-ea-petroleo px-1.5 py-0.5 font-bold text-ea-cremewm">repor</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Aviso flutuante */}
        <AnimatePresence>
          {toast !== null && ToastIcon && (
            <motion.div
              key={toast}
              className="absolute bottom-4 right-4 z-20 hidden w-[min(300px,calc(100%-2rem))] items-start gap-3 rounded-ea bg-ea-petroleo p-3.5 text-ea-cremewm shadow-ea-lg sm:flex"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE_EA }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-ea-sm bg-ea-neon text-ea-petroleo">
                <ToastIcon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-xs font-bold">{TOASTS[toast].title}</span>
                <span className="text-[0.7rem] leading-snug text-ea-soft-dark">{TOASTS[toast].body}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
