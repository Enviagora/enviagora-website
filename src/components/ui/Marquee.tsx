import type { ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

type MarqueeProps = {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  /** Segundos por volta (quanto maior, mais lento). */
  duration?: number;
};

/**
 * Faixa infinita horizontal (logos). Duplica os itens para loop contínuo,
 * pausa no hover e usa máscara de fade nas bordas. Com prefers-reduced-motion,
 * vira uma grade estática que quebra linha (fallback acessível).
 */
export function Marquee({ items, className, itemClassName, duration = 32 }: MarqueeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-x-10 gap-y-6', className)}>
        {items.map((item, i) => (
          <div key={i} className={itemClassName}>
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('ea-edge-fade group relative overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <div key={i} className={cn('shrink-0', itemClassName)}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
