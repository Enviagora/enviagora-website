import { Package } from 'lucide-react';
import { topBanner } from '@/content/content';

/** Barra fina no topo — exclusividade da operação (copy verbatim). */
export function TopBanner() {
  return (
    <div className="ea-on-dark bg-ea-petroleo text-ea-cremewm">
      <div className="ea-container-wide flex items-center justify-center gap-2.5 py-2.5 text-center">
        <Package className="h-4 w-4 shrink-0 text-ea-neon" aria-hidden />
        <p className="text-[0.78rem] font-medium leading-snug sm:text-sm">{topBanner}</p>
      </div>
    </div>
  );
}
