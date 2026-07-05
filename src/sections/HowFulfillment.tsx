import { howFulfillment } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';

export function HowFulfillment() {
  return (
    <Section id="como-funciona" tone="ceu">
      <SectionHeading
        kicker="Passo a passo"
        title={howFulfillment.title}
        subtitle={howFulfillment.subtitle}
        align="center"
        className="mx-auto"
      />

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {howFulfillment.steps.map((step, i) => (
          <Reveal key={step.step} delay={i * 0.12} className="relative">
            <div className="flex h-full flex-col gap-5 rounded-ea-lg bg-ea-creme/70 p-8">
              <div className="flex items-baseline gap-3">
                <span className="ea-display text-6xl text-ea-petroleo/15">0{i + 1}</span>
                <span className="ea-kicker rounded-pill bg-ea-neon px-3 py-1.5 text-ea-petroleo">{step.step}</span>
              </div>
              <p className="text-base leading-relaxed text-ea-petroleo">{step.body}</p>
            </div>

            {/* Seta conectora entre passos (desktop) */}
            {i < howFulfillment.steps.length - 1 && (
              <Arrow className="absolute -right-6 top-1/2 hidden h-7 w-7 -translate-y-1/2 text-ea-petroleo/30 md:block" aria-hidden />
            )}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
