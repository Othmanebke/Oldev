"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/fx/Reveal";
import ProjectViewer from "@/components/seo/ProjectViewer";
import { PROJECT_FILTERS, type Project, type ProjectTag } from "@/lib/projects";

type Props = {
  projects: Project[];
  /** Show the techno filter chips (Tous / React / WordPress / HTML). */
  filters?: boolean;
  /** Chip colors for the card they sit on. */
  tone?: "dark" | "light";
};

/**
 * Grid of project cards; a click opens the full-site viewer. Every project is
 * in the server HTML (the filter only applies after hydration).
 */
export default function ProjectShowcase({ projects, filters, tone = "light" }: Props) {
  const [filter, setFilter] = useState<ProjectTag | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = filter === "all" ? projects : projects.filter((p) => p.tag === filter);
  const dark = tone === "dark";

  return (
    <div className="flex flex-col gap-8">
      {filters && (
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrer par technologie">
          {PROJECT_FILTERS.map((f) => {
            const on = f.tag === filter;
            const count = f.tag === "all" ? projects.length : projects.filter((p) => p.tag === f.tag).length;
            return (
              <button
                key={f.tag}
                onClick={() => setFilter(f.tag)}
                aria-pressed={on}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-[18px] py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                  on
                    ? "border-abcs-red bg-abcs-red text-white"
                    : dark
                      ? "border-white/20 text-white/75 hover:border-white/50 hover:text-white"
                      : "border-abcs-black/20 text-abcs-black/75 hover:border-abcs-black/50 hover:text-abcs-black"
                }`}
              >
                {f.label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <Reveal as="ul" className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div data-reveal style={{ "--i": i % 3 } as CSSProperties}>
                <button
                  onClick={() => setOpen(i)}
                  aria-label={`Voir le site ${p.name} en entier`}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-white/10 bg-abcs-surface text-left text-white shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)]"
                >
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    style={{ transition: "transform 1.1s cubic-bezier(.22,1,.36,1), filter .6s" }}
                    className="object-cover object-top brightness-[0.8] saturate-[0.9] group-hover:scale-[1.07] group-hover:brightness-100 group-hover:saturate-100"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg,rgba(10,10,10,0.2) 0%,rgba(10,10,10,0) 30%,rgba(10,10,10,0.6) 55%,rgba(10,10,10,0.97) 80%)" }}
                  />

                  <span className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
                    <span className="rounded-full bg-[rgba(10,10,10,0.75)] px-3 py-[7px] text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-[8px]">
                      {p.category}
                    </span>
                    {p.concept && (
                      <span className="rounded-full bg-white px-3 py-[7px] text-[11px] font-bold uppercase tracking-[0.14em] text-abcs-black">Concept</span>
                    )}
                  </span>

                  {/* "View" badge, centered on hover (always visible on touch screens) */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-[38%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-abcs-red text-center text-[12px] font-bold uppercase leading-tight tracking-[0.12em] opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 [@media(hover:none)]:hidden"
                  >
                    Voir le
                    <br />
                    site ↗
                  </span>

                  <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 md:p-6">
                    <span className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] uppercase leading-[0.9] tracking-[-0.02em]">{p.name}</span>
                    <span className="line-clamp-2 text-[14px] leading-[1.5] text-white/75">{p.tagline}</span>
                    <span className="flex items-center justify-between gap-3 pt-1">
                      <span className="flex flex-wrap gap-1.5">
                        {p.stack.slice(0, 3).map((s) => (
                          <span key={s} className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] text-white/80">{s}</span>
                        ))}
                      </span>
                      <span aria-hidden className="shrink-0 text-[12px] font-bold uppercase tracking-[0.12em] text-abcs-red [@media(hover:hover)]:hidden">
                        Voir ↗
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </Reveal>

      <ProjectViewer projects={list} index={open} onChange={setOpen} />
    </div>
  );
}
