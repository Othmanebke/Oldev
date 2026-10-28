"use client";

import type { CSSProperties } from "react";
import { LOADER_INTRO_DELAY } from "@/components/Preloader";
import { delay, fade, LogoMark } from "@/components/hero/HeroParts";
import GradientASCII from "@/components/fx/GradientASCII";
import { useContactModal } from "@/components/ContactModalProvider";
import { HERO_CODE } from "@/lib/heroCode";
import { useScrollToSection } from "@/lib/useScrollToSection";

const HD = LOADER_INTRO_DELAY / 1000;

/**
 * Text typed letter by letter after the preloader: one inline-block span per
 * character (delay `start + index × step`), words kept unbroken, spaces as .26em gaps.
 */
function Typed({ text, start, step }: { text: string; start: number; step: number }) {
  const words = text.split(" ");
  // Index of each word's first letter in the whole text (spaces count as one step)
  const first = words.map((_, w) => words.slice(0, w).reduce((s, x) => s + Array.from(x).length + 1, 0));
  return words.map((word, w) => (
    <span key={w} className="inline-flex whitespace-nowrap">
      {w > 0 && <span aria-hidden className="inline-block w-[.26em]" />}
      {Array.from(word).map((ch, i) => (
        <span key={i} className="inline-block" style={{ animation: `h-ch .08s linear ${delay(start + (first[w] + i) * step)} both` }}>
          {ch}
        </span>
      ))}
    </span>
  ));
}

const archivo = "var(--font-archivo-flex), sans-serif";

export default function HeroSection() {
  const scrollToSection = useScrollToSection();
  const { openModal } = useContactModal();

  return (
    <section id="top" data-stack className="relative bg-black text-white">
      {/* Intro waits for the preloader */}
      <div className="relative h-[100svh] min-h-[640px] overflow-hidden bg-black" style={{ "--hd": `${HD}s` } as CSSProperties}>
        <div aria-hidden className="absolute inset-0 z-0">
          <GradientASCII
            colors={["#000000", "#FF3B00", "#f0fdfa"]}
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
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[58%]" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.72) 55%,#000 100%)" }} />

        {/* Top bar: logo mark only, no entrance (the preloader's "O" sits right on it) */}
        <div className="absolute inset-x-0 top-0 z-[5] flex justify-center py-[clamp(22px,3vw,40px)]">
          <LogoMark id="hero-logo" className="h-[26px] text-[#f4f4f2]" />
        </div>

        <div
          className="absolute inset-x-0 z-[5] flex flex-col items-center px-5 text-center"
          style={{ bottom: "clamp(28px,11vh,150px)", gap: "clamp(12px,1.8vh,18px)" }}
        >
          {/* Above the portal: "codée" falls over "site," */}
          <p
            aria-hidden
            className="m-0 flex flex-col items-center font-medium leading-[1.15] tracking-[-.03em] text-[rgba(244,244,242,.88)]"
            style={{ fontFamily: archivo, fontSize: "clamp(22px,2vw,30px)", textShadow: "0 2px 20px rgba(0,0,0,.6)", marginBottom: "clamp(150px,40vh,460px)" }}
          >
            <span className="flex flex-wrap justify-center pr-[2.4em] max-[400px]:pr-[1.2em]">
              <Typed text="Chaque ligne, codée à la main." start={0.4} step={0.055} />
            </span>
            <span className="flex flex-wrap justify-center pl-[2.4em] max-[400px]:pl-[1.2em]">
              <Typed text="Chaque site, pensé pour vendre" start={1.775} step={0.055} />
            </span>
          </p>

          <h1
            className="m-0 font-sans font-semibold leading-[1.2] tracking-[-.035em] text-white text-balance"
            style={{ fontSize: "clamp(22px,2vw,30px)", textShadow: "0 2px 24px rgba(0,0,0,.7)" }}
          >
            <span className="flex flex-wrap justify-center">
              <Typed text="Développeur web freelance" start={3.4} step={0.04} />
            </span>
            <span className="sr-only"> Othmane Bouakline, O&apos;LDEV, Seine-et-Marne. Chaque ligne codée à la main, chaque site pensé pour vendre.</span>
          </h1>
          <p className="m-0 flex flex-wrap justify-center font-medium text-[#d0d0d0]" style={{ fontSize: "clamp(16px,1.3vw,19px)", textShadow: "0 2px 16px rgba(0,0,0,.8)" }}>
            <Typed text="Des sites qui donnent envie" start={4.55} step={0.03} />
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3" style={fade(5.56)}>
            <button onClick={() => openModal()} className="btn-glass-primary" style={{ "--sweep-delay": delay(6.36) } as CSSProperties}>
              Devis gratuit <span aria-hidden className="text-[14px] opacity-90">↗</span>
            </button>
            <a
              href="#portfolio"
              onClick={(e) => {
                if (scrollToSection("portfolio")) e.preventDefault();
              }}
              className="btn-glass"
            >
              Voir les projets
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
