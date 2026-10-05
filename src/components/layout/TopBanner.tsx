import { topBanner } from '@/content/content';
import { Arrow } from '@/components/brand/Arrow';

/**
 * Barra fina no topo — exclusividade da operação. No mobile vira a versão curta,
 * sempre em uma linha; o volume mínimo fica em destaque (neon sobre escuro).
 */
export function TopBanner() {
  return (
    <div className="ea-on-dark bg-ea-petroleo text-ea-cremewm">
      <div className="ea-container-wide flex items-center justify-center gap-2 py-2.5 text-center">
        <Arrow className="h-3 w-3 text-ea-neon" />
        <p className="whitespace-nowrap text-[0.74rem] font-medium leading-none tracking-[0.01em] sm:text-[0.8rem]">
          <span className="hidden md:inline">{topBanner.lead} · </span>
          <span className="md:hidden">{topBanner.short} </span>
          <strong className="font-bold text-ea-neon">{topBanner.highlight}</strong>
        </p>
      </div>
    </div>
  );
}
