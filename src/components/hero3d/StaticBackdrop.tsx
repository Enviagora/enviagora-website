import { Arrow } from '@/components/brand/Arrow';

/**
 * Fundo estático do hero — usado como fallback enquanto a cena 3D carrega,
 * quando não há WebGL, e com prefers-reduced-motion. Puro CSS/SVG (leve).
 */
export function StaticBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ea-petroleo" aria-hidden>
      {/* Glow neon central */}
      <div
        className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(196,255,87,0.16), transparent 62%)' }}
      />
      {/* Grade de pontos */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(250,250,245,0.10) 1px, transparent 1.4px)',
          backgroundSize: '26px 26px',
        }}
      />
      {/* Seta gigante */}
      <Arrow className="absolute -right-24 -bottom-24 h-[36rem] w-[36rem] text-ea-neon/[0.05]" />

      {/* Planta abstrata de uma esteira — mantém a linguagem logística sem WebGL. */}
      <div className="absolute -bottom-24 right-[-12%] hidden h-[75%] w-[70%] -rotate-[13deg] lg:block">
        {[0, 1, 2, 3].map((lane) => (
          <div
            key={lane}
            className="absolute bottom-0 top-0 w-[16%] border-x border-ea-cremewm/10 bg-ea-petroleo-2/50"
            style={{ left: `${lane * 23}%` }}
          >
            <span
              className="absolute inset-x-0 top-[18%] mx-auto block aspect-square w-3/5 rounded-ea-sm border border-ea-neon/20 bg-ea-kraft/20"
              style={{ top: `${16 + lane * 15}%` }}
            />
            <span
              className="absolute inset-x-0 mx-auto block aspect-square w-2/5 rounded-ea-sm border border-ea-cremewm/10 bg-ea-kraft/10"
              style={{ top: `${60 - lane * 9}%` }}
            />
          </div>
        ))}
        <div className="absolute left-0 right-0 top-[43%] h-px bg-ea-neon/35 shadow-[0_0_18px_rgba(196,255,87,0.3)]" />
      </div>
    </div>
  );
}
