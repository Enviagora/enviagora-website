import { socialProof } from '@/content/content';
import { Arrow } from '@/components/brand/Arrow';
import { Marquee } from '@/components/ui/Marquee';

export function SocialProof() {
  return (
    <section className="border-y border-ea-petroleo/10 bg-ea-creme py-10 sm:py-12" aria-labelledby="social-proof-title">
      <div className="ea-container-wide grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
        <h2 id="social-proof-title" className="flex items-center gap-2.5 font-sans text-sm font-normal text-ea-soft lg:max-w-[16rem]">
          <Arrow className="h-4 w-4 shrink-0 text-ea-neon" />
          <span>
            {socialProof.title} <span className="font-semibold text-ea-petroleo">{socialProof.titleBrand}</span>
          </span>
        </h2>

        <Marquee
          duration={30}
          items={socialProof.brands.map((brand) => (
            <span className="select-none whitespace-nowrap font-sans text-lg font-semibold uppercase tracking-[0.12em] text-ea-petroleo/60 transition-colors duration-300 hover:text-ea-petroleo">
              {brand}
            </span>
          ))}
          itemClassName="px-8"
        />
      </div>
    </section>
  );
}
