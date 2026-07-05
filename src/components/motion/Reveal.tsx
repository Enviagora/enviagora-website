import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_EA, VIEWPORT } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos (para orquestrar sequências). */
  delay?: number;
  /** Deslocamento vertical inicial. */
  y?: number;
  as?: 'div' | 'li' | 'section' | 'span';
};

/**
 * Wrapper de reveal no scroll (fade + subida). Respeita prefers-reduced-motion:
 * quando ativo, renderiza o conteúdo estático (sem transform), garantindo fallback.
 */
export function Reveal({ children, className, delay = 0, y = 26, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE_EA, delay }}
    >
      {children}
    </Tag>
  );
}
