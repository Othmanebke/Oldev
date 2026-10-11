"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/fx/SectionHeader";
import Watermark from "@/components/fx/Watermark";

const EXPERIENCES = [
  {
    year: "2024",
    title: "Développeur ServiceNow",
    company: "Inetum",
    period: "2024 — 2026",
    type: "Alternance · ITSM",
    current: false,
    desc: "Portails ServiceNow sur-mesure, workflows ITSM automatisés et intégrations API REST avec des systèmes tiers.",
    highlights: [
      "Conception de portails ServiceNow sur-mesure",
      "Automatisation de workflows ITSM complexes",
      "Intégrations API REST avec systèmes tiers",
      "Accompagnement des équipes métier",
    ],
    stack: ["ServiceNow", "JavaScript", "REST API", "Glide"],
  },
  {
    year: "2022",
    title: "Consultant ITSM & UX Designer",
    company: "Fujitsu France",
    period: "2022 — 2024",
    type: "Alternance · Grand compte",
    current: false,
    desc: "Pilotage de projets ITSM, conception d’interfaces et optimisation des processus IT en environnement grand compte.",
    highlights: [
      "Pilotage end-to-end de projets ITSM",
      "Design d’interfaces utilisateur complexes",
      "Analyse et optimisation des processus IT",
      "Coordination équipes pluridisciplinaires",
    ],
    stack: ["Figma", "UX Design", "ITIL", "ServiceNow"],
  },
  {
    year: "2020",
    title: "Développeur Full Stack",
    company: "AJC Ingénieur",
    period: "2020 — 2022",
    type: "Alternance · Full Stack",
    current: false,
    desc: "Applications web React / Node.js, architecture API REST et mise en production sur Vercel.",
    highlights: [
      "Développement React + Node.js full stack",
      "Architecture et intégrations API REST",
      "Mise en production et déploiement Vercel",
      "Code review et bonnes pratiques",
    ],
    stack: ["React", "Node.js", "PostgreSQL", "Vercel"],
  },
];

const DIPLOMAS = [
  { level: "Bac+5", title: "Master 2 Expert Informatique Web", school: "RNCP niveau 7 · diplômé", year: "2026", hl: true },
  { level: "Bac+4", title: "Master 1 Expert Informatique Web", school: "RNCP niveau 7", year: "2025" },
  { level: "Bac+3", title: "Bachelor Informatique", school: "Formation professionnelle", year: "2023" },
  { level: "Bac+2", title: "Développeur Full Stack", school: "AJC Formation", year: "2022" },
];

const PANELS = EXPERIENCES.length + 1;

