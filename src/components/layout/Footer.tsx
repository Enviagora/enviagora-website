import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Instagram, Globe, Mail, Phone, ShieldCheck, Server, MapPin } from 'lucide-react';
import { footer, site } from '@/content/content';
import { Logo } from '@/components/brand/Logo';
import { Arrow } from '@/components/brand/Arrow';
import { WhatsAppIcon } from '@/components/brand/WhatsAppIcon';
import { whatsappHref } from '@/lib/siteConfig';

// Fatos já publicados no site — selos de confiança para o comprador B2B.
const TRUST = [
  { icon: ShieldCheck, text: 'Galpões com ANVISA' },
  { icon: Server, text: 'Infraestrutura AWS' },
  { icon: MapPin, text: `CDs em ${site.locais.join(' e ')}` },
];

const linkCls = 'inline-flex items-center gap-2 text-sm text-ea-soft-dark transition-colors hover:text-ea-cremewm';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const arrowY = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const [wa, setWa] = useState<string | null>(null);
  useEffect(() => setWa(whatsappHref()), []);

  // Campos de contato podem estar vazios no conteúdo (aguardando os dados reais).
  const { email, telefone, cnpj } = footer.contato as { email: string; telefone: string; cnpj: string };

  return (
    <footer ref={ref} className="ea-on-dark relative overflow-hidden bg-ea-petroleo text-ea-cremewm">
      {/* Seta gigante como marca d'água (grafismo do sistema, sangrando). */}
      <motion.div
        className="pointer-events-none absolute -right-10 -top-16"
        style={reduce ? undefined : { y: arrowY }}
        aria-hidden
      >
        <Arrow className="h-72 w-72 text-ea-neon/[0.06] sm:h-96 sm:w-96" />
      </motion.div>

      <div className="ea-container-wide relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marca */}
          <div className="flex flex-col gap-5">
            <Logo on="dark" className="h-6 self-start" />
            <p className="ea-display max-w-xs text-2xl text-ea-cremewm">{footer.tagline}</p>
            <p className="max-w-xs text-sm text-ea-soft-dark">{footer.pitch}</p>
          </div>

          {/* Colunas de links */}
          {footer.cols.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
              <span className="ea-kicker text-ea-neon">{col.title}</span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label} className="text-sm text-ea-soft-dark">
                    {link.href ? (
                      <a href={link.href} className="transition-colors duration-200 hover:text-ea-cremewm">
                        {link.label}
                      </a>
                    ) : (
                      link.label
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Selos de confiança */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-ea border border-ea-cremewm/10 bg-ea-cremewm/10 sm:grid-cols-3">
          {TRUST.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 bg-ea-petroleo px-5 py-4 text-sm text-ea-cremewm">
              <Icon className="h-4 w-4 shrink-0 text-ea-neon" strokeWidth={1.8} aria-hidden />
              {text}
            </li>
          ))}
        </ul>

        {/* Contato / social — campos vazios não aparecem */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={linkCls}>
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className={linkCls}>
              <Mail className="h-4 w-4" aria-hidden />
              {email}
            </a>
          )}
          {telefone && (
            <a href={`tel:${telefone.replace(/[^\d+]/g, '')}`} className={linkCls}>
              <Phone className="h-4 w-4" aria-hidden />
              {telefone}
            </a>
          )}
          <a href="https://instagram.com/enviagora" target="_blank" rel="noopener noreferrer" className={linkCls}>
            <Instagram className="h-4 w-4" aria-hidden />
            {footer.contato.instagram}
          </a>
          <a href={site.url} className={linkCls}>
            <Globe className="h-4 w-4" aria-hidden />
            {footer.contato.site}
          </a>
        </div>

        {/* Barra legal */}
        <div className="mt-8 flex flex-col gap-3 border-t border-ea-cremewm/10 pt-6 text-xs text-ea-soft-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            {footer.legal}
            {cnpj && <span className="ml-2">CNPJ {cnpj}</span>}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {footer.legalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-ea-cremewm">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
