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
              <article className="group flex h-full flex-col gap-3 bg-ea-creme p-7 transition-colors duration-300 hover:bg-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-ea bg-ea-neon transition-transform duration-300 ease-ea group-hover:-translate-y-0.5">
                  <Icon className="h-6 w-6 text-ea-petroleo" strokeWidth={1.7} aria-hidden />
                </span>
                <h3 className="ea-display mt-1 text-lg text-ea-petroleo">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ea-soft">{f.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
