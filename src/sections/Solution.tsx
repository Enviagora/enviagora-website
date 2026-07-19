import {
  Gift,
  Briefcase,
  Percent,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  MapPin,
  BellRing,
  Cpu,
  Box,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { solution } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';

const iconMap: Record<string, LucideIcon> = {
  gift: Gift,
  briefcase: Briefcase,
  percent: Percent,
  calendar: CalendarCheck,
  sparkles: Sparkles,
  shield: ShieldCheck,
  pin: MapPin,
  bell: BellRing,
  cpu: Cpu,
};

export function Solution() {
  return (
    <Section tone="creme">
      <SectionHeading kicker="Tudo em um só lugar" title={solution.title} align="center" className="mx-auto" />

      <div className="mt-14 grid gap-px overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-ea-petroleo/10 sm:grid-cols-2 lg:grid-cols-3">
        {solution.features.map((f, i) => {
          const Icon = iconMap[f.icon];
          return (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <article className="group relative flex h-full min-h-[15rem] flex-col gap-3 overflow-hidden bg-ea-creme p-7 transition-colors duration-300 hover:bg-white">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-ea bg-ea-neon transition-transform duration-300 ease-ea group-hover:-translate-y-0.5">
                    <Icon className="h-6 w-6 text-ea-petroleo" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="ea-tnum text-[0.58rem] font-semibold tracking-[0.16em] text-ea-soft">MODULE / {String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="ea-display mt-1 text-lg text-ea-petroleo">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ea-soft">{f.body}</p>
                <div className="mt-auto flex items-center gap-2 pt-4 text-ea-petroleo/30" aria-hidden>
                  <Box className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-ea-petroleo" strokeWidth={1.5} />
                  <span className="h-px flex-1 bg-ea-petroleo/10" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ea-neon ring-2 ring-ea-petroleo/5" />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
