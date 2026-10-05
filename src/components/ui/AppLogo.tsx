import { integrationLogos } from '@/content/integrationLogos';
import { TikTokGlyph } from '@/components/brand/TikTokGlyph';
import { cn } from '@/lib/cn';

/**
 * Logo de plataforma/marketplace enquadrado como ícone de aplicativo: miolo
 * centralizado com respiro, na cor de fundo oficial (branco por padrão). O
 * respiro vem do tamanho do miolo (64%), não de padding em %, que seria
 * relativo à largura do pai e sumiria com o logo em caixas pequenas.
 */
export function AppLogo({ slug, className }: { slug: string; className?: string }) {
  const logo = integrationLogos[slug];
  if (!logo) return null;
  return (
    <span
      title={logo.label}
      className={cn('flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-[24%]', className)}
      style={{ backgroundColor: logo.bg ?? '#FFFFFF' }}
    >
      {/* O TikTok usa glyph próprio (nota branca) para aparecer no fundo escuro. */}
      {slug === 'tiktok' ? (
        <TikTokGlyph className="h-[64%] w-[64%]" />
      ) : (
        <img src={logo.file} alt={`Logo ${logo.label}`} loading="lazy" decoding="async" className="h-[64%] w-[64%] object-contain" />
      )}
    </span>
  );
}
