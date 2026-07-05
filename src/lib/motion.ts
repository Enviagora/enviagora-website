import type { Variants } from 'framer-motion';

/** Easing premium da marca (ease-out expressivo). */
export const EASE_EA = [0.22, 1, 0.36, 1] as const;

/** Fade + subida sutil — reveal padrão das seções. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EA } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_EA } },
};

/** Container que escalona a entrada dos filhos. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** Configuração de viewport para whileInView (dispara uma vez, um pouco antes). */
export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;
