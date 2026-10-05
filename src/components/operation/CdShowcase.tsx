import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { process } from '@/content/content';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';
import racks600 from '@/assets/operacao/cd-porta-paletes-600.webp';
import racks1000 from '@/assets/operacao/cd-porta-paletes-1000.webp';
import aisle600 from '@/assets/operacao/cd-corredor-600.webp';
import aisle941 from '@/assets/operacao/cd-corredor-941.webp';

const PHOTOS = [
  { src: racks1000, srcSet: `${racks600} 600w, ${racks1000} 1000w`, w: 1000, h: 1379, pos: '62% 40%' },
  { src: aisle941, srcSet: `${aisle600} 600w, ${aisle941} 941w`, w: 941, h: 1672, pos: '50% 55%' },
];

/**
 * O CD de verdade: área, fatos e duas fotos reais da operação em Extrema/MG.
 * As fotos andam em velocidades diferentes no scroll (parallax sutil).
 */
export function CdShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yA = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yB = useTransform(scrollYProgress, [0, 1], [70, -50]);
  const { cd } = process;

  return (
    <div
      ref={ref}
      className="mt-16 grid gap-12 border-t border-ea-cremewm/10 pt-14 md:mt-24 md:pt-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20"
    >
      <div className="flex flex-col gap-6">
        <Reveal>
          <span className="ea-kicker inline-flex items-center gap-2 text-ea-neon">
            <Arrow className="h-3.5 w-3.5" />
            {cd.kicker}
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="flex flex-col gap-2">
            <span className="ea-metric whitespace-nowrap text-[clamp(3.2rem,5.6vw,5.25rem)] text-ea-cremewm">{cd.metric}</span>
            <span className="ea-display text-xl text-ea-cremewm sm:text-2xl">{cd.title}</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-md text-base leading-relaxed text-ea-soft-dark">{cd.body}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <ul className="flex max-w-md flex-col border-t border-ea-cremewm/10">
            {cd.facts.map((f) => (
              <li key={f} className="flex items-center gap-3 border-b border-ea-cremewm/10 py-3.5 text-sm text-ea-cremewm">
                <Arrow className="h-3 w-3 text-ea-neon" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {PHOTOS.map((p, i) => (
          <motion.figure
            key={p.src}
            className={i === 1 ? 'mt-10 sm:mt-16' : undefined}
            style={reduce ? undefined : { y: i === 0 ? yA : yB }}
          >
            <Reveal delay={0.1 + i * 0.1} className="relative overflow-hidden rounded-ea-lg border border-ea-cremewm/10">
              <img
                src={p.src}
                srcSet={p.srcSet}
                sizes="(min-width: 1024px) 330px, 50vw"
                width={p.w}
                height={p.h}
                alt={cd.photos[i].alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
                style={{ objectPosition: p.pos }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ea-petroleo/75 to-transparent" />
              <figcaption className="absolute bottom-3 left-3 rounded-pill bg-ea-petroleo/80 px-3 py-1.5 text-[0.7rem] font-medium text-ea-cremewm backdrop-blur-sm sm:bottom-4 sm:left-4 sm:text-xs">
                {cd.photos[i].caption}
              </figcaption>
            </Reveal>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
