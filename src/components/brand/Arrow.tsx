import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type ArrowProps = {
  className?: string;
  /** Rótulo acessível. Sem título, a seta é decorativa (aria-hidden). */
  title?: string;
};

const MASK = "url('/brand/seta-enviagora-neon.svg')";

/**
 * Seta ↗ OFICIAL da Enviagora. Renderizada como máscara CSS e colorida por
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
      className={cn('inline-block shrink-0 bg-current', className)}
      style={{
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  );
});
