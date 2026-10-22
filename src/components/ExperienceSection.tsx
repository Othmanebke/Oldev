"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import SectionTitle from "@/components/fx/SectionTitle";
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

const mono = "font-mono text-[14px]";
// Date column, dot column and gap: the rail sits in the middle of the dot column
const COLS = "clamp(70px,14vw,170px) 32px minmax(0,1fr)";
const GAP = "clamp(12px,2vw,28px)";

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
        <SectionTitle
          tone="light"
          top="Parcours"
          word="Expériences"
          intro="5 ans en alternance chez Inetum, Fujitsu et AJC, et un Bac+5 en poche."
          mark="un Bac+5 en poche"
        />

        <ol ref={listRef} className="relative m-0 flex list-none flex-col p-0 pt-[clamp(8px,1.5vw,16px)]">
          {/* Grey rail + orange progress, centred in the 32px dot column */}
          <div aria-hidden className="absolute bottom-0 top-[calc(clamp(8px,1.5vw,16px)+9px)] w-0.5 bg-[rgba(17,17,17,.12)]" style={{ left: `calc(clamp(70px,14vw,170px) + ${GAP} + 15px)` }}>
            <div ref={lineRef} className="w-full bg-abcs-red shadow-[0_0_12px_rgba(255,59,0,.45)]" />
          </div>

          {EXPERIENCES.map((x, i) => (
            <li
              key={x.company}
              data-reveal
              className="grid pb-[clamp(44px,5.5vw,72px)] last:pb-0"
              style={{ gridTemplateColumns: COLS, columnGap: GAP }}
            >
              <div className={`${mono} flex flex-col pt-px font-bold leading-[1.3] text-[#111] sm:flex-row sm:gap-[.6ch] sm:whitespace-nowrap`}>
                <span>
                  {x.from} <span className="font-normal text-[#111]/45">→</span>
                </span>
                <span>{x.to}</span>
              </div>
              <span className="flex justify-center">
                <span data-dot className="tl-dot relative z-[2] block h-[18px] w-[18px] rounded-full" />
              </span>
              <div className="flex min-w-0 flex-col gap-3">
                <span className={`${mono} flex flex-wrap items-center gap-2 font-bold text-[#111]`}>
                  {i === 0 && (
                    <>
                      <span aria-hidden className="h-2 w-2 rounded-full bg-abcs-red" />
                      <span className="text-[#C42F00]">Dernier poste</span>
                      <span aria-hidden className="text-[#111]/35">·</span>
                    </>
                  )}
                  {x.company}
                </span>
                <h3
                  className="m-0 leading-[1.05] tracking-[-.035em] text-balance"
                  style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.5rem)" }}
                >
                  {x.title}
                </h3>
                <p className="m-0 max-w-[640px] text-[16px] leading-[1.65] text-[rgba(17,17,17,.7)] text-pretty">{x.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Diplomas, Bac+5 highlighted */}
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-1.5 pt-[clamp(8px,2vw,24px)]">
          {DIPLOMAS.map((d, i) =>
            i === 0 ? (
              <div
                key={d.level}
                data-reveal
                className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 rounded-[18px] bg-abcs-red px-5 py-[18px] text-white shadow-[0_20px_50px_-20px_rgba(255,59,0,.6)] max-[420px]:grid-cols-[52px_minmax(0,1fr)_auto] max-[420px]:gap-3 max-[420px]:px-4"
              >
                <span className="font-heading text-[15px]">{d.level}</span>
                <span className="flex flex-col gap-[3px]">
                  <span className="text-[16px] font-extrabold">{d.title}</span>
                  <span className="inline-flex items-center gap-1.5 text-[14px] text-white/[.88]">
                    <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {d.school}
                  </span>
                </span>
                <span className={`${mono} font-bold`}>{d.year}</span>
              </div>
            ) : (
              <div
                key={d.level}
                data-reveal
                style={{ "--i": i } as CSSProperties}
                className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-[rgba(17,17,17,.12)] px-5 py-4 max-[420px]:grid-cols-[52px_minmax(0,1fr)_auto] max-[420px]:gap-3 max-[420px]:px-4"
              >
                <span className="font-heading text-[15px] text-[#111]/60">{d.level}</span>
                <span className="flex flex-col gap-[3px]">
                  <span className="text-[16px] font-extrabold">{d.title}</span>
                  <span className="text-[14px] text-[#111]/60">{d.school}</span>
                </span>
                <span className={`${mono} text-[#111]/60`}>{d.year}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
