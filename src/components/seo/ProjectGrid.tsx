"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProjectPreview from "@/components/seo/ProjectPreview";
import { H2 } from "@/components/seo/ui";
import { PROJECT_FILTERS, type Project, type ProjectTag } from "@/lib/projects";

type Props = {
  title: string;
  projects: Project[];
  /** Same tabs as the home page (Tous / Vitrine / Sur-mesure / WordPress), right of the title. */
  filters?: boolean;
  /** Link right of the title (when there are no filters). */
  link?: { href: string; label: string };
};

/** Grid of project cards; a click opens the full page (menu to footer), scrolling by itself. Every card is in the server HTML. */
export default function ProjectGrid({ title, projects, filters, link }: Props) {
  const [filter, setFilter] = useState<ProjectTag | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = projects.filter((p) => filter === "all" || p.tag === filter);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <H2>{title}</H2>
        {filters ? (
          <div
            className="grid grid-cols-2 gap-1 rounded-[24px] bg-white/[.04] p-[5px] shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] sm:flex sm:flex-wrap sm:rounded-full"
            role="group"
            aria-label="Filtrer par type de site"
          >
            {PROJECT_FILTERS.map((f) => {
              const n = projects.filter((p) => f.tag === "all" || p.tag === f.tag).length;
              if (!n) return null;
              const on = f.tag === filter;
              return (
                <button
                  key={f.tag}
                  onClick={() => setFilter(f.tag)}
                  aria-pressed={on}
                  className={`inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] font-semibold transition-all duration-300 ${
                    on
                      ? "bg-[rgba(255,59,0,.14)] text-white shadow-[inset_0_0_0_1px_rgba(255,120,50,.45),0_0_24px_-6px_rgba(255,59,0,.5)]"
                      : "text-[#a0a0a0] hover:bg-white/[.05] hover:text-white"
                  }`}
                >
                  {f.label}
                  <span className={`text-[13px] font-medium tabular-nums ${on ? "text-abcs-red" : "text-[#8f8f8f]"}`}>{n}</span>
                </button>
              );
            })}
          </div>
        ) : (
          link && (
            <Link href={link.href} className="group inline-flex items-center gap-2 py-2 text-[15px] font-semibold text-white">
              {link.label.replace(/ →$/, "")}
              <span aria-hidden className="text-abcs-red transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          )
        )}
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-3">
        {list.map((p, i) => (
          <li key={p.id}>
            <button onClick={() => setOpen(i)} aria-label={`Voir le site ${p.name} en entier`} className="group flex w-full flex-col gap-3.5 text-left">
              <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#111] shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 380px"
                  className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-[rgba(10,10,10,.72)] px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur-[8px] transition-colors group-hover:bg-abcs-red">
                  Voir le site ↗
                </span>
              </span>
              <span className="flex min-w-0 items-baseline justify-between gap-3">
                <span className="truncate text-[17px] font-semibold tracking-[-.02em] text-white" style={{ fontFamily: "var(--font-archivo-flex), sans-serif" }}>
                  {p.name}
                </span>
                <span className="shrink-0 text-[14px] text-[#a0a0a0]">{p.sector}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ProjectPreview projects={list} index={open} onChange={setOpen} />
    </div>
  );
}
