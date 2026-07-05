import { BadgePercent, ShieldCheck, Zap, MapPinned } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { benefits } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';

const iconMap: Record<string, LucideIcon> = {
  discount: BadgePercent,
  transparent: ShieldCheck,
  fast: Zap,
  nationwide: MapPinned,
};

export function Benefits() {
  return (
    <Section tone="coolgrey">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.items.map((item, i) => {
          const Icon = iconMap[item.icon];
          return (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="group flex h-full flex-col gap-4 rounded-ea-lg border border-ea-petroleo/10 bg-ea-creme p-7 transition-all duration-300 ease-ea hover:-translate-y-1 hover:border-ea-petroleo/20 hover:shadow-ea">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-ea bg-ea-neon">
                    <Icon className="h-6 w-6 text-ea-petroleo" strokeWidth={1.7} aria-hidden />
                  </span>
                  <Arrow className="h-5 w-5 text-ea-petroleo/25 transition-all duration-300 ease-ea group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ea-petroleo" />
                </div>
                <h3 className="ea-display text-xl text-ea-petroleo">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ea-soft">{item.body}</p>
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
