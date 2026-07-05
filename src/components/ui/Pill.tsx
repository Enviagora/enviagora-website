import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'creme' | 'lavanda' | 'ceu' | 'neon' | 'outline' | 'dark';

const toneCls: Record<Tone, string> = {
  creme: 'bg-ea-creme text-ea-petroleo',
  lavanda: 'bg-ea-lavanda text-ea-petroleo',
  ceu: 'bg-ea-ceu text-ea-petroleo',
  neon: 'bg-ea-neon text-ea-petroleo',
  outline: 'border border-ea-petroleo/20 text-ea-petroleo',
  dark: 'bg-ea-petroleo text-ea-cremewm',
};

/** Pill tag arredondada (ex.: `beleza`, `cosméticos`) — grafismo do sistema. */
export function Pill({
  children,
  tone = 'creme',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-1 font-sans text-[0.8rem] font-medium leading-none',
        toneCls[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
