"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GrainyRow from "@/components/fx/GrainyRow";
import ProjectPreview from "@/components/seo/ProjectPreview";
import SectionHeading from "@/components/sections/SectionHeading";
import { archivo, gutter, section, sectionInner, sectionPad } from "@/components/sections/layout";
import { PROJECTS, PROJECT_FILTERS, projectById, projectsForTag, type Project, type ProjectTag } from "@/lib/projects";

const pad = (n: number) => String(n).padStart(2, "0");
const defil = (n: number) => `/defil-travaux/ecran-${pad(n)}.jpg`;
const shot = (id: string) => projectById(id).image;

/** "Tous": two rows of client sites mixed with hero concepts (public/defil-travaux). */
const ROW_A = [shot("wecars"), defil(3), shot("hora"), defil(1), shot("aero"), shot("moreau"), shot("kinetik"), defil(5), shot("dental"), shot("sorel")];
const ROW_B = [shot("fontaney"), defil(7), shot("wonder"), shot("fauteo"), shot("nocta"), defil(9), shot("djcley"), shot("burga"), shot("griddle")];
const ROWS_LIST = ["wecars", "hora", "aero", "moreau", "kinetik", "dental", "sorel", "fontaney", "wonder", "fauteo", "nocta", "djcley", "burga", "griddle"].map(projectById);

