import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/fx/SectionHeader";
import StackEffect from "@/components/fx/StackEffect";
import ContactCta from "@/components/seo/ContactCta";
import JsonLd from "@/components/seo/JsonLd";
import OfferCards from "@/components/seo/OfferCards";
import ProjectShowcase from "@/components/seo/ProjectShowcase";
import SeoHero from "@/components/seo/SeoHero";
import StackCard from "@/components/seo/StackCard";
import { breadcrumbJsonLd } from "@/lib/jsonLd";
import { PROJECT_FILTERS, projectsForTag, type ProjectTag } from "@/lib/projects";
import { SERVICE_PAGES } from "@/lib/seoPages";
import { priceRange } from "@/lib/services";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Réalisations : sites vitrines, WordPress et Next.js";
const DESCRIPTION =
  "Portfolio d’Othmane Bouakline, développeur web freelance : sites vitrines, sites WordPress et WooCommerce, applications Next.js / React pour des entreprises, commerces et indépendants.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/realisations" },
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME, url: "/realisations", title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION },
};

export default function RealisationsPage() {
  // Same order as the home tabs: React / Next.js, WordPress, HTML
  const projects = PROJECT_FILTERS.filter((f) => f.tag !== "all").flatMap((f) => projectsForTag(f.tag as ProjectTag));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Réalisations", path: "/realisations" }])} />
      <StackEffect />
      <main className="flex flex-col bg-abcs-bg" style={{ overflowX: "clip" }}>
        <SeoHero
          crumbs={[{ name: "Réalisations" }]}
          label="Portfolio"
          title="Mes réalisations"
          intro={[
            "Sites vitrines, sites corporate WordPress, boutiques en ligne et applications web en Next.js / React : une sélection de projets clients et personnels.",
            "Cliquez sur un projet pour parcourir le site en entier. Les projets « Concept » sont des créations personnelles.",
          ]}
          stats={[
            { v: String(projects.length), l: "projets présentés" },
            { v: "3", l: "technologies" },
            { v: "5 ans", l: "d’expérience" },
          ]}
          ctaLabel="Parlons de votre projet"
        />

        <StackCard tone="dark" z={2} watermark="Travaux · Projets · Travaux · Projets ·" watermark2="Next.js · WordPress · React · HTML ·">
          <SectionHeader tone="dark" label="01 · Portfolio" title="Tous les projets" intro="Filtrez par technologie, puis cliquez pour voir le site en entier." />
          <ProjectShowcase projects={projects} filters tone="dark" />
        </StackCard>

        <StackCard tone="bg" z={3} watermark="Votre site · Prochain · Votre site ·">
          <SectionHeader tone="light" label="02 · Et vous ?" title="Le prochain, c’est le vôtre" intro="Choisissez la formule qui vous correspond, ou parlons-en directement." />
          <OfferCards
            tone="light"
            items={SERVICE_PAGES.map((o) => ({ href: `/services/${o.slug}`, eyebrow: priceRange(o.key), title: o.h1, text: o.intro[0] }))}
          />
          <div className="self-center">
            <ContactCta label="Démarrer mon projet" />
          </div>
        </StackCard>

        <Footer />
      </main>
    </>
  );
}
