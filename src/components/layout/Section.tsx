import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'creme' | 'petroleo' | 'ceu' | 'lavanda' | 'coolgrey' | 'kraft' | 'white';

const toneCls: Record<Tone, string> = {
  creme: 'bg-ea-creme text-ea-petroleo',
  white: 'bg-white text-ea-petroleo',
  coolgrey: 'bg-ea-coolgrey text-ea-petroleo',
  ceu: 'bg-ea-ceu text-ea-petroleo',
  lavanda: 'bg-ea-lavanda text-ea-petroleo',
  kraft: 'bg-ea-kraft text-ea-petroleo',
  // `ea-on-dark` troca a cor do foco para neon (acessibilidade em fundo escuro).
  petroleo: 'bg-ea-petroleo text-ea-cremewm ea-on-dark',
};

type SectionProps = {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  wide?: boolean;
  /** Sem container interno (para seções full-bleed). */
  bare?: boolean;
  children: ReactNode;
};

/** Casca de seção: fundo por tom da marca + espaçamento vertical + container. */
export function Section({
  id,
  tone = 'creme',
  className,
  containerClassName,
  wide,
  bare,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn('relative py-section', toneCls[tone], className)}>
      {bare ? (
        children
      ) : (
        <div className={cn(wide ? 'ea-container-wide' : 'ea-container', containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
