import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type CountUpProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

/**
 * Contador que anima de 0 até `value` ao entrar na viewport (easeOutCubic).
 * Respeita prefers-reduced-motion (mostra o valor final imediatamente).
 * Formatação em pt-BR (99,6 em vez de 99.6).
 */
export function CountUp({ value, suffix = '', decimals, duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduce = useReducedMotion();
  // O HTML pré-renderizado (e quem está sem JS) vê o valor final; no navegador
  // o contador zera antes do primeiro paint e anima ao entrar na tela.
  const [display, setDisplay] = useState(value);
  const dec = decimals ?? (Number.isInteger(value) ? 0 : 1);

  useIsoLayoutEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setDisplay(0);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / (duration * 1000)));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  const formatted = display.toLocaleString('pt-BR', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
