import { useEffect, useRef } from 'react';
import { getSiteConfig } from '@/lib/siteConfig';
import { cn } from '@/lib/cn';

const SCRIPT_ID = 'enviagora-hsforms-embed';

function embedScriptSrc(portalId: string, region: string) {
  const host = region === 'na1' ? 'js.hsforms.net' : `js-${region}.hsforms.net`;
  return `https://${host}/forms/embed/${portalId}.js`;
}

type HubSpotFormProps = {
  className?: string;
};

/**
 * Formulário oficial do HubSpot (o mesmo do site atual), para que os leads
 * continuem caindo no CRM com as mesmas notificações e workflows.
 *
 * Usa o embed novo (`hs-form-frame`): o script observa o DOM e renderiza
 * qualquer frame que apareça — inclusive depois de o React remontar a seção.
 * O script só é injetado quando o formulário chega perto da tela, para não
 * pesar o carregamento inicial da home.
 */
export function HubSpotForm({ className }: HubSpotFormProps) {
  const { portalId, formId, region } = getSiteConfig().hubspot;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.getElementById(SCRIPT_ID)) return;

    const inject = () => {
      if (document.getElementById(SCRIPT_ID)) return;
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = embedScriptSrc(portalId, region);
      s.defer = true;
      document.body.appendChild(s);
    };

    if (!('IntersectionObserver' in window)) {
      inject();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          inject();
          io.disconnect();
        }
      },
      { rootMargin: '1200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [portalId, region]);

  return (
    <div
      ref={ref}
      className={cn('hs-form-frame', className)}
      data-region={region}
      data-form-id={formId}
      data-portal-id={portalId}
    />
  );
}
