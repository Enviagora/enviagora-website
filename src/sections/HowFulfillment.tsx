import { motion, useReducedMotion } from 'framer-motion';
import { Building2, Warehouse, Truck, Box } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { howFulfillment } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';

/* ==========================================================================
   HowFulfillment — passo a passo do fulfillment em 3 cards conectados.
   Cada card tem ícone, selo do passo, número-fantasma no canto e um nó
   conector entre eles (desktop) para dar sensação de fluxo.
   ========================================================================== */

// Ícone de cada etapa: abertura/integração → armazenagem → coleta.
const STEP_ICONS: LucideIcon[] = [Building2, Warehouse, Truck];

export function HowFulfillment() {
  const { steps } = howFulfillment;
  const reduce = useReducedMotion();

  return (
    <Section id="como-funciona" tone="ceu">
      <SectionHeading
        kicker="Passo a passo"
        title={howFulfillment.title}
        subtitle={howFulfillment.subtitle}
        align="center"
        className="mx-auto"
      />

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i] ?? Building2;
          const isLast = i === steps.length - 1;
          return (
            <Reveal key={step.step} delay={i * 0.12} className="relative">
              <article className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-ea-creme p-8 shadow-ea-sm transition-all duration-300 ease-ea hover:-translate-y-1 hover:border-ea-petroleo/20 hover:shadow-ea">
                {/* Número-fantasma anexado ao canto (marca-d'água) */}
                <span
                  aria-hidden
                  className="ea-display ea-tnum pointer-events-none absolute -right-1 -top-6 select-none text-[7rem] leading-none text-ea-petroleo/[0.07]"
                >
                  0{i + 1}
                </span>

                {/* Ícone da etapa + selo do passo */}
                <div className="relative flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-ea bg-ea-petroleo shadow-ea-sm transition-transform duration-300 ease-ea group-hover:-translate-y-0.5">
                    <Icon className="h-6 w-6 text-ea-neon" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="ea-kicker rounded-pill bg-ea-neon px-3 py-1.5 text-ea-petroleo">{step.step}</span>
                </div>

                <p className="relative text-base leading-relaxed text-ea-petroleo/85">{step.body}</p>
                <div className="relative mt-auto flex items-center gap-3 border-t border-ea-petroleo/10 pt-5" aria-hidden>
                  <Box className="h-4 w-4 text-ea-petroleo/50" strokeWidth={1.5} />
                  <span className="h-px flex-1 bg-gradient-to-r from-ea-petroleo/25 via-ea-neon to-ea-petroleo/10" />
                  <span className="ea-tnum text-[0.58rem] tracking-[0.16em] text-ea-soft">FLOW / 0{i + 1}</span>
                </div>
              </article>

              {/* Nó conector entre os passos (só no desktop) */}
              {!isLast && (
                <span className="absolute left-[calc(100%+1rem)] top-1/2 z-10 hidden h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ea-petroleo/10 bg-white shadow-ea-sm md:flex">
                  <motion.span
                    animate={reduce ? undefined : { x: [0, 2, 0], y: [0, -2, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Arrow className="h-4 w-4 text-ea-petroleo" />
                  </motion.span>
                </span>
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
