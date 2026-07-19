import { useState } from 'react';
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
  const [failed, setFailed] = useState(false);
  if (!logo) return null;
  const initials = logo.label
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
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
        ) : failed ? (
          <span className="ea-tnum text-center text-[0.68rem] font-bold uppercase tracking-tight text-ea-petroleo">
            {initials}
          </span>
        ) : (
          <img
            src={logo.file}
            alt={`Logo ${logo.label}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
            onError={() => setFailed(true)}
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
              <article className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-white p-7 shadow-ea-sm transition-all duration-500 ease-ea hover:-translate-y-1 hover:shadow-ea">
                <div className="absolute inset-x-0 top-0 flex h-1 overflow-hidden" aria-hidden>
                  <span className="w-1/3 bg-ea-ceu" />
                  <span className="w-1/3 bg-ea-neon" />
                  <span className="w-1/3 bg-ea-lavanda" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-ea bg-ea-petroleo">
                      <Icon className="h-6 w-6 text-ea-neon" strokeWidth={1.7} aria-hidden />
                    </span>
                    <span className="h-px flex-1 bg-ea-petroleo/10" aria-hidden />
                    <span className="relative flex h-2 w-2" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-50" />
                      <span className="relative h-2 w-2 rounded-full bg-ea-neon" />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="ea-display text-xl text-ea-petroleo">{group.title}</h3>
                    <p className="text-sm leading-relaxed text-ea-soft">{group.body}</p>
                  </div>
                </div>

                <ul className="mt-auto grid grid-cols-4 gap-x-3 gap-y-4 border-t border-ea-petroleo/10 pt-5">
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
