import { motion, useReducedMotion } from 'framer-motion';
import { Check, Heart, Music2, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { tiktokShop } from '@/content/content';
import { EASE_EA } from '@/lib/motion';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { Logo } from '@/components/brand/Logo';
import { TikTokGlyph } from '@/components/brand/TikTokGlyph';
import { CountUp } from '@/components/motion/CountUp';

/* ==========================================================================
   TikTokShop — bloco-manifesto no estilo do material de marca: card com
   gradiente verde→lilás, headline em Fraunces, seta e wordmark. Destaca a
   autoridade (Nº 1 em TikTok Shop na América Latina · +1 milhão de pacotes/mês).

   Animação "viral": curva de crescimento que se desenha sozinha (efeito
   hockey-stick), partículas de engajamento subindo (corações, notas, pacotes)
   e um halo neon pulsando atrás do número gigante. Tudo decorativo e atrás do
   conteúdo; some por completo em prefers-reduced-motion.
   ========================================================================== */

// Gradiente da marca (verde neon → creme → lilás), como no material impresso.
const GRADIENT =
  'linear-gradient(158deg, #c4ff57 0%, #dcefb4 28%, #dcdcdf 60%, #d1c8e8 100%)';

// Curva "hockey-stick": fica baixa e dispara à direita (crescimento viral).
const CURVE = 'M0,146 C80,146 150,144 210,132 C258,122 292,98 320,64 C342,38 366,16 400,6';
const CURVE_AREA = `${CURVE} L400,160 L0,160 Z`;

// Partículas de engajamento que sobem pelo card (corações, notas, pacotes).
type Particle = { left: string; size: number; delay: number; dur: number; drift: number; Icon: LucideIcon };
const PARTICLES: Particle[] = [
  { left: '6%', size: 18, delay: 0.0, dur: 11, drift: 14, Icon: Heart },
  { left: '18%', size: 13, delay: 2.4, dur: 13, drift: -10, Icon: Music2 },
  { left: '30%', size: 20, delay: 1.2, dur: 12, drift: 12, Icon: Package },
  { left: '42%', size: 12, delay: 3.6, dur: 14, drift: -14, Icon: Heart },
  { left: '54%', size: 16, delay: 0.8, dur: 10, drift: 10, Icon: Music2 },
  { left: '64%', size: 22, delay: 2.0, dur: 13, drift: -12, Icon: Package },
  { left: '74%', size: 14, delay: 4.2, dur: 12, drift: 14, Icon: Heart },
  { left: '84%', size: 12, delay: 1.6, dur: 15, drift: -8, Icon: Music2 },
  { left: '92%', size: 18, delay: 3.0, dur: 11, drift: 10, Icon: Package },
  { left: '12%', size: 12, delay: 5.0, dur: 14, drift: 12, Icon: Music2 },
  { left: '48%', size: 24, delay: 5.6, dur: 13, drift: -10, Icon: Heart },
  { left: '68%', size: 12, delay: 4.8, dur: 12, drift: 12, Icon: Package },
];

export function TikTokShop() {
  const reduce = useReducedMotion();

  return (
    <Section id="tiktok-shop" tone="creme">
      <Reveal>
        <div
          className="relative isolate overflow-hidden rounded-ea-lg p-8 shadow-ea-lg sm:p-12 lg:p-16"
          style={{ background: GRADIENT }}
        >
          {/* Brilho suave em movimento (vida no gradiente) */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -z-10 h-[60%] w-[60%] rounded-full opacity-60 blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)' }}
              animate={{ x: ['-10%', '60%', '-10%'], y: ['-20%', '80%', '-20%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Curva de crescimento viral que se desenha sozinha ao entrar na tela */}
          <svg
            aria-hidden
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] w-full"
          >
            <defs>
              <linearGradient id="tt-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#123336" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#123336" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={CURVE_AREA}
              fill="url(#tt-area)"
              initial={reduce ? undefined : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.2, delay: 0.7, ease: EASE_EA }}
            />
            <motion.path
              d={CURVE}
              fill="none"
              stroke="#123336"
              strokeOpacity={0.4}
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? undefined : { pathLength: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.8, delay: 0.35, ease: EASE_EA }}
            />
          </svg>

          {/* Partículas de engajamento subindo (energia viral do TikTok) */}
          {!reduce && (
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              {PARTICLES.map((p, i) => {
                const Icon = p.Icon;
                return (
                  <motion.span
                    key={i}
                    className="absolute text-ea-petroleo/25"
                    style={{ left: p.left, top: '100%' }}
                    initial={{ top: '108%', opacity: 0 }}
                    animate={{
                      top: '-12%',
                      x: [0, p.drift, 0],
                      opacity: [0, 0.4, 0.4, 0],
                      rotate: [0, p.drift > 0 ? 12 : -12, 0],
                    }}
                    transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Icon size={p.size} strokeWidth={2} />
                  </motion.span>
                );
              })}
            </div>
          )}

          {/* Aba lateral (nod ao material de marca) */}
          <span className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 rotate-90 text-[0.7rem] font-bold uppercase tracking-[0.35em] text-ea-petroleo/40 lg:block">
            TikTok Shop
          </span>

          {/* Topo: seta + ícone do TikTok Shop (nota branca sobre fundo escuro) */}
          <div className="flex items-start justify-between gap-4">
            <Arrow className="h-8 w-8 text-ea-petroleo sm:h-10 sm:w-10" />
            <motion.span
              style={{ width: 56, height: 56 }}
              className="flex shrink-0 items-center justify-center overflow-hidden rounded-[24%] bg-[#010101] p-3 shadow-ea ring-1 ring-black/10"
              animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, -4, 0] }}
              transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TikTokGlyph className="h-full w-full" />
            </motion.span>
          </div>

          {/* Selo de autoridade */}
          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-pill bg-ea-petroleo px-4 py-2 text-[0.72rem] font-bold uppercase tracking-label text-ea-neon">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ea-neon" />
              </span>
              {tiktokShop.badge}
            </span>
          </div>

          {/* Headline */}
          <h2 className="ea-display mt-5 max-w-[18ch] text-display-md text-ea-petroleo">{tiktokShop.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ea-petroleo/75 sm:text-lg">{tiktokShop.lead}</p>

          {/* Stat gigante + provas + CTA */}
          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14">
            <div className="flex flex-col">
              <span className="relative inline-flex w-fit">
                {/* Halo neon pulsando atrás do número */}
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(196,255,87,0.6), transparent 70%)',
                      filter: 'blur(22px)',
                    }}
                    animate={{ opacity: [0.35, 0.85, 0.35], scale: [0.92, 1.06, 0.92] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <span className="ea-tnum ea-display text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.9] text-ea-petroleo">
                  <CountUp value={tiktokShop.stat.value} suffix={tiktokShop.stat.suffix} />
                </span>
              </span>
              <span className="mt-1 text-sm font-semibold uppercase tracking-label text-ea-petroleo/70">
                {tiktokShop.stat.label}
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <ul className="flex flex-col gap-3">
                {tiktokShop.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-base font-medium text-ea-petroleo">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ea-petroleo">
                      <Check className="h-3.5 w-3.5 text-ea-neon" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div>
                <Button href="#contato" variant="secondary" size="lg">
                  {tiktokShop.cta}
                </Button>
              </div>
            </div>
          </div>

          {/* Wordmark no rodapé do card */}
          <div className="mt-12 flex items-end justify-end">
            <Logo on="light" className="h-6 w-auto opacity-80 sm:h-7" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
