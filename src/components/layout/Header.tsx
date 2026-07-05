import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { nav, hero } from '@/content/content';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trava o scroll do body quando o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // No topo o header está sobre o hero ESCURO → conteúdo claro.
  // Ao rolar, ganha fundo creme → conteúdo escuro.
  const dark = !scrolled;

  return (
    <header
      className={cn(
        'ea-on-dark sticky top-0 z-50 transition-all duration-300 ease-ea',
        scrolled
          ? 'border-b border-ea-petroleo/10 bg-ea-creme/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="ea-container-wide flex h-16 items-center justify-between gap-4 sm:h-[70px]">
        <a href="#top" aria-label="Enviagora — início" className="shrink-0">
          <Logo on={dark ? 'dark' : 'light'} className="h-6 w-auto sm:h-7" />
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full',
                dark
                  ? 'text-ea-cremewm/75 hover:text-ea-cremewm after:bg-ea-neon'
                  : 'text-ea-soft hover:text-ea-petroleo after:bg-ea-petroleo',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="#contato" size="md" className="hidden sm:inline-flex">
            {hero.cta}
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-ea-sm lg:hidden',
              dark ? 'text-ea-cremewm' : 'text-ea-petroleo',
            )}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Overlay mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ea-petroleo text-ea-cremewm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ea-container-wide flex h-16 items-center justify-between">
              <Logo on="dark" className="h-6 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-ea-sm text-ea-cremewm"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="ea-container-wide flex flex-1 flex-col justify-center gap-2" aria-label="Navegação mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="ea-display border-b border-ea-cremewm/10 py-4 text-3xl text-ea-cremewm"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <Button href="#contato" variant="primary" size="lg" className="mt-8 self-start" onClick={() => setOpen(false)}>
                {hero.cta}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
