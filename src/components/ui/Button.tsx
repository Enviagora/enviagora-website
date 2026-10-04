import type { MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
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

// Botões preenchidos ganham "efeito magnético" (seguem o cursor de leve).
const MAGNETIC: Record<Variant, boolean> = { primary: true, secondary: true, ghost: false, 'ghost-dark': false };

// Spec oficial do botão (Caminho 02): raio 8px, Satoshi Bold em CAIXA ALTA com
// tracking 0.14em. Raio total (pílula) fica reservado às tags.
const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-ea-sm text-center font-sans font-bold uppercase tracking-label leading-[1.3] ease-ea select-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';

const sizeCls: Record<Size, string> = {
  md: 'px-5 py-3.5 text-[0.75rem]',
  lg: 'px-7 py-[1.05rem] text-[0.8125rem]',
};

// Variações magnéticas: sem translate no CSS (o movimento vem do motion).
const variantCls: Record<Variant, string> = {
  primary: 'bg-ea-neon text-ea-petroleo transition-[box-shadow,background-color] duration-300 hover:bg-ea-neon-300',
  secondary: 'bg-ea-petroleo text-ea-cremewm transition-[box-shadow,background-color] duration-300 hover:shadow-ea',
  ghost:
    'border border-ea-petroleo/25 text-ea-petroleo transition-all duration-300 hover:border-ea-petroleo hover:bg-ea-petroleo/[0.04] active:scale-[0.97]',
  'ghost-dark':
    'border border-ea-cremewm/50 text-ea-cremewm transition-all duration-300 hover:border-ea-neon hover:text-ea-neon active:scale-[0.97]',
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
  const magnetic = MAGNETIC[variant];
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 22, mass: 0.6 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = cn(base, sizeCls[size], variantCls[variant], className);
  const arrow = withArrow ? (
    <Arrow className="h-[1.15em] w-[1.15em] shrink-0 transition-transform duration-300 ease-ea group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
  ) : null;
  const content = (
    <>
      {children}
      {arrow}
    </>
  );

  if (magnetic) {
    const shared = {
      className: classes,
      onClick,
      'aria-label': ariaLabel,
      style: { x, y },
      onMouseMove: onMove,
      onMouseLeave: reset,
      whileTap: { scale: 0.96 },
    };
    return href !== undefined ? (
      <motion.a href={href} target={target} rel={rel} {...shared}>
        {content}
      </motion.a>
    ) : (
      <motion.button type={type} disabled={disabled} {...shared}>
        {content}
      </motion.button>
    );
  }

  return href !== undefined ? (
    <a href={href} className={classes} onClick={onClick} target={target} rel={rel} aria-label={ariaLabel}>
      {content}
    </a>
  ) : (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
