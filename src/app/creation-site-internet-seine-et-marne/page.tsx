import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/fx/FaqAccordion";
import SectionHeader from "@/components/fx/SectionHeader";
import StackEffect from "@/components/fx/StackEffect";
import JsonLd from "@/components/seo/JsonLd";
import OfferCards from "@/components/seo/OfferCards";
import ProjectShowcase from "@/components/seo/ProjectShowcase";
import SeoHero from "@/components/seo/SeoHero";
import StackCard from "@/components/seo/StackCard";
import Steps from "@/components/seo/Steps";
import TownsRadar from "@/components/seo/TownsRadar";
import { breadcrumbJsonLd } from "@/lib/jsonLd";
import { PROJECTS } from "@/lib/projects";
import { LOCAL_FAQ, SERVICE_PAGES } from "@/lib/seoPages";
import { priceRange } from "@/lib/services";
import { SITE_NAME } from "@/lib/site";

const PATH = "/creation-site-internet-seine-et-marne";
const TITLE = "Création de site internet en Seine-et-Marne (77)";
const DESCRIPTION =
  "Développeur web freelance à Brie-Comte-Robert : création de sites vitrines, WordPress et sur-mesure pour les entreprises de Seine-et-Marne et d’Île-de-France. Devis gratuit, site vitrine de 300 à 600 €.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME, url: PATH, title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION },
};

/** Client work from each stack. */
const SHOWCASE = ["cfi", "elior", "idemia", "tennis-bry", "papillon-dor", "parfumerie"];

export default function LocalPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Seine-et-Marne", path: PATH }])} />
      <StackEffect />
      <main className="flex flex-col bg-abcs-bg" style={{ overflowX: "clip" }}>
        <SeoHero
          crumbs={[{ name: "Seine-et-Marne" }]}
          label="Brie-Comte-Robert · Seine-et-Marne (77)"
          title="Création de site internet en Seine-et-Marne"
          intro={[
            "Je suis Othmane Bouakline, développeur web freelance basé à Brie-Comte-Robert. J’accompagne les artisans, commerçants, indépendants et PME de Seine-et-Marne, de l’idée à la mise en ligne.",
            "5 ans d’expérience (Inetum, Fujitsu, AJC), un Bac+5 en informatique web, un interlocuteur unique et une réponse sous 48 h.",
          ]}
          stats={[
            { v: "300 – 600€", l: "le site vitrine" },
            { v: "48 h", l: "délai de réponse max" },
            { v: "5 ans", l: "d’expérience" },
          ]}
          icons={["maps", "wordpress", "next", "html", "react", "figma"]}
          ctaLabel="Demander un devis gratuit"
          secondary={{ href: "/realisations", label: "Voir mes réalisations" }}
        />

        <StackCard tone="dark" z={2} watermark="Offres · Sites · Offres · Sites · Offres ·" watermark2="Vitrine · Sur-mesure · WordPress ·">
          <SectionHeader tone="dark" label="01 · Offres" title="Quel site pour vous ?" intro="Trois formules claires, avec une fourchette de prix selon les options et un délai annoncés dès le départ." />
          <OfferCards
            items={SERVICE_PAGES.map((s) => ({ href: `/services/${s.slug}`, eyebrow: priceRange(s.key), title: s.h1, text: s.intro[0] }))}
          />
        </StackCard>

        <StackCard tone="light" z={3} watermark="Seine-et-Marne · 77 · Île-de-France ·" watermark2="Près de chez vous · Près de chez vous ·">
          <SectionHeader
            tone="light"
            label="02 · Proximité"
            title="Près de chez vous"
            intro="Basé à Brie-Comte-Robert, je travaille avec les entreprises de toute la Seine-et-Marne et du sud-est de l’Île-de-France, et avec des clients partout en France. Tout peut se faire à distance, par téléphone ou en visio."
          />
          <TownsRadar />
        </StackCard>

        <StackCard tone="dark" z={4} watermark="Méthode · Étapes · Méthode · Étapes ·" watermark2="Appel · Devis · Design · Code · En ligne ·">
          <SectionHeader tone="dark" label="03 · Méthode" title="De l’appel à la mise en ligne" intro="Cinq étapes claires, sans jargon, avec un prix fixé dès le devis." />
          <Steps />
        </StackCard>

        <StackCard tone="bg" z={5} watermark="Réalisations · Projets · Réalisations ·" watermark2="Cliquez · Explorez · Cliquez · Explorez ·">
          <SectionHeader tone="light" label="04 · Exemples" title="Quelques réalisations" intro="Cliquez sur un projet pour parcourir le site en entier." />
          <ProjectShowcase projects={PROJECTS.filter((p) => SHOWCASE.includes(p.id))} />
          <Link
            href="/realisations"
            className="self-center inline-flex items-center gap-2 rounded-full border border-abcs-black/25 px-[26px] py-[16px] text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-abcs-red hover:text-abcs-red-text"
          >
            Toutes les réalisations →
          </Link>
        </StackCard>

        <StackCard tone="light" z={6} watermark="FAQ · Questions · FAQ · Questions ·">
          <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: "clamp(24px,4vw,56px)" }}>
            <SectionHeader
              tone="light"
              label="05 · FAQ"
              title="Questions fréquentes"
              titleSize="clamp(2.4rem,6vw,5rem)"
              intro="Une autre question ? Réponse sous 48 h maximum."
              className="md:items-start md:text-left"
            />
            <FaqAccordion items={LOCAL_FAQ} />
          </div>
        </StackCard>

        <Footer />
      </main>
    </>
  );
}
