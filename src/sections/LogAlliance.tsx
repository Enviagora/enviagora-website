import { logAlliance } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { FreightQuoteLive } from '@/components/conversion/FreightQuoteLive';
import { SavingsCalculator } from '@/components/conversion/SavingsCalculator';
import { PainLead } from '@/components/ui/PainLead';

/* ==========================================================================
   Economia — LogAlliance: a promessa (até 40% no frete), os benefícios da rede,
   a cotação em tempo real (como a economia acontece) e o simulador com CTA
   pré-preenchido.
   ========================================================================== */

export function LogAlliance() {
  return (
    <Section id="economia" tone="creme">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16">
        <div className="flex flex-col gap-6">
          <Reveal>
            <PainLead text={logAlliance.pain} />
          </Reveal>
          <SectionHeading kicker={logAlliance.kicker} title={logAlliance.title} subtitle={logAlliance.subtitle} align="left" />
          <Reveal delay={0.05}>
            <p className="max-w-lg text-base leading-relaxed text-ea-soft">{logAlliance.intro}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ul className="grid gap-px overflow-hidden rounded-ea border border-ea-petroleo/10 bg-ea-petroleo/10 sm:grid-cols-2">
            {logAlliance.benefits.map((b) => (
              <li key={b.title} className="flex flex-col gap-1.5 bg-ea-creme p-5">
                <span className="text-sm font-bold text-ea-petroleo">{b.title}</span>
                <span className="text-sm leading-relaxed text-ea-soft">{b.body}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={0.05} className="mt-12 sm:mt-16">
        <FreightQuoteLive />
      </Reveal>

      <Reveal delay={0.05} className="mt-6 sm:mt-8">
        <SavingsCalculator />
      </Reveal>
    </Section>
  );
}
