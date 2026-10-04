import { niches } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Pill } from '@/components/ui/Pill';
import { Arrow } from '@/components/brand/Arrow';
import { ProductArt } from '@/components/brand/ProductArt';

const meta = [
  { art: 'suplementos', tags: ['suplementos', 'nutracêuticos', 'performance'] },
  { art: 'beleza', tags: ['beleza', 'cosméticos', 'wellness'] },
] as const;

export function Niches() {
  return (
    <Section id="operacao" tone="creme">
      <SectionHeading kicker="Operação especializada" title={niches.title} align="center" className="mx-auto" />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {niches.items.map((item, i) => {
          const { art, tags } = meta[i];
          return (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="flex h-full flex-col overflow-hidden rounded-ea-lg border border-ea-petroleo/15 bg-white">
                {/* Vitrine: o tipo de produto que a operação manuseia */}
                <div className="relative border-b border-ea-petroleo/10 bg-ea-coolgrey/50 px-8 pb-4 pt-8 text-ea-petroleo sm:px-12">
                  <Arrow className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-ea-petroleo/[0.05]" />
                  <ProductArt kind={art} className="relative mx-auto max-w-[320px]" />
                </div>

                <div className="flex flex-1 flex-col gap-6 p-8 sm:p-10">
                  <div className="flex flex-col gap-3">
                    <h3 className="ea-display text-2xl text-ea-petroleo sm:text-[1.7rem]">{item.title}</h3>
                    <p className="text-base leading-relaxed text-ea-soft">{item.body}</p>
                  </div>

                  <ul className="flex flex-col border-t border-ea-petroleo/10">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 border-b border-ea-petroleo/10 py-3 text-sm font-medium text-ea-petroleo">
                        <Arrow className="h-3 w-3 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <Pill key={t} tone="outline">
                        {t}
                      </Pill>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
