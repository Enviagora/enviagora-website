import { cases } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Cases com resultado mensurável. Só aparece quando `cases.items` tiver dados
 * reais (aprovados pelos clientes) — sem itens, a seção não é renderizada.
 */
export function Cases() {
  if (!cases.items.length) return null;

  return (
    <Section id="cases" tone="creme">
      <SectionHeading kicker={cases.kicker} title={cases.title} align="center" className="mx-auto" />

      <div className="mt-14 grid gap-px overflow-hidden rounded-ea-lg border border-ea-petroleo/15 bg-ea-petroleo/15 md:grid-cols-2 lg:grid-cols-3">
        {cases.items.map((c, i) => (
          <Reveal key={c.brand} delay={i * 0.06} className="bg-white">
            <figure className="flex h-full flex-col gap-6 p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-bold text-ea-petroleo">{c.brand}</span>
                <span className="ea-kicker text-ea-soft">{c.segment}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="ea-metric text-5xl text-ea-petroleo">{c.metric}</span>
                <span className="text-sm text-ea-soft">{c.metricLabel}</span>
              </div>
              <blockquote className="flex-1 border-t border-ea-petroleo/10 pt-5 text-base leading-relaxed text-ea-petroleo">
                “{c.quote}”
              </blockquote>
              <figcaption className="text-sm text-ea-soft">
                <span className="font-bold text-ea-petroleo">{c.author}</span> · {c.role}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
