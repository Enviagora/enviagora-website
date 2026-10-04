import { TopBanner } from '@/components/layout/TopBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { MobileCtaBar } from '@/components/conversion/MobileCtaBar';
import { useConversionTracking } from '@/hooks/useConversionTracking';

import { Hero } from '@/sections/Hero';
import { SocialProof } from '@/sections/SocialProof';
import { TikTokShop } from '@/sections/TikTokShop';
import { Niches } from '@/sections/Niches';
import { Process } from '@/sections/Process';
import { LogAlliance } from '@/sections/LogAlliance';
import { RealTime } from '@/sections/RealTime';
import { Integrations } from '@/sections/Integrations';
import { Cases } from '@/sections/Cases';
import { ContactForm } from '@/sections/ContactForm';
import { Faq } from '@/sections/Faq';

export default function App() {
  useConversionTracking();

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

      {/* Narrativa: promessa + prova → para quem → como funciona → economia →
          controle → integrações → resultados → contato → objeções. */}
      <main id="conteudo">
        <Hero />
        <SocialProof />
        <TikTokShop />
        <Niches />
        <Process />
        <LogAlliance />
        <RealTime />
        <Integrations />
        <Cases />
        <ContactForm />
        <Faq />
      </main>

      <Footer />
      <MobileCtaBar />
    </>
  );
}
