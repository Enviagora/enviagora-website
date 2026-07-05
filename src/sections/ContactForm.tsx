import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { contactForm, site } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/brand/Arrow';
import { cn } from '@/lib/cn';

const inputCls =
  'w-full rounded-ea-sm border border-ea-petroleo/15 bg-white px-4 py-3 text-[0.95rem] text-ea-petroleo placeholder:text-ea-soft/50 transition-colors duration-200 focus:border-ea-petroleo focus:outline-none focus:ring-2 focus:ring-ea-neon/40';
const labelCls = 'flex flex-col gap-1.5 text-sm font-medium text-ea-petroleo';

function Required() {
  return <span className="text-ea-soft"> *</span>;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [origem, setOrigem] = useState('');
  const f = contactForm.fields;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(integração): enviar os dados para o CRM/endpoint (placeholder).
    // Ex.: await fetch('/api/lead', { method: 'POST', body: new FormData(e.currentTarget) })
    setSubmitted(true);
  }

  return (
    <Section id="contato" tone="petroleo">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Persuasão */}
        <div className="flex flex-col gap-6">
          <span className="ea-kicker inline-flex items-center gap-2 text-ea-neon">
            <Arrow className="h-3.5 w-3.5" /> Vagas limitadas
          </span>
          <Reveal>
            <h2 className="ea-display text-display-sm text-ea-cremewm ea-balance">{contactForm.title}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-base text-ea-soft-dark">{contactForm.instruction}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="flex flex-col gap-3 pt-2">
              {[`Operação em ${site.locais[0]} e ${site.locais[1]}`, 'Resposta de um especialista', 'Sem taxas escondidas'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-3 text-ea-cremewm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-ea-sm bg-ea-neon">
                      <Arrow className="h-3.5 w-3.5 text-ea-petroleo" />
                    </span>
                    <span className="text-sm">{t}</span>
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>

        {/* Card do formulário */}
        <Reveal delay={0.1}>
          <div className="rounded-ea-lg bg-ea-creme p-6 shadow-ea-lg sm:p-8">
            {submitted ? (
              <div className="flex min-h-[26rem] flex-col items-center justify-center gap-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ea-neon">
                  <CheckCircle2 className="h-8 w-8 text-ea-petroleo" aria-hidden />
                </span>
                <h3 className="ea-display text-2xl text-ea-petroleo">Recebemos seus dados!</h3>
                <p className="max-w-xs text-sm text-ea-soft">
                  Um especialista da Enviagora entrará em contato em breve. Enquanto isso, prepare sua operação para
                  escalar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <p className="text-sm text-ea-soft">{contactForm.instruction}</p>

                <label className={labelCls}>
                  <span>
                    {f.nome}
                    <Required />
                  </span>
                  <input className={inputCls} name="nome" type="text" required autoComplete="name" />
                </label>

                <div className={labelCls}>
                  <span>
                    {f.whatsapp}
                    <Required />
                  </span>
                  <div className="grid grid-cols-[1.4fr_0.6fr_1fr] gap-2">
                    <select className={cn(inputCls, 'appearance-none')} name="pais" defaultValue="55" aria-label={f.whatsapp}>
                      <option value="55">{f.whatsappCountry}</option>
                    </select>
                    <input className={inputCls} name="ddd" inputMode="numeric" placeholder={f.whatsappDdd} required aria-label={f.whatsappDdd} />
                    <input className={inputCls} name="numero" inputMode="numeric" placeholder={f.whatsappNumero} required autoComplete="tel-national" aria-label={f.whatsappNumero} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelCls}>
                    <span>
                      {f.empresa}
                      <Required />
                    </span>
                    <input className={inputCls} name="empresa" type="text" required autoComplete="organization" />
                  </label>
                  <label className={labelCls}>
                    <span>{f.site}</span>
                    <input className={inputCls} name="site" type="text" inputMode="url" autoComplete="url" />
                  </label>
                </div>

                <label className={labelCls}>
                  <span>
                    {f.envios}
                    <Required />
                  </span>
                  <input className={inputCls} name="envios" inputMode="numeric" required />
                </label>

                <fieldset className="flex flex-col gap-2.5">
                  <legend className="mb-1 text-sm font-medium text-ea-petroleo">
                    {f.origem}
                    <Required />
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {contactForm.origemOptions.map((opt) => {
                      const active = origem === opt;
                      return (
                        <label
                          key={opt}
                          className={cn(
                            'cursor-pointer rounded-pill border px-3.5 py-1.5 text-sm transition-all duration-200',
                            active
                              ? 'border-ea-neon bg-ea-neon font-medium text-ea-petroleo'
                              : 'border-ea-petroleo/15 bg-white text-ea-soft hover:border-ea-petroleo/40',
                          )}
                        >
                          <input
                            type="radio"
                            name="origem"
                            value={opt}
                            className="sr-only"
                            checked={active}
                            onChange={() => setOrigem(opt)}
                            required
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <Button type="submit" size="lg" className="mt-1 w-full">
                  {contactForm.submit}
                </Button>

                <p className="text-center text-sm text-ea-soft">
                  <a href="#top" className="font-medium text-ea-petroleo underline underline-offset-2 hover:text-ea-neon">
                    {contactForm.secondaryLink}
                  </a>{' '}
                  — {contactForm.secondaryCall}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
