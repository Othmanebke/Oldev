import Preloader from "@/components/Preloader";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/WorkSection";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import StackSection from "@/components/StackSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import Grain from "@/components/fx/Grain";
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
        {/* Dark sections share one grain + vignette backdrop; Parcours sits on its own light band */}
        <div className="relative bg-[#050505]">
          <Grain />
          <ServicesSection />
          <WorkSection />
          <AboutSection />
          <StackSection />
        </div>
        <ExperienceSection />
        <Footer />
      </main>
    </>
  );
}
