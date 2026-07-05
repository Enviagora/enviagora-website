import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Check } from 'lucide-react';
import { brazilStates } from '@/content/brazilMap';
import { logAlliance } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Chevron } from '@/components/brand/Chevron';
import { cn } from '@/lib/cn';

/* ==========================================================================
   LogAlliance — mapa do Brasil animado mostrando a cotação de frete.
   A cada ciclo, um caminhão sai do CD (Extrema/MG) para uma região; aparece o
   comparativo de cotações (várias transportadoras) e destacamos a MAIS BARATA.
   ========================================================================== */

const VB = { w: 613, h: 639 }; // viewBox do mapa (@svg-maps/brazil)
const HUB = { x: 448, y: 452 }; // CD Enviagora — Extrema/MG (sudeste)

type Region = { name: string; x: number; y: number; side: 'left' | 'right'; best: number; quotes: string[] };

// Posições em coordenadas do viewBox; best = índice da cotação mais barata.
// Sem nomes de transportadora (genérico "Transportadora 1/2/3") p/ não confundir.
const REGIONS: Region[] = [
  { name: 'Norte', x: 175, y: 150, side: 'right', best: 1, quotes: ['R$ 15,20', 'R$ 12,56', 'R$ 13,90'] },
  { name: 'Nordeste', x: 505, y: 248, side: 'left', best: 1, quotes: ['R$ 10,40', 'R$ 8,92', 'R$ 9,80'] },
  { name: 'Centro-Oeste', x: 300, y: 372, side: 'left', best: 1, quotes: ['R$ 9,50', 'R$ 8,12', 'R$ 8,90'] },
  { name: 'Sudeste', x: 500, y: 442, side: 'left', best: 1, quotes: ['R$ 6,40', 'R$ 5,58', 'R$ 5,95'] },
  { name: 'Sul', x: 322, y: 560, side: 'left', best: 1, quotes: ['R$ 9,10', 'R$ 7,94', 'R$ 8,60'] },
];

const px = (x: number) => `${(x / VB.w) * 100}%`;
const py = (y: number) => `${(y / VB.h) * 100}%`;

