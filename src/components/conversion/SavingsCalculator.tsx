import { useEffect, useId, useState, type CSSProperties } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { calculator } from '@/content/content';
import { Button } from '@/components/ui/Button';
import { track } from '@/lib/analytics';
import { HS_FIELDS, orderVolumeOption, prefillField } from '@/lib/hubspotForm';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_EA } from '@/lib/motion';

const brl0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
const int = new Intl.NumberFormat('pt-BR');

const REF = calculator.refFreight; // frete de referência da rede — usado na conta, nunca exibido
const MAX_SAVING = calculator.maxSaving; // teto da estimativa = promessa publicada ("até 40%")
const ORDERS = { min: 5000, max: 100000, step: 500 };
const FREIGHT = { min: 6, max: 40, step: 0.5 };

/** Número que desliza até o novo valor (sem pular) quando as entradas mudam. */
function Rolling({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(v));
  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 0.6, ease: EASE_EA });
    return () => c.stop();
  }, [value, reduce, mv]);
  return <motion.span>{text}</motion.span>;
}

type QuestionProps = {
  n: number;
  label: string;
  value: string;
  range: { min: number; max: number; step: number };
  current: number;
  onChange: (v: number) => void;
  scale: [string, string];
};

/** Pergunta numerada com o valor em destaque e um slider fácil de arrastar. */
function Question({ n, label, value, range, current, onChange, scale }: QuestionProps) {
  const id = useId();
  const fill = ((current - range.min) / (range.max - range.min)) * 100;
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="flex items-start gap-3 text-[0.95rem] font-bold leading-snug text-ea-cremewm">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ea-neon text-xs text-ea-petroleo">{n}</span>
        {label}
      </label>
      <span className="ea-metric pl-9 text-[2rem] text-ea-cremewm sm:text-4xl">{value}</span>
      <div className="pl-9">
        <input
          id={id}
          type="range"
          min={range.min}
          max={range.max}
          step={range.step}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ea-range"
          style={{ '--fill': `${fill}%` } as CSSProperties}
        />
        <div className="mt-1 flex justify-between text-xs text-ea-soft-dark">
          <span>{scale[0]}</span>
          <span>{scale[1]}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Simulador de economia no frete em 2 perguntas (pedidos/mês e frete médio
 * atual). Mostra só a economia estimada — por mês, por ano e como fatia do
 * gasto atual —, sem expor o frete da Enviagora. O CTA pré-preenche no
 * formulário o volume de pedidos e a necessidade "Reduzir custo de frete".
 */
export function SavingsCalculator() {
  const [orders, setOrders] = useState(10000);
  const [freight, setFreight] = useState(15);

  const share = freight > 0 ? Math.min(MAX_SAVING, Math.max(0, (freight - REF) / freight)) : 0;
  const bill = orders * freight;
  const monthly = bill * share;
  const yearly = monthly * 12;
  const pct = Math.round(share * 100);
  const low = pct < 5;

  const onCta = () => {
    prefillField(HS_FIELDS.orderVolume, orderVolumeOption(orders));
    prefillField(HS_FIELDS.need, 'Reduzir custo de frete');
    track('enviagora_calculator_cta', { orders, freight, monthly_saving: Math.round(monthly) });
  };

  return (
    <div className="ea-on-dark overflow-hidden rounded-ea-lg bg-ea-petroleo text-ea-cremewm">
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        {/* Perguntas */}
        <div className="flex flex-col gap-9 p-6 sm:p-10">
          <div className="flex flex-col gap-3">
            <span className="ea-kicker text-ea-neon">{calculator.kicker}</span>
            <h3 className="ea-display text-display-sm text-ea-cremewm">{calculator.title}</h3>
            <p className="text-sm text-ea-soft-dark">{calculator.subtitle}</p>
          </div>

          <Question
            n={1}
            label={calculator.ordersLabel}
            value={orders >= ORDERS.max ? `${int.format(orders)}+` : int.format(orders)}
            range={ORDERS}
            current={orders}
            onChange={setOrders}
            scale={[`${int.format(ORDERS.min)} (${calculator.ordersMin})`, `${int.format(ORDERS.max)}+`]}
          />

          <Question
            n={2}
            label={calculator.freightLabel}
            value={freight >= FREIGHT.max ? `${brl2.format(freight)}+` : brl2.format(freight)}
            range={FREIGHT}
            current={freight}
            onChange={setFreight}
            scale={[brl0.format(FREIGHT.min), `${brl0.format(FREIGHT.max)}+`]}
          />
        </div>

        {/* Resultado */}
        <div className="flex flex-col justify-between gap-8 border-t border-ea-cremewm/10 bg-ea-petroleo-2 p-6 sm:p-10 lg:border-l lg:border-t-0">
          <div className="flex flex-col gap-6" aria-live="polite">
            <span className="ea-kicker text-ea-soft-dark">{calculator.resultLabel}</span>
            {low ? (
              <p className="max-w-sm text-base leading-relaxed text-ea-cremewm">{calculator.lowNote}</p>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <p className="ea-metric text-[clamp(2.75rem,8vw,4.5rem)] text-ea-neon">
                    <Rolling value={monthly} format={(v) => brl0.format(v)} />
                  </p>
                  <p className="text-base text-ea-soft-dark">
                    {calculator.perMonth} <span className="px-1 text-ea-cremewm/30">·</span>
                    <span className="ea-tnum text-ea-cremewm">
                      <Rolling value={yearly} format={(v) => brl0.format(v)} />
                    </span>{' '}
                    {calculator.perYear}
                  </p>
                  <p className="text-xs text-ea-soft-dark">{calculator.margin}</p>
                </div>

                {/* Gasto atual com frete; a fatia em neon é o que deixaria de gastar */}
                <div className="flex flex-col gap-2" aria-hidden>
                  <div className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="text-ea-soft-dark">{calculator.todayLabel}</span>
                    <span className="ea-tnum text-sm text-ea-cremewm">
                      <Rolling value={bill} format={(v) => brl0.format(v)} />
                      <span className="text-ea-soft-dark">/mês</span>
                    </span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-ea-cremewm/20">
                    <motion.div
                      className="absolute inset-y-0 right-0 rounded-full bg-ea-neon"
                      initial={false}
                      animate={{ width: `${share * 100}%` }}
                      transition={{ duration: 0.6, ease: EASE_EA }}
                    />
                  </div>
                  <span className="self-end text-xs font-bold text-ea-neon">
                    {pct}% {calculator.savingTag}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button
              href="#contato"
              size="lg"
              onClick={onCta}
              className="w-full max-sm:px-4 max-sm:text-[0.75rem] min-[360px]:whitespace-nowrap sm:w-auto sm:self-start"
            >
              {low ? calculator.ctaLow : calculator.cta}
            </Button>
            <p className="text-xs leading-relaxed text-ea-soft-dark">{calculator.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Além do frete: incentivos fiscais */}
      <div className="flex flex-col gap-1.5 border-t border-ea-cremewm/10 px-6 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-10">
        <span className="ea-kicker shrink-0 text-ea-soft-dark">{calculator.tax.kicker}</span>
        <p className="text-sm text-ea-soft-dark">
          <span className="font-bold text-ea-neon">{calculator.tax.value}</span> {calculator.tax.text}
        </p>
      </div>
    </div>
  );
}
