import { contactForm, site } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Arrow } from '@/components/brand/Arrow';
import { HubSpotForm } from '@/components/forms/HubSpotForm';

export function ContactForm() {
  return (
    <Section id="contato" tone="petroleo">
      <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Persuasão */}
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
            <ul className="flex flex-col gap-3 border-t border-ea-cremewm/10 pt-6">
              {[`Operação em ${site.locais[0]} e ${site.locais[1]}`, 'Resposta de um especialista', 'Sem taxas escondidas'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-3 text-ea-cremewm">
                    <Arrow className="h-3.5 w-3.5 text-ea-neon" />
                    <span className="text-sm">{t}</span>
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>

        {/* Formulário oficial do HubSpot. Ele foi estilizado no HubSpot para fundo
            escuro (rótulos claros), por isso a superfície é verde profundo. */}
        <Reveal delay={0.1}>
          <div className="rounded-ea-lg border border-ea-cremewm/10 bg-ea-petroleo-2 p-5 sm:p-8">
            <HubSpotForm className="min-h-[640px]" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
