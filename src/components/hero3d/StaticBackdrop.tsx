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
    </div>
  );
}
