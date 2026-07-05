import { motion, useReducedMotion } from 'framer-motion';
import { Warehouse, PackageOpen, Truck } from 'lucide-react';
import { process } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Pill } from '@/components/ui/Pill';
import { VIEWPORT } from '@/lib/motion';

const icons = [Warehouse, PackageOpen, Truck];

export function Process() {
  const reduce = useReducedMotion();

  return (
    <Section tone="petroleo">
      <div className="flex flex-col items-center gap-5">
        <Pill tone="dark" className="border border-ea-neon/30 !text-ea-neon">
          {process.local}
        </Pill>
        <SectionHeading title={process.title} align="center" theme="dark" className="mx-auto" />
      </div>

      <div className="relative mt-16">
        {/* Linha conectando as etapas (desenha no scroll) */}
        <svg
          className="absolute left-0 right-0 top-[2.2rem] hidden h-px w-full md:block"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
          aria-hidden
        >
          <motion.line
            x1="6"
            y1="0.5"
            x2="94"
            y2="0.5"
            stroke="var(--ea-neon)"
            strokeOpacity={0.4}
            strokeWidth={1}
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? undefined : { pathLength: 0 }}
            whileInView={reduce ? undefined : { pathLength: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        </svg>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {process.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={step.title} delay={i * 0.12} className="relative flex flex-col items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-ea bg-ea-neon ring-8 ring-ea-petroleo">
                  <Icon className="h-8 w-8 text-ea-petroleo" strokeWidth={1.5} aria-hidden />
                </div>
                <span className="ea-kicker text-ea-neon">Etapa 0{i + 1}</span>
                <h3 className="ea-display text-2xl text-ea-cremewm">{step.title}</h3>
                <p className="text-base leading-relaxed text-ea-soft-dark">{step.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
