import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { comoComecar, contactForm } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';
import { LeadForm } from '@/components/forms/LeadForm';
import { LEAD_EVENT, type LeadDetail } from '@/lib/hubspotForm';
import { meetingsEmbedUrl } from '@/lib/siteConfig';
import { EASE_EA } from '@/lib/motion';

/** Depois do envio: confirmação + agenda do HubSpot Meetings (se configurada). */
function LeadSuccess({ lead }: { lead: LeadDetail }) {
  const meetings = meetingsEmbedUrl(lead);
  const { success } = contactForm;
  const ref = useRef<HTMLDivElement>(null);

  // O card encolhe ao trocar o formulário pela confirmação → traz para a vista.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-6 scroll-mt-28"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_EA }}
      role="status"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-ea bg-ea-neon text-ea-petroleo">
        <Check className="h-6 w-6" strokeWidth={2.4} aria-hidden />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="ea-display text-2xl text-ea-cremewm sm:text-3xl">{success.title}</h3>
        <p className="text-base text-ea-soft-dark">{success.body}</p>
      </div>

      {meetings && (
        <div className="flex flex-col gap-3 border-t border-ea-cremewm/10 pt-6">
          <span className="ea-kicker text-ea-neon">{success.scheduleTitle}</span>
          <iframe
            src={meetings}
            title="Agendar conversa com um especialista"
            className="h-[680px] w-full rounded-ea bg-white"
            loading="lazy"
          />
        </div>
      )}
    </motion.div>
  );
}

export function ContactForm() {
  const [lead, setLead] = useState<LeadDetail | null>(null);

  useEffect(() => {
    const onLead = (e: Event) => setLead((e as CustomEvent<LeadDetail>).detail ?? {});
    window.addEventListener(LEAD_EVENT, onLead);
    return () => window.removeEventListener(LEAD_EVENT, onLead);
  }, []);

  return (
    <Section id="contato" tone="petroleo">
      <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Persuasão + o que acontece depois */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <span className="ea-kicker inline-flex items-center gap-2 text-ea-neon">
            <Arrow className="h-3.5 w-3.5" /> {contactForm.kicker}
          </span>
          <Reveal>
            <h2 className="ea-display text-display-sm text-ea-cremewm ea-balance">{contactForm.title}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-base text-ea-soft-dark">{contactForm.instruction}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4 border-t border-ea-cremewm/10 pt-6">
              <span className="ea-kicker text-ea-cremewm">{comoComecar.title}</span>
              <ol className="flex flex-col">
                {comoComecar.steps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-ea-cremewm/10 py-4 first:pt-0">
                    <span className="ea-metric pt-0.5 text-2xl text-ea-neon">0{i + 1}</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-ea-cremewm">{s.title}</span>
                      <span className="text-sm leading-relaxed text-ea-soft-dark">{s.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-ea-soft-dark">{comoComecar.note}</p>
            </div>
          </Reveal>

        </div>

        {/* Formulário próprio (envia para o formulário do HubSpot pela API; se
            o HubSpot recusar, ele mesmo mostra o formulário oficial preenchido). */}
        <Reveal delay={0.1}>
          <div className="rounded-ea-lg border border-ea-cremewm/10 bg-ea-petroleo-2 p-5 sm:p-8">
            {/* Continua montado (só escondido) após o envio: no plano B o embed
                do HubSpot não gosta de ter o nó removido no meio do fluxo. */}
            <div className={lead ? 'hidden' : undefined}>
              <LeadForm />
            </div>
            <AnimatePresence>{lead && <LeadSuccess lead={lead} />}</AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
