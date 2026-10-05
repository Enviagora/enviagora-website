import { niches } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Pill } from '@/components/ui/Pill';
import { Arrow } from '@/components/brand/Arrow';
import suplementos720 from '@/assets/nichos/suplementos-720.webp';
import suplementos1280 from '@/assets/nichos/suplementos-1280.webp';
import beleza720 from '@/assets/nichos/beleza-720.webp';
import beleza1280 from '@/assets/nichos/beleza-1280.webp';

// Fotos de produtos reais de marcas operadas pela Enviagora.
const meta = [
  {
    photo: { src: suplementos1280, srcSet: `${suplementos720} 720w, ${suplementos1280} 1280w` },
    alt: 'Suplementos e nutracêuticos de marcas clientes: gomas, creatina, magnésio, probióticos, greens e colágeno',
    tags: ['suplementos', 'nutracêuticos', 'performance'],
  },
  {
    photo: { src: beleza1280, srcSet: `${beleza720} 720w, ${beleza1280} 1280w` },
    alt: 'Cosméticos de marcas clientes: creme, clareador, sérum, protetores solares, body splash e desodorante',
    tags: ['beleza', 'cosméticos', 'wellness'],
  },
];

export function Niches() {
  return (
    <Section id="operacao" tone="creme">
      <SectionHeading kicker="Operação especializada" title={niches.title} align="center" className="mx-auto" />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {niches.items.map((item, i) => {
          const { photo, alt, tags } = meta[i];
          return (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-ea-lg border border-ea-petroleo/15 bg-white">
                {/* Vitrine: produtos reais que a operação manuseia */}
                <div className="relative overflow-hidden border-b border-ea-petroleo/10 bg-[#F1EEE8]">
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(min-width: 1184px) 580px, (min-width: 768px) 50vw, 100vw"
                    width={1280}
                    height={525}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[1958/803] w-full object-cover transition-transform duration-700 ease-ea group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-6 p-8 sm:p-10">
                  <div className="flex flex-col gap-3">
                    <h3 className="ea-display text-2xl text-ea-petroleo sm:text-[1.7rem]">{item.title}</h3>
                    <p className="text-base leading-relaxed text-ea-soft">{item.body}</p>
                  </div>

                  <ul className="flex flex-col border-t border-ea-petroleo/10">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 border-b border-ea-petroleo/10 py-3 text-sm font-medium text-ea-petroleo">
                        <Arrow className="h-3 w-3 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <Pill key={t} tone="outline">
                        {t}
                      </Pill>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
