import { HeroSection } from "@/components/landing/hero-section";
import { TrustedBySection } from "@/components/landing/trusted-by-section";
import { SearchSection } from "@/components/landing/search-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TopicsSection } from "@/components/landing/topics-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <SearchSection />
      <StatsSection />
      <FeaturesSection />
      <TopicsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
