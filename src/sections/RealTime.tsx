import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Boxes, Bell, Check } from 'lucide-react';
import { realTime } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { VIEWPORT } from '@/lib/motion';
import { cn } from '@/lib/cn';

// Estados de UI ilustrativos (não são copy do site) — dão a sensação de "ao vivo".
const rows = [
  { status: 'Enviado', tone: 'bg-ea-neon', w: 62 },
  { status: 'Em separação', tone: 'bg-ea-ceu', w: 48 },
  { status: 'Em trânsito', tone: 'bg-ea-lavanda', w: 70 },
  { status: 'Conferência', tone: 'bg-ea-kraft', w: 54 },
];
const timeline = ['Pedido recebido', 'Em separação', 'Coletado', 'Em trânsito'];

const nf = new Intl.NumberFormat('pt-BR');

/** Números e estados que se atualizam sozinhos → o painel parece vivo. */
function useLiveDashboard(run: boolean) {
  const [s, setS] = useState({ enviados: 328, estoque: 12480, repo: 24, step: 0, flash: 0 });
  useEffect(() => {
    if (!run) return;
    const t1 = window.setInterval(() => {
      setS((p) => ({
        ...p,
        enviados: p.enviados + 1 + Math.floor(Math.random() * 3),
        estoque: Math.max(0, p.estoque + Math.floor(Math.random() * 7) - 3),
        repo: Math.max(6, p.repo + Math.floor(Math.random() * 3) - 1),
        flash: Math.floor(Math.random() * rows.length),
      }));
    }, 1900);
    const t2 = window.setInterval(() => setS((p) => ({ ...p, step: (p.step + 1) % timeline.length })), 1500);
    return () => {
      window.clearInterval(t1);
      window.clearInterval(t2);
    };
  }, [run]);
  return s;
}

function MockDashboard() {
  const reduce = useReducedMotion();
  const live = useLiveDashboard(!reduce);
  const miniStats = [
    { k: 'Em estoque', tone: 'bg-ea-ceu', v: nf.format(live.estoque) },
    { k: 'Enviados hoje', tone: 'bg-ea-neon', v: nf.format(live.enviados) },
    { k: 'Reposição', tone: 'bg-ea-lavanda', v: nf.format(live.repo) },
  ];

  return (
    <div className="relative">
      {/* Janela do painel */}
      <div className="overflow-hidden rounded-ea-lg border border-ea-petroleo/10 bg-white shadow-ea-lg">
        <div className="flex items-center gap-2 border-b border-ea-petroleo/10 bg-ea-creme px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ea-petroleo/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-ea-petroleo/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-ea-petroleo/20" />
          <span className="ml-3 flex items-center gap-1.5 text-xs font-semibold text-ea-soft">
            <Boxes className="h-3.5 w-3.5" aria-hidden /> Inventário
          </span>
          {/* Indicador "ao vivo" */}
          <span className="ml-auto flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-label text-ea-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ea-neon" />
            </span>
            ao vivo
          </span>
        </div>

        <div className="p-5">
          {/* Mini stats com números que atualizam */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {miniStats.map((t) => (
              <div key={t.k} className="rounded-ea-sm bg-ea-creme p-3">
                <span className={cn('mb-2 block h-4 w-4 rounded', t.tone)} />
                <span className="ea-tnum block font-serif text-lg leading-none text-ea-petroleo">{t.v}</span>
                <span className="mt-1 block text-[0.6rem] text-ea-soft">{t.k}</span>
              </div>
            ))}
          </div>

          {/* Tabela — a linha "atualizada" acende */}
          <div className="flex flex-col gap-3">
            {rows.map((r, i) => (
              <motion.div
                key={i}
                className={cn(
                  'flex items-center gap-3 rounded-ea-sm px-2 py-1.5 transition-colors duration-500',
                  live.flash === i ? 'bg-ea-neon/10 ring-1 ring-ea-neon/30' : 'ring-1 ring-transparent',
                )}
                initial={reduce ? undefined : { opacity: 0, x: -12 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              >
                <span className="h-8 w-8 shrink-0 rounded-ea-sm bg-ea-coolgrey" />
                <span className="h-2.5 rounded-full bg-ea-petroleo/10" style={{ width: `${r.w}%` }} />
                <span className="ml-auto flex items-center gap-1.5 rounded-pill bg-ea-creme px-2.5 py-1 text-[0.65rem] font-medium text-ea-petroleo">
                  <span className={cn('h-2 w-2 rounded-full', r.tone)} />
                  {r.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Card flutuante: pedido percorrendo a linha do tempo */}
      <motion.div
        className="relative ml-auto mt-4 w-56 rounded-ea border border-ea-petroleo/10 bg-white p-4 shadow-ea-lg sm:absolute sm:-bottom-8 sm:-right-4 sm:mt-0 lg:-right-8"
        initial={reduce ? undefined : { opacity: 0, y: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="mb-3 flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5 text-ea-petroleo" aria-hidden />
          <span className="text-xs font-semibold text-ea-petroleo">Pedido de venda</span>
        </div>
        <ol className="flex flex-col gap-2.5">
          {timeline.map((t, i) => {
            const done = i < live.step;
            const current = i === live.step;
            return (
              <li key={t} className="flex items-center gap-2">
                <span
                  className={cn(
                    'relative flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-500',
                    done || current ? 'bg-ea-neon' : 'bg-ea-coolgrey',
                  )}
                >
                  {done && <Check className="h-2.5 w-2.5 text-ea-petroleo" strokeWidth={3} />}
                  {current && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ea-neon opacity-60" />}
                </span>
                <span className={cn('text-[0.68rem] transition-colors duration-500', done || current ? 'font-semibold text-ea-petroleo' : 'text-ea-soft')}>
                  {t}
                </span>
              </li>
            );
          })}
        </ol>
      </motion.div>
    </div>
  );
}

export function RealTime() {
  return (
    <Section tone="kraft">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <MockDashboard />
        </Reveal>

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <SectionHeading kicker="Visibilidade total" title={realTime.title} align="left" />
          <Reveal delay={0.05}>
            <p className="max-w-xl text-base leading-relaxed text-ea-soft">{realTime.body}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ea-soft">
              <span className="ea-kicker text-ea-petroleo">{realTime.poweredBy}</span>
            </span>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
