"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { LOADER_INTRO_DELAY } from "@/components/Preloader";
import { delay, fade, DispoBadge, HeroBackdrop, LogoMark } from "@/components/hero/HeroParts";
import { useScrollToSection } from "@/lib/useScrollToSection";

const HD = LOADER_INTRO_DELAY / 1000;
const EASE = "cubic-bezier(.22,1,.36,1)";

/** Scattered lines, alternating left / right entrances (centred column on phones, see .hero-line). */
const LINES = [
  { t: "Chaque ligne,", x: "45%", y: "44%", from: "h-sl" },
  { t: "codée à la main.", x: "41%", y: "50%", from: "h-sr" },
  { t: "Chaque site,", x: "50.5%", y: "57.5%", from: "h-sl" },
  { t: "pensé pour vendre.", x: "52%", y: "63.5%", from: "h-sr" },
];

export default function HeroSection() {
  const scrollToSection = useScrollToSection();

  return (
    // Bottom padding: room for the next card, which overlaps it
    <section id="top" data-stack className="relative bg-[#050505] pb-16 text-white">
      {/* Intro waits for the preloader, whose last frame is this same backdrop */}
      <div className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[#050505]" style={{ "--hd": `${HD}s` } as CSSProperties}>
        <HeroBackdrop drift />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] opacity-[.14] mix-blend-overlay"
          style={{
            backgroundSize: "160px",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Top bar: logo mark centred, availability on the right */}
        <div className="absolute inset-x-0 top-0 z-[5] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(20px,3vw,44px)] py-[clamp(22px,3vw,40px)]" style={fade(0.2)}>
          <span />
          <LogoMark className="w-[28px] text-[#f4f4f2]" />
          <DispoBadge />
        </div>

        {LINES.map((l, i) => (
          <span
            key={l.t}
            aria-hidden
            className="hero-line z-[4] whitespace-nowrap font-sans font-medium tracking-[-.01em] text-[#f4f4f2]"
            style={
              {
                "--x": l.x,
                "--y": l.y,
                "--n": i,
                fontSize: "clamp(15px,1.15vw,18px)",
                textShadow: "0 1px 18px rgba(0,0,0,.35)",
                animation: `${l.from} 1.3s ${EASE} ${delay(0.5 + i * 0.5)} both`,
              } as CSSProperties
            }
          >
            {l.t}
          </span>
        ))}

        <h1
          className="absolute inset-x-0 z-[4] m-0 px-6 text-center font-sans font-semibold tracking-[-.035em] text-[#f4f4f2]"
          style={{ bottom: "clamp(120px,18vh,170px)", fontSize: "clamp(24px,2.1vw,32px)", animation: `h-fade 1.4s ${EASE} ${delay(2.6)} both` }}
        >
          Développeur web freelance<span className="text-abcs-red">.</span>
          <span className="sr-only"> Othmane Bouakline, O&apos;LDEV, Seine-et-Marne. Chaque ligne codée à la main, chaque site pensé pour vendre.</span>
        </h1>

        {/* Projects card: bottom right, centred on phones (always under the tagline) */}
        <a
          href="#portfolio"
          onClick={(e) => {
            if (scrollToSection("portfolio")) e.preventDefault();
          }}
          className="group absolute bottom-[clamp(20px,4vh,36px)] right-[clamp(20px,3vw,44px)] z-[5] flex items-center gap-4 whitespace-nowrap rounded-[14px] border border-white/[0.14] bg-[rgba(20,20,20,.55)] p-2 pr-5 backdrop-blur-[14px] transition-colors duration-300 hover:border-abcs-red max-[639px]:right-1/2 max-[639px]:translate-x-1/2"
          style={fade(1.5)}
        >
          <span className="relative block h-16 w-[110px] shrink-0 overflow-hidden rounded-[9px] max-[639px]:h-14 max-[639px]:w-24">
            <Image src="/defil-travaux/hero-01.jpg" alt="" fill sizes="110px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span aria-hidden className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-abcs-red text-[14px] text-white">↗</span>
          </span>
          <span className="font-sans text-[14px] font-semibold text-[#f4f4f2]">Voir les projets</span>
        </a>
      </div>
    </section>
  );
}
