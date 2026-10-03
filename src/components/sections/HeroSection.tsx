"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useContactModal } from "@/components/ContactModalProvider";
import { LOADER_INTRO_DELAY } from "@/components/Preloader";
import {
  cap, condensed, delay, fade, DispoBadge, HeroBackground, HeroOverlays, HeroPortrait, HeroSocials, ParisTime, useHeroMotion,
} from "@/components/hero/HeroParts";
import { EMAIL } from "@/lib/site";

const NAME = "OTHMANE B.";
const ROLES = ["Développeur web", "Web designer", "Expert WordPress", "Dev Next.js", "Créateur de sites"];

const nameStyle: CSSProperties = {
  ...condensed,
  margin: 0,
  padding: ".04em .02em 0",
  overflow: "hidden",
  lineHeight: 0.84,
  letterSpacing: "-.01em",
  fontSize: "clamp(4rem,19vw,22rem)",
  whiteSpace: "nowrap",
};

function Letters() {
  return (
    <>
      {NAME.split("").map((c, i) =>
        c === " " ? (
          <span key={i} className="inline-block w-[.22em]" />
        ) : (
          <span
            key={i}
            className="inline-block"
            style={{
              animation: `h-rise 1.1s cubic-bezier(.22,1,.36,1) ${delay(0.25 + i * 0.06)} both`,
              ...(c === "." ? { color: "#FF3B00", WebkitTextStroke: 0 } : {}),
            }}
          >
            {c}
          </span>
        )
      )}
    </>
  );
}

/** Whole word slides up and out, next one slides in from below. */
function RoleRotator() {
  const [{ role, prev, tick }, set] = useState({ role: 0, prev: -1, tick: 0 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => set((s) => ({ prev: s.role, role: (s.role + 1) % ROLES.length, tick: s.tick + 1 })), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative grid h-[1.25em] overflow-hidden">
      {prev >= 0 && (
        <span key={`o${tick}`} className="whitespace-nowrap [grid-area:1/1]" style={{ animation: "word-out .6s cubic-bezier(.65,0,.35,1) both" }}>
          {ROLES[prev]}
        </span>
      )}
      <span key={`i${tick}`} className="whitespace-nowrap [grid-area:1/1]" style={{ animation: `word-in .7s cubic-bezier(.22,1,.36,1) ${prev >= 0 ? 0.12 : 0}s both` }}>
        {ROLES[role]}
      </span>
    </span>
  );
}

export default function HeroSection() {
  const { openModal } = useContactModal();
  const root = useRef<HTMLDivElement>(null);
  const nameA = useRef<HTMLDivElement>(null);
  const nameB = useRef<HTMLDivElement>(null);
  const caps = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  useHeroMotion({ root, layers: [nameA, nameB], caps, photo, light });

  return (
    <section id="top" data-stack className="relative bg-[#050505] pb-16 text-white">
      {/* Intro waits for the preloader curtain */}
      <div ref={root} className="relative h-screen min-h-[640px] overflow-hidden bg-[#050505]" style={{ "--hd": `${LOADER_INTRO_DELAY / 1000}s` } as CSSProperties}>
        <HeroBackground lightRef={light} />

        {/* Name — filled, behind the photo */}
        <div ref={nameA} className="hero-name absolute left-1/2 top-[28%] z-[1] text-[#f4f4f2]" style={{ translate: "-50% 0", filter: "drop-shadow(0 0 40px rgba(255,255,255,.22))" }}>
          <h1 style={nameStyle}>
            <span className="sr-only">Othmane Bouakline, développeur web freelance</span>
            <span aria-hidden><Letters /></span>
          </h1>
        </div>

        <HeroPortrait photoRef={photo} />

        {/* Name — outline, in front of the photo */}
        <div ref={nameB} aria-hidden className="hero-name pointer-events-none absolute left-1/2 top-[28%] z-[3]" style={{ translate: "-50% 0", color: "transparent", WebkitTextStroke: "1.2px rgba(244,244,242,.55)" }}>
          <div style={nameStyle}><Letters /></div>
        </div>

        <HeroOverlays />

        {/* Captions aligned to the name edges (invisible name copy sets the width) */}
        <div ref={caps} className="hero-name pointer-events-none absolute left-1/2 top-[28%] z-[4] flex flex-col" style={{ translate: "-50% 0" }}>
          <div aria-hidden style={{ ...nameStyle, visibility: "hidden" }}>{NAME}</div>
          <div className={`mt-[clamp(14px,1.6vw,24px)] flex items-start justify-between gap-6 text-[#f4f4f2] ${cap}`} style={fade(1.3)}>
            <span className="flex flex-col gap-0.5">
              <span className="text-[#f4f4f2]/50">Sites web</span>
              <span>qui ramènent des clients</span>
            </span>
            <span className="flex flex-col items-end gap-0.5 text-right">
              <span className="text-[#f4f4f2]/50">Freelance</span>
              <span className="text-abcs-red"><RoleRotator /></span>
            </span>
          </div>
        </div>

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-[5] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(20px,3vw,44px)] py-[clamp(22px,3vw,40px)]" style={fade(0.2)}>
          <span className="uppercase" style={{ ...condensed, fontSize: 24, letterSpacing: ".01em" }}>
            O&apos;LDEV
          </span>
          <span className="hidden md:inline-flex"><ParisTime /></span>
          <DispoBadge />
        </div>

        {/* Bottom bar */}
        <div
          className="absolute bottom-[clamp(28px,6vh,64px)] left-[clamp(20px,3vw,44px)] right-[clamp(20px,3vw,44px)] z-[5] grid grid-cols-1 items-center justify-items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:justify-items-stretch"
          style={fade(1.5)}
        >
          <HeroSocials className="order-2 md:order-none" />
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-abcs-red py-[7px] pl-6 pr-[7px] text-[13px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_40px_-8px_rgba(255,59,0,0.6)] transition-all duration-200 hover:bg-white hover:text-abcs-black"
          >
            Réserver un appel
            <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-abcs-black text-[15px] text-white">↗</span>
          </button>
          <a href={`mailto:${EMAIL}`} className={`hidden justify-self-end text-[#f4f4f2] transition-colors hover:text-abcs-red lg:block ${cap}`}>
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
