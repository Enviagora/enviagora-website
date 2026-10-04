import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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
 * quando ativo, o conteúdo aparece sem animação. O elemento é sempre o mesmo
 * (motion.*) — trocar de tipo após hidratar remontaria os filhos (ex.: o
 * formulário do HubSpot).
 */
export function Reveal({ children, className, delay = 0, y = 26, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE_EA, delay }}
    >
      {children}
    </Tag>
  );
}
