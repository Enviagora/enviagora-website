import { forwardRef } from 'react';

type ArrowProps = React.SVGProps<SVGSVGElement> & {
  /** Rótulo acessível. Sem título, a seta é tratada como decorativa. */
  title?: string;
};

/**
 * Seta ↗ — símbolo proprietário da Enviagora (direção, acesso e precisão).
 * A cor herda de `currentColor` (use `text-ea-neon`, `text-ea-petroleo`, etc.),
 * permitindo animar/estilizar via CSS. Geometria fiel ao asset do Caminho 01.
 */
export const Arrow = forwardRef<SVGSVGElement, ArrowProps>(function Arrow(
  { title, strokeWidth = 17, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M27 73 L73 27" />
        <path d="M41 27 L73 27 L73 59" />
      </g>
    </svg>
  );
});
