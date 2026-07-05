import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Warehouse, PackageOpen, Truck } from 'lucide-react';
import { process } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Pill } from '@/components/ui/Pill';
import { Arrow } from '@/components/brand/Arrow';
import { cn } from '@/lib/cn';

/* ==========================================================================
   Process — "A jornada de um pacote", do armazenamento ao envio.
   Animação ligada ao scroll (sem pin → robusto no iOS):
   - Desktop: a caixa da marca viaja pelo trilho neon e acende cada estação.
   - Mobile: vira uma timeline vertical que preenche e destaca cada etapa.
   Copy preservado. Fallback estático em prefers-reduced-motion.
   ========================================================================== */

const icons = [Warehouse, PackageOpen, Truck];
const NEON_GLOW = '0 12px 40px rgba(196, 255, 87, 0.32)';
const DIM_RING = 'inset 0 0 0 1.5px rgba(196, 255, 87, 0.28)';

/** Caixa da marca que percorre o trilho (eco dos doodles: caixa + seta ↗). */
function TravelingPackage() {
  return (
    <motion.div
      className="relative flex h-11 w-11 items-center justify-center rounded-[26%] bg-ea-neon text-ea-petroleo ring-1 ring-ea-petroleo/10"
      style={{ boxShadow: '0 10px 30px rgba(196,255,87,0.5)' }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Arrow className="h-5 w-5" />
      {/* rastro luminoso atrás da caixa */}
      <span
        className="pointer-events-none absolute right-full top-1/2 mr-1 h-px w-12 -translate-y-1/2 bg-gradient-to-l from-ea-neon/70 to-transparent"
        aria-hidden
      />
    </motion.div>
  );
}

export function Process() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 0.85', 'end 0.45'] });
  const fillPct = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [reached, setReached] = useState(reduce ? 3 : 1);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return;
    setReached(v >= 0.9 ? 3 : v >= 0.5 ? 2 : 1);
  });

  const isActive = (i: number) => !!reduce || reached >= i + 1;

  return (
    <Section tone="petroleo">
      <div className="flex flex-col items-center gap-5">
        <Pill tone="dark" className="border border-ea-neon/30 !text-ea-neon">
          {process.local}
        </Pill>
        <SectionHeading title={process.title} align="center" theme="dark" className="mx-auto" />
      </div>

      <div ref={wrapRef} className="mt-16 md:mt-24">
        {/* ===================== DESKTOP: jornada horizontal ===================== */}
        <div className="relative hidden md:block">
          {/* Trilho no centro dos ícones (top-7 = centro do tile h-14). */}
          <div className="pointer-events-none absolute left-[16.667%] right-[16.667%] top-7 z-0">
            {/* Base tracejada (esteira). */}
            <div
              className="absolute inset-x-0 top-0 h-[3px] -translate-y-1/2 rounded-full"
              style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(196,255,87,0.30) 0 9px, transparent 9px 18px)' }}
            />
            {/* Preenchimento neon que acompanha o scroll. */}
            <motion.div
              className="absolute left-0 top-0 h-[3px] -translate-y-1/2 rounded-full bg-ea-neon"
              style={{ width: reduce ? '100%' : fillPct }}
            />
            {/* Pacote viajando (fica atrás dos ícones por causa do z-index da lista). */}
            {!reduce && (
              <motion.div className="absolute top-0 z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: fillPct }}>
                <TravelingPackage />
              </motion.div>
            )}
          </div>

          <ol className="relative z-10 grid grid-cols-3 gap-8">
            {process.steps.map((step, i) => {
              const Icon = icons[i];
              const active = isActive(i);
              return (
                <li key={step.title} className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-ea ring-8 ring-ea-petroleo transition-all duration-500 ease-ea',
                      active ? 'scale-100 bg-ea-neon text-ea-petroleo' : 'scale-90 bg-ea-petroleo text-ea-neon/60',
                    )}
                    style={{ boxShadow: active ? NEON_GLOW : DIM_RING }}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.6} aria-hidden />
                  </div>
                  <span className={cn('ea-kicker mt-5 text-ea-neon transition-opacity duration-500', active ? 'opacity-100' : 'opacity-40')}>
                    Etapa 0{i + 1}
                  </span>
                  <h3 className={cn('ea-display mt-2 text-2xl text-ea-cremewm transition-opacity duration-500', active ? 'opacity-100' : 'opacity-50')}>
                    {step.title}
                  </h3>
                  <p className={cn('mt-2 max-w-[34ch] text-base leading-relaxed text-ea-soft-dark transition-opacity duration-500', active ? 'opacity-100' : 'opacity-40')}>
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ===================== MOBILE: timeline vertical ===================== */}
        <ol className="flex flex-col md:hidden">
          {process.steps.map((step, i) => {
            const Icon = icons[i];
            const active = isActive(i);
            const segActive = !!reduce || reached >= i + 2; // conector até o próximo nó
            const last = i === process.steps.length - 1;
            return (
              <li key={step.title} className="flex gap-5">
                {/* Coluna do trilho: ícone + conector que liga ao próximo nó. */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-14 w-14 shrink-0 items-center justify-center rounded-ea transition-all duration-500 ease-ea',
                      active ? 'bg-ea-neon text-ea-petroleo' : 'bg-ea-petroleo text-ea-neon/60',
                    )}
                    style={{ boxShadow: active ? NEON_GLOW : DIM_RING }}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.6} aria-hidden />
                  </div>
                  {!last && (
                    <div
                      className="relative my-2 w-[3px] flex-1 overflow-hidden rounded-full"
                      style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(196,255,87,0.28) 0 8px, transparent 8px 16px)' }}
                    >
                      <div
                        className={cn('absolute inset-0 rounded-full bg-ea-neon transition-transform duration-700 ease-ea', segActive ? 'scale-y-100' : 'scale-y-0')}
                        style={{ transformOrigin: 'top' }}
                      />
                    </div>
                  )}
                </div>

                {/* Conteúdo da etapa. */}
                <div className={cn('pb-10 transition-opacity duration-500', active ? 'opacity-100' : 'opacity-45')}>
                  <span className="ea-kicker text-ea-neon">Etapa 0{i + 1}</span>
                  <h3 className="ea-display mt-1.5 text-2xl text-ea-cremewm">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-ea-soft-dark">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
