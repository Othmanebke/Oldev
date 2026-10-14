"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/fx/SectionTitle";
import { card } from "@/components/sections/layout";

const EXPERIENCES = [
  {
    period: "2024 → 2026",
    type: "Alternance · ITSM",
    title: "Développeur ServiceNow",
    company: "Inetum",
    desc: "Portails ServiceNow sur-mesure, workflows ITSM automatisés et intégrations API REST avec des systèmes tiers.",
    stack: ["ServiceNow", "JavaScript", "REST API", "Glide"],
  },
  {
    period: "2022 → 2024",
    type: "Alternance · Grand compte",
    title: "Consultant ITSM & UX Designer",
    company: "Fujitsu France",
    desc: "Pilotage de projets ITSM, conception d’interfaces et optimisation des processus IT en environnement grand compte.",
    stack: ["Figma", "UX Design", "ITIL", "ServiceNow"],
  },
  {
    period: "2020 → 2022",
    type: "Alternance · Full Stack",
    title: "Développeur Full Stack",
    company: "AJC Ingénieur",
    desc: "Applications web React / Node.js, architecture API REST et mise en production sur Vercel.",
    stack: ["React", "Node.js", "PostgreSQL", "Vercel"],
  },
];

const DIPLOMAS = [
  { level: "Bac+5", title: "Master 2 Expert Informatique Web", school: "RNCP niveau 7 · diplômé", year: "2026" },
  { level: "Bac+4", title: "Master 1 Expert Informatique Web", school: "RNCP niveau 7", year: "2025" },
  { level: "Bac+3", title: "Bachelor Informatique", school: "Formation professionnelle", year: "2023" },
  { level: "Bac+2", title: "Développeur Full Stack", school: "AJC Formation", year: "2022" },
];

const mono = "font-mono text-[14px]";

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
      dots.forEach((d) => d.toggleAttribute("data-on", d.getBoundingClientRect().top + 9 - r.top <= h));
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
      className={`${card} overflow-x-clip bg-[#f4f4f2] text-[#111]`}
      // Extra room at the bottom for the footer card that overlaps it
      style={{ padding: "clamp(64px,8vw,112px) clamp(20px,5vw,72px) calc(clamp(64px,8vw,112px) + clamp(48px,7vw,112px))" }}
    >
      <div className="relative mx-auto flex max-w-[1280px] flex-col" style={{ gap: "clamp(48px,6vw,88px)" }}>
        <SectionTitle
          tone="light"
          top="Parcours"
          word="Expériences"
          count={`(${String(EXPERIENCES.length + 1).padStart(2, "0")})`}
          intro="5 ans en alternance chez Inetum, Fujitsu et AJC, et un Bac+5 en poche."
          mark="un Bac+5 en poche"
          aside="2020—26®"
        />

        <ol ref={listRef} className="relative m-0 flex list-none flex-col p-0" style={{ gap: "clamp(48px,6vw,80px)" }}>
          {/* Grey rail + orange progress, centred in the 32px column */}
          <div aria-hidden className="absolute bottom-0 top-0 w-0.5 bg-[rgba(17,17,17,.12)]" style={{ left: "calc(clamp(70px,14vw,170px) + 15px)" }}>
            <div ref={lineRef} className="w-full bg-abcs-red shadow-[0_0_12px_rgba(255,59,0,.45)]" />
          </div>

          {EXPERIENCES.map((x, i) => (
            <li key={x.company} className="grid" style={{ gridTemplateColumns: "clamp(70px,14vw,170px) 32px 1fr" }}>
              <div className={`${mono} flex flex-col gap-1 pr-3 text-[#111]/70`}>
                <span className="font-bold text-[#111]">{x.period}</span>
                <span>{x.type}</span>
              </div>
              <span className="relative flex justify-center">
                <span data-dot className="tl-dot relative z-[1] mt-0.5 block h-[18px] w-[18px] rounded-full border-2 border-[#f4f4f2]" />
              </span>
              <div className="flex min-w-0 flex-col gap-4 pl-[clamp(12px,2vw,24px)]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className={`${mono} flex items-center gap-2 font-bold`}>
                    {i === 0 && <span aria-hidden className="h-2 w-2 rounded-full bg-abcs-red" />}
                    {x.company}
                  </span>
                  {i === 0 && <span className={`${mono} text-[#C42F00]`}>Dernier poste</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {x.stack.map((t) => (
                    <span key={t} className="rounded-lg border border-[rgba(17,17,17,.16)] bg-white/55 px-2.5 py-1 font-mono text-[12px]">
                      {t}
                    </span>
                  ))}
                </div>
                <h3
                  className="m-0 leading-[1.02] tracking-[-.035em]"
                  style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.5rem)" }}
                >
                  {x.title}
                </h3>
                <p className="m-0 max-w-[620px] text-[16px] leading-[1.6] text-[rgba(17,17,17,.7)] text-pretty">{x.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Diplomas */}
        <div className="grid border-t border-[rgba(17,17,17,.12)] pt-[clamp(32px,4vw,56px)]" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(32px,5vw,72px)" }}>
          <div className="flex flex-col gap-3">
            <span className="font-heading leading-[0.85] tracking-[-0.04em] text-abcs-red" style={{ fontSize: "clamp(2.6rem,5vw,4.4rem)" }}>
              Bac+5
            </span>
            <h3 className="m-0 font-heading font-normal uppercase text-[clamp(1.4rem,2.4vw,2rem)] leading-none">Diplômes</h3>
            <span className="text-[16px] text-[#111]/65">Master Expert Informatique Web · diplômé 2026</span>
          </div>
          <div className="flex flex-col">
            {DIPLOMAS.map((d, i) => (
              <div key={d.level} className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-[rgba(17,17,17,.12)] py-[18px] first:pt-0">
                <span className={`font-heading text-[16px] ${i === 0 ? "text-[#C42F00]" : "text-[#111]/60"}`}>{d.level}</span>
                <span className="flex flex-col gap-[3px]">
                  <span className="text-[16px] font-extrabold">{d.title}</span>
                  <span className="text-[14px] text-[#111]/60">{d.school}</span>
                </span>
                <span className={`${mono} text-[#111]/60`}>{d.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
