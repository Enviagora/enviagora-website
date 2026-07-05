import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { logAlliance } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Chevron } from '@/components/brand/Chevron';
import { VIEWPORT } from '@/lib/motion';

// Nós de cobertura (posições em % dentro do painel) com os valores de frete.
const pins = logAlliance.mapValues.map((v, i) => {
  const coords = [
    { x: 30, y: 24 },
    { x: 19, y: 50 },
    { x: 73, y: 30 },
    { x: 43, y: 72 },
    { x: 80, y: 62 },
    { x: 58, y: 90 },
  ];
  return { v, ...coords[i] };
});
const HUB = { x: 50, y: 48 };

export function LogAlliance() {
  const reduce = useReducedMotion();

  return (
    <Section tone="creme">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Texto */}
        <div className="flex flex-col gap-6">
          <SectionHeading
            kicker="Rede de transportadoras"
            title={logAlliance.title}
            subtitle={logAlliance.subtitle}
            align="left"
          />
          <Reveal delay={0.05}>
            <p className="max-w-xl text-base leading-relaxed text-ea-soft">{logAlliance.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-2">
            <h3 className="ea-display text-xl text-ea-petroleo">{logAlliance.howTitle}</h3>
            <p className="max-w-xl text-base leading-relaxed text-ea-soft">{logAlliance.howBody}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Button href="#contato" size="lg">
              {logAlliance.cta}
            </Button>
          </Reveal>
        </div>

        {/* Painel de cobertura */}
        <Reveal delay={0.1}>
          <div
            className="relative aspect-square w-full overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-ea-ceu/60 p-6 shadow-ea"
            style={{
              backgroundImage:
                'radial-gradient(rgba(18,51,54,0.14) 1.1px, transparent 1.2px)',
              backgroundSize: '18px 18px',
            }}
          >
            {/* LogAlliance wordmark */}
            <div className="absolute right-5 top-5 flex items-center gap-1.5">
              <span className="flex text-ea-petroleo">
                <Chevron className="h-4 w-4 rotate-90" />
                <Chevron className="-ml-2 h-4 w-4 rotate-90" />
              </span>
              <span className="font-sans text-sm font-bold tracking-tight text-ea-petroleo">
                {logAlliance.brand}
              </span>
            </div>

            {/* Rotas do hub para os nós */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {pins.map((p, i) => (
                <motion.line
                  key={i}
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--ea-petroleo)"
                  strokeOpacity={0.25}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  initial={reduce ? undefined : { pathLength: 0 }}
                  whileInView={reduce ? undefined : { pathLength: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.2 + i * 0.1 }}
                />
              ))}
            </svg>

            {/* Hub central */}
            <div
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ea-neon ring-4 ring-ea-neon/25"
              style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
              aria-hidden
            />

            {/* Pills de valor de frete */}
            {pins.map((p, i) => (
              <motion.div
                key={p.v}
                className="ea-tnum absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-pill bg-white px-3 py-1.5 text-xs font-semibold text-ea-petroleo shadow-ea-sm"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, ease: 'backOut', delay: 0.5 + i * 0.1 }}
              >
                {p.v}
              </motion.div>
            ))}

            {/* Badge de economia */}
            <motion.div
              className="absolute bottom-5 left-5 flex items-center gap-3 rounded-ea bg-ea-petroleo px-4 py-3 shadow-ea"
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ea-neon">
                <Check className="h-5 w-5 text-ea-petroleo" strokeWidth={2.5} aria-hidden />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[0.68rem] uppercase tracking-label text-ea-soft-dark">
                  {logAlliance.savingBadge.label}
                </span>
                <span className="font-serif text-xl text-ea-neon">{logAlliance.savingBadge.value}</span>
              </span>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
