import { motion } from 'framer-motion';
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
   bloco chapado em Verde Neon, manchete em caixa alta, seta e wordmark. Destaca a
   autoridade (Nº 1 em TikTok Shop na América Latina · +1 milhão de pacotes/mês).

   Animação "viral" (roda no desktop e no mobile, como as demais seções):
   curva de crescimento sutil que se desenha sozinha, partículas de engajamento
   subindo (corações, notas, pacotes) e um halo neon pulsando atrás do número.
   Tudo é decorativo, atrás do conteúdo e propositalmente suave para não
   competir com o texto.
   ========================================================================== */

// Bloco chapado em Verde Neon (Caminho 02: cor chapada, sem gradiente). Sobre
// neon, tudo em verde profundo — inclusive o logo, monocromático.
const BLOCK_BG = '#C4FF57';

// Curva "hockey-stick": fica baixa e dispara à direita (crescimento viral).
const CURVE = 'M0,146 C80,146 150,144 210,132 C258,122 292,98 320,64 C342,38 366,16 400,6';
const CURVE_AREA = `${CURVE} L400,160 L0,160 Z`;

// Curva da faixa mobile (100 de altura): baixa à esquerda, dispara na ponta.
// Termina antes da borda (o ponto da ponta não fica cortado pelo raio do card).
const BAND_CURVE = 'M0,94 C80,94 160,92 215,82 C265,72 298,52 322,35 C342,21 358,12 372,8';
const BAND_AREA = `${BAND_CURVE} L372,100 L0,100 Z`;

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

/** Partículas da faixa mobile: nascem perto da ponta da curva e sobem. */
const BAND_PARTICLES: { left: string; size: number; delay: number; Icon: LucideIcon }[] = [
  { left: '66%', size: 17, delay: 0, Icon: Heart },
  { left: '77%', size: 14, delay: 0.8, Icon: Music2 },
  { left: '86%', size: 18, delay: 1.6, Icon: Package },
  { left: '72%', size: 13, delay: 2.4, Icon: Heart },
  { left: '90%', size: 14, delay: 3.1, Icon: Music2 },
];

/**
 * Mobile: faixa animada sob o número (sangra até as bordas do card). A curva
 * de crescimento se desenha de tempos em tempos, a ponta pulsa e as
 * partículas sobem dali — tudo dentro da faixa, sem cobrir texto.
 */
function ViralBand() {
  return (
    <div aria-hidden className="relative -mx-6 mt-3 h-24 overflow-hidden sm:hidden">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="tt-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#123336" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#123336" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={BAND_AREA}
          fill="url(#tt-band)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: EASE_EA }}
        />
        <motion.path
          d={BAND_CURVE}
          fill="none"
          stroke="#123336"
          strokeOpacity={0.55}
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: [0, 1, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 6, times: [0, 0.3, 1], repeat: Infinity, ease: EASE_EA }}
        />
      </svg>

      {/* Ponta da curva: o ponto que "dispara" */}
      <span className="absolute right-[7%] top-[8%] flex h-3 w-3 -translate-y-1/2 translate-x-1/2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-petroleo opacity-40" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-ea-petroleo ring-4 ring-ea-petroleo/15" />
      </span>

      {BAND_PARTICLES.map((p, i) => {
        const Icon = p.Icon;
        return (
          <motion.span
            key={i}
            className="absolute bottom-0 text-ea-petroleo/70"
            style={{ left: p.left }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [20, -70], opacity: [0, 0.9, 0], rotate: [0, i % 2 ? 14 : -14] }}
            transition={{ duration: 3.4, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
          >
            <Icon size={p.size} strokeWidth={2.2} />
          </motion.span>
        );
      })}
    </div>
  );
}

