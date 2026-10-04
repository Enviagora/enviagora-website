import { useEffect, useState } from 'react';

/**
 * `prefers-reduced-motion` seguro para hidratação: o primeiro render (no build
 * pré-renderizado e no cliente) é sempre `false`, e o valor real entra logo após
 * montar. O hook do Framer lê o matchMedia já no primeiro render do cliente, o
 * que gera markup diferente do HTML pré-renderizado.
 */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduce;
}
