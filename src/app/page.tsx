import Preloader from "@/components/Preloader";
import StackEffect from "@/components/fx/StackEffect";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/WorkSection";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import { homeJsonLd } from "@/lib/jsonLd";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "\\u003c") }}
      />
      <Preloader />
      <StackEffect />
      <main className="flex min-h-screen flex-col bg-abcs-bg" style={{ overflowX: "clip" }}>
        <HeroSection />
        <WorkSection />
        <ServicesSection />
        <AboutSection />
        <ExperienceSection />
        <Footer />
      </main>
    </>
  );
}
