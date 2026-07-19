import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { nav, hero } from '@/content/content';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  // Barra flutua sobre o hero escuro → conteúdo claro no topo; escuro ao rolar.
  const dark = !scrolled;

  return (
    <header className="ea-on-dark sticky top-0 z-50 pt-2 sm:pt-3">
      <div className="ea-container-wide">
        <div
          className={cn(
            'flex h-14 items-center justify-between gap-4 rounded-pill border pl-4 pr-2 transition-all duration-300 ease-ea sm:pl-6 sm:pr-3',
            scrolled
              ? 'border-ea-petroleo/10 bg-ea-creme/90 shadow-ea backdrop-blur-md'
              : 'border-ea-cremewm/12 bg-ea-petroleo/35 backdrop-blur-md',
          )}
        >
          <a href="#top" aria-label="Enviagora — início" className="shrink-0">
            <Logo on={dark ? 'dark' : 'light'} className="h-6 w-auto" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full',
                  dark
                    ? 'text-ea-cremewm/80 hover:text-ea-cremewm after:bg-ea-neon'
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
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-pill lg:hidden',
                dark ? 'text-ea-cremewm' : 'text-ea-petroleo',
              )}
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="menu-mobile"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="fixed inset-0 z-[60] flex flex-col bg-ea-petroleo text-ea-cremewm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ea-container-wide flex h-16 items-center justify-between pt-2">
              <Logo on="dark" className="h-6 w-auto" />
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-pill text-ea-cremewm"
                aria-label="Fechar menu"
                autoFocus
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="ea-container-wide flex flex-1 flex-col justify-center gap-2" aria-label="Navegação mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="ea-display border-b border-ea-cremewm/10 py-4 text-3xl text-ea-cremewm"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <Button href="#contato" variant="primary" size="lg" className="mt-8 self-start" onClick={closeMenu}>
                {hero.cta}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
