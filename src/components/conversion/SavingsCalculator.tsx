import { useEffect, useId, useState } from 'react';
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

const OURS = calculator.oursValue; // frete médio Enviagora (≈ R$ 9, todo o Brasil)
const MIN_ORDERS = 5000;
const MAX_ORDERS = 100000;

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

/**
 * Simulador de economia no frete: frete atual da marca × frete médio da
 * Enviagora. O CTA pré-preenche no formulário do HubSpot o volume de pedidos e
 * a necessidade "Reduzir custo de frete".
 */
export function SavingsCalculator() {
  const [orders, setOrders] = useState(10000);
  const [freight, setFreight] = useState(15);
  const ordersId = useId();
  const freightId = useId();

  const perOrder = Math.max(0, freight - OURS);
  const monthly = orders * perOrder;
  const yearly = monthly * 12;
  const pct = freight > 0 ? Math.round((perOrder / freight) * 100) : 0;
  const oursShare = freight > 0 ? Math.min(1, OURS / freight) : 1;
  const low = perOrder <= 0.5;

  const onCta = () => {
    prefillField(HS_FIELDS.orderVolume, orderVolumeOption(orders));
    prefillField(HS_FIELDS.need, 'Reduzir custo de frete');
    track('enviagora_calculator_cta', { orders, freight, monthly_saving: Math.round(monthly) });
  };

  return (
    <div className="ea-on-dark overflow-hidden rounded-ea-lg bg-ea-petroleo text-ea-cremewm">
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        {/* Entradas */}
        <div className="flex flex-col gap-8 p-7 sm:p-10">
          <div className="flex flex-col gap-3">
            <span className="ea-kicker text-ea-neon">{calculator.kicker}</span>
            <h3 className="ea-display text-display-sm text-ea-cremewm">{calculator.title}</h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={ordersId} className="text-sm font-bold text-ea-cremewm">
                {calculator.ordersLabel}
              </label>
              <span className="ea-metric text-2xl text-ea-cremewm">{int.format(orders)}</span>
            </div>
            <input
              id={ordersId}
              type="range"
              min={MIN_ORDERS}
              max={MAX_ORDERS}
              step={500}
              value={orders}
              onChange={(e) => setOrders(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[#C4FF57]"
            />
            <div className="flex justify-between text-xs text-ea-soft-dark">
              <span>
                {int.format(MIN_ORDERS)} <span className="opacity-70">({calculator.ordersMin})</span>
              </span>
              <span>{int.format(MAX_ORDERS)}+</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor={freightId} className="text-sm font-bold text-ea-cremewm">
              {calculator.freightLabel}
            </label>
            <div className="flex items-center rounded-ea-sm border border-ea-cremewm/25 bg-ea-petroleo-2 focus-within:border-ea-neon sm:self-start">
              <span className="pl-3 text-sm text-ea-soft-dark">R$</span>
              <input
                id={freightId}
                type="number"
                inputMode="decimal"
                min={5}
                max={200}
                step={0.5}
                value={freight}
                onChange={(e) => setFreight(Math.max(0, Number(e.target.value) || 0))}
                className="ea-metric w-28 bg-transparent px-2 py-2.5 text-xl text-ea-cremewm outline-none"
              />
            </div>
          </div>

          {/* Comparação visual: seu frete × frete Enviagora */}
          <div className="flex flex-col gap-3" aria-hidden>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-ea-soft-dark">{calculator.todayLabel}</span>
                <span className="ea-tnum text-ea-cremewm">{brl2.format(freight)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-ea-cremewm/25" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-ea-soft-dark">
                  {calculator.oursLabel} <span className="opacity-70">· {calculator.oursNote}</span>
                </span>
                <span className="ea-tnum font-bold text-ea-neon">~{brl2.format(OURS)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-ea-cremewm/10">
                <motion.div
                  className="h-full rounded-full bg-ea-neon"
                  initial={false}
                  animate={{ width: `${oursShare * 100}%` }}
                  transition={{ duration: 0.6, ease: EASE_EA }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="flex flex-col justify-between gap-8 border-t border-ea-cremewm/10 bg-ea-petroleo-2 p-7 sm:p-10 lg:border-l lg:border-t-0">
          <div className="flex flex-col gap-3" aria-live="polite">
            <span className="ea-kicker text-ea-soft-dark">{calculator.resultLabel}</span>
            {low ? (
              <p className="max-w-sm text-base leading-relaxed text-ea-cremewm">{calculator.lowNote}</p>
            ) : (
              <>
                <p className="ea-metric text-[clamp(2.5rem,6vw,4.25rem)] text-ea-neon">
                  <Rolling value={monthly} format={(n) => brl0.format(n)} />
                  <span className="ml-1 text-xl text-ea-soft-dark">/mês</span>
                </p>
                <p className="text-base text-ea-cremewm">
                  <Rolling value={yearly} format={(n) => brl0.format(n)} />{' '}
                  <span className="text-ea-soft-dark">{calculator.perYear}</span>
                </p>
                <p className="mt-2 inline-flex items-center gap-2 self-start rounded-pill border border-ea-neon/30 px-3 py-1 text-xs text-ea-cremewm">
                  <span className="ea-tnum font-bold text-ea-neon">−{brl2.format(perOrder)}</span> {calculator.perOrder}
                  <span className="text-ea-soft-dark">({pct}%)</span>
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button href="#contato" size="lg" onClick={onCta} className="self-start">
              {calculator.cta}
            </Button>
            <p className="text-xs leading-relaxed text-ea-soft-dark">{calculator.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Incentivos fiscais — o outro lado da economia */}
      <div className="flex flex-col gap-2 border-t border-ea-cremewm/10 px-7 py-6 sm:flex-row sm:items-center sm:gap-6 sm:px-10">
        <span className="ea-metric shrink-0 text-3xl text-ea-neon">{calculator.tax.value}</span>
        <p className="text-sm text-ea-soft-dark">{calculator.tax.text}</p>
      </div>
    </div>
  );
}
