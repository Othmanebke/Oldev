import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/fx/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import ProjectGrid from "@/components/seo/ProjectGrid";
import Footer from "@/components/Footer";
import SeoHeader from "@/components/seo/SeoHeader";
import SeoHero from "@/components/seo/SeoHero";
import Steps from "@/components/seo/Steps";
import { display, H2, Section } from "@/components/seo/ui";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/jsonLd";
import { PROJECTS } from "@/lib/projects";
import { LOCAL_FAQ, LOCAL_TOWNS, SERVICE_PAGES } from "@/lib/seoPages";
import { priceRange } from "@/lib/services";

const PATH = "/creation-site-internet-seine-et-marne";
const TITLE = "Développeur web freelance en Seine-et-Marne (77)";
const DESCRIPTION =
  "Développeur web en Seine-et-Marne, basé à Brie-Comte-Robert. Sites vitrines, WordPress et Next.js pour artisans, commerces et PME. Devis gratuit sous 24 h.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

/** Client work from each stack. */
const SHOWCASE = ["cfi", "elior", "idemia", "tennis-bry", "papillon-dor", "brows"];

export default function LocalPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Seine-et-Marne", path: PATH }])} />
      <SeoHeader />
      <main className="flex flex-col bg-black text-[#f4f4f2]">
        <SeoHero
          crumbs={[{ name: "Seine-et-Marne" }]}
          title="Développeur web freelance en Seine-et-Marne"
          intro={[
            "Je suis Othmane Bouakline, développeur web freelance basé à Brie-Comte-Robert. J’accompagne les artisans, commerçants, indépendants et PME de Seine-et-Marne, de l’idée à la mise en ligne.",
            "5 ans d’expérience (Inetum, Fujitsu, AJC), un Bac+5 en informatique web, un interlocuteur unique et un devis gratuit en 24 h.",
          ]}
          stats={[
            { v: priceRange("vitrine"), l: "le site vitrine" },
            { v: "24 h", l: "pour votre devis gratuit" },
            { v: "5 ans", l: "d’expérience" },
          ]}
          ctaLabel="Demander un devis gratuit"
          secondary={{ href: "/realisations", label: "Voir mes réalisations" }}
        />

        <Section num="01" label="Offres">
          <H2>Quel site pour vous ?</H2>
          <ul className="m-0 flex list-none flex-col p-0">
            {SERVICE_PAGES.map((s) => (
              <li key={s.slug} className="border-t border-white/10 last:border-b">
                <Link
                  href={`/services/${s.slug}`}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-6 transition-[translate,color] duration-300 ease-out-expo hover:translate-x-3 hover:text-abcs-red min-[760px]:grid-cols-[minmax(0,1fr)_auto_auto]"
                >
                  <span className="text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1.05]" style={{ ...display, fontWeight: 700, letterSpacing: "-.02em" }}>
                    {s.h1}
                  </span>
                  <span className="col-start-1 row-start-2 text-[15px] text-[#a0a0a0] min-[760px]:col-start-2 min-[760px]:row-start-1">{priceRange(s.key)}</span>
                  <span aria-hidden className="row-span-2 text-[22px] text-abcs-red min-[760px]:row-span-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section num="02" label="Proximité" dark>
          <H2>Près de chez vous</H2>
          <p className="m-0 max-w-[640px] text-[17px] leading-[1.6] text-[#c8c8c8] text-pretty">
            Basé à Brie-Comte-Robert, je travaille avec les entreprises de toute la Seine-et-Marne et du sud-est de l’Île-de-France, et avec des clients partout en
            France. Tout peut se faire à distance, par téléphone ou en visio.
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Villes desservies">
            {LOCAL_TOWNS.map((t) => (
              <li key={t} className="rounded-full border border-white/15 bg-white/[.03] px-3.5 py-1.5 text-[14px] text-[#e6e6e6]">
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section num="03" label="Méthode">
          <H2>De l’appel à la mise en ligne</H2>
          <Steps />
        </Section>

        <Section num="04" label="Réalisations">
          <ProjectGrid title="Quelques réalisations" projects={PROJECTS.filter((p) => SHOWCASE.includes(p.id))} link={{ href: "/realisations", label: "Toutes les réalisations" }} />
        </Section>

        <Section num="05" label="FAQ">
          <H2>Questions fréquentes</H2>
          <FaqAccordion items={LOCAL_FAQ} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
