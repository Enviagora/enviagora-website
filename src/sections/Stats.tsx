import { stats } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { Arrow } from '@/components/brand/Arrow';

export function Stats() {
  return (
    <Section tone="creme" className="!py-16 sm:!py-20">
      <Reveal>
        <div className="ea-on-dark overflow-hidden rounded-ea-lg bg-ea-petroleo px-6 py-12 shadow-ea-lg sm:px-12 sm:py-14">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {stats.items.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 0.1}
                className="flex flex-col items-start gap-2 border-l border-ea-cremewm/15 pl-5"
              >
                <Arrow className="mb-1 h-4 w-4 text-ea-neon" />
                <p className="ea-tnum font-serif text-5xl leading-none text-ea-cremewm sm:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 font-sans text-base font-semibold text-ea-cremewm">{s.title}</p>
                <p className="text-sm text-ea-soft-dark">{s.label}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
