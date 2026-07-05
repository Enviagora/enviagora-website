import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax leve no scroll via GSAP + ScrollTrigger (scrub).
 * Aplique em elementos DECORATIVOS (não controlados pelo Framer Motion, para
 * não conflitar no transform). Respeita prefers-reduced-motion (não anima).
 *
 * @param distance deslocamento total em px ao longo da travessia do elemento.
 */
export function useParallax<T extends Element = HTMLElement>(distance = 60) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -distance / 2 },
        {
          y: distance / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [distance]);

  return ref;
}
