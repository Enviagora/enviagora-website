import { Instagram, Globe } from 'lucide-react';
import { footer, site } from '@/content/content';
import { Logo } from '@/components/brand/Logo';
import { Arrow } from '@/components/brand/Arrow';
import { useParallax } from '@/hooks/useParallax';

export function Footer() {
  const arrowRef = useParallax<HTMLSpanElement>(120);
  return (
    <footer className="ea-on-dark relative overflow-hidden bg-ea-petroleo text-ea-cremewm">
      {/* Seta gigante como marca d'água (grafismo do sistema, sangrando). */}
      <Arrow
        ref={arrowRef}
        className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 text-ea-neon/[0.06] sm:h-96 sm:w-96"
      />

      <div className="ea-container-wide relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marca */}
          <div className="flex flex-col gap-5">
            <Logo on="dark" className="h-7 w-auto self-start" />
            <p className="ea-display max-w-xs text-2xl text-ea-cremewm">{footer.tagline}</p>
            <p className="max-w-xs text-sm text-ea-soft-dark">{footer.pitch}</p>
          </div>

          {/* Colunas de links */}
          {footer.cols.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
              <span className="ea-kicker text-ea-neon">{col.title}</span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ea-soft-dark transition-colors duration-200 hover:text-ea-cremewm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contato / social */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ea-cremewm/10 pt-8">
          <a
            href="https://instagram.com/enviagora"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ea-soft-dark transition-colors hover:text-ea-cremewm"
          >
            <Instagram className="h-4 w-4" aria-hidden />
            {footer.contato.instagram}
          </a>
          <a
            href={site.url}
            className="inline-flex items-center gap-2 text-sm text-ea-soft-dark transition-colors hover:text-ea-cremewm"
          >
            <Globe className="h-4 w-4" aria-hidden />
            {footer.contato.site}
          </a>
        </div>

        {/* Barra legal */}
        <div className="mt-8 flex flex-col gap-3 border-t border-ea-cremewm/10 pt-6 text-xs text-ea-soft-dark sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.legal}</p>
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