const panelClass = "flex w-full shrink-0 items-center lg:h-full lg:w-screen";
const panelPadding = { padding: "clamp(24px,min(4vw,4vh),48px) clamp(24px,5vw,72px) clamp(88px,11vh,110px)" };
const gridStyle = {
  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))",
  gap: "clamp(32px,5vw,72px)",
};
const bigValue = "font-heading leading-[0.85] tracking-[-0.04em] text-abcs-red";
// Also bounded by the viewport height so panels fit on short screens (tablets in landscape)
const bigSize = { fontSize: "clamp(3.5rem,min(10vw,13vh),9rem)" };
const panelTitle = "m-0 font-heading font-normal uppercase leading-[0.92] tracking-[-0.02em]";
const panelTitleSize = { fontSize: "clamp(1.8rem,min(3.6vw,5.5vh),3.4rem)" };

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Horizontal scroll driven by the vertical progress through the section (≥ 1024px).
  // Sticky inner container rather than a GSAP pin: the stacked-cards effect
  // transforms the section, which would break a position: fixed pin.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;

    const tick = () => {
      raf = 0;
      const sec = sectionRef.current;
      const track = trackRef.current;
      if (!sec || !track) return;
      if (!mq.matches) {
        track.style.transform = "";
        return;
      }
      const dist = sec.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -sec.getBoundingClientRect().top / Math.max(1, dist)));
      track.style.transform = `translateX(${-p * (track.scrollWidth - window.innerWidth)}px)`;
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;
      setActive(Math.round(p * (PANELS - 1)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experiences"
      data-stack
      className="relative z-[14] -mt-9 md:-mt-16 rounded-t-[36px] md:rounded-t-[64px] bg-white text-abcs-black shadow-[0_-30px_70px_rgba(0,0,0,0.4)] lg:h-[calc(100vh+300vw)]"
    >
      <div className="relative flex flex-col overflow-hidden rounded-t-[36px] md:rounded-t-[64px] lg:sticky lg:top-0 lg:h-screen">
        <Watermark text="Parcours · Expériences · Diplômes · Parcours ·" stroke="rgba(17,17,17,0.07)" top="clamp(16px,3vw,40px)" />

        {/* Progress bar */}
        <div aria-hidden className="absolute left-0 right-0 top-0 z-[3] hidden h-[3px] bg-abcs-black/8 lg:block">
          <div ref={barRef} className="h-full w-0 bg-abcs-red" />
        </div>

        <SectionHeader
          tone="light"
          label="05 · Parcours"
          title="Expériences"
          titleSize="clamp(2.8rem,min(9vw,11vh),110px)"
          intro="5 ans en alternance chez Inetum, Fujitsu et AJC, et un Bac+5 en poche."
          className="relative z-[2]"
          style={{ padding: "clamp(40px,5vw,64px) clamp(24px,5vw,72px) 0" }}
        >
          <div aria-hidden className="mt-1.5 hidden items-center gap-[18px] lg:flex">
            <div className="flex gap-1.5">
              {Array.from({ length: PANELS }, (_, i) => (
                <span
                  key={i}
                  className={`h-1 w-7 rounded-full transition-colors duration-[400ms] ${i <= active ? "bg-abcs-red" : "bg-abcs-black/15"}`}
                />
              ))}
            </div>
            <span className="font-mono text-[14px] tracking-[0.12em] text-abcs-black/60">
              {String(active + 1).padStart(2, "0")} / {String(PANELS).padStart(2, "0")}
            </span>
          </div>
        </SectionHeader>

        <div ref={trackRef} className="relative z-[1] flex min-h-0 flex-1 flex-col will-change-transform lg:flex-row">
          {EXPERIENCES.map((x) => (
            <article key={x.company} className={panelClass} style={panelPadding}>
              <div className="mx-auto grid w-full max-w-[1200px] items-center" style={gridStyle}>
                <div className="flex flex-col gap-4">
                  <span className={bigValue} style={bigSize}>{x.year}</span>
                  {x.current && (
                    <span className="inline-flex items-center gap-2 self-start rounded-full bg-[rgba(34,160,90,0.12)] px-3 py-[7px] text-[12px] font-bold uppercase tracking-[0.14em] text-abcs-green-text">
                      <span className="h-[7px] w-[7px] rounded-full bg-abcs-green" />
                      Poste actuel
                    </span>
                  )}
                  <h3 className={panelTitle} style={panelTitleSize}>{x.title}</h3>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="text-[16px] font-extrabold uppercase tracking-[0.1em] text-abcs-red-text">@ {x.company}</span>
                    <span className="text-[14px] font-semibold text-abcs-black/60">{x.period} · {x.type}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-5 rounded-[28px] bg-abcs-bg" style={{ padding: "clamp(24px,3vw,36px)" }}>
                  <p className="m-0 text-[18px] font-medium leading-[1.55] text-pretty">{x.desc}</p>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {x.highlights.map((h) => (
                      <li key={h} className="grid grid-cols-[10px_1fr] items-baseline gap-3 text-[16px] leading-[1.5] text-abcs-black/75">
                        <span aria-hidden className="h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-abcs-red" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {x.stack.map((t) => (
                      <span key={t} className="rounded-full border border-abcs-black/12 bg-white px-[11px] py-1.5 text-[12px] font-bold uppercase tracking-[0.1em]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Diplomas panel */}
          <article className={panelClass} style={panelPadding}>
            <div className="mx-auto grid w-full max-w-[1200px] items-center" style={gridStyle}>
              <div className="flex flex-col gap-4">
                <span className={bigValue} style={bigSize}>Bac+5</span>
                <h3 className={panelTitle} style={panelTitleSize}>Diplômes</h3>
                <span className="text-[16px] font-semibold text-abcs-black/65">Master Expert Informatique Web · diplômé 2026</span>
              </div>
              <div className="flex flex-col rounded-[28px] bg-abcs-bg py-2" style={{ paddingInline: "clamp(24px,3vw,36px)" }}>
                {DIPLOMAS.map((d) => (
                  <div
                    key={d.level}
                    className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-abcs-black/10 py-[18px] last:border-b-0"
                  >
                    <span className={`font-heading text-[16px] ${d.hl ? "text-abcs-red-text" : "text-abcs-black/60"}`}>{d.level}</span>
                    <span className="flex flex-col gap-[3px]">
                      <span className="text-[16px] font-extrabold">{d.title}</span>
                      <span className="text-[14px] text-abcs-black/60">{d.school}</span>
                    </span>
                    <span className="font-mono text-[14px] text-abcs-black/60">{d.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
