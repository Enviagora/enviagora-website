import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { hero, reassurance } from '@/content/content';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { StaticBackdrop } from '@/components/hero3d/StaticBackdrop';
import { SceneErrorBoundary } from '@/components/hero3d/SceneErrorBoundary';

// A cena 3D é pesada → carrega em chunk separado, depois do first paint.
const PackageScene = lazy(() => import('@/components/hero3d/PackageScene'));

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

export function Hero() {
  const reduce = useReducedMotion();
  const [enable3d, setEnable3d] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // A foto da cena (no HTML) pinta junto com o texto. O 3D ao vivo só começa
  // depois que a página terminou de carregar e o navegador ficou ocioso, para
  // não disputar com o carregamento; ao ficar pronto, entra por cima com fade.
  useEffect(() => {
    let cancelled = false;
    let idle = 0;
    let timer = 0;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => {
      if (cancelled) return;
      if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setEnable3d(true), { timeout: 1500 });
      else timer = window.setTimeout(() => setEnable3d(true), 500);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
      if (idle) w.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="top"
      className="ea-on-dark relative -mt-16 flex min-h-[100svh] items-start overflow-hidden bg-ea-petroleo pt-16 text-ea-cremewm sm:-mt-[70px] sm:pt-[70px]"
    >
      {/* Foto da cena (sempre por baixo) + cena 3D ao vivo entrando com fade */}
      <div className="absolute inset-0">
        <StaticBackdrop />
        {enable3d && (
          <div
            className="absolute inset-0 transition-opacity duration-1000 ease-out"
            style={{ opacity: sceneReady ? 1 : 0 }}
          >
            <SceneErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <PackageScene onReady={() => setSceneReady(true)} />
              </Suspense>
            </SceneErrorBoundary>
          </div>
        )}
      </div>

      {/* Scrim de profundidade + legibilidade do texto sobre a cena */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(70% 55% at 50% 33%, rgba(18,51,54,0.62) 0%, rgba(18,51,54,0.30) 45%, transparent 72%), linear-gradient(180deg, rgba(18,51,54,0.72) 0%, transparent 34%, transparent 55%, rgba(18,51,54,0.92) 100%)',
        }}
      />

      {/* Conteúdo (pointer-events-none deixa o mouse chegar na cena p/ parallax) */}
      <div className="ea-container-wide pointer-events-none relative z-10 flex min-h-[calc(100svh-7.5rem)] flex-col items-center gap-4 pb-6 pt-[3vh] text-center sm:gap-6 sm:pb-10 sm:pt-[9vh]">
        {/* Kicker só no desktop — no mobile deixa o hero mais limpo. */}
        <span className="ea-rise ea-kicker hidden items-center gap-2 text-ea-neon sm:inline-flex" style={delay(0.05)}>
          <Arrow className="h-3.5 w-3.5" />
          {hero.kicker}
        </span>

        <h1 className="ea-display ea-hero-shadow text-display-lg text-ea-cremewm">
          <span className="ea-line">
            <span style={delay(0.12)}>
              {hero.titlePre}
              {/* Destaque da manchete: peso Bold + neon (permitido sobre fundo escuro). */}
              <span className="ea-highlight text-ea-neon">{hero.titleHighlight}</span>{' '}
            </span>
          </span>
          <span className="ea-line">
            <span style={delay(0.24)}>{hero.titlePos.trim()}</span>
          </span>
        </h1>

        <p className="ea-rise ea-hero-shadow max-w-2xl text-base text-ea-cremewm/90 sm:text-lg" style={delay(0.45)}>
          {hero.subtitle}
        </p>

        <div className="ea-rise pointer-events-auto flex flex-col items-center gap-3 pt-2" style={delay(0.6)} data-track="hero">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="#contato" size="lg">
              {hero.cta}
            </Button>
            <Button href="#economia" variant="ghost-dark" size="lg" withArrow={false}>
              {hero.ctaSecondary}
            </Button>
          </div>
          <p className="ea-hero-shadow max-w-[34ch] text-[0.72rem] text-ea-cremewm/85 sm:max-w-none sm:text-xs">{reassurance}</p>
        </div>

        {/* Prova na dobra: números já publicados, em grade com réguas finas */}
        <ul
          className="ea-rise mt-auto grid w-full max-w-4xl grid-cols-2 overflow-hidden rounded-ea border border-ea-cremewm/15 bg-ea-petroleo/55 backdrop-blur-md sm:grid-cols-4"
          style={delay(0.75)}
        >
          {hero.proof.map((p, i) => (
            <li
              key={p.label}
              className={[
                'flex flex-col items-center gap-1 px-3 py-3 sm:py-5',
                i % 2 === 1 ? 'border-l border-ea-cremewm/15' : '',
                i >= 2 ? 'border-t border-ea-cremewm/15 sm:border-t-0' : '',
                i === 2 ? 'sm:border-l' : '',
              ].join(' ')}
            >
              <span className="ea-metric text-[1.7rem] text-ea-cremewm sm:text-4xl">{p.value}</span>
              <span className="text-[0.7rem] leading-snug text-ea-soft-dark sm:text-xs">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Indicador de scroll (só desktop: no mobile a prova ocupa a base) */}
      {!reduce && (
        <motion.a
          href="#operacao"
          aria-label="Rolar para explorar"
          className="pointer-events-auto absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 text-ea-soft-dark transition-colors hover:text-ea-cremewm lg:block"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.a>
      )}
    </section>
  );
}
