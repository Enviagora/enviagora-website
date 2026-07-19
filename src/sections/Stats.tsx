import { stats } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { Arrow } from '@/components/brand/Arrow';
import { Box } from 'lucide-react';

export function Stats() {
  return (
    <Section tone="creme" className="!py-16 sm:!py-24">
      <Reveal>
        <div className="ea-on-dark relative overflow-hidden rounded-ea-lg bg-ea-petroleo px-6 py-10 shadow-ea-lg sm:px-12 sm:py-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{ backgroundImage: 'radial-gradient(rgba(196,255,87,0.12) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          />
          <div className="relative mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-ea-cremewm/10 pb-6">
            <div>
              <span className="ea-kicker text-ea-neon">Escala comprovada</span>
              <h2 className="ea-display mt-2 max-w-xl text-2xl text-ea-cremewm sm:text-3xl">Números de uma operação preparada para crescer.</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-ea-soft-dark">
              <Box className="h-4 w-4 text-ea-neon" strokeWidth={1.6} aria-hidden />
              Dados operacionais
            </div>
          </div>

          <ul className="relative grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {stats.items.map((s, i) => (
              <li
                key={s.title}
                className="flex flex-col items-start gap-2 border-l border-ea-cremewm/15 pl-5"
              >
                <span className="mb-1 flex items-center gap-2">
                  <Arrow className="h-4 w-4 text-ea-neon" />
                  <span className="ea-tnum text-[0.6rem] tracking-[0.16em] text-ea-soft-dark">METRIC / 0{i + 1}</span>
                </span>
                <p className="ea-tnum font-serif text-5xl leading-none text-ea-cremewm sm:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 font-sans text-base font-semibold text-ea-cremewm">{s.title}</p>
                <p className="text-sm text-ea-soft-dark">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
