import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type ArrowProps = {
  className?: string;
  /** Rótulo acessível. Sem título, a seta é decorativa (aria-hidden). */
  title?: string;
};

/**
 * Seta ↗ OFICIAL da Enviagora (símbolo do Caminho 02, src/assets/brand/simbolo.svg).
 * A máscara fica na classe `.ea-arrow` (index.css) — um único url() no CSS em vez
 * de repetir o SVG em cada seta do HTML. Colorida por
 * `currentColor` — funciona em qualquer cor (use `text-ea-neon`, `text-ea-petroleo`,
 * etc.) sem repetir o path no DOM. Controle o tamanho pela className (ex.: `h-4 w-4`).
 */
export const Arrow = forwardRef<HTMLSpanElement, ArrowProps>(function Arrow({ className, title }, ref) {
  return (
    <span
      ref={ref}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn('ea-arrow', className)}
    />
  );
});
