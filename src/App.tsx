import { TopBanner } from '@/components/layout/TopBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';

import { Hero } from '@/sections/Hero';
import { SocialProof } from '@/sections/SocialProof';
import { OperationalPulse } from '@/sections/OperationalPulse';
import { TikTokShop } from '@/sections/TikTokShop';
import { Niches } from '@/sections/Niches';
import { Process } from '@/sections/Process';
import { LogAlliance } from '@/sections/LogAlliance';
import { Benefits } from '@/sections/Benefits';
import { Stats } from '@/sections/Stats';
import { RealTime } from '@/sections/RealTime';
import { Integrations } from '@/sections/Integrations';
import { HowFulfillment } from '@/sections/HowFulfillment';
import { Solution } from '@/sections/Solution';
import { ContactForm } from '@/sections/ContactForm';
import { Faq } from '@/sections/Faq';

export default function App() {
  return (
    <>
      {/* Skip link — acessibilidade por teclado */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ea-sm focus:bg-ea-petroleo focus:px-4 focus:py-2 focus:text-ea-cremewm"
      >
        Pular para o conteúdo
      </a>

      <ScrollProgress />
      <TopBanner />
      <Header />

      <main id="conteudo">
        <Hero />
        <SocialProof />
        <OperationalPulse />
        <TikTokShop />
        <Niches />
        <Process />
        <LogAlliance />
        <Benefits />
        <Stats />
        <RealTime />
        <Integrations />
        <HowFulfillment />
        <Solution />
        <ContactForm />
        <Faq />
      </main>

      <Footer />
    </>
  );
}
