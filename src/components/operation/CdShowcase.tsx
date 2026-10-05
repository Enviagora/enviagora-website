import { process } from '@/content/content';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';
import { cn } from '@/lib/cn';
import equipe640 from '@/assets/operacao/cd-equipe-640.webp';
import equipe960 from '@/assets/operacao/cd-equipe-960.webp';
import equipe1254 from '@/assets/operacao/cd-equipe-1254.webp';
import empilhadeira360 from '@/assets/operacao/cd-empilhadeira-360.webp';
import empilhadeira640 from '@/assets/operacao/cd-empilhadeira-640.webp';
import corredor360 from '@/assets/operacao/cd-corredor-360.webp';
import corredor640 from '@/assets/operacao/cd-corredor-640.webp';
import armazenagem360 from '@/assets/operacao/cd-armazenagem-360.webp';
import armazenagem640 from '@/assets/operacao/cd-armazenagem-640.webp';
import paletes360 from '@/assets/operacao/cd-porta-paletes-360.webp';
import paletes640 from '@/assets/operacao/cd-porta-paletes-640.webp';

// Mesma ordem de process.cd.photos. Todas as fotos são quadradas.
const PHOTOS = [
  { src: equipe960, srcSet: `${equipe640} 640w, ${equipe960} 960w, ${equipe1254} 1254w` },
  { src: empilhadeira640, srcSet: `${empilhadeira360} 360w, ${empilhadeira640} 640w` },
  { src: corredor640, srcSet: `${corredor360} 360w, ${corredor640} 640w` },
  { src: armazenagem640, srcSet: `${armazenagem360} 360w, ${armazenagem640} 640w` },
  { src: paletes640, srcSet: `${paletes360} 360w, ${paletes640} 640w` },
];

/**
 * O CD de verdade: área, fatos e uma galeria em mosaico com 5 fotos reais da
 * operação em Extrema/MG (a primeira em destaque, 2×2 no desktop).
 */
export function CdShowcase() {
  const { cd } = process;

  return (
    <div className="mt-16 border-t border-ea-cremewm/10 pt-14 md:mt-24 md:pt-20">
      {/* Cabeçalho: número + título à esquerda, texto e fatos à direita */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
        <div className="flex flex-col gap-4">
          <Reveal>
            <span className="ea-kicker inline-flex items-center gap-2 text-ea-neon">
              <Arrow className="h-3.5 w-3.5" />
              {cd.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="flex flex-col gap-2">
              <span className="ea-metric whitespace-nowrap text-[clamp(3.2rem,7vw,5.5rem)] text-ea-cremewm">{cd.metric}</span>
              <span className="ea-display text-xl text-ea-cremewm sm:text-2xl">{cd.title}</span>
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="flex flex-col gap-5">
          <p className="max-w-xl text-base leading-relaxed text-ea-soft-dark">{cd.body}</p>
          <ul className="flex flex-wrap gap-2">
            {cd.facts.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-2 rounded-pill border border-ea-cremewm/15 px-3.5 py-1.5 text-xs text-ea-cremewm sm:text-sm"
              >
                <Arrow className="h-2.5 w-2.5 text-ea-neon" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Galeria em mosaico */}
      <div className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 lg:mt-14 lg:grid-cols-4">
        {PHOTOS.map((p, i) => {
          const featured = i === 0;
          return (
            <Reveal
              key={p.src}
              delay={0.05 + i * 0.06}
              className={cn('relative', featured ? 'col-span-2 lg:row-span-2' : 'col-span-1')}
            >
              <figure className="group relative h-full overflow-hidden rounded-ea-lg border border-ea-cremewm/10 bg-ea-petroleo-2">
                <img
                  src={p.src}
                  srcSet={p.srcSet}
                  sizes={featured ? '(min-width: 1024px) 590px, 100vw' : '(min-width: 1024px) 290px, 50vw'}
                  width={1254}
                  height={1254}
                  alt={cd.photos[i].alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-ea group-hover:scale-[1.04]"
                />
                <div
                  className={cn(
                    'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ea-petroleo/85 via-ea-petroleo/25 to-transparent',
                    featured ? 'h-1/2' : 'h-2/5',
                  )}
                />
                <figcaption
                  className={cn(
                    'absolute flex items-start gap-1.5 font-medium text-ea-cremewm sm:items-center sm:gap-2',
                    featured
                      ? 'bottom-4 left-4 right-4 text-sm sm:bottom-6 sm:left-6 sm:text-base'
                      : 'bottom-2.5 left-2.5 right-2.5 text-[0.7rem] leading-tight sm:bottom-4 sm:left-4 sm:right-4 sm:text-sm',
                  )}
                >
                  <Arrow className={cn('mt-[0.15em] shrink-0 text-ea-neon sm:mt-0', featured ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5')} />
                  {cd.photos[i].caption}
                </figcaption>
                {featured && (
                  <span className="absolute right-4 top-4 rounded-pill bg-ea-neon px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-label text-ea-petroleo sm:right-6 sm:top-6 sm:text-xs">
                    Extrema/MG
                  </span>
                )}
              </figure>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
