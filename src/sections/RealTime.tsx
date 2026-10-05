import { realTime } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';
import { LiveDashboard } from '@/components/realtime/LiveDashboard';
import { PainLead } from '@/components/ui/PainLead';

/* ==========================================================================
   Visibilidade total — texto + recursos em cima e o painel ao vivo em largura
   total (como um print do produto, mas vivo).
   ========================================================================== */

export function RealTime() {
  return (
    <Section tone="coolgrey">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
        <div className="flex flex-col gap-6">
          <Reveal>
            <PainLead text={realTime.pain} />
          </Reveal>
          <SectionHeading kicker="Visibilidade total" title={realTime.title} align="left" />
          <Reveal delay={0.05}>
            <p className="max-w-xl text-base leading-relaxed text-ea-soft">{realTime.body}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="flex flex-col gap-4">
          <ul className="grid gap-px overflow-hidden rounded-ea border border-ea-petroleo/10 bg-ea-petroleo/10 sm:grid-cols-3">
            {realTime.features.map((f) => (
              <li key={f.title} className="flex flex-col gap-1.5 bg-ea-coolgrey p-4">
                <span className="flex items-center gap-2 text-sm font-bold text-ea-petroleo">
                  <Arrow className="h-3 w-3 shrink-0" />
                  {f.title}
                </span>
                <span className="text-sm leading-snug text-ea-soft">{f.body}</span>
              </li>
            ))}
          </ul>
          <span className="ea-kicker text-ea-petroleo">{realTime.poweredBy}</span>
        </Reveal>
      </div>

      <Reveal delay={0.05} className="mt-12 sm:mt-16">
        <LiveDashboard />
      </Reveal>
    </Section>
  );
}