/** Image, with the project's reel on top when it has one (hover on desktop, visible on phones). */
function ProjectMedia({ project, priority }: { project: Project; priority?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = v.parentElement!;
    const play = () => v.play().then(() => setPlaying(true)).catch(() => {});
    const stop = () => {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
    };
    if (window.matchMedia("(hover: hover)").matches) {
      box.addEventListener("pointerenter", play);
      box.addEventListener("pointerleave", stop);
      return () => {
        box.removeEventListener("pointerenter", play);
        box.removeEventListener("pointerleave", stop);
      };
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.6 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[22px] bg-[#111]">
      <Image
        src={project.image}
        alt={project.name}
        fill
        priority={priority}
        sizes="(max-width: 768px) 86vw, 940px"
        className="object-cover object-top transition-transform duration-[1.1s] ease-out-expo group-hover:scale-[1.04]"
      />
      {project.video && !broken && (
        <video
          ref={video}
          src={project.video}
          poster={project.image}
          muted
          playsInline
          loop
          preload="none"
          onError={() => setBroken(true)}
          className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <span className="absolute bottom-4 right-4 rounded-full bg-[rgba(10,10,10,.72)] px-3.5 py-2 text-[13px] font-semibold text-white opacity-0 backdrop-blur-[8px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-[899px]:opacity-100">
        Voir le site ↗
      </span>
    </div>
  );
}

/** Inner padding of the full-width rail, so its first card lines up with the content (max 1280px). */
const edge = `max(${gutter}, calc(50vw - 640px))`;

const chevron =
  "grid size-10 flex-none place-items-center rounded-full text-[#a0a0a0] transition-colors duration-200 hover:text-abcs-red disabled:pointer-events-none disabled:opacity-30";

/**
 * One tab's projects side by side, edge to edge. The wheel keeps scrolling the
 * page; the rail moves with a trackpad, a swipe, a mouse drag, the dots or the
 * chevrons. A click (not a drag) opens the full page.
 */
function Rail({ items, label, onOpen }: { items: Project[]; label: string; onOpen: (i: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // Mouse drag (touch scrolls natively). Snap is off while dragging, and a drag doesn't count as a click.
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.style.scrollSnapType = "none";
      e.currentTarget.style.cursor = "grabbing";
    }
    e.currentTarget.scrollLeft = d.left - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const t = e.currentTarget;
    t.style.cursor = "";
    if (d.moved) {
      // Back to snapping, landing on the nearest project
      t.style.scrollSnapType = "";
      setTimeout(() => (drag.current = null));
    } else drag.current = null;
  };

  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    const p = max > 0 ? t.scrollLeft / max : 0;
    setCurrent(Math.round(p * (items.length - 1)));
  };
  /** Scrolls the rail so that project `i` comes first. */
  const goTo = (i: number) => {
    const t = track.current;
    const cards = t?.querySelectorAll("article");
    if (!t || !cards?.length) return;
    const k = Math.max(0, Math.min(items.length - 1, i));
    t.scrollTo({ left: cards[k].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-[clamp(16px,2.4vh,24px)]" style={{ marginInline: "calc(50% - 50vw)" }} role="region" aria-roledescription="carrousel" aria-label={label}>
      <div className="flex items-baseline justify-between gap-4" style={{ paddingInline: edge }}>
        <span className="font-semibold tracking-[-.02em] text-[#f4f4f2]" style={{ ...archivo, fontSize: "clamp(20px,2vw,26px)" }}>
          {label}
        </span>
        <span className="font-mono text-[14px] tracking-[.14em] text-[#a0a0a0]" aria-live="polite">
          {pad(current + 1)} / {pad(items.length)}
        </span>
      </div>
      <div
        ref={track}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-[clamp(14px,1.6vw,22px)] overflow-x-auto overflow-y-hidden overscroll-x-contain select-none"
        style={{ paddingBlock: "4px 8px", paddingInline: edge, scrollPaddingInline: edge }}
      >
        {items.map((p, i) => (
          <article key={p.id} className="flex flex-none snap-start flex-col" style={{ width: "min(84vw,940px,calc((100vh - 280px) * 1.6 + 32px))" }}>
            <button onClick={() => onOpen(i)} aria-label={`Voir le site ${p.name} en entier`} className="group flex h-full flex-col text-left">
              <span className="flex flex-col gap-2 px-1 pt-2" style={{ paddingBottom: "clamp(16px,2vw,22px)" }}>
                <span role="heading" aria-level={3} className="font-bold leading-[1.02] tracking-[-.035em] text-white" style={{ ...archivo, fontSize: "clamp(26px,2.8vw,40px)" }}>
                  {p.name}
                </span>
                <span className="max-w-[560px] text-[15px] leading-[1.5] text-[#b5b5b5] text-pretty max-sm:text-[14px]">{p.tagline}</span>
              </span>
              {/* Bottom of the card: images stay aligned whatever the length of the tagline */}
              <span className="mt-auto block">
                <ProjectMedia project={p} priority={i === 0} />
              </span>
            </button>
          </article>
        ))}
      </div>
      {/* ‹ • • ● • • › */}
      <div className="flex items-center justify-center gap-1" style={{ paddingInline: edge }}>
        <button onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Projet précédent" className={chevron}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center">
          {items.map((p, i) => (
            <button key={p.id} onClick={() => goTo(i)} aria-label={`Voir ${p.name}`} aria-current={i === current} className="group grid h-8 place-items-center px-[5px] max-[400px]:px-1">
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-abcs-red" : "w-1.5 bg-white/25 group-hover:bg-white/60"}`}
              />
            </button>
          ))}
        </div>
        <button onClick={() => goTo(current + 1)} disabled={current === items.length - 1} aria-label="Projet suivant" className={chevron}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function WorkSection() {
  const [filter, setFilter] = useState<ProjectTag | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = filter === "all" ? [] : projectsForTag(filter);
  const label = PROJECT_FILTERS.find((f) => f.tag === filter)?.label ?? "";

  return (
    <section id="portfolio" data-stack className={section} style={sectionPad}>
      <div className={sectionInner} style={{ gap: "clamp(36px,5vw,56px)" }}>
        <SectionHeading kicker="RÉALISATIONS" title="Des sites qui font venir des clients" />

        <div data-reveal className="flex justify-center">
          <div
            className="grid grid-cols-2 gap-1 rounded-[24px] bg-white/[.04] p-[5px] shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] sm:flex sm:flex-wrap sm:justify-center sm:rounded-full"
            role="group"
            aria-label="Filtrer par type de site"
          >
            {PROJECT_FILTERS.map((f) => {
              const on = f.tag === filter;
              const count = f.tag === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.tag === f.tag).length;
              return (
                <button
                  key={f.tag}
                  onClick={() => {
                    setFilter(f.tag);
                    setOpen(null);
                  }}
                  aria-pressed={on}
                  className={`inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-[11px] text-[15px] font-semibold transition-all duration-300 max-sm:px-3 ${
                    on
                      ? "bg-[rgba(255,59,0,.14)] text-white shadow-[inset_0_0_0_1px_rgba(255,120,50,.45),0_0_24px_-6px_rgba(255,59,0,.5)]"
                      : "bg-transparent text-[#a0a0a0] hover:bg-white/[.05] hover:text-white"
                  }`}
                >
                  {f.label}
                  <span className={`text-[13px] font-medium tabular-nums ${on ? "text-abcs-red" : "text-[#8f8f8f]"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Always mounted, so the reveal also covers projects shown after a filter change */}
        <div data-reveal>
          {filter === "all" ? (
            <>
              <div className="flex flex-col gap-[clamp(12px,1.6vw,20px)]" style={{ margin: `0 calc(-1 * ${gutter})` }}>
                <GrainyRow images={ROW_A} speed={38} gap={14} radius={18} className="h-[clamp(180px,22vw,320px)]" />
                <GrainyRow images={ROW_B} speed={-32} gap={14} radius={18} className="h-[clamp(180px,22vw,320px)]" />
              </div>
              <ul className="sr-only">
                {ROWS_LIST.map((p) => (
                  <li key={p.id}>
                    {p.name} · {p.sector}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Rail key={filter} items={list} label={label} onOpen={setOpen} />
          )}
        </div>

        <Link
          href="/realisations"
          className="self-center py-2 text-[14px] font-bold uppercase tracking-[.12em] text-[#c8c8c8] underline-offset-4 transition-colors hover:text-abcs-red hover:underline"
        >
          Voir toutes les réalisations →
        </Link>
      </div>

      <ProjectPreview projects={list} index={open} onChange={setOpen} />
    </section>
  );
}
