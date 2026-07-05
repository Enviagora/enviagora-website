import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { hero } from '@/content/content';
import { EASE_EA } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { StaticBackdrop } from '@/components/hero3d/StaticBackdrop';
import { SceneErrorBoundary } from '@/components/hero3d/SceneErrorBoundary';

// A cena 3D é pesada → carrega em chunk separado, depois do first paint.
const PackageScene = lazy(() => import('@/components/hero3d/PackageScene'));

export function Hero() {
  const reduce = useReducedMotion();
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setEnable3d(true), 180);
    return () => window.clearTimeout(t);
  }, []);

  // Reveal em cortina (linha mascarada). Respeita reduced-motion.
  const Line = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
    if (reduce) return <span className="block">{children}</span>;
    return (
      <span className="block overflow-hidden pb-[0.08em]">
        <motion.span
          className="block"
          initial={{ y: '115%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.95, ease: EASE_EA, delay }}
        >
          {children}
        </motion.span>
      </span>
    );
  };

  const fade = (delay: number) =>
    reduce
      ? { initial: undefined, animate: undefined }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE_EA, delay },
        };

  return (
    <section
      id="top"
      className="ea-on-dark relative -mt-16 flex min-h-[100svh] items-start overflow-hidden bg-ea-petroleo pt-16 text-ea-cremewm sm:-mt-[70px] sm:pt-[70px]"
    >
      {/* Cena 3D (esteira) / fallback estático */}
      <div className="absolute inset-0">
        {enable3d ? (
          <SceneErrorBoundary fallback={<StaticBackdrop />}>
            <Suspense fallback={<StaticBackdrop />}>
              <PackageScene />
            </Suspense>
          </SceneErrorBoundary>
        ) : (
          <StaticBackdrop />
        )}
      </div>

      {/* Scrim de profundidade + legibilidade do texto sobre a cena */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(70% 55% at 50% 33%, rgba(18,51,54,0.62) 0%, rgba(18,51,54,0.30) 45%, transparent 72%), linear-gradient(180deg, rgba(18,51,54,0.72) 0%, transparent 34%, transparent 60%, rgba(18,51,54,0.85) 100%)',
        }}
      />

      {/* Conteúdo (pointer-events-none deixa o mouse chegar na cena p/ parallax) */}
      <div className="ea-container-wide pointer-events-none relative z-10 flex flex-col items-center gap-5 pb-24 pt-[5vh] text-center sm:gap-6 sm:pt-[12vh]">
        <motion.span {...fade(0.05)} className="ea-kicker inline-flex items-center gap-2 text-ea-neon">
          <Arrow className="h-3.5 w-3.5" />
          {hero.kicker}
        </motion.span>

        <h1 className="ea-display ea-hero-shadow text-display-lg text-ea-cremewm">
          <Line delay={0.15}>
            {hero.titlePre}
            <span className="relative inline-block">
              <span className="relative z-10">{hero.titleHighlight}</span>
              <motion.span
                className="absolute inset-x-[-0.04em] bottom-[0.04em] z-0 h-[0.22em] origin-left rounded-full bg-ea-neon"
                aria-hidden
                initial={reduce ? undefined : { scaleX: 0 }}
                animate={reduce ? undefined : { scaleX: 1 }}
                transition={{ duration: 0.7, ease: EASE_EA, delay: 0.9 }}
              />
            </span>
          </Line>
          <Line delay={0.28}>{hero.titlePos.trim()}</Line>
        </h1>

        <motion.p {...fade(0.5)} className="ea-hero-shadow max-w-xl text-base text-ea-cremewm/85 sm:text-lg">
          {hero.subtitle}
        </motion.p>

        <motion.ul {...fade(0.62)} className="flex flex-wrap items-center justify-center gap-2.5">
          {hero.bullets.map((b) => (
            <li
              key={b}
              className="flex items-center gap-2 rounded-pill border border-ea-cremewm/12 bg-ea-petroleo/40 px-3.5 py-2 text-sm font-medium text-ea-cremewm backdrop-blur-sm"
            >
              <Arrow className="h-3.5 w-3.5 shrink-0 text-ea-neon" />
              {b}
            </li>
          ))}
        </motion.ul>

        <motion.div {...fade(0.74)} className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button href="#contato" size="lg">
            {hero.cta}
          </Button>
          <Button href="#como-funciona" variant="ghost-dark" size="lg" withArrow={false}>
            Como funciona
          </Button>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      {!reduce && (
        <motion.a
          href="#operacao"
          aria-label="Rolar para explorar"
          className="pointer-events-auto absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-ea-soft-dark transition-colors hover:text-ea-cremewm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="ea-kicker text-[0.62rem]">Explorar</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.a>
      )}
    </section>
  );
}
