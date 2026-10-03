import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ContactCta from "@/components/seo/ContactCta";
import { JsonLd, PageHero, ProjectGrid, Section, SeoMain } from "@/components/seo/SeoBlocks";
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

/** Section title per tab — more descriptive than the short tab labels. */
const GROUP_TITLES: Record<ProjectTag, string> = {
  nextjs: "Sites React & Next.js",
  wordpress: "Sites WordPress",
  html: "Sites HTML / CSS",
};

export default function RealisationsPage() {
  const groups = PROJECT_FILTERS.filter((f) => f.tag !== "all") as { tag: ProjectTag; label: string }[];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Réalisations", path: "/realisations" }])} />
      <SeoMain>
        <PageHero
          crumbs={[{ name: "Réalisations" }]}
          label="Portfolio"
          title="Mes réalisations"
          intro={[
            "Une sélection de sites créés pour des clients et de projets personnels : sites vitrines, sites corporate WordPress, boutiques en ligne et applications web en Next.js / React.",
            "Les projets marqués « Concept » sont des créations personnelles réalisées pour explorer un secteur ou une technique.",
          ]}
        >
          <div className="pt-2"><ContactCta label="Parlons de votre projet" /></div>
        </PageHero>

        {groups.map((g) => (
          <Section key={g.tag} title={GROUP_TITLES[g.tag]}>
            <ProjectGrid projects={projectsForTag(g.tag)} />
          </Section>
        ))}
      </SeoMain>
      <Footer />
    </>
  );
}
