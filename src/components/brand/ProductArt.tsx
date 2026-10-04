import { cn } from '@/lib/cn';

type Kind = 'suplementos' | 'beleza';

/**
 * Silhuetas de produto em traço fino (sem marca de terceiros): mostram em um
 * relance com que tipo de produto a operação trabalha. Cor via `currentColor`.
 */
export function ProductArt({ kind, className }: { kind: Kind; className?: string }) {
  const body = 'fill-ea-creme stroke-current';
  const label = 'fill-ea-coolgrey stroke-current';
  const line = 'stroke-current';

  return (
    <svg
      viewBox="0 0 280 150"
      className={cn('h-auto w-full', className)}
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Piso */}
      <path d="M8 138 H272" className={line} strokeOpacity={0.25} />

      {kind === 'suplementos' ? (
        <>
          {/* Pote de whey */}
          <rect x="34" y="34" width="84" height="18" rx="5" className={body} />
          <path d="M42 34 V52 M52 34 V52 M62 34 V52 M72 34 V52 M82 34 V52 M92 34 V52 M102 34 V52 M110 34 V52" className={line} strokeOpacity={0.35} />
          <rect x="28" y="52" width="96" height="86" rx="12" className={body} />
          <rect x="40" y="74" width="72" height="40" rx="4" className={label} />
          <path d="M50 88 H92 M50 98 H80" className={line} />

          {/* Frasco de cápsulas */}
          <rect x="152" y="58" width="34" height="14" rx="3" className={body} />
          <path d="M148 72 H190 L198 86 V130 a8 8 0 0 1 -8 8 H148 a8 8 0 0 1 -8 -8 V86 Z" className={body} />
          <rect x="146" y="94" width="46" height="26" rx="3" className={label} />
          <path d="M154 104 H182 M154 111 H174" className={line} />

          {/* Cápsulas soltas */}
          <rect x="214" y="124" width="30" height="12" rx="6" className={body} transform="rotate(-18 229 130)" />
          <path d="M229 124 V136" className={line} transform="rotate(-18 229 130)" />
          <rect x="238" y="126" width="28" height="11" rx="5.5" className={body} transform="rotate(14 252 131.5)" />
          <path d="M252 126 V137" className={line} transform="rotate(14 252 131.5)" />
        </>
      ) : (
        <>
          {/* Bisnaga (em pé sobre a tampa) */}
          <path d="M36 30 H96 V38 H36 Z" className={body} />
          <path d="M40 38 H92 L84 116 H48 Z" className={body} />
          <path d="M52 62 H80 M54 72 H76" className={line} />
          <rect x="50" y="116" width="32" height="22" rx="4" className={body} />

          {/* Frasco conta-gotas */}
          <rect x="144" y="22" width="18" height="26" rx="9" className={body} />
          <rect x="138" y="48" width="30" height="14" rx="3" className={body} />
          <rect x="126" y="62" width="54" height="76" rx="12" className={body} />
          <rect x="136" y="86" width="34" height="30" rx="3" className={label} />
          <path d="M143 97 H163 M143 105 H157" className={line} />

          {/* Pote de creme */}
          <rect x="202" y="96" width="62" height="16" rx="5" className={body} />
          <rect x="198" y="112" width="70" height="26" rx="7" className={body} />
          <path d="M214 125 H252" className={line} strokeOpacity={0.5} />
        </>
      )}
    </svg>
  );
}
