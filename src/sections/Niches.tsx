import { FlaskConical, Sparkles } from 'lucide-react';
import { niches } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Pill } from '@/components/ui/Pill';

const meta = [
  { icon: FlaskConical, glow: '#C4DBE0', tags: ['suplementos', 'nutracêuticos', 'performance'] },
  { icon: Sparkles, glow: '#C9C2D6', tags: ['beleza', 'cosméticos', 'wellness'] },
] as const;

export function Niches() {
  return (
    <Section id="operacao" tone="creme">
      <SectionHeading kicker="Operação especializada" title={niches.title} align="center" className="mx-auto" />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {niches.items.map((item, i) => {
          const { icon: Icon, glow, tags } = meta[i];
          return (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-white p-8 shadow-ea-sm transition-all duration-300 ease-ea hover:-translate-y-1 hover:shadow-ea sm:p-10">
                {/* Glow tonal no canto (radial-gradient, sem filtro blur → sem
                    artefato de recorte no Safari/iOS). */}
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${glow} 0%, rgba(255,255,255,0) 68%)` }}
                  aria-hidden
                />

                <span className="relative flex h-14 w-14 items-center justify-center rounded-ea bg-ea-neon">
                  <Icon className="h-7 w-7 text-ea-petroleo" strokeWidth={1.6} aria-hidden />
                </span>

                <div className="relative flex flex-col gap-3">
                  <h3 className="ea-display text-2xl text-ea-petroleo sm:text-[1.7rem]">{item.title}</h3>
                  <p className="text-base leading-relaxed text-ea-soft">{item.body}</p>
                </div>

                <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
                  {tags.map((t) => (
                    <Pill key={t} tone="outline">
                      {t}
                    </Pill>
                  ))}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
