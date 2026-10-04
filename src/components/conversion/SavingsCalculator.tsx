import { useId, useState } from 'react';
import { calculator } from '@/content/content';
import { Button } from '@/components/ui/Button';
import { track } from '@/lib/analytics';
import { HS_FIELDS, orderVolumeOption, prefillField } from '@/lib/hubspotForm';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const int = new Intl.NumberFormat('pt-BR');

// Desconto máximo publicado da LogAlliance ("até 40%").
const MAX_DISCOUNT = 0.4;

/**
 * Simulador de economia no frete. Ao clicar no CTA, já pré-preenche no
 * formulário do HubSpot o volume de pedidos e a necessidade "Reduzir custo de
 * frete" — o lead chega no formulário com metade do trabalho feito.
 */
export function SavingsCalculator() {
  const [orders, setOrders] = useState(10000);
  const [freight, setFreight] = useState(20);
  const ordersId = useId();
  const freightId = useId();

  const monthly = orders * freight * MAX_DISCOUNT;
  const yearly = monthly * 12;

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
              min={1000}
              max={100000}
              step={500}
              value={orders}
              onChange={(e) => setOrders(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[#C4FF57]"
            />
            <div className="flex justify-between text-xs text-ea-soft-dark">
              <span>1.000</span>
              <span>100.000+</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor={freightId} className="text-sm font-bold text-ea-cremewm">
              {calculator.freightLabel}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-ea-sm border border-ea-cremewm/25 bg-ea-petroleo-2 focus-within:border-ea-neon">
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
                  className="ea-metric w-24 bg-transparent px-2 py-2.5 text-xl text-ea-cremewm outline-none"
                />
              </div>
              <span className="text-xs text-ea-soft-dark">{calculator.freightHint}</span>
            </div>
          </div>

          {orders < 3000 && <p className="text-sm text-ea-soft-dark">{calculator.minNote}</p>}
        </div>

        {/* Resultado */}
        <div className="flex flex-col justify-between gap-8 border-t border-ea-cremewm/10 bg-ea-petroleo-2 p-7 sm:p-10 lg:border-l lg:border-t-0">
          <div className="flex flex-col gap-2" aria-live="polite">
            <span className="ea-kicker text-ea-soft-dark">{calculator.resultLabel}</span>
            <p className="ea-metric text-[clamp(2.5rem,6vw,4.25rem)] text-ea-neon">
              <span className="mr-2 align-middle text-base font-bold uppercase tracking-label text-ea-cremewm">até</span>
              {brl.format(monthly)}
              <span className="ml-1 text-xl text-ea-soft-dark">/mês</span>
            </p>
            <p className="text-base text-ea-cremewm">
              {brl.format(yearly)} <span className="text-ea-soft-dark">{calculator.perYear}</span>
            </p>
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
