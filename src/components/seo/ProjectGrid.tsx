"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProjectPreview from "@/components/seo/ProjectPreview";
import { H2 } from "@/components/seo/ui";
import type { Project } from "@/lib/projects";

type Props = {
  title: string;
  projects: Project[];
  /** Techno filter pills, right of the title. */
  filters?: boolean;
  /** Link right of the title (when there are no filters). */
  link?: { href: string; label: string };
};

const FILTERS = [
  { tag: "all", label: "Tous" },
  { tag: "react", label: "React" },
  { tag: "nextjs", label: "Next.js" },
  { tag: "wordpress", label: "WordPress" },
  { tag: "html", label: "HTML" },
] as const;
type Filter = (typeof FILTERS)[number]["tag"];

/** React and Next.js projects share the "nextjs" tag: split them by their stack. */
const matches = (p: Project, f: Filter) =>
  f === "all" ||
  (f === "react" ? p.tag === "nextjs" && !p.stack.includes("Next.js") : f === "nextjs" ? p.tag === "nextjs" && p.stack.includes("Next.js") : p.tag === f);

/** Grid of project cards; a click opens the auto-scrolling preview. Every card is in the server HTML. */
export default function ProjectGrid({ title, projects, filters, link }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = projects.filter((p) => matches(p, filter));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <H2>{title}</H2>
        {filters ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par technologie">
            {FILTERS.map((f) => {
              const n = projects.filter((p) => matches(p, f.tag)).length;
              if (!n) return null;
              const on = f.tag === filter;
              return (
                <button
                  key={f.tag}
                  onClick={() => setFilter(f.tag)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                    on ? "border-[#111] bg-[#111] text-white" : "border-[rgba(17,17,17,.2)] text-[#111] hover:border-[#111]"
                  }`}
                >
                  {f.label}
                  <span className={on ? "text-white/60" : "text-[#666]"}>{n}</span>
                </button>
              );
            })}
          </div>
        ) : (
          link && (
            <Link href={link.href} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#111]">
              {link.label.replace(/ →$/, "")}
              <span aria-hidden className="text-abcs-red transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          )
        )}
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-3">
        {list.map((p, i) => (
          <li key={p.id}>
            <button onClick={() => setOpen(i)} aria-label={`Voir le site ${p.name}`} className="group flex w-full flex-col gap-3.5 text-left">
              <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#e6e6e3]">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 380px"
                  className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-[rgba(17,17,17,.82)] px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-[6px] transition-colors group-hover:bg-abcs-red">
                  Voir le site ↗
                </span>
              </span>
              <span className="flex min-w-0 items-baseline justify-between gap-3 text-[15px]">
                <span className="truncate font-semibold text-[#111]">{p.name}</span>
                <span className="shrink-0 text-[14px] text-[#666]">{p.category}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ProjectPreview projects={list} index={open} onChange={setOpen} />
    </div>
  );
}
