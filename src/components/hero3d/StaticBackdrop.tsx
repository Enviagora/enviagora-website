import posterDesktop1000 from '@/assets/hero/poster-desktop-1000.webp';
import posterDesktop1600 from '@/assets/hero/poster-desktop-1600.webp';
import posterMobile from '@/assets/hero/poster-mobile-780.webp';

/**
 * Fundo do hero antes (e no lugar) da cena 3D: um quadro renderizado da
 * própria cena. Vem no HTML pré-renderizado → aparece junto com o texto, e o
 * 3D ao vivo entra por cima com fade quando estiver pronto. Também é o
 * fallback sem WebGL.
 */
export function StaticBackdrop() {
  return (
    <picture className="absolute inset-0 block bg-ea-petroleo" aria-hidden>
      <source media="(max-width: 767px)" srcSet={posterMobile} />
      <source srcSet={`${posterDesktop1000} 1000w, ${posterDesktop1600} 1600w`} sizes="100vw" />
      <img
        src={posterDesktop1600}
        alt=""
        width={1600}
        height={969}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </picture>
  );
}
