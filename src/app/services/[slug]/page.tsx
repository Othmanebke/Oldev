import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/fx/FaqAccordion";
import Reveal from "@/components/fx/Reveal";
import SectionHeader from "@/components/fx/SectionHeader";
import StackEffect from "@/components/fx/StackEffect";
import JsonLd from "@/components/seo/JsonLd";
import OfferCards from "@/components/seo/OfferCards";
import PlanSpotlight from "@/components/seo/PlanSpotlight";
import ProjectShowcase from "@/components/seo/ProjectShowcase";
import SeoHero, { type HeroIcon } from "@/components/seo/SeoHero";
import StackCard from "@/components/seo/StackCard";
import Steps from "@/components/seo/Steps";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonLd";
import { projectsForTag } from "@/lib/projects";
import { getServicePage, SERVICE_PAGES } from "@/lib/seoPages";
import { FAQ, PLANS, SERVICES, type ServiceKey } from "@/lib/services";
import { SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

const HERO_ICONS: Partial<Record<ServiceKey, HeroIcon[]>> = {
  vitrine: ["html", "maps", "css", "js", "figma", "vercel"],
  webapp: ["next", "react", "ts", "tailwind", "node", "vercel"],
  wordpress: ["wordpress", "woo", "elementor", "figma", "maps", "css"],
};

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const page = getServicePage((await params).slug);
  if (!page) return {};
  const path = `/services/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME, url: path, title: `${page.metaTitle} | ${SITE_NAME}`, description: page.metaDescription },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const page = getServicePage((await params).slug);
  if (!page) notFound();

  const plan = PLANS.find((p) => p.key === page.key)!;
  const path = `/services/${page.slug}`;

  return (
    <>
      <JsonLd data={serviceJsonLd({ key: page.key, name: page.h1, description: page.metaDescription, path })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Services", path: "/#services" }, { name: page.name, path }])} />
      <StackEffect />
      <main className="flex flex-col bg-abcs-bg" style={{ overflowX: "clip" }}>
        <SeoHero
          crumbs={[{ name: "Services", href: "/#services" }, { name: page.name }]}
          label={`${plan.for} · ${SERVICES[page.key].price.toLowerCase()}`}
          title={page.h1}
          intro={page.intro}
          stats={[
            { v: SERVICES[page.key].price.replace(/^dès\s*/i, ""), l: "prix de départ" },
            { v: plan.delay, l: "de délai" },
            { v: plan.revisions, l: "de révisions" },
          ]}
          icons={HERO_ICONS[page.key] ?? []}
          service={page.key}
          secondary={{ href: "/realisations", label: "Voir mes réalisations" }}
        />

        <StackCard tone="dark" z={2} watermark="Pour qui · Pour vous · Pour qui · Pour vous ·" watermark2={`${page.name} · ${page.name} · ${page.name} ·`}>
          <SectionHeader tone="dark" label="01 · Pour qui ?" title="Pensé pour vous" intro={page.intro[0]} />
          <Reveal className="grid gap-5 md:grid-cols-3">
            {page.audience.map((a, i) => (
              <article
                key={a.title}
                data-reveal
                style={{ "--i": i } as CSSProperties}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-[28px] border border-white/10 bg-abcs-surface p-7 transition-[border-color,translate] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-abcs-red/60 md:p-8"
              >
                <span
                  aria-hidden
                  className="font-heading text-[88px] leading-[0.8] text-transparent transition-colors duration-500 group-hover:text-abcs-red/15"
                  style={{ WebkitTextStroke: "1.5px rgba(255,59,0,0.6)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 text-[21px] font-extrabold uppercase leading-tight">{a.title}</h3>
                <p className="m-0 text-[16px] leading-[1.6] text-white/70">{a.text}</p>
              </article>
            ))}
          </Reveal>
        </StackCard>

        <StackCard tone="light" z={3} dots watermark="Tarif · Inclus · Tarif · Inclus · Tarif ·" watermark2="Transparent · Sans surprise · Transparent ·">
          <SectionHeader tone="light" label="02 · Tarif transparent" title="Ce qui est inclus" intro="Un prix de départ, un délai et ce qui est inclus. Pas de surprise sur la facture." />
          <PlanSpotlight service={page.key} />
        </StackCard>

        <StackCard tone="dark" z={4} watermark="Méthode · Étapes · Méthode · Étapes ·" watermark2="Appel · Devis · Design · Code · En ligne ·">
          <SectionHeader tone="dark" label="03 · Méthode" title="Comment ça se passe" intro="Cinq étapes claires, de notre premier appel à la mise en ligne de votre site." />
          <Steps />
        </StackCard>

        <StackCard tone="bg" z={5} watermark="Réalisations · Projets · Réalisations ·" watermark2="Cliquez · Explorez · Cliquez · Explorez ·">
          <SectionHeader tone="light" label="04 · Exemples" title="Réalisations" intro="Cliquez sur un projet pour parcourir le site en entier." />
          <ProjectShowcase projects={projectsForTag(page.tag).slice(0, 6)} />
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
            <FaqAccordion items={[...page.faq, ...FAQ]} />
          </div>
        </StackCard>

        <StackCard tone="bg" z={7} watermark="Offres · Services · Offres · Services ·">
          <SectionHeader tone="light" label="Aussi disponible" title="Mes autres offres" />
          <OfferCards
            tone="light"
            items={[
              ...SERVICE_PAGES.filter((p) => p.slug !== page.slug).map((o) => ({
                href: `/services/${o.slug}`,
                eyebrow: SERVICES[o.key].price,
                title: o.h1,
                text: o.intro[0],
              })),
              {
                href: "/creation-site-internet-seine-et-marne",
                eyebrow: "Seine-et-Marne · 77",
                title: "Création de site internet en Seine-et-Marne",
                text: "Un développeur web freelance basé à Brie-Comte-Robert, pour les entreprises du 77 et d’Île-de-France.",
              },
            ]}
          />
        </StackCard>

        <Footer />
      </main>
    </>
  );
}
