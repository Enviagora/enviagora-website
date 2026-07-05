import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Arrow } from '@/components/brand/Arrow';

type Variant = 'primary' | 'secondary' | 'ghost' | 'ghost-dark';
type Size = 'md' | 'lg';

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler;
  type?: 'button' | 'submit';
  target?: string;
  rel?: string;
  disabled?: boolean;
  'aria-label'?: string;
};

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-pill font-sans font-semibold leading-none transition-all duration-300 ease-ea select-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';

const sizeCls: Record<Size, string> = {
  md: 'px-6 py-3 text-[0.9rem]',
  lg: 'px-7 py-4 text-base',
};

const variantCls: Record<Variant, string> = {
  // Primário: fundo neon + texto petróleo (regra da marca), sem sombra em repouso.
  primary: 'bg-ea-neon text-ea-petroleo hover:-translate-y-0.5 hover:shadow-ea-neon',
  secondary: 'bg-ea-petroleo text-ea-cremewm hover:-translate-y-0.5 hover:shadow-ea',
  ghost: 'border-[1.5px] border-ea-petroleo/25 text-ea-petroleo hover:border-ea-petroleo hover:bg-ea-petroleo/[0.04]',
  'ghost-dark': 'border-[1.5px] border-ea-cremewm/30 text-ea-cremewm hover:border-ea-neon hover:text-ea-neon',
};

export function Button({
  variant = 'primary',
  size = 'md',
  withArrow = true,
  className,
  children,
  href,
  onClick,
  type = 'button',
  target,
  rel,
  disabled,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = cn(base, sizeCls[size], variantCls[variant], className);
  const arrow = withArrow ? (
    <Arrow className="h-[1.05em] w-[1.05em] shrink-0 transition-transform duration-300 ease-ea group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
  ) : null;

  if (href !== undefined) {
    return (
      <a href={href} className={classes} onClick={onClick} target={target} rel={rel} aria-label={ariaLabel}>
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
      {arrow}
    </button>
  );
}
