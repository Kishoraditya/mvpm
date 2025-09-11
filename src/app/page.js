import Header from '@/components/layout/Header'
import BetaBadge from '@/components/layout/BetaBadge'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import GamesSection from '@/components/sections/GamesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import FAQSection from '@/components/sections/FAQSection'
import ComingSoonSection from '@/components/sections/ComingSoonSection'
import SignupSection from '@/components/sections/SignupSection'
import appConfig from '@/lib/config'

export default function Home() {
  return (
    <>
      <Header />
      <BetaBadge />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <HeroSection />
        <GamesSection />
        <HowItWorksSection />
        {appConfig.getFeatureFlag('ui.faq', true) && <FAQSection />}
        <ComingSoonSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