export function LogAlliance() {
  const [active, setActive] = useState(3); // começa no Sudeste (perto do CD)

  // Roda em loop para todos (inclusive reduce-motion) — pedido do cliente.
  useEffect(() => {
    const id = window.setInterval(() => setActive((a) => (a + 1) % REGIONS.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  const region = REGIONS[active];

  return (
    <Section id="logalliance" tone="creme">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Texto enxuto */}
        <div className="flex flex-col gap-6">
          <SectionHeading kicker="Rede de transportadoras" title={logAlliance.title} subtitle={logAlliance.subtitle} align="left" />
          <Reveal delay={0.05}>
            <p className="max-w-lg text-base leading-relaxed text-ea-soft">{logAlliance.intro}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button href="#contato" size="lg">
              {logAlliance.cta}
            </Button>
          </Reveal>
        </div>

        {/* Painel: mapa animado */}
        <Reveal delay={0.1}>
          <div
            className="relative w-full overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-ea-ceu/40 p-4 shadow-ea sm:p-6"
            style={{ backgroundImage: 'radial-gradient(rgba(18,51,54,0.12) 1.1px, transparent 1.2px)', backgroundSize: '18px 18px' }}
          >
            {/* Wordmark LogAlliance */}
            <div className="absolute right-5 top-5 z-30 flex items-center gap-1.5">
              <span className="flex text-ea-petroleo">
                <Chevron className="h-4 w-4 rotate-90" />
                <Chevron className="-ml-2 h-4 w-4 rotate-90" />
              </span>
              <span className="font-sans text-sm font-bold tracking-tight text-ea-petroleo">{logAlliance.brand}</span>
            </div>

            {/* Área do mapa (aspect do viewBox → overlays alinham por %) */}
            <div className="relative mx-auto w-full" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
              <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" aria-hidden>
                {brazilStates.map((loc) => (
                  <path key={loc.id} d={loc.path} fill="var(--ea-petroleo)" fillOpacity={0.07} stroke="var(--ea-petroleo)" strokeOpacity={0.2} strokeWidth={0.6} />
                ))}
                {/* A linha cresce do hub até a ponta do caminhão (mesma duração
                    e easing) → acompanha exatamente para onde o caminhão vai. */}
                <motion.line
                  key={active}
                  x1={HUB.x}
                  y1={HUB.y}
                  stroke="var(--ea-petroleo)"
                  strokeOpacity={0.45}
                  strokeWidth={1.4}
                  strokeDasharray="5 4"
                  vectorEffect="non-scaling-stroke"
                  initial={{ x2: HUB.x, y2: HUB.y }}
                  animate={{ x2: region.x, y2: region.y }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                />
              </svg>

              {/* Hub — CD Extrema/MG */}
              <span className="absolute z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ea-neon ring-4 ring-ea-neon/30" style={{ left: px(HUB.x), top: py(HUB.y) }} aria-hidden>
                <span className="absolute -inset-1 animate-ping rounded-full bg-ea-neon/40" />
              </span>

              {/* Chip de melhor preço por região (oculto na região ativa → vira popover) */}
              {REGIONS.map((r, i) =>
                i === active ? null : (
                  <span
                    key={r.name}
                    className="ea-tnum absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-pill bg-white px-2.5 py-1 text-[0.72rem] font-semibold text-ea-petroleo shadow-ea-sm"
                    style={{ left: px(r.x), top: py(r.y) }}
                  >
                    {r.quotes[r.best]}
                  </span>
                ),
              )}

              {/* Caminhão: sai do CD (hub) e vai até a região ativa a cada ciclo. */}
              <motion.span
                key={active}
                className="absolute z-20 flex h-7 w-7 items-center justify-center rounded-full bg-ea-petroleo shadow-ea"
                style={{ marginLeft: -14, marginTop: -14 }}
                initial={{ left: px(HUB.x), top: py(HUB.y) }}
                animate={{ left: px(region.x), top: py(region.y) }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                aria-hidden
              >
                <Truck className="h-4 w-4 text-ea-neon" strokeWidth={2} />
              </motion.span>

              {/* Popover de cotações da região ativa (âncora = ponto da região) */}
              <div className="absolute z-30" style={{ left: px(region.x), top: py(region.y) }}>
                <motion.div
                  key={active}
                  className={cn(
                    'absolute w-36 rounded-ea border border-ea-petroleo/10 bg-white p-2.5 shadow-ea sm:w-44',
                    region.side === 'left' ? 'right-3.5' : 'left-3.5',
                  )}
                  style={{ top: -52, transformOrigin: region.side === 'left' ? 'right center' : 'left center' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'backOut', delay: 1.0 }}
                >
                  <span className="mb-1.5 block text-[0.58rem] font-bold uppercase tracking-label text-ea-soft">
                    {region.name} · {region.quotes.length} cotações
                  </span>
                  <ul className="flex flex-col gap-1">
                    {region.quotes.map((v, qi) => {
                      const best = qi === region.best;
                      return (
                        <li key={qi} className={cn('flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-[0.7rem]', best && 'bg-ea-neon/20')}>
                          <span className={cn('truncate', best ? 'font-semibold text-ea-petroleo' : 'text-ea-soft')}>Transp. {qi + 1}</span>
                          <span className={cn('ea-tnum flex shrink-0 items-center gap-0.5 font-semibold', best ? 'text-ea-petroleo' : 'text-ea-soft line-through')}>
                            {best && <Check className="h-3 w-3" strokeWidth={3} />}
                            {v}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Badge de economia */}
            <div className="mt-3 flex items-center gap-3 rounded-ea bg-ea-petroleo px-4 py-3 shadow-ea sm:mt-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ea-neon">
                <Check className="h-5 w-5 text-ea-petroleo" strokeWidth={2.5} aria-hidden />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[0.68rem] uppercase tracking-label text-ea-soft-dark">{logAlliance.savingBadge.label}</span>
                <span className="font-serif text-xl text-ea-neon">{logAlliance.savingBadge.value}</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
