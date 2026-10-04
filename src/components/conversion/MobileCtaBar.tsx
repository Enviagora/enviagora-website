import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { hero } from '@/content/content';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/brand/WhatsAppIcon';
import { whatsappHref } from '@/lib/siteConfig';
import { EASE_EA } from '@/lib/motion';

/**
 * Barra fixa de CTA no mobile: aparece depois que o hero sai da tela e some
 * quando o formulário ou o rodapé estão visíveis (não compete com eles nem
 * cobre os links legais).
 */
export function MobileCtaBar() {
  const [show, setShow] = useState(false);
  const [wa, setWa] = useState<string | null>(null);

  useEffect(() => {
    setWa(whatsappHref());
    const heroEl = document.getElementById('top');
    const blockers = [document.getElementById('contato'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => !!el,
    );
    let pastHero = false;
    const visible = new Set<Element>();
    const update = () => setShow(pastHero && visible.size === 0);
    const ioHero = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting;
      update();
    });
    const ioBlock = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        update();
      },
      { threshold: 0.05 },
    );
    if (heroEl) ioHero.observe(heroEl);
    blockers.forEach((el) => ioBlock.observe(el));
    return () => {
      ioHero.disconnect();
      ioBlock.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ea-cremewm/10 bg-ea-petroleo/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: EASE_EA }}
        >
          <div className="flex items-stretch gap-2" data-track="mobile-bar">
            <Button href="#contato" className="flex-1" withArrow>
              {hero.cta}
            </Button>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                data-track="mobile-bar-whatsapp"
                aria-label="Conversar no WhatsApp"
                className="flex w-12 shrink-0 items-center justify-center rounded-ea-sm border border-ea-cremewm/40 text-ea-cremewm transition-colors hover:border-ea-neon hover:text-ea-neon"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
