import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { hero, site } from '@/content/content';
import { EASE_EA } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { StaticBackdrop } from '@/components/hero3d/StaticBackdrop';
import { SceneErrorBoundary } from '@/components/hero3d/SceneErrorBoundary';
import { MeshField } from '@/components/herobg/MeshField';
import { BrazilMap } from '@/components/herobg/BrazilMap';

// A cena 3D é pesada → carrega em chunk separado, depois do first paint.
const PackageScene = lazy(() => import('@/components/hero3d/PackageScene'));

// PRÉVIA: 3 direções de hero para o cliente escolher. Depois de decidir,
// mantemos só a escolhida e removemos o seletor.
const HERO_VARIANTS = [
  { id: 'esteira', label: 'Esteira 3D' },
  { id: 'malha', label: 'Malha viva' },
  { id: 'mapa', label: 'Mapa BR' },
] as const;
type HeroVariant = (typeof HERO_VARIANTS)[number]['id'];

function initialVariant(): HeroVariant {
  if (typeof window === 'undefined') return 'esteira';
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('hero');
    const stored = window.localStorage.getItem('ea-hero');
    const v = (fromUrl || stored) as HeroVariant;
    if (HERO_VARIANTS.some((o) => o.id === v)) return v;
  } catch {
    /* ignore */
  }
  return 'esteira';
}

export function Hero() {
  const reduce = useReducedMotion();
  const [enable3d, setEnable3d] = useState(false);
  const [variant, setVariant] = useState<HeroVariant>(initialVariant);

  // Monta o WebGL logo após o first paint (confiável em todos os browsers,
  // inclusive Safari/iOS).
  useEffect(() => {
    const t = window.setTimeout(() => setEnable3d(true), 180);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('ea-hero', variant);
    } catch {
      /* ignore */
    }
  }, [variant]);

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
      {/* Fundo do hero (variante selecionada) */}
      <div className="absolute inset-0">
        {variant === 'esteira' &&
          (enable3d ? (
            <SceneErrorBoundary fallback={<StaticBackdrop />}>
              <Suspense fallback={<StaticBackdrop />}>
                <PackageScene />
              </Suspense>
            </SceneErrorBoundary>
          ) : (
            <StaticBackdrop />
          ))}
        {variant === 'malha' && <MeshField />}
        {variant === 'mapa' && <BrazilMap />}
      </div>

      {/* Scrim para legibilidade do texto sobre a cena */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(120% 80% at 50% 38%, transparent 30%, rgba(18,51,54,0.5) 76%), linear-gradient(180deg, rgba(18,51,54,0.75) 0%, rgba(18,51,54,0.35) 20%, transparent 44%, transparent 62%, rgba(18,51,54,0.82) 100%)',
        }}
      />

      {/* Conteúdo (pointer-events-none deixa o mouse chegar na cena p/ parallax) */}
      <div className="ea-container-wide pointer-events-none relative z-10 flex flex-col items-center gap-6 pb-24 pt-[12vh] text-center sm:gap-7 sm:pt-[13vh]">
        <motion.span {...fade(0.05)} className="ea-kicker inline-flex items-center gap-2 text-ea-neon">
          <Arrow className="h-3.5 w-3.5" />
          {site.locais[0]} · {site.locais[1]}
        </motion.span>

        <h1 className="ea-display ea-hero-shadow text-display-xl text-ea-cremewm">
          <Line delay={0.15}>
            {hero.titlePre}
            <span className="relative inline-block">
              <span className="relative z-10">{hero.titleHighlight}</span>
              <motion.span
                className="absolute inset-x-[-0.05em] bottom-[0.08em] z-0 h-[0.3em] origin-left rounded-sm bg-ea-neon"
                aria-hidden
                initial={reduce ? undefined : { scaleX: 0 }}
                animate={reduce ? undefined : { scaleX: 1 }}
                transition={{ duration: 0.7, ease: EASE_EA, delay: 0.9 }}
              />
            </span>
          </Line>
          <Line delay={0.28}>{hero.titlePos.trim()}</Line>
        </h1>

        <motion.p {...fade(0.5)} className="ea-hero-shadow max-w-2xl text-lg text-ea-cremewm/85 sm:text-xl">
          {hero.subtitle}
        </motion.p>

        <motion.ul {...fade(0.62)} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {hero.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm font-medium text-ea-cremewm sm:text-[0.95rem]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-ea-sm bg-ea-neon">
                <Arrow className="h-3.5 w-3.5 text-ea-petroleo" />
              </span>
              {b}
            </li>
          ))}
        </motion.ul>

        <motion.div {...fade(0.74)} className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 pt-3">
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

      {/* SELETOR DE PRÉVIA (provisório) — escolha a direção do hero */}
      <div className="pointer-events-auto fixed bottom-4 right-4 z-[80] flex items-center gap-1 rounded-pill border border-ea-cremewm/15 bg-ea-petroleo/85 p-1 text-xs text-ea-cremewm shadow-ea-lg backdrop-blur">
        <span className="hidden px-2 text-ea-soft-dark sm:inline">Prévia:</span>
        {HERO_VARIANTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setVariant(o.id)}
            className={cn(
              'rounded-pill px-3 py-1.5 font-medium transition-colors',
              variant === o.id ? 'bg-ea-neon text-ea-petroleo' : 'text-ea-cremewm/80 hover:text-ea-cremewm',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
