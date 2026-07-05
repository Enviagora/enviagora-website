import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { hero, site } from '@/content/content';
import { EASE_EA } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { Logo } from '@/components/brand/Logo';
import { RouteNetwork } from '@/components/motion/RouteNetwork';
import { useParallax } from '@/hooks/useParallax';

export function Hero() {
  const reduce = useReducedMotion();
  const gradientRef = useParallax<HTMLDivElement>(80);

  // Orquestração de entrada (acima da dobra → dispara no load).
  // Com reduced-motion, zera deslocamentos e durações (aparece instantâneo).
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE_EA } },
  };

  return (
    <section id="top" className="relative overflow-hidden bg-ea-creme">
      {/* Gradiente ambiente sutil (creme → céu-azul) para dar profundidade. */}
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            'radial-gradient(60% 55% at 85% 15%, rgba(196,219,224,0.55), transparent 60%), radial-gradient(50% 50% at 5% 90%, rgba(201,194,214,0.35), transparent 55%)',
        }}
      />

      <div className="ea-container-wide relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        {/* Coluna de texto */}
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-start gap-7">
          <motion.span variants={item} className="ea-kicker inline-flex items-center gap-2 text-ea-petroleo">
            <Arrow className="h-3.5 w-3.5 text-ea-neon" />
            {site.locais[0]} · {site.locais[1]}
          </motion.span>

          <motion.h1 variants={item} className="ea-display text-display-lg text-ea-petroleo ea-balance">
            {hero.titlePre}
            <span className="relative inline-block">
              <span className="relative z-10">{hero.titleHighlight}</span>
              <span
                className="absolute inset-x-[-0.05em] bottom-[0.06em] z-0 h-[0.32em] rounded-sm bg-ea-neon"
                aria-hidden
              />
            </span>
            {hero.titlePos}
          </motion.h1>

          <motion.p variants={item} className="max-w-xl text-lg leading-relaxed text-ea-soft">
            {hero.subtitle}
          </motion.p>

          <motion.ul variants={item} className="flex flex-col gap-3">
            {hero.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-ea-petroleo">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-ea-sm bg-ea-neon">
                  <Arrow className="h-4 w-4 text-ea-petroleo" />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="pt-1">
            <Button href="#contato" size="lg">
              {hero.cta}
            </Button>
          </motion.div>
        </motion.div>

        {/* Painel visual (assinatura) */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_EA, delay: 0.15 }}
          className="ea-on-dark relative aspect-[4/3.4] w-full overflow-hidden rounded-ea-lg bg-ea-petroleo shadow-ea-lg sm:aspect-[4/3]"
        >
          <RouteNetwork className="absolute inset-0 h-full w-full" />

          {/* Logo pequeno no topo do painel */}
          <div className="absolute left-5 top-5">
            <Logo on="dark" className="h-5 w-auto opacity-90" />
          </div>

          {/* Chip de operação (dashboard flavor) */}
          <div className="absolute bottom-5 left-5 rounded-ea bg-ea-petroleo-2/80 px-4 py-3 backdrop-blur-sm">
            <span className="ea-kicker text-ea-neon">Hoje</span>
            <p className="ea-tnum mt-1 font-serif text-2xl leading-none text-ea-cremewm">12.480</p>
            <span className="text-xs text-ea-soft-dark">envios</span>
          </div>

          {/* Card flutuante de assertividade */}
          <motion.div
            className="absolute bottom-6 right-5 flex items-center gap-2.5 rounded-pill bg-ea-cremewm px-4 py-2.5 shadow-ea"
            animate={reduce ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-ea-neon" aria-hidden />
            <span className="ea-tnum text-sm font-semibold text-ea-petroleo">99,6% assertividade</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
