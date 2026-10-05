import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Instagram, Linkedin, Mail, MapPin, Phone, Server, ShieldCheck, Warehouse } from 'lucide-react';
import { BLOG_HREF, footer, hero, site } from '@/content/content';
import { Logo } from '@/components/brand/Logo';
import { Arrow } from '@/components/brand/Arrow';
import { Button } from '@/components/ui/Button';
import { getSiteConfig } from '@/lib/siteConfig';

// Fatos já publicados no site — selos de confiança para o comprador B2B.
const TRUST = [
  { icon: ShieldCheck, title: 'Galpões com ANVISA', short: 'ANVISA' },
  { icon: Server, title: 'Infraestrutura AWS', short: 'AWS' },
  { icon: Warehouse, title: `CD de ${site.cd.area} em ${site.cd.local}`, short: site.cd.area },
];

// Ícones das redes, exibidos ao lado do link correspondente na coluna "Conteúdo".
const SOCIAL = [
  { icon: Instagram, href: site.instagram },
  { icon: Linkedin, href: site.linkedin },
];

type Contato = {
  email: string;
  telefone: string;
  razao: string;
  cnpj: string;
  endereco: { rua: string; bairro: string; cidade: string; cep: string };
};

const isExternal = (href: string) => /^https?:\/\//.test(href);
const linkCls = 'text-sm text-ea-soft-dark transition-colors duration-200 hover:text-ea-cremewm';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const arrowY = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const { blogUrl } = getSiteConfig();
  const { email, telefone, razao, cnpj, endereco } = footer.contato as Contato;
  const enderecoLinha = `${endereco.rua}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.cep}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoLinha)}`;

  return (
    <footer ref={ref} className="ea-on-dark relative overflow-hidden bg-ea-petroleo text-ea-cremewm">
      {/* Seta gigante como marca d'água (grafismo do sistema, sangrando). */}
      <motion.div
        className="pointer-events-none absolute -right-16 -top-16 sm:-right-10"
        style={reduce ? undefined : { y: arrowY }}
        aria-hidden
      >
        <Arrow className="h-56 w-56 text-ea-neon/[0.05] sm:h-96 sm:w-96" />
      </motion.div>

      <div className="ea-container-wide relative pb-8 pt-14 sm:pb-10 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1.1fr] lg:gap-12">
          {/* Marca + CTA */}
          <div className="flex flex-col gap-4">
            <Logo on="dark" className="h-6 self-start" />
            <p className="ea-display max-w-[18ch] text-[1.4rem] leading-tight text-ea-cremewm sm:text-2xl">{footer.tagline}</p>
            <p className="max-w-xs text-sm text-ea-soft-dark">{footer.pitch}</p>
            <div className="pt-2" data-track="footer">
              <Button href="#contato" size="md" className="w-full sm:w-auto">
                {hero.cta}
              </Button>
            </div>
          </div>

          {/* Links: 2 colunas lado a lado também no celular */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            {footer.cols.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3.5">
                <span className="ea-kicker text-ea-neon">{col.title}</span>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => {
                    const href = link.href === BLOG_HREF ? blogUrl : link.href;
                    const ext = isExternal(href);
                    return (
                      <li key={link.label}>
                        <a
                          href={href}
                          {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className={`${linkCls} inline-flex items-center gap-2`}
                        >
                          {SOCIAL.filter((so) => so.href === href).map(({ icon: Icon }) => (
                            <Icon key={href} className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                          ))}
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>

          {/* Empresa: razão social, CNPJ e endereço (obrigatórios) */}
          <div className="flex flex-col gap-3.5">
            <span className="ea-kicker text-ea-neon">Empresa</span>
            <address className="flex flex-col gap-3 text-sm not-italic text-ea-soft-dark">
              <span>
                <span className="font-bold text-ea-cremewm">{razao}</span>
                <br />
                CNPJ {cnpj}
              </span>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2.5 transition-colors hover:text-ea-cremewm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ea-neon" aria-hidden />
                <span>
                  {endereco.rua}
                  <br />
                  {endereco.bairro}
                  <br />
                  {endereco.cidade} · CEP {endereco.cep}
                  <span className="mt-1 block text-xs text-ea-cremewm/70 underline decoration-ea-neon/60 underline-offset-4 group-hover:text-ea-cremewm">
                    Ver no mapa
                  </span>
                </span>
              </a>
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2.5 hover:text-ea-cremewm">
                  <Mail className="h-4 w-4 shrink-0 text-ea-neon" aria-hidden />
                  {email}
                </a>
              )}
              {telefone && (
                <a href={`tel:${telefone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2.5 hover:text-ea-cremewm">
                  <Phone className="h-4 w-4 shrink-0 text-ea-neon" aria-hidden />
                  {telefone}
                </a>
              )}
            </address>
          </div>
        </div>

        {/* Selos de confiança: 3 numa linha (compactos no celular) */}
        <ul className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-ea border border-ea-cremewm/10 bg-ea-cremewm/10">
          {TRUST.map(({ icon: Icon, title, short }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-2 bg-ea-petroleo px-2 py-4 text-center sm:flex-row sm:gap-3 sm:px-5 sm:text-left"
            >
              <Icon className="h-5 w-5 shrink-0 text-ea-neon sm:h-4 sm:w-4" strokeWidth={1.8} aria-hidden />
              <span className="text-[0.72rem] font-medium leading-tight text-ea-cremewm sm:text-sm">
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{title}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* Linha final */}
        <div className="mt-8 flex flex-col gap-3 border-t border-ea-cremewm/10 pt-6 text-xs text-ea-soft-dark sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.legal}</p>
          <ul className="flex gap-5">
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
