import { socialProof } from '@/content/content';
import { clientLogo } from '@/content/clientLogos';
import { Arrow } from '@/components/brand/Arrow';
import { Marquee } from '@/components/ui/Marquee';

// Logos menores no celular (--logo-scale) para caberem ~3 por vez na tela.
function ClientLogo({ name, slug }: { name: string; slug: string }) {
  const logo = clientLogo(slug);
  const mask = `url("${logo.src}") center / contain no-repeat`;
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className="block bg-ea-petroleo opacity-55 transition-opacity duration-300 [--logo-scale:0.74] sm:[--logo-scale:1] [@media(hover:hover)]:hover:opacity-100"
      style={{
        width: `calc(${logo.width}px * var(--logo-scale))`,
        height: `calc(${logo.height}px * var(--logo-scale))`,
        WebkitMask: mask,
        mask,
      }}
    />
  );
}

export function SocialProof() {
  return (
    <section className="border-y border-ea-petroleo/10 bg-ea-creme py-10 sm:py-12">
      <div className="ea-container-wide grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
        <p className="ea-kicker flex items-center gap-2.5 leading-relaxed text-ea-petroleo lg:max-w-[15rem]">
          <Arrow className="h-3.5 w-3.5 shrink-0 text-ea-petroleo" />
          <span>
            {socialProof.title} {socialProof.titleBrand}
          </span>
        </p>

        {/* Uma volta mais curta no celular (logos menores e mais juntos) → um pouco mais rápido. */}
        <Marquee
          duration={socialProof.brands.length * 4.5}
          className="[--marquee-duration:36s] sm:[--marquee-duration:72s]"
          items={socialProof.brands.map((b) => (
            <ClientLogo key={b.logo} name={b.name} slug={b.logo} />
          ))}
          itemClassName="px-5 sm:px-10"
        />
      </div>
    </section>
  );
}
