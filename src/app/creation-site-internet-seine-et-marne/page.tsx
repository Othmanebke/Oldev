import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import ContactCta from "@/components/seo/ContactCta";
import { FaqList, JsonLd, PageHero, ProjectGrid, Section, SeoMain } from "@/components/seo/SeoBlocks";
import { breadcrumbJsonLd } from "@/lib/jsonLd";
import { PROJECTS } from "@/lib/projects";
import { LOCAL_FAQ, LOCAL_TOWNS, SERVICE_PAGES, STEPS } from "@/lib/seoPages";
import { SERVICES } from "@/lib/services";
import { SITE_NAME } from "@/lib/site";

const PATH = "/creation-site-internet-seine-et-marne";
const TITLE = "Création de site internet en Seine-et-Marne (77)";
const DESCRIPTION =
  "Développeur web freelance à Brie-Comte-Robert : création de sites vitrines, WordPress et sur-mesure pour les entreprises de Seine-et-Marne et d’Île-de-France. Devis gratuit, dès 300 €.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME, url: PATH, title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION },
};

/** A mix of client work from each stack. */
const SHOWCASE = ["cfi", "tennis-bry", "parfumerie"];

export default function LocalPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Seine-et-Marne", path: PATH }])} />
      <SeoMain>
        <PageHero
          crumbs={[{ name: "Seine-et-Marne" }]}
          label="Brie-Comte-Robert · Seine-et-Marne · Île-de-France"
          title="Création de site internet en Seine-et-Marne"
          intro={[
            "Je suis Othmane Bouakline, développeur web freelance basé à Brie-Comte-Robert. J’accompagne les artisans, commerçants, indépendants et PME de Seine-et-Marne dans la création de leur site internet, de l’idée à la mise en ligne.",
            "Avec 5 ans d’expérience en développement web (Inetum, Fujitsu, AJC) et un Bac+5 en informatique web, je vous propose un interlocuteur unique, des tarifs transparents et une réponse sous 48 h.",
          ]}
        >
          <div className="pt-2"><ContactCta label="Demander un devis gratuit" /></div>
        </PageHero>

        <Section label="Offres" title="Quel site pour votre entreprise ?">
          <div className="grid gap-5 md:grid-cols-3">
            {SERVICE_PAGES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group flex flex-col gap-3 rounded-[24px] bg-white p-7 transition-colors hover:bg-abcs-black hover:text-white">
                <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-abcs-red-text group-hover:text-abcs-red">{SERVICES[s.key].price}</span>
                <h3 className="m-0 text-[21px] font-bold">{s.h1}</h3>
                <p className="m-0 text-[15px] leading-[1.55] opacity-75">{s.intro[0]}</p>
                <span className="mt-auto pt-2 text-[13px] font-bold uppercase tracking-[0.14em]">En savoir plus →</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section label="Proximité" title="Un développeur web près de chez vous">
          <div className="flex flex-col gap-6 text-[17px] leading-[1.6] text-abcs-black/75">
            <p className="m-0 max-w-[760px]">
              Basé à Brie-Comte-Robert, je travaille avec des entreprises de toute la Seine-et-Marne et du sud-est de l’Île-de-France,
              ainsi qu’avec des clients partout en France. Tout le projet peut se faire à distance, par téléphone ou en visio.
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {LOCAL_TOWNS.map((t) => (
                <li key={t} className="rounded-full bg-white px-4 py-2 text-[14px] font-bold text-abcs-black">{t}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section label="Méthode" title="De l’appel à la mise en ligne">
          <ol className="m-0 grid list-none gap-5 p-0 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2 rounded-[24px] bg-white p-6">
                <span className="font-heading text-[28px] text-abcs-red">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-0 text-[17px] font-bold">{s.title}</h3>
                <p className="m-0 text-[15px] leading-[1.55] text-abcs-black/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section label="Exemples" title="Quelques réalisations">
          <ProjectGrid projects={PROJECTS.filter((p) => SHOWCASE.includes(p.id))} />
          <Link href="/realisations" className="self-start text-[14px] font-bold uppercase tracking-[0.14em] text-abcs-red-text underline-offset-4 hover:underline">
            Toutes les réalisations →
          </Link>
        </Section>

        <Section label="FAQ" title="Questions fréquentes">
          <FaqList items={LOCAL_FAQ} />
        </Section>
      </SeoMain>
      <Footer />
    </>
  );
}
