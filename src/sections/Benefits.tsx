import { BadgePercent, ShieldCheck, Zap, MapPinned, Box } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { benefits } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { SectionHeading } from '@/components/ui/SectionHeading';

const iconMap: Record<string, LucideIcon> = {
  discount: BadgePercent,
  transparent: ShieldCheck,
  fast: Zap,
  nationwide: MapPinned,
};

export function Benefits() {
  return (
    <Section tone="coolgrey">
      <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <SectionHeading
          kicker="Padrão Enviagora"
          title="Performance operacional, sem improviso."
          subtitle="Cada etapa foi desenhada para proteger sua marca, seu estoque e a experiência do seu cliente."
          align="left"
        />
        <Reveal className="hidden lg:block">
          <div className="flex items-center gap-3 rounded-pill border border-ea-petroleo/10 bg-ea-creme px-4 py-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-ea-neon" />
            </span>
            <span className="ea-kicker text-[0.62rem] text-ea-soft">Controle de qualidade ativo</span>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.items.map((item, i) => {
          const Icon = iconMap[item.icon];
          return (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="group relative flex h-full min-h-[19rem] flex-col gap-4 overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-ea-creme p-7 transition-all duration-500 ease-ea hover:-translate-y-1 hover:border-ea-petroleo/20 hover:shadow-ea">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                  style={{ background: 'linear-gradient(180deg, rgba(196,255,87,0.18), transparent)' }}
                />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-ea bg-ea-neon">
                    <Icon className="h-6 w-6 text-ea-petroleo" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="ea-tnum text-[0.62rem] font-semibold tracking-[0.18em] text-ea-petroleo/35">
                    EA / 0{i + 1}
                  </span>
                </div>
                <h3 className="ea-display text-xl text-ea-petroleo">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ea-soft">{item.body}</p>
                <div className="mt-auto flex items-end justify-between pt-5">
                  <div className="relative h-8 flex-1 overflow-hidden" aria-hidden>
                    <span className="absolute left-0 right-5 top-1/2 h-px bg-ea-petroleo/15" />
                    <Box className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-ea-petroleo transition-transform duration-700 ease-ea group-hover:translate-x-20" strokeWidth={1.5} />
                  </div>
                  <Arrow className="ml-4 h-5 w-5 text-ea-petroleo/25 transition-all duration-300 ease-ea group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ea-petroleo" />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <Button href="#contato" size="lg">
          {benefits.cta}
        </Button>
      </Reveal>
    </Section>
  );
}