export function TikTokShop() {
  return (
    <Section id="tiktok-shop" tone="creme">
      <Reveal>
        <div
          className="relative isolate overflow-hidden rounded-ea-lg p-6 sm:p-12 lg:p-16"
          style={{ background: BLOCK_BG }}
        >
          {/* Curva de crescimento viral — bem sutil, como marca-d'água atrás do texto */}
          <svg
            aria-hidden
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[62%] w-full sm:block"
          >
            <defs>
              <linearGradient id="tt-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#123336" stopOpacity="0.09" />
                <stop offset="100%" stopColor="#123336" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={CURVE_AREA}
              fill="url(#tt-area)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.2, delay: 0.7, ease: EASE_EA }}
            />
            <motion.path
              d={CURVE}
              fill="none"
              stroke="#123336"
              strokeOpacity={0.14}
              strokeWidth={1.25}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.8, delay: 0.35, ease: EASE_EA }}
            />
          </svg>

          {/* Partículas de engajamento subindo (energia viral do TikTok) */}
          {/* No mobile o card é estreito e as partículas passariam por cima do texto. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden sm:block">
            {PARTICLES.map((p, i) => {
              const Icon = p.Icon;
              return (
                <motion.span
                  key={i}
                  className="absolute text-ea-petroleo/30"
                  style={{ left: p.left }}
                  initial={{ top: '108%', opacity: 0 }}
                  animate={{
                    top: '-12%',
                    x: [0, p.drift, 0],
                    opacity: [0, 0.5, 0.5, 0],
                    rotate: [0, p.drift > 0 ? 12 : -12, 0],
                  }}
                  transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon size={p.size} strokeWidth={2} />
                </motion.span>
              );
            })}
          </div>

          {/* Aba lateral (nod ao material de marca) */}
          <span className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 rotate-90 text-[0.7rem] font-bold uppercase tracking-[0.35em] text-ea-petroleo/40 lg:block">
            TikTok Shop
          </span>

          {/* Topo: seta + ícone do TikTok Shop (nota branca sobre fundo escuro) */}
          <div className="flex items-start justify-between gap-4">
            <Arrow className="h-7 w-7 text-ea-petroleo sm:h-10 sm:w-10" />
            <motion.span
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[24%] bg-[#010101] p-2.5 shadow-ea ring-1 ring-black/10 sm:h-14 sm:w-14 sm:p-3"
              animate={{ y: [0, -6, 0], rotate: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TikTokGlyph className="h-full w-full" />
            </motion.span>
          </div>

          {/* Selo de autoridade */}
          <div className="mt-6 sm:mt-8">
            <span className="inline-flex items-center gap-2 rounded-pill bg-ea-petroleo px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-label text-ea-neon sm:px-4 sm:py-2 sm:text-[0.75rem]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ea-neon" />
              </span>
              {tiktokShop.badge}
            </span>
          </div>

          {/* Headline */}
          <h2 className="ea-display mt-4 max-w-[20ch] text-[1.75rem] leading-[1.08] text-ea-petroleo sm:mt-5 sm:text-display-md">
            {tiktokShop.title}
          </h2>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ea-petroleo/75 sm:mt-5 sm:text-lg">{tiktokShop.lead}</p>

          {/* Stat gigante + provas + CTA */}
          <div className="mt-6 grid gap-6 sm:mt-10 sm:gap-8 lg:mt-12 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14">
            <div className="flex flex-col">
              <span className="relative inline-flex w-fit">
                <span className="ea-metric text-[clamp(2.8rem,13vw,6.5rem)] text-ea-petroleo">
                  <CountUp value={tiktokShop.stat.value} suffix={tiktokShop.stat.suffix} />
                </span>
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-label text-ea-petroleo/70 sm:text-sm">
                {tiktokShop.stat.label}
              </span>
              {/* Mobile: a curva viral ganha uma faixa própria sob o número */}
              <ViralBand />
            </div>

            <div className="flex flex-col gap-6">
              <ul className="flex flex-col gap-3">
                {tiktokShop.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-ea-petroleo">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ea-petroleo">
                      <Check className="h-3 w-3 text-ea-neon" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div>
                <Button href="#contato" variant="secondary" size="lg" className="w-full sm:w-auto">
                  {tiktokShop.cta}
                </Button>
              </div>
            </div>
          </div>

          {/* Wordmark no rodapé do card */}
          <div className="mt-12 hidden items-end justify-end sm:flex">
            <Logo on="neon" className="h-5 sm:h-6" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
