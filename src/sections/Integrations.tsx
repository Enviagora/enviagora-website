import { Store, ShoppingBag, Settings2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { integrations } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';

const groupIcons: LucideIcon[] = [Store, ShoppingBag, Settings2];

export function Integrations() {
  return (
    <Section id="integracoes" tone="creme">
      <SectionHeading
        kicker="Conecte sua operação"
        title={integrations.title}
        subtitle={integrations.subtitle}
        align="center"
        className="mx-auto"
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {integrations.groups.map((group, i) => {
          const Icon = groupIcons[i];
          return (
            <Reveal key={group.title} delay={i * 0.1}>
              <article className="flex h-full flex-col gap-5 rounded-ea-lg border border-ea-petroleo/10 bg-white p-7 shadow-ea-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-ea bg-ea-petroleo">
                  <Icon className="h-6 w-6 text-ea-neon" strokeWidth={1.7} aria-hidden />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="ea-display text-xl text-ea-petroleo">{group.title}</h3>
                  <p className="text-sm leading-relaxed text-ea-soft">{group.body}</p>
                </div>

                <ul className="mt-auto grid grid-cols-3 gap-2 pt-2">
                  {group.logos.map((logo) => (
                    <li
                      key={logo}
                      className="flex aspect-[3/2] items-center justify-center rounded-ea-sm border border-ea-petroleo/10 bg-ea-creme px-1 text-center text-[0.62rem] font-semibold leading-tight text-ea-soft"
                      title={logo}
                    >
                      {logo}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <Button href="#contato" size="lg">
          {integrations.cta}
        </Button>
      </Reveal>
    </Section>
  );
}
