import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqAccordion from "@/components/fx/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import ProjectGrid from "@/components/seo/ProjectGrid";
import SeoContact from "@/components/seo/SeoContact";
import SeoHeader from "@/components/seo/SeoHeader";
import SeoHero from "@/components/seo/SeoHero";
import Steps from "@/components/seo/Steps";
import { display, H2, Section } from "@/components/seo/ui";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonLd";
import { projectsForTag } from "@/lib/projects";
import { getServicePage, SERVICE_PAGES } from "@/lib/seoPages";
import { FAQ, PLANS, priceRange } from "@/lib/services";
import { SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

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
  const others = [
    ...SERVICE_PAGES.filter((p) => p.slug !== page.slug).map((o) => ({ href: `/services/${o.slug}`, eyebrow: priceRange(o.key), title: o.h1 })),
    { href: "/creation-site-internet-seine-et-marne", eyebrow: "Seine-et-Marne · 77", title: "Création de site internet en Seine-et-Marne" },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd({ key: page.key, name: page.h1, description: page.metaDescription, path })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Services", path: "/#services" }, { name: page.name, path }])} />
      <SeoHeader />
      <main className="flex flex-col bg-[#f4f4f2] text-[#111]">
        <SeoHero
          crumbs={[{ name: "Services", href: "/#services" }, { name: page.name }]}
          title={page.h1}
          intro={page.intro}
          stats={[
            { v: priceRange(page.key), l: "selon les options" },
            { v: plan.delay, l: "de délai" },
            { v: plan.revisions, l: "de révisions" },
          ]}
          ctaLabel="Réserver un appel"
          service={page.key}
          secondary={{ href: "/realisations", label: "Voir mes réalisations" }}
        />

        <Section num="01" label="Pour qui">
          <H2>Pensé pour vous</H2>
          <div className="grid gap-8 min-[900px]:grid-cols-3 min-[900px]:gap-6">
            {page.audience.map((a) => (
              <article key={a.title} className="flex flex-col gap-2.5 border-t border-[#111] pt-5">
                <h3 className="m-0 text-[17px] font-semibold leading-[1.4]">{a.title}</h3>
                <p className="m-0 text-[15px] leading-[1.6] text-[#555] text-pretty">{a.text}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section num="02" label="Tarif" dark>
          <h2 className="sr-only">Tarif</h2>
          <div className="grid gap-12 min-[1000px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[1000px]:gap-16">
            <div className="flex flex-col gap-4">
              <p className="m-0 text-[15px] text-[#f4f4f2]/65">De la formule de base à toutes les options</p>
              <p className="m-0 whitespace-nowrap leading-[.95]" style={{ ...display, fontSize: "clamp(3rem,6.4vw,5.6rem)", textWrap: "nowrap" }}>
                {priceRange(page.key)}
              </p>
              <p className="m-0 text-[15px] text-[#f4f4f2]/65">
                {plan.delay} · {plan.revisions} de révisions · prix fixé au devis
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="m-0 text-[13px] font-medium text-[#f4f4f2]/60">Inclus dans la formule de base</h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {plan.included.map((it) => (
                  <li key={it} className="flex gap-3 border-t border-[rgba(244,244,242,.12)] py-3.5 text-[16px] leading-[1.5] last:border-b">
                    <span aria-hidden className="font-bold text-abcs-red">✓</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section num="03" label="Méthode">
          <H2>Comment ça se passe</H2>
          <Steps />
        </Section>

        <Section num="04" label="Exemples">
          <ProjectGrid title="Quelques réalisations" projects={projectsForTag(page.tag).slice(0, 3)} link={{ href: "/realisations", label: "Toutes les réalisations" }} />
        </Section>

        <Section num="05" label="FAQ">
          <H2>Questions fréquentes</H2>
          <FaqAccordion items={[...page.faq, ...FAQ]} />
        </Section>

        <Section label="Autres offres">
          <H2>Mes autres offres</H2>
          <div className="grid gap-4 min-[760px]:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group flex flex-col gap-3 rounded-2xl border border-[rgba(17,17,17,.12)] p-6 transition-colors duration-300 hover:border-[#111]"
              >
                <span className="text-[14px] text-[#666]">{o.eyebrow}</span>
                <span className="text-[20px] leading-[1.15]" style={{ ...display, fontWeight: 700, letterSpacing: "-.02em" }}>{o.title}</span>
                <span aria-hidden className="mt-auto pt-2 text-[18px] text-abcs-red transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      <SeoContact />
    </>
  );
}
