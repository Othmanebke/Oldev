/** Server-rendered building blocks for the SEO pages (services, réalisations, local). */

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import type { Faq } from "@/lib/seoPages";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Visible breadcrumb + page title block. */
export function PageHero({
  crumbs,
  label,
  title,
  intro,
  children,
}: {
  crumbs: { name: string; href?: string }[];
  label: string;
  title: string;
  intro: string[];
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-5 pt-16 md:px-8 md:pt-24">
      <nav aria-label="Fil d’Ariane" className="text-[12px] font-bold uppercase tracking-[0.14em] text-abcs-black/50">
        <ol className="flex flex-wrap gap-2">
          {[{ name: "Accueil", href: "/" }, ...crumbs].map((c, i, all) => (
            <li key={c.name} className="flex gap-2">
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} className="transition-colors hover:text-abcs-red-text">{c.name}</Link>
              ) : (
                <span aria-current="page" className="text-abcs-black/80">{c.name}</span>
              )}
              {i < all.length - 1 && <span aria-hidden>/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <span className="text-[14px] font-bold uppercase tracking-[0.25em] text-abcs-red-text">{label}</span>
      <h1 className="m-0 font-heading font-normal uppercase leading-[0.9] tracking-[-0.02em]" style={{ fontSize: "clamp(2.6rem,8vw,6.5rem)" }}>
        {title}
      </h1>
      <div className="flex max-w-[720px] flex-col gap-4 text-[18px] leading-[1.6] text-abcs-black/75">
        {intro.map((p) => <p key={p} className="m-0">{p}</p>)}
      </div>
      {children}
    </header>
  );
}

export function Section({ title, label, children }: { title: string; label?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-5 md:px-8">
      <div className="flex flex-col gap-2">
        {label && <span className="text-[13px] font-bold uppercase tracking-[0.25em] text-abcs-red-text">{label}</span>}
        <h2 className="m-0 font-heading font-normal uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function ProjectGrid({ projects, headingLevel = "h3" }: { projects: Project[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <li key={p.id} className="flex flex-col overflow-hidden rounded-[24px] bg-abcs-black text-white">
          <div className="relative aspect-[16/10] overflow-hidden bg-abcs-surface">
            <Image src={p.image} alt={`Site ${p.name} — ${p.category}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover object-top" />
            {p.concept && (
              <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-[6px] text-[11px] font-bold uppercase tracking-[0.14em] text-abcs-black">Concept</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-abcs-red">{p.category}</span>
            <H className="m-0 font-heading text-[26px] font-normal uppercase leading-none">{p.name}</H>
            <p className="m-0 text-[15px] leading-[1.55] text-white/75">{p.tagline}</p>
            <ul className="mt-auto flex list-none flex-wrap gap-1.5 p-0 pt-2">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-white/70">{s}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** FAQ as native <details> so answers are in the HTML and work without JS. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((f) => (
        <details key={f.q} className="group rounded-[20px] bg-white px-6 py-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold">
            {f.q}
            <span aria-hidden className="text-[22px] text-abcs-red transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="m-0 mt-3 text-[16px] leading-[1.6] text-abcs-black/75">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Light page shell; the footer card overlaps its bottom edge. */
export function SeoMain({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-col gap-20 bg-abcs-bg pb-36 md:gap-28 md:pb-44">{children}</main>;
}
