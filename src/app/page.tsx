import Preloader from "@/components/Preloader";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/WorkSection";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import ScrollFx from "@/components/fx/ScrollFx";
import { homeJsonLd } from "@/lib/jsonLd";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "\u003c") }}
      />
      <Preloader />
      <main className="flex min-h-screen flex-col bg-[#050505]" style={{ overflowX: "clip" }}>
        <HeroSection />
        <ServicesSection />
        <WorkSection />
        <AboutSection />
        <ExperienceSection />
        <Footer />
      </main>
      <ScrollFx />
    </>
  );
}
