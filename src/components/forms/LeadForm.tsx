import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { leadForm } from '@/content/content';
import { Arrow } from '@/components/brand/Arrow';
import { HubSpotForm } from '@/components/forms/HubSpotForm';
import { CONSENT, submitLead, type LeadPayload } from '@/lib/hubspotSubmit';
import { HS_FIELDS, LEAD_EVENT, PREFILL_EVENT, installHubSpotFormBridge, prefillField, type LeadDetail } from '@/lib/hubspotForm';
import { track, trackLead } from '@/lib/analytics';
import { EASE_EA } from '@/lib/motion';
import { cn } from '@/lib/cn';

/* ==========================================================================
   Formulário próprio (2 etapas) com o visual da marca. Envia para o mesmo
   formulário do HubSpot pela API (ver lib/hubspotSubmit). Se o HubSpot recusar
   (ex.: CAPTCHA ligado no formulário) ou a rede falhar, mostra o formulário
   oficial do HubSpot já preenchido com o que a pessoa digitou — nenhum lead
   se perde.
   ========================================================================== */

type Values = Omit<LeadPayload, 'consentCommunications' | 'consentProcessing'> & {
  consentCommunications: boolean;
  consentProcessing: boolean;
};
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  website: '',
  monthly_order_volume: '',
  erp_used: '',
  product_segment: '',
  primary_business_need: '',
  consentCommunications: false,
  consentProcessing: false,
};

const STEP_FIELDS: (keyof Values)[][] = [
  ['firstname', 'lastname', 'email', 'phone', 'website'],
  ['monthly_order_volume', 'erp_used', 'product_segment', 'primary_business_need', 'consentProcessing'],
];

const MIN_FILL_MS = 2500; // envio mais rápido que isso = robô

/** (11) 99999-9999 */
function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validate(v: Values, fields: (keyof Values)[]): Errors {
  const e: Errors = {};
  const { errors } = leadForm;
  for (const f of fields) {
    const val = v[f];
    if (f === 'consentProcessing') {
      if (!val) e[f] = errors.consent;
      continue;
    }
    if (typeof val === 'string' && !val.trim()) {
      e[f] = errors.required;
      continue;
    }
    if (f === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(val).trim())) e[f] = errors.email;
    if (f === 'phone' && String(val).replace(/\D/g, '').length < 10) e[f] = errors.phone;
    if (f === 'website' && !/\.[a-z]{2,}/i.test(String(val))) e[f] = errors.website;
  }
  return e;
}

function normalizeWebsite(v: string) {
  const t = v.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

const inputCls =
  'w-full rounded-ea-sm border bg-ea-petroleo/50 px-3.5 py-3 text-[0.95rem] text-ea-cremewm placeholder:text-ea-cremewm/35 outline-none transition-colors duration-200 focus:border-ea-neon focus:bg-ea-petroleo/70';

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ea-cremewm">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-err`} className="text-xs text-[#ffb4a8]">
          {error}
        </span>
      )}
    </div>
  );
}

