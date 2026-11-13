import Preloader from "@/components/Preloader";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/WorkSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { ServicesSection } from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import { AboutSection } from "@/components/AboutSection";
import Footer from "@/components/Footer";
import ScrollFx from "@/components/fx/ScrollFx";
import JsonLd from "@/components/seo/JsonLd";
import { faqJsonLd, homeJsonLd } from "@/lib/jsonLd";
import { FAQ } from "@/lib/services";

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Preloader />
      <main className="flex min-h-screen flex-col bg-black" style={{ overflowX: "clip" }}>
        <HeroSection />
        <WorkSection />
        <HowItWorksSection />
        <ServicesSection />
        <TestimonialsSection />
        <FaqSection />
        <AboutSection />
        <Footer />
      </main>
      <ScrollFx />
    </>
  );
}
