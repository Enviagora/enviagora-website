import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_EA, VIEWPORT } from '@/lib/motion';
import { cn } from '@/lib/cn';

type PainLeadProps = {
  /** A dor na voz do cliente (sem aspas). */
  text: string;
  theme?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
};

/**
 * Abertura de seção que "mata" uma dor do cliente: a frase dele aparece e é
 * riscada ao entrar na tela; o título logo abaixo é a resposta. As dores vão
 * sendo resolvidas ao longo da página, cada uma na seção que trata dela.
 */
export function PainLead({ text, theme = 'light', align = 'left', className }: PainLeadProps) {
  const reduce = useReducedMotion();
  const dark = theme === 'dark';
  const line = dark ? 'rgba(250, 250, 245, 0.6)' : 'rgba(18, 51, 54, 0.55)';

  return (
    <p
      className={cn(
        'flex items-start gap-2.5 text-base leading-snug sm:text-lg',
        dark ? 'text-ea-cremewm/65' : 'text-ea-soft',
        align === 'center' && 'justify-center text-center',
        className,
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border sm:mt-1',
          dark ? 'border-ea-cremewm/30' : 'border-ea-petroleo/25',
        )}
        aria-hidden
      >
        <X className="h-3 w-3" strokeWidth={2.5} />
      </span>
      {/* O span externo é o item flex; o risco fica no interno, inline, para
          cortar cada linha quando a frase quebra. */}
      <span>
        <motion.span
          className="bg-no-repeat [background-position:0_58%]"
          style={{ backgroundImage: `linear-gradient(${line}, ${line})` }}
          initial={{ backgroundSize: reduce ? '100% 1.5px' : '0% 1.5px' }}
          whileInView={{ backgroundSize: '100% 1.5px' }}
          viewport={VIEWPORT}
          transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.3, ease: EASE_EA }}
        >
          “{text}”
        </motion.span>
      </span>
    </p>
  );
}
