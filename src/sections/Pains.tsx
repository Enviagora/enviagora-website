import { motion } from 'framer-motion';
import { pains } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_EA, VIEWPORT } from '@/lib/motion';

/* ==========================================================================
   As 5 maiores dores de quem vende online → como resolvemos. Cada dor (na voz
   do cliente) é riscada ao entrar na tela e dá lugar à solução com a prova.
   ========================================================================== */

/** Frase da dor riscada linha a linha (fundo em gradiente que cresce). */
function StrikeText({ children, delay }: { children: string; delay: number }) {
  const reduce = useReducedMotion();
  const line = 'linear-gradient(rgba(18, 51, 54, 0.55), rgba(18, 51, 54, 0.55))';
  return (
    <motion.span
      className="bg-no-repeat [background-position:0_58%]"
      style={{ backgroundImage: line }}
      initial={{ backgroundSize: reduce ? '100% 1.5px' : '0% 1.5px' }}
      whileInView={{ backgroundSize: '100% 1.5px' }}
      viewport={VIEWPORT}
      transition={reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE_EA }}
    >
      {children}
    </motion.span>
  );
}

export function Pains() {
  return (
    <Section id="dores" tone="coolgrey">
      <SectionHeading kicker={pains.kicker} title={pains.title} align="left" className="max-w-3xl" />

      <ol className="mt-12 flex flex-col border-t border-ea-petroleo/15 sm:mt-14">
        {pains.items.map((item, i) => (
          <Reveal
            key={item.pain}
            as="li"
            delay={0.04 * i}
            className="grid gap-4 border-b border-ea-petroleo/15 py-7 sm:py-8 lg:grid-cols-[3.5rem_1fr_2.5rem_1fr_12rem] lg:items-center lg:gap-6"
          >
            <span className="ea-metric text-sm text-ea-soft lg:text-base">{String(i + 1).padStart(2, '0')}</span>

            {/* A dor, na voz do cliente */}
            <p className="flex flex-col gap-1.5">
              <span className="ea-kicker text-[0.68rem] text-ea-soft lg:hidden">{pains.painLabel}</span>
              <span className="text-lg leading-snug text-ea-soft sm:text-xl">
                <StrikeText delay={0.25}>{`“${item.pain}”`}</StrikeText>
              </span>
            </p>

            <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-ea-neon lg:flex" aria-hidden>
              <Arrow className="h-4 w-4 text-ea-petroleo" />
            </span>

            {/* Como resolvemos */}
            <p className="flex flex-col gap-1.5">
              <span className="ea-kicker inline-flex items-center gap-1.5 text-[0.68rem] text-ea-petroleo lg:hidden">
                <Arrow className="h-3 w-3" />
                {pains.fixLabel}
              </span>
              <span className="text-base leading-relaxed text-ea-petroleo">{item.fix}</span>
            </p>

            {/* Prova */}
            <p className="flex items-baseline gap-3 lg:flex-col lg:items-end lg:gap-1 lg:text-right">
              <span className="ea-metric whitespace-nowrap text-4xl text-ea-petroleo lg:text-[2.6rem]">{item.metric}</span>
              <span className="text-sm leading-snug text-ea-soft">{item.metricLabel}</span>
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
