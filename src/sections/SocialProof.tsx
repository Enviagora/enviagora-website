import { socialProof } from '@/content/content';
import { clientLogo } from '@/content/clientLogos';
import { Arrow } from '@/components/brand/Arrow';
import { Marquee } from '@/components/ui/Marquee';

function ClientLogo({ name, slug }: { name: string; slug: string }) {
  const logo = clientLogo(slug);
  const mask = `url("${logo.src}") center / contain no-repeat`;
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className="block bg-ea-petroleo opacity-55 transition-opacity duration-300 hover:opacity-100"
      style={{ width: logo.width, height: logo.height, WebkitMask: mask, mask }}
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

        <Marquee
          duration={30}
          items={socialProof.brands.map((b) => (
            <ClientLogo key={b.logo} name={b.name} slug={b.logo} />
          ))}
          itemClassName="px-8 sm:px-10"
        />
      </div>
    </section>
  );
}
