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
import { homeJsonLd } from "@/lib/jsonLd";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "<") }}
      />
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
