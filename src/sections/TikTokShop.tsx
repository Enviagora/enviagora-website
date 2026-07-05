import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { tiktokShop } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { Logo } from '@/components/brand/Logo';
import { CountUp } from '@/components/motion/CountUp';

/* ==========================================================================
   TikTokShop — bloco-manifesto no estilo do material de marca: card com
   gradiente verde→lilás, headline em Fraunces, seta e wordmark. Destaca a
   autoridade (Nº 1 em TikTok Shop na América Latina · +1 milhão de pacotes/mês).
   ========================================================================== */

// Gradiente da marca (verde neon → creme → lilás), como no material impresso.
const GRADIENT =
  'linear-gradient(158deg, #c4ff57 0%, #dcefb4 28%, #dcdcdf 60%, #d1c8e8 100%)';

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

          {/* Aba lateral (nod ao material de marca) */}
          <span className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 rotate-90 text-[0.7rem] font-bold uppercase tracking-[0.35em] text-ea-petroleo/40 lg:block">
            TikTok Shop
          </span>

          {/* Topo: seta + logo oficial do TikTok Shop (nota é escura → tile branco) */}
          <div className="flex items-start justify-between gap-4">
            <Arrow className="h-8 w-8 text-ea-petroleo sm:h-10 sm:w-10" />
            <span
              style={{ width: 56, height: 56 }}
              className="flex shrink-0 items-center justify-center overflow-hidden rounded-[24%] bg-white p-3 shadow-ea ring-1 ring-ea-petroleo/10"
            >
              <img src="/brand/integracoes/tiktok.avif" alt="TikTok Shop" className="h-full w-full object-contain" />
            </span>
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
              <span className="ea-tnum ea-display text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.9] text-ea-petroleo">
                <CountUp value={tiktokShop.stat.value} suffix={tiktokShop.stat.suffix} />
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
