import { useEffect } from 'react';
import { trackCta } from '@/lib/analytics';
import { installHubSpotFormBridge } from '@/lib/hubspotForm';

/** Âncoras/links que contam como CTA de conversão. */
function isCta(a: HTMLAnchorElement) {
  const href = a.getAttribute('href') ?? '';
  return href.startsWith('#contato') || href.startsWith('#economia') || href.includes('wa.me/');
}

/**
 * Instala o rastreamento de conversão da página:
 * - ponte com os eventos do formulário HubSpot (Lead no envio)
 * - clique em qualquer CTA, com a seção de origem (header, hero, faq…)
 */
export function useConversionTracking() {
  useEffect(() => {
    installHubSpotFormBridge();

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || !isCta(a)) return;
      const tagged = a.closest<HTMLElement>('[data-track]');
      const where =
        tagged?.dataset.track ??
        (a.closest('header') ? 'header' : a.closest('footer') ? 'footer' : a.closest('section')?.id || 'page');
      trackCta(where, (a.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60), a.getAttribute('href') ?? '');
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
}
