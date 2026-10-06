import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import ProjectGrid from "@/components/seo/ProjectGrid";
import SeoContact from "@/components/seo/SeoContact";
import SeoHeader from "@/components/seo/SeoHeader";
import SeoHero from "@/components/seo/SeoHero";
import { Section } from "@/components/seo/ui";
import { breadcrumbJsonLd } from "@/lib/jsonLd";
import { PROJECT_FILTERS, projectsForTag, type ProjectTag } from "@/lib/projects";
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
      <SeoHeader />
      <main className="flex flex-col bg-[#f4f4f2] text-[#111]">
        <SeoHero
          crumbs={[{ name: "Réalisations" }]}
          title="Mes réalisations"
          intro={[
            "Sites vitrines, sites corporate WordPress, boutiques en ligne et applications web en Next.js / React : une sélection de projets clients et personnels.",
            "Cliquez sur un projet pour voir le site défiler en entier. Les projets « Concept » sont des créations personnelles.",
          ]}
          stats={[
            { v: String(projects.length), l: "projets présentés" },
            { v: "3", l: "technologies" },
            { v: "5 ans", l: "d’expérience" },
          ]}
          ctaLabel="Parlons de votre projet"
        />

        <Section num="01" label="Portfolio">
          <ProjectGrid title="Tous les projets" projects={projects} filters />
        </Section>
      </main>
      <SeoContact />
    </>
  );
}
