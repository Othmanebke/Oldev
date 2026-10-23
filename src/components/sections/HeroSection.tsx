"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { LOADER_INTRO_DELAY } from "@/components/Preloader";
import { delay, fade, LogoMark } from "@/components/hero/HeroParts";
import GradientASCII from "@/components/fx/GradientASCII";
import { HERO_CODE } from "@/lib/heroCode";
import { useScrollToSection } from "@/lib/useScrollToSection";

const HD = LOADER_INTRO_DELAY / 1000;
const EASE = "cubic-bezier(.22,1,.36,1)";

/** Lines around the ASCII shape, alternating left / right entrances (centred column on phones, see .hero-line). */
const LINES = [
  { t: "Chaque ligne,", x: "33%", y: "16%", my: "17%", from: "h-sl" },
  { t: "codée à la main.", x: "51%", y: "26%", my: "23%", from: "h-sr" },
  { t: "Chaque site,", x: "34%", y: "65%", my: "62%", from: "h-sl" },
  { t: "pensé pour vendre.", x: "50%", y: "72%", my: "68%", from: "h-sr" },
];

export default function HeroSection() {
  const scrollToSection = useScrollToSection();

  return (
    // Bottom padding: room for the next card, which overlaps it
    <section id="top" data-stack className="relative bg-black pb-16 text-white">
      {/* Intro waits for the preloader */}
      <div className="relative h-[100svh] min-h-[600px] overflow-hidden bg-black" style={{ "--hd": `${HD}s` } as CSSProperties}>
        <div aria-hidden className="absolute inset-0 z-0">
          <GradientASCII
            colors={["#000000", "#f97316", "#f0fdfa"]}
            shape="pinch"
            characters=" .:-=+*#%@"
            cellSize={14}
            density={0.8}
            glyphOpacity={1}
            glow={0.2}
            depthOfField={0}
            flicker={0.2}
            softness={0.5}
            scale={1}
            flow={0.5}
            speed={1}
            gradientOpacity={0.9}
            grain={0.08}
            variation={0}
            mouseInteraction
            scrambleRadius={0.1}
            clickEffect="wave"
            intro
            // Starts under the preloader, so its band is there when the preloader fades
            introDelay={1.8}
            lightMode={false}
            codeText={HERO_CODE}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] opacity-[.14] mix-blend-overlay"
          style={{
            backgroundSize: "160px",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
        />

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[42%]" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 60%,#000 100%)" }} />

        {/* Top bar: logo mark only, no entrance (the preloader's "O" sits right on it) */}
        <div className="absolute inset-x-0 top-0 z-[5] flex justify-center py-[clamp(22px,3vw,40px)]">
          <LogoMark id="hero-logo" className="h-[26px] text-[#f4f4f2]" />
        </div>

        {LINES.map((l, i) => (
          <span
            key={l.t}
            aria-hidden
            className="hero-line z-[4] whitespace-nowrap font-semibold tracking-[-.03em] text-[#f4f4f2]"
            style={
              {
                "--x": l.x,
                "--y": l.y,
                "--my": l.my,
                fontFamily: "var(--font-archivo-flex), sans-serif",
                fontSize: "clamp(22px,2.4vw,38px)",
                textShadow: "0 2px 24px rgba(0,0,0,.6)",
                animation: `${l.from} 1.3s ${EASE} ${delay(0.5 + i * 0.5)} both`,
              } as CSSProperties
            }
          >
            {l.t}
          </span>
        ))}

        <h1
          // Above the projects card below 1024px, where they would cross
          className="absolute inset-x-0 bottom-[clamp(64px,7vh,84px)] z-[4] m-0 px-6 text-center font-sans font-semibold tracking-[-.035em] text-[#f4f4f2] max-lg:bottom-[clamp(116px,15vh,136px)]"
          style={{ fontSize: "clamp(24px,2.1vw,32px)", animation: `h-fade 1.4s ${EASE} ${delay(2.6)} both` }}
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
