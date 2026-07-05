import { Store, ShoppingBag, Settings2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { integrations } from '@/content/content';
import { integrationLogos } from '@/content/integrationLogos';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { TikTokGlyph } from '@/components/brand/TikTokGlyph';

const groupIcons: LucideIcon[] = [Store, ShoppingBag, Settings2];

/** Um logo enquadrado como ícone de aplicativo: miolo centralizado com respiro. */
function LogoTile({ slug }: { slug: string }) {
  const logo = integrationLogos[slug];
  if (!logo) return null;
  return (
    <li className="flex justify-center">
      <span
        title={logo.label}
        className="flex aspect-square w-full max-w-[64px] items-center justify-center overflow-hidden rounded-[24%] p-[18%] shadow-ea-sm ring-1 ring-ea-petroleo/10 transition-transform duration-300 ease-ea will-change-transform hover:-translate-y-0.5"
        style={{ backgroundColor: logo.bg ?? '#FFFFFF' }}
      >
        {/* O TikTok usa glyph próprio (nota branca) para aparecer no fundo escuro. */}
        {slug === 'tiktok' ? (
          <TikTokGlyph className="h-full w-full" />
        ) : (
          <img
            src={logo.file}
            alt={`Logo ${logo.label}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        )}
      </span>
    </li>
  );
}

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
              <article className="flex h-full flex-col gap-6 rounded-ea-lg border border-ea-petroleo/10 bg-white p-7 shadow-ea-sm">
                <div className="flex flex-col gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-ea bg-ea-petroleo">
                    <Icon className="h-6 w-6 text-ea-neon" strokeWidth={1.7} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="ea-display text-xl text-ea-petroleo">{group.title}</h3>
                    <p className="text-sm leading-relaxed text-ea-soft">{group.body}</p>
                  </div>
                </div>

                <ul className="mt-auto grid grid-cols-4 gap-x-3 gap-y-4 pt-2">
                  {group.logos.map((slug) => (
                    <LogoTile key={slug} slug={slug} />
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
