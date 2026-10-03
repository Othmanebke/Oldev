import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/seo/ContactCta";
import { FaqList, JsonLd, PageHero, ProjectGrid, Section, SeoMain } from "@/components/seo/SeoBlocks";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonLd";
import { projectsForTag } from "@/lib/projects";
import { getServicePage, SERVICE_PAGES, STEPS } from "@/lib/seoPages";
import { FAQ, PLANS, SERVICES } from "@/lib/services";
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
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <>
      <JsonLd data={serviceJsonLd({ key: page.key, name: page.h1, description: page.metaDescription, path })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Services", path: "/#services" }, { name: page.name, path }])} />
      <SeoMain>
        <PageHero
          crumbs={[{ name: "Services", href: "/#services" }, { name: page.name }]}
          label={`${SERVICES[page.key].price} · ${plan.delay}`}
          title={page.h1}
          intro={page.intro}
        >
          <div className="flex flex-wrap gap-3 pt-2">
            <ContactCta service={page.key} />
            <Link
              href="/realisations"
              className="inline-flex items-center rounded-full border border-abcs-black/20 px-[26px] py-[16px] text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-abcs-red hover:text-abcs-red-text"
            >
              Voir mes réalisations
            </Link>
          </div>
        </PageHero>

        <Section label="Pour qui ?" title="Une offre pensée pour vous">
          <div className="grid gap-5 md:grid-cols-3">
            {page.audience.map((a) => (
              <div key={a.title} className="flex flex-col gap-3 rounded-[24px] bg-white p-7">
                <h3 className="m-0 text-[19px] font-bold">{a.title}</h3>
                <p className="m-0 text-[16px] leading-[1.6] text-abcs-black/75">{a.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Tarif transparent" title="Ce qui est inclus">
          <div className="grid gap-5 rounded-[28px] bg-abcs-black p-7 text-white md:grid-cols-[1fr_1.4fr] md:p-10">
            <div className="flex flex-col gap-4">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/60">{plan.for}</span>
              <p className="m-0 font-heading text-[56px] uppercase leading-none text-abcs-red">{SERVICES[page.key].price}</p>
              <dl className="m-0 grid grid-cols-2 gap-4 text-[15px]">
                <div><dt className="text-white/55">Délai</dt><dd className="m-0 font-bold">{plan.delay}</dd></div>
                <div><dt className="text-white/55">Révisions</dt><dd className="m-0 font-bold">{plan.revisions}</dd></div>
              </dl>
            </div>
            <div className="flex flex-col gap-4">
              <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[17px]">
                {plan.included.map((i) => (
                  <li key={i} className="flex gap-3"><span aria-hidden className="text-abcs-red">✓</span>{i}</li>
                ))}
                {plan.excluded.map((i) => (
                  <li key={i} className="flex gap-3 text-white/55"><span aria-hidden>–</span>Non inclus : {i}</li>
                ))}
              </ul>
              <div className="pt-2"><ContactCta service={page.key} label="Choisir cette offre" tone="light" /></div>
            </div>
          </div>
        </Section>

        <Section label="Méthode" title="Comment ça se passe">
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

        <Section label="Exemples" title="Réalisations">
          <ProjectGrid projects={projectsForTag(page.tag).slice(0, 6)} />
          <Link href="/realisations" className="self-start text-[14px] font-bold uppercase tracking-[0.14em] text-abcs-red-text underline-offset-4 hover:underline">
            Toutes les réalisations →
          </Link>
        </Section>

        <Section label="FAQ" title="Questions fréquentes">
          <FaqList items={[...page.faq, ...FAQ]} />
        </Section>

        <Section label="Aussi disponible" title="Mes autres offres">
          <div className="grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className="group flex flex-col gap-2 rounded-[24px] bg-white p-7 transition-colors hover:bg-abcs-black hover:text-white">
                <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-abcs-red-text group-hover:text-abcs-red">{SERVICES[o.key].price}</span>
                <span className="text-[20px] font-bold">{o.h1} →</span>
              </Link>
            ))}
            <Link href="/creation-site-internet-seine-et-marne" className="group flex flex-col gap-2 rounded-[24px] bg-white p-7 transition-colors hover:bg-abcs-black hover:text-white">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-abcs-red-text group-hover:text-abcs-red">Île-de-France</span>
              <span className="text-[20px] font-bold">Création de site internet en Seine-et-Marne →</span>
            </Link>
          </div>
        </Section>
      </SeoMain>
      <Footer />
    </>
  );
}
