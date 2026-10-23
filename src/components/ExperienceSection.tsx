"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { card } from "@/components/sections/layout";

const EXPERIENCES = [
  {
    from: "2024", to: "2026",
    title: "Développeur ServiceNow",
    company: "Inetum",
    desc: "Portails ServiceNow sur-mesure, workflows ITSM automatisés et intégrations API REST avec des systèmes tiers.",
  },
  {
    from: "2022", to: "2024",
    title: "Consultant ITSM & UX Designer",
    company: "Fujitsu France",
    desc: "Pilotage de projets ITSM, conception d’interfaces et optimisation des processus IT en environnement grand compte.",
  },
  {
    from: "2020", to: "2022",
    title: "Développeur Full Stack",
    company: "AJC Ingénieur",
    desc: "Applications web React / Node.js, architecture API REST et mise en production sur Vercel.",
  },
];

const DIPLOMAS = [
  { level: "Bac+5", title: "Master 2 Expert Informatique Web", school: "RNCP niveau 7 · diplômé", year: "2026" },
  { level: "Bac+4", title: "Master 1 Expert Informatique Web", school: "RNCP niveau 7", year: "2025" },
  { level: "Bac+3", title: "Bachelor Informatique", school: "Formation professionnelle", year: "2023" },
  { level: "Bac+2", title: "Développeur Full Stack", school: "AJC Formation", year: "2022" },
];

const archivo = { fontFamily: "var(--font-archivo-flex), sans-serif" } as const;
// Date column (from 640px; phones show the date above the role), dot column and gap: the rail sits
// in the middle of the dot column
const COLS = "grid-cols-[32px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[clamp(70px,14vw,170px)_32px_minmax(0,1fr)] sm:gap-x-[clamp(12px,2vw,28px)]";
const RAIL_LEFT = "left-[15px] sm:left-[calc(clamp(70px,14vw,170px)+clamp(12px,2vw,28px)+15px)]";

/** Light section: vertical timeline whose orange line grows with the scroll, then the diplomas. */
export default function ExperienceSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current, line = lineRef.current;
    if (!list || !line) return;
    const dots = Array.from(list.querySelectorAll<HTMLElement>("[data-dot]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const h = reduced ? r.height : Math.max(0, Math.min(r.height, window.innerHeight * 0.62 - r.top));
      line.style.height = `${h}px`;
      dots.forEach((d) => d.toggleAttribute("data-on", reduced || d.getBoundingClientRect().top + 9 - r.top <= h));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="experiences"
      data-stack
      className={`${card} overflow-x-clip bg-[#f4f4f2] text-[#111]`}
      // Extra room at the bottom for the footer card that overlaps it
      style={{ padding: "clamp(64px,8vw,112px) clamp(20px,5vw,72px) calc(clamp(64px,8vw,112px) + clamp(48px,7vw,112px))" }}
    >
      <div className="relative mx-auto flex max-w-[1280px] flex-col" style={{ gap: "clamp(32px,4vw,56px)" }}>
        <h2 className="sr-only">Parcours et diplômes</h2>

        <ol ref={listRef} className="relative m-0 flex list-none flex-col p-0 pt-[clamp(8px,1.5vw,16px)]">
          {/* Grey rail + orange progress, centred in the 32px dot column */}
          <div aria-hidden className={`absolute bottom-0 top-[calc(clamp(8px,1.5vw,16px)+9px)] w-0.5 bg-[rgba(17,17,17,.12)] ${RAIL_LEFT}`}>
            <div ref={lineRef} className="w-full bg-abcs-red shadow-[0_0_12px_rgba(255,59,0,.45)]" />
          </div>

          {EXPERIENCES.map((x, i) => (
            <li
              key={x.company}
              data-reveal
              className={`grid pb-[clamp(44px,5.5vw,72px)] last:pb-0 ${COLS}`}
            >
              <div className="flex flex-col pt-px text-[15px] max-sm:hidden font-semibold leading-[1.3] tracking-[-.01em] text-[#111] tabular-nums sm:flex-row sm:gap-[.4ch] sm:whitespace-nowrap" style={archivo}>
                <span>
                  {x.from} <span className="font-normal text-[rgba(17,17,17,.3)]">–</span>
                </span>
                <span>{x.to}</span>
              </div>
              <span className="flex justify-center">
                <span data-dot className="tl-dot relative z-[2] mt-0.5 block size-4 rounded-full" />
              </span>
              <div className="flex min-w-0 flex-col gap-3">
                <span className="text-[14px] font-semibold leading-[1.3] text-[rgba(17,17,17,.5)] tabular-nums sm:hidden" style={archivo}>
                  {x.from} – {x.to}
                </span>
                <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-[#111]">
                  {x.company}
                  {i === 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,59,0,.1)] px-2.5 py-1 text-[13px] font-semibold text-[#C42F00]">
                      <span aria-hidden className="size-1.5 rounded-full bg-abcs-red" />
                      Dernier poste
                    </span>
                  )}
                </span>
                <h3 className="m-0 font-bold leading-[1.02] tracking-[-.04em] text-balance" style={{ ...archivo, fontSize: "clamp(1.7rem,3.2vw,2.6rem)" }}>
                  {x.title}
                </h3>
                <p className="m-0 max-w-[640px] text-[17px] leading-[1.6] text-[rgba(17,17,17,.62)] text-pretty">{x.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Diplomas in a white card, Bac+5 highlighted */}
        <div className="flex justify-center pt-[clamp(8px,2vw,24px)]">
          <div className="flex w-full max-w-[760px] flex-col gap-1 rounded-[28px] bg-white p-2 shadow-[0_1px_0_rgba(17,17,17,.04),0_30px_60px_-30px_rgba(17,17,17,.18),inset_0_0_0_1px_rgba(17,17,17,.06)]">
            {DIPLOMAS.map((d, i) => {
              const top = i === 0;
              return (
                <div
                  key={d.level}
                  data-reveal
                  style={{ "--i": i } as CSSProperties}
                  className={`grid grid-cols-[64px_minmax(0,1fr)_auto] gap-4 px-[22px] max-[420px]:grid-cols-[52px_minmax(0,1fr)_auto] max-[420px]:gap-3 max-[420px]:px-4 ${
                    top
                      ? "items-center rounded-[20px] bg-abcs-red py-5 text-white shadow-[0_20px_40px_-18px_rgba(255,59,0,.65)]"
                      : "items-baseline rounded-2xl py-[18px] transition-colors duration-300 hover:bg-[rgba(17,17,17,.035)]"
                  }`}
                >
                  <span className={`text-[16px] font-bold tracking-[-.01em] ${top ? "" : "text-abcs-red-text"}`} style={archivo}>
                    {d.level}
                  </span>
                  <span className="flex flex-col gap-[3px]">
                    <span className="text-[17px] font-bold tracking-[-.015em]" style={archivo}>
                      {d.title}
                    </span>
                    {top ? (
                      <span className="inline-flex items-center gap-1.5 text-[14px] text-white/[.88]">
                        <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                        {d.school}
                      </span>
                    ) : (
                      <span className="text-[14px] text-[rgba(17,17,17,.62)]">{d.school}</span>
                    )}
                  </span>
                  <span className={`text-[15px] font-semibold tabular-nums ${top ? "" : "text-[rgba(17,17,17,.45)]"}`} style={archivo}>
                    {d.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
