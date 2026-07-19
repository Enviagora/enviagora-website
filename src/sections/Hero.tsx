import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ScanLine, ShieldCheck, TimerReset } from 'lucide-react';
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
    if (reduce) {
      setEnable3d(false);
      return;
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(() => setEnable3d(true), { timeout: 900 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }
    const timeout = window.setTimeout(() => setEnable3d(true), 320);
    return () => window.clearTimeout(timeout);
  }, [reduce]);

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
      {/* Fallback permanente evita flash durante o carregamento do WebGL. */}
      <div className="absolute inset-0" aria-hidden>
        <StaticBackdrop />
      </div>
      <div className="absolute inset-0 lg:left-[38%]" aria-hidden>
        {enable3d && (
          <SceneErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <motion.div
                className="h-full w-full"
                initial={{ opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: EASE_EA }}
              >
                <PackageScene />
              </motion.div>
            </Suspense>
          </SceneErrorBoundary>
        )}
      </div>

      {/* Luz de estúdio e scrim direcional: texto limpo, operação visível à direita. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(50% 65% at 82% 45%, rgba(196,255,87,0.09) 0%, transparent 70%), linear-gradient(90deg, rgba(18,51,54,0.98) 0%, rgba(18,51,54,0.94) 34%, rgba(18,51,54,0.42) 72%, rgba(18,51,54,0.2) 100%), linear-gradient(180deg, rgba(18,51,54,0.48) 0%, transparent 48%, rgba(18,51,54,0.94) 100%)',
        }}
      />

      <div className="ea-container-wide pointer-events-none relative z-10 flex min-h-[calc(100svh-4rem)] flex-col items-start justify-center gap-5 pb-40 pt-10 text-left sm:gap-6 sm:pb-44 lg:pt-16">
        <motion.span {...fade(0.05)} className="ea-kicker inline-flex items-center gap-2 text-ea-neon">
          <Arrow className="h-3.5 w-3.5" />
          {hero.kicker}
        </motion.span>

        <h1 className="ea-display ea-hero-shadow max-w-[15ch] text-display-lg text-ea-cremewm">
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

        <motion.p {...fade(0.5)} className="ea-hero-shadow max-w-lg text-base leading-relaxed text-ea-cremewm/80 sm:text-lg">
          {hero.subtitle}
        </motion.p>

        <motion.ul {...fade(0.62)} className="flex max-w-2xl flex-wrap items-center gap-2.5">
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

        <motion.div {...fade(0.74)} className="pointer-events-auto flex flex-wrap items-center gap-3 pt-2">
          <Button href="#contato" size="lg">
            {hero.cta}
          </Button>
          <Button href="#como-funciona" variant="ghost-dark" size="lg" withArrow={false}>
            Como funciona
          </Button>
        </motion.div>
      </div>

      {/* Painel operacional: reforça tecnologia e precisão sem competir com o título. */}
      <motion.div
        {...fade(0.95)}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 border-t border-ea-cremewm/10 bg-ea-petroleo/75 backdrop-blur-md"
      >
        <div className="ea-container-wide grid grid-cols-3 divide-x divide-ea-cremewm/10 py-4 sm:py-5 lg:max-w-4xl lg:pl-0 lg:pr-10">
          {[
            { icon: ScanLine, label: 'Rastreabilidade', value: 'SKU a SKU' },
            { icon: TimerReset, label: 'Operação', value: 'SLA monitorado' },
            { icon: ShieldCheck, label: 'Conferência', value: 'Dupla validação' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5 px-3 first:pl-0 sm:gap-3 sm:px-6">
              <Icon className="hidden h-5 w-5 shrink-0 text-ea-neon sm:block" strokeWidth={1.6} aria-hidden />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[0.55rem] uppercase tracking-label text-ea-soft-dark sm:text-[0.62rem]">{label}</span>
                <span className="truncate text-[0.68rem] font-semibold text-ea-cremewm sm:text-xs">{value}</span>
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Indicador de scroll */}
      {!reduce && (
        <motion.a
          href="#operacao"
          aria-label="Rolar para explorar"
          className="pointer-events-auto absolute bottom-24 right-5 z-30 hidden flex-col items-center gap-1 text-ea-soft-dark transition-colors hover:text-ea-cremewm sm:flex lg:right-10"
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
