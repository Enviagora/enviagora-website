type ChevronProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

/**
 * Chevron ↑ — grafismo secundário da marca (usado em UI/telas).
 * Cor via `currentColor`. Geometria fiel ao asset do Caminho 01.
 */
export function Chevron({ title, strokeWidth = 15, ...props }: ChevronProps) {
  return (
    <svg
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
        <path d="M30 46 L50 26 L70 46" />
        <path d="M50 26 L50 78" />
      </g>
    </svg>
  );
}
