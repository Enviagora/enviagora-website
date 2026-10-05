import { motion } from 'framer-motion';
import { ScanBarcode } from 'lucide-react';
import { channels } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { AppLogo } from '@/components/ui/AppLogo';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ==========================================================================
   Canais — logo depois da prova social: a Enviagora atende TODOS os canais
   (não só TikTok Shop), do mesmo estoque, com coleta dedicada dentro do CD.
   Fundo claro (cinza) para emendar com a faixa de logos, também clara; o
   cartão da coleta dedicada fica escuro como destaque.
   ========================================================================== */

/** Ícone de leitor com a linha de "bip" varrendo o código de barras. */
function ScanIcon() {
  const reduce = useReducedMotion();
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-ea bg-ea-neon text-ea-petroleo">
      <ScanBarcode className="h-6 w-6" strokeWidth={1.8} aria-hidden />
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-x-2 h-0.5 rounded-full bg-ea-petroleo/70"
          initial={{ top: '22%' }}
          animate={{ top: ['22%', '76%', '22%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </span>
  );
}

/** Transportadoras com equipe dedicada dentro do CD, bipando direto na expedição. */
function CarriersCard() {
  const { carriers } = channels;
  return (
    <div className="ea-on-dark flex gap-4 rounded-ea-lg bg-ea-petroleo p-5 text-ea-cremewm sm:p-6">
      <ScanIcon />
      <div className="flex flex-col gap-3">
        <span className="ea-kicker text-ea-neon">{carriers.kicker}</span>
        <p className="text-sm leading-relaxed text-ea-cremewm/85">{carriers.body}</p>
        <ul className="flex flex-wrap gap-2">
          {carriers.names.map((n) => (
            <li key={n} className="rounded-pill border border-ea-cremewm/20 px-3 py-1 text-xs font-bold tracking-wide text-ea-cremewm">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Channels() {
  const { ownStore } = channels;

  return (
    <Section id="canais" tone="coolgrey">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading kicker={channels.kicker} title={channels.title} subtitle={channels.subtitle} align="left" />

          {/* Coleta dedicada (desktop: aqui; celular: depois dos canais) */}
          <Reveal delay={0.1} className="hidden lg:block">
            <CarriersCard />
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {channels.items.map((c, i) => (
              <Reveal key={c.name} as="li" delay={0.04 * i}>
                <div className="flex h-full items-center gap-3 rounded-ea border border-ea-petroleo/10 bg-white p-3 shadow-ea-sm transition-colors duration-300 hover:border-ea-petroleo/30 sm:flex-col sm:items-start sm:p-4">
                  <AppLogo slug={c.logo} className="w-9 ring-1 ring-ea-petroleo/10 sm:w-11" />
                  <span className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
                    <span className="text-[0.8rem] font-bold leading-tight text-ea-petroleo sm:text-sm">{c.name}</span>
                    {'tag' in c && <span className="text-[0.7rem] leading-snug text-ea-soft sm:text-xs">{c.tag}</span>}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

          {/* Loja própria: onde o frete da rede faz mais diferença */}
          <Reveal delay={0.2}>
            <div className="flex flex-col gap-4 rounded-ea border border-ea-petroleo/10 bg-white p-4 shadow-ea-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex -space-x-2">
                  {ownStore.logos.map((slug) => (
                    <AppLogo key={slug} slug={slug} className="w-9 ring-2 ring-white" />
                  ))}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold text-ea-petroleo">{ownStore.title}</span>
                  <span className="text-xs text-ea-soft">{ownStore.body}</span>
                </span>
              </div>
              <span className="self-start whitespace-nowrap rounded-pill bg-ea-petroleo px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-label text-ea-neon sm:self-auto">
                {ownStore.tag}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-3 lg:hidden">
            <CarriersCard />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