export function LeadForm() {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [fallback, setFallback] = useState(false);
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const touchedStep = useRef(false);

  // Pré-preenchimentos vindos de outros CTAs (ex.: simulador de economia).
  useEffect(() => {
    installHubSpotFormBridge();
    const map: Record<string, keyof Values> = {
      [HS_FIELDS.orderVolume]: 'monthly_order_volume',
      [HS_FIELDS.need]: 'primary_business_need',
    };
    const onPrefill = (e: Event) => {
      const { name, value } = (e as CustomEvent<{ name: string; value: string }>).detail;
      const key = map[name];
      if (key) setValues((v) => ({ ...v, [key]: value }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  // Foco no primeiro campo ao trocar de etapa (teclado e leitor de tela).
  useEffect(() => {
    if (!touchedStep.current) return;
    stepRef.current?.querySelector<HTMLElement>('input, select, button')?.focus();
  }, [step]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const id = (f: string) => `${uid}-${f}`;
  const aria = (f: keyof Values) => ({
    id: id(f),
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `${id(f)}-err` : undefined,
  });
  const border = (f: keyof Values) => (errors[f] ? 'border-[#ffb4a8]' : 'border-ea-cremewm/20');

  const next = () => {
    const e = validate(values, STEP_FIELDS[0]);
    setErrors(e);
    if (Object.keys(e).length) return;
    touchedStep.current = true;
    track('enviagora_form_step', { step: 2 });
    setStep(1);
  };

  /** Plano B: formulário oficial do HubSpot, já preenchido. */
  const goFallback = (reason: string) => {
    track('enviagora_form_fallback', { reason });
    const p: [string, string | boolean][] = [
      [HS_FIELDS.firstName, values.firstname],
      [HS_FIELDS.lastName, values.lastname],
      [HS_FIELDS.email, values.email.trim()],
      [HS_FIELDS.phone, `+55${values.phone.replace(/\D/g, '')}`],
      [HS_FIELDS.website, normalizeWebsite(values.website)],
      [HS_FIELDS.orderVolume, values.monthly_order_volume],
      [HS_FIELDS.erp, values.erp_used],
      [HS_FIELDS.segment, values.product_segment],
      [HS_FIELDS.need, values.primary_business_need],
      [HS_FIELDS.consentCommunications, values.consentCommunications],
      [HS_FIELDS.consentProcessing, values.consentProcessing],
    ];
    p.forEach(([n, v]) => prefillField(n, v));
    setFallback(true);
  };

  const submit = async () => {
    const e = validate(values, STEP_FIELDS[1]);
    setErrors(e);
    if (Object.keys(e).length) return;
    // Anti-spam: campo-isca preenchido ou envio rápido demais → finge sucesso.
    if (honeypot.current?.value || Date.now() - startedAt.current < MIN_FILL_MS) {
      track('enviagora_form_spam');
      window.dispatchEvent(new CustomEvent<LeadDetail>(LEAD_EVENT, { detail: {} }));
      return;
    }
    setSending(true);
    const res = await submitLead({
      ...values,
      email: values.email.trim(),
      phone: `+55 ${maskPhone(values.phone)}`,
      website: normalizeWebsite(values.website),
    });
    setSending(false);
    if (res.ok) {
      trackLead({ order_volume: values.monthly_order_volume || undefined });
      window.dispatchEvent(
        new CustomEvent<LeadDetail>(LEAD_EVENT, {
          detail: {
            firstName: values.firstname,
            lastName: values.lastname,
            email: values.email.trim(),
            orderVolume: values.monthly_order_volume,
          },
        }),
      );
      return;
    }
    if (res.reason === 'invalid-email') {
      touchedStep.current = true;
      setStep(0);
      setErrors({ email: leadForm.errors.email });
      return;
    }
    goFallback(res.reason);
  };

  if (fallback) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="ea-kicker text-ea-neon">{leadForm.fallbackTitle}</span>
          <p className="text-sm text-ea-soft-dark">{leadForm.fallbackBody}</p>
        </div>
        <HubSpotForm className="min-h-[640px]" />
      </div>
    );
  }

  const select = (f: keyof Values, options: readonly (string | { label: string; value: string })[]) => (
    <div className="relative">
      <select
        {...aria(f)}
        value={values[f] as string}
        onChange={(e) => set(f, e.target.value as never)}
        className={cn(inputCls, border(f), 'appearance-none pr-10', !values[f] && 'text-ea-cremewm/40')}
      >
        <option value="" disabled>
          {leadForm.placeholders.select}
        </option>
        {options.map((o) => {
          const { label, value } = typeof o === 'string' ? { label: o, value: o } : o;
          return (
            <option key={value} value={value} className="text-ea-petroleo">
              {label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ea-cremewm/60" aria-hidden />
    </div>
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 0) next();
        else void submit();
      }}
      className="relative flex flex-col gap-6"
      aria-label="Fale com um especialista"
    >
      {/* Progresso */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="ea-kicker text-ea-neon">
            Etapa {step + 1} de 2 · {leadForm.steps[step]}
          </span>
          {step === 1 && (
            <button
              type="button"
              onClick={() => {
                touchedStep.current = true;
                setStep(0);
              }}
              className="text-ea-soft-dark underline-offset-4 hover:text-ea-cremewm hover:underline"
            >
              {leadForm.back}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5" aria-hidden>
          {[0, 1].map((i) => (
            <span key={i} className="h-1 overflow-hidden rounded-full bg-ea-cremewm/10">
              <motion.span
                className="block h-full rounded-full bg-ea-neon"
                initial={false}
                animate={{ width: step >= i ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: EASE_EA }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Campo-isca (escondido de pessoas; robôs costumam preencher) */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Empresa
          <input ref={honeypot} type="text" name="company_site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          ref={stepRef}
          initial={{ opacity: 0, x: step ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step ? -24 : 24 }}
          transition={{ duration: 0.3, ease: EASE_EA }}
          className="flex flex-col gap-4"
        >
          {step === 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={id('firstname')} label={leadForm.labels.firstname} error={errors.firstname}>
                  <input
                    {...aria('firstname')}
                    autoComplete="given-name"
                    placeholder={leadForm.placeholders.firstname}
                    value={values.firstname}
                    onChange={(e) => set('firstname', e.target.value)}
                    className={cn(inputCls, border('firstname'))}
                  />
                </Field>
                <Field id={id('lastname')} label={leadForm.labels.lastname} error={errors.lastname}>
                  <input
                    {...aria('lastname')}
                    autoComplete="family-name"
                    placeholder={leadForm.placeholders.lastname}
                    value={values.lastname}
                    onChange={(e) => set('lastname', e.target.value)}
                    className={cn(inputCls, border('lastname'))}
                  />
                </Field>
              </div>
              <Field id={id('email')} label={leadForm.labels.email} error={errors.email}>
                <input
                  {...aria('email')}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={leadForm.placeholders.email}
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={cn(inputCls, border('email'))}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={id('phone')} label={leadForm.labels.phone} error={errors.phone}>
                  <div className={cn('flex items-center rounded-ea-sm border bg-ea-petroleo/50 focus-within:border-ea-neon', border('phone'))}>
                    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-ea-cremewm/15 px-3 text-sm text-ea-cremewm/70" aria-hidden>
                      🇧🇷 +55
                    </span>
                    <input
                      {...aria('phone')}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder={leadForm.placeholders.phone}
                      value={values.phone}
                      onChange={(e) => set('phone', maskPhone(e.target.value))}
                      className="w-full bg-transparent px-3 py-3 text-[0.95rem] text-ea-cremewm outline-none placeholder:text-ea-cremewm/35"
                    />
                  </div>
                </Field>
                <Field id={id('website')} label={leadForm.labels.website} error={errors.website}>
                  <input
                    {...aria('website')}
                    inputMode="url"
                    autoComplete="url"
                    placeholder={leadForm.placeholders.website}
                    value={values.website}
                    onChange={(e) => set('website', e.target.value)}
                    className={cn(inputCls, border('website'))}
                  />
                </Field>
              </div>
            </>
          ) : (
            <>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1.5 text-sm font-bold text-ea-cremewm">{leadForm.labels.orderVolume}</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-invalid={errors.monthly_order_volume ? true : undefined}>
                  {leadForm.orderVolume.map((o) => {
                    const on = values.monthly_order_volume === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => set('monthly_order_volume', o)}
                        className={cn(
                          'rounded-ea-sm border px-2 py-2.5 text-center text-xs font-medium transition-colors duration-200 sm:text-[0.8rem]',
                          on
                            ? 'border-ea-neon bg-ea-neon text-ea-petroleo'
                            : 'border-ea-cremewm/20 bg-ea-petroleo/50 text-ea-cremewm hover:border-ea-cremewm/50',
                        )}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
                {errors.monthly_order_volume && <span className="text-xs text-[#ffb4a8]">{errors.monthly_order_volume}</span>}
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={id('erp_used')} label={leadForm.labels.erp} error={errors.erp_used}>
                  {select('erp_used', leadForm.erp)}
                </Field>
                <Field id={id('product_segment')} label={leadForm.labels.segment} error={errors.product_segment}>
                  {select('product_segment', leadForm.segment)}
                </Field>
              </div>
              <Field id={id('primary_business_need')} label={leadForm.labels.need} error={errors.primary_business_need}>
                {select('primary_business_need', leadForm.need)}
              </Field>

              {/* Consentimentos (LGPD) — mesmos textos do HubSpot */}
              <div className="flex flex-col gap-3 border-t border-ea-cremewm/10 pt-4 text-xs leading-relaxed text-ea-soft-dark">
                <p>{CONSENT.communicationText}</p>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-ea-cremewm">
                  <input
                    type="checkbox"
                    checked={values.consentCommunications}
                    onChange={(e) => set('consentCommunications', e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#C4FF57]"
                  />
                  {CONSENT.communicationLabel}
                </label>
                <p>{CONSENT.processingText}</p>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-ea-cremewm">
                  <input
                    type="checkbox"
                    {...aria('consentProcessing')}
                    checked={values.consentProcessing}
                    onChange={(e) => set('consentProcessing', e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#C4FF57]"
                  />
                  <span>
                    {CONSENT.processingLabel} <span className="text-[#ffb4a8]">*</span>
                  </span>
                </label>
                {errors.consentProcessing && (
                  <span id={`${id('consentProcessing')}-err`} className="text-xs text-[#ffb4a8]">
                    {errors.consentProcessing}
                  </span>
                )}
                <p>
                  {CONSENT.privacyText}{' '}
                  <a href="/policies/privacy-policy" className="text-ea-cremewm underline underline-offset-2 hover:text-ea-neon">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        type="submit"
        disabled={sending}
        className="group inline-flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-ea-sm bg-ea-neon px-4 py-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-ea-petroleo transition-colors duration-200 hover:bg-ea-neon-300 disabled:cursor-wait disabled:opacity-80 sm:px-6 sm:text-sm sm:tracking-label"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {leadForm.sending}
          </>
        ) : step === 0 ? (
          <>
            {leadForm.next}
            <Arrow className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
          </>
        ) : (
          <>
            {leadForm.submit}
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
