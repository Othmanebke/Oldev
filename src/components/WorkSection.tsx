"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/fx/SectionHeader";
import Watermark from "@/components/fx/Watermark";
import { PROJECTS, PROJECT_FILTERS, type Project, type ProjectTag } from "@/lib/projects";

const pad = (n: number) => String(n).padStart(2, "0");

/** Hero concepts shown only in the "Tous" marquee (public/defil-travaux). */
const MARQUEE_HEROES = Array.from({ length: 11 }, (_, i) => `/defil-travaux/hero-${pad(i + 1)}.jpg`);

/** Thumbnails only — decorative, no text, no interaction. */
function MarqueeRow({ items, animation }: { items: string[]; animation: string }) {
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
      }}
    >
      <div className="flex w-max gap-3 will-change-transform" style={{ animation }}>
        {[...items, ...items].map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative aspect-[14/9] shrink-0 overflow-hidden rounded-2xl border border-[#222] bg-[#1A1A1A]"
            style={{ width: "clamp(300px,32vw,420px)" }}
          >
            <Image src={src} alt="" fill sizes="420px" className="object-cover object-top" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  return (
    <article
      className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-abcs-surface text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
      style={{ flex: featured ? "2 1 560px" : "1 1 340px", minHeight: featured ? "clamp(440px,70vw,560px)" : "clamp(360px,60vw,420px)" }}
    >
      <Image
        src={project.image}
        alt={project.name}
        fill
        sizes={featured ? "(max-width: 768px) 100vw, 800px" : "(max-width: 768px) 100vw, 420px"}
        style={{ transition: "transform 1.1s cubic-bezier(.22,1,.36,1), filter .6s" }}
        className="object-cover object-top brightness-[0.78] saturate-[0.9] group-hover:scale-[1.07] group-hover:brightness-100 group-hover:saturate-100"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(10,10,10,0.25) 0%,rgba(10,10,10,0) 22%,rgba(10,10,10,0.55) 42%,rgba(10,10,10,0.96) 68%,rgba(10,10,10,0.98) 100%)",
        }}
      />

      <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
        <span className="rounded-full bg-[rgba(10,10,10,0.75)] px-[11px] py-[7px] font-mono text-[13px] tracking-[0.16em] backdrop-blur-[8px]">
          {pad(PROJECTS.indexOf(project) + 1)}
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {project.concept && (
            <span className="rounded-full bg-white px-3 py-[7px] text-[12px] font-bold uppercase tracking-[0.14em] text-abcs-black">
              Concept
            </span>
          )}
          <span className="rounded-full bg-[rgba(10,10,10,0.75)] px-3 py-[7px] text-[12px] font-bold uppercase tracking-[0.14em] backdrop-blur-[8px]">
            {project.category}
          </span>
        </div>
      </div>

      <div
        className="absolute flex flex-col gap-3"
        style={{ left: "clamp(20px,3vw,32px)", right: "clamp(20px,3vw,32px)", bottom: "clamp(20px,3vw,32px)" }}
      >
        <h3
          className="m-0 font-heading font-normal uppercase leading-[0.88] tracking-[-0.03em]"
          style={{ fontSize: featured ? "clamp(2.2rem,5vw,4.6rem)" : "clamp(1.6rem,2.6vw,2.2rem)" }}
        >
          {project.name}
        </h3>
        {featured && (
          <p className="m-0 max-w-[460px] text-[16px] leading-[1.55] text-white/80 text-pretty">{project.tagline}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <span key={t} className="rounded-full border border-white/28 px-2.5 py-[5px] text-[12px] uppercase tracking-[0.1em]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

const arrowBtn =
  "grid size-12 place-items-center rounded-full border border-white/20 text-white/80 transition-all duration-200 hover:border-abcs-red hover:bg-abcs-red hover:text-white";

/** One project at a time, with prev / next buttons and dots. */
function ProjectCarousel({ items }: { items: Project[] }) {
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);
  const current = items[index];

  return (
    <div className="flex flex-col gap-5" role="region" aria-roledescription="carrousel" aria-label="Projets">
      <div className="flex">
        <ProjectCard key={current.id} project={current} featured />
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => go(-1)} aria-label="Projet précédent" className={arrowBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {items.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                aria-label={`Voir ${p.name}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-abcs-red" : "w-2 bg-white/25 hover:bg-white/50"}`}
              />
            ))}
            <span className="ml-2 font-mono text-[13px] tracking-[0.16em] text-white/60" aria-live="polite">
              {pad(index + 1)} / {pad(items.length)}
            </span>
          </div>

          <button onClick={() => go(1)} aria-label="Projet suivant" className={arrowBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function WorkSection() {
  const [filter, setFilter] = useState<ProjectTag | "all">("all");
  const lead = PROJECT_FILTERS.find((f) => f.tag === filter)?.lead;
  const list = PROJECTS.filter((p) => p.tag === filter).sort((a, b) => Number(b.id === lead) - Number(a.id === lead));

  return (
    <section
      id="portfolio"
      data-stack
      className="relative z-10 -mt-9 md:-mt-16 overflow-hidden rounded-t-[36px] md:rounded-t-[64px] bg-abcs-black text-white shadow-[0_-30px_70px_rgba(0,0,0,0.5)]"
      style={{ padding: "clamp(64px,9vw,120px) clamp(20px,5vw,72px) clamp(96px,10vw,140px)" }}
    >
      <Watermark text="Travaux · Projets · Travaux · Projets · Travaux ·" stroke="rgba(255,255,255,0.08)" />
      <Watermark variant="2" text="Next.js · WordPress · React · HTML · Next.js ·" stroke="rgba(255,59,0,0.22)" />

      <div className="relative z-[1] mx-auto flex max-w-[1280px] flex-col" style={{ gap: "clamp(36px,5vw,56px)" }}>
        <SectionHeader
          tone="dark"
          label="01 · Réalisations"
          title="Mes travaux"
          intro="Vitrines, e-commerce et apps web : une sélection de projets clients et personnels."
        />

        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrer par technologie">
          {PROJECT_FILTERS.map((f) => {
            const on = f.tag === filter;
            const count = f.tag === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.tag === f.tag).length;
            return (
              <button
                key={f.tag}
                onClick={() => setFilter(f.tag)}
                aria-pressed={on}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-[18px] py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                  on
                    ? "border-abcs-red bg-abcs-red text-white"
                    : "border-white/20 bg-transparent text-white/75 hover:border-white/50 hover:text-white"
                }`}
              >
                {f.label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {filter === "all" ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none flex select-none flex-col gap-3"
              style={{ margin: "0 calc(-1 * clamp(20px,5vw,72px))" }}
            >
              <MarqueeRow items={MARQUEE_HEROES} animation="mq-l 40s linear infinite" />
              <MarqueeRow items={[...MARQUEE_HEROES].reverse()} animation="mq-r 46s linear infinite" />
            </div>
            <p className="m-0 text-center text-[15px] text-white/60">Choisis une techno pour voir le détail des projets.</p>
          </>
        ) : (
          <ProjectCarousel key={filter} items={list} />
        )}
      </div>
    </section>
  );
}
