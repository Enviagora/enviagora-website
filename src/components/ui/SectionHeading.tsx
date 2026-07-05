import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Arrow } from '@/components/brand/Arrow';
import { Reveal } from '@/components/motion/Reveal';

type SectionHeadingProps = {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  className?: string;
  titleClassName?: string;
};

/**
 * Cabeçalho de seção padrão: kicker (rótulo caixa alta + seta), título serif
 * de display e subtítulo opcional. Usa Reveal para entrada suave.
 */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = 'center',
  theme = 'light',
  className,
  titleClassName,
}: SectionHeadingProps) {
  const soft = theme === 'dark' ? 'text-ea-soft-dark' : 'text-ea-soft';
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {kicker ? (
        <span className={cn('ea-kicker inline-flex items-center gap-2', theme === 'dark' ? 'text-ea-neon' : 'text-ea-petroleo')}>
          <Arrow className="h-3.5 w-3.5 text-ea-neon" />
          {kicker}
        </span>
      ) : null}

      <h2
        className={cn(
          'ea-display text-display-md ea-balance',
          theme === 'dark' ? 'text-ea-cremewm' : 'text-ea-petroleo',
          align === 'center' ? 'max-w-3xl' : 'max-w-2xl',
          titleClassName,
        )}
      >
        {title}
      </h2>

      {subtitle ? (
        <p className={cn('max-w-2xl text-base leading-relaxed sm:text-lg', soft)}>{subtitle}</p>
      ) : null}
    </Reveal>
  );
}
