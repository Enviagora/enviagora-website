import { motion, useReducedMotion } from 'framer-motion';
import { Box, ScanLine, Warehouse, PackageCheck, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Arrow } from '@/components/brand/Arrow';
import { Reveal } from '@/components/motion/Reveal';
import { EASE_EA } from '@/lib/motion';

type Stage = {
  label: string;
  detail: string;
  icon: LucideIcon;
};

const stages: Stage[] = [
  { label: 'Recebimento', detail: 'Conferência por SKU', icon: Box },
  { label: 'Scan', detail: 'Rastreio unitário', icon: ScanLine },
  { label: 'Armazenagem', detail: 'Endereço inteligente', icon: Warehouse },
  { label: 'Pick & pack', detail: 'Dupla validação', icon: PackageCheck },
  { label: 'Expedição', detail: 'Melhor transportadora', icon: Truck },
];

export function OperationalPulse() {
  const reduce = useReducedMotion();

  return (
    <section className="ea-on-dark relative overflow-hidden bg-ea-petroleo py-8 text-ea-cremewm sm:py-10" aria-labelledby="operation-pulse-title">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(196,255,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(196,255,87,0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="ea-container-wide relative">
        <Reveal className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-50" />}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ea-neon" />
            </span>
            <h2 id="operation-pulse-title" className="ea-kicker text-ea-neon">
              Operação em movimento
            </h2>
          </div>
          <span className="ea-tnum font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ea-soft-dark">
            SLA monitorado · ponta a ponta
          </span>
        </Reveal>

        <div className="relative">
          <div className="absolute left-6 right-6 top-6 hidden h-px bg-ea-cremewm/15 lg:block" aria-hidden>
            <motion.span
              className="block h-px origin-left bg-ea-neon"
              initial={reduce ? undefined : { scaleX: 0 }}
              whileInView={reduce ? undefined : { scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE_EA }}
            />
            {!reduce && (
              <motion.span
                className="absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-ea-neon text-ea-petroleo shadow-ea-neon"
                initial={{ left: '0%' }}
                whileInView={{ left: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 4.8, delay: 0.35, ease: 'easeInOut' }}
              >
                <Arrow className="h-3.5 w-3.5" />
              </motion.span>
            )}
          </div>

          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.li
                  key={stage.label}
                  className="relative flex items-center gap-3 rounded-ea border border-ea-cremewm/10 bg-ea-petroleo-2/80 p-3.5 backdrop-blur-sm lg:flex-col lg:items-start lg:border-0 lg:bg-transparent lg:p-0"
                  initial={reduce ? undefined : { opacity: 0, y: 14 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: EASE_EA }}
                >
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-ea border border-ea-neon/25 bg-ea-petroleo text-ea-neon">
                    <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col lg:pt-2">
                    <span className="font-sans text-sm font-semibold text-ea-cremewm">{stage.label}</span>
                    <span className="mt-0.5 text-xs text-ea-soft-dark">{stage.detail}</span>
                  </span>
                  <span className="ea-tnum ml-auto text-[0.62rem] text-ea-neon/60 lg:absolute lg:right-0 lg:top-1">
                    0{index + 1}
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
