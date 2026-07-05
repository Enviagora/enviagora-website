import { motion, useReducedMotion } from 'framer-motion';
import { Boxes, Bell, Check } from 'lucide-react';
import { realTime } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { VIEWPORT } from '@/lib/motion';

// Linhas do inventário (estados de UI ilustrativos — não são copy do site).
const rows = [
  { w: '62%', status: 'Enviado', tone: 'bg-ea-neon' },
  { w: '48%', status: 'Em separação', tone: 'bg-ea-ceu' },
  { w: '70%', status: 'Em trânsito', tone: 'bg-ea-lavanda' },
  { w: '54%', status: 'Conferência', tone: 'bg-ea-kraft' },
];
const timeline = ['Enviado', 'Aguardando transportadora', 'Em conferência', 'Em processamento'];

function MockDashboard() {
  const reduce = useReducedMotion();
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
        </div>

        <div className="p-5">
          {/* Mini stats */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { k: 'Em estoque', tone: 'bg-ea-ceu' },
              { k: 'Enviados', tone: 'bg-ea-neon' },
              { k: 'Reposição', tone: 'bg-ea-lavanda' },
            ].map((t) => (
              <div key={t.k} className="rounded-ea-sm bg-ea-creme p-3">
                <span className={`mb-2 block h-5 w-5 rounded ${t.tone}`} />
                <span className="text-[0.65rem] text-ea-soft">{t.k}</span>
              </div>
            ))}
          </div>

          {/* Tabela */}
          <div className="flex flex-col gap-3">
            {rows.map((r, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={reduce ? undefined : { opacity: 0, x: -12 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              >
                <span className="h-8 w-8 shrink-0 rounded-ea-sm bg-ea-coolgrey" />
                <span className="h-2.5 rounded-full bg-ea-petroleo/10" style={{ width: r.w }} />
                <span className="ml-auto flex items-center gap-1.5 rounded-pill bg-ea-creme px-2.5 py-1 text-[0.65rem] font-medium text-ea-petroleo">
                  <span className={`h-2 w-2 rounded-full ${r.tone}`} />
                  {r.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Card flutuante: linha do tempo do pedido */}
      <motion.div
        className="absolute -bottom-8 -right-4 w-56 rounded-ea border border-ea-petroleo/10 bg-white p-4 shadow-ea-lg sm:-right-8"
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
          {timeline.map((t, i) => (
            <li key={t} className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  i === 0 ? 'bg-ea-neon' : 'bg-ea-coolgrey'
                }`}
              >
                {i === 0 ? <Check className="h-2.5 w-2.5 text-ea-petroleo" strokeWidth={3} /> : null}
              </span>
              <span className={`text-[0.68rem] ${i === 0 ? 'font-semibold text-ea-petroleo' : 'text-ea-soft'}`}>
                {t}
              </span>
            </li>
          ))}
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
          <SectionHeading
            kicker="Visibilidade total"
            title={realTime.title}
            align="left"
          />
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
