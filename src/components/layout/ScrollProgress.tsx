import { motion, useScroll, useSpring } from 'framer-motion';

/** Barra fina de progresso de leitura no topo da página (grafismo neon). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-ea-neon"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
