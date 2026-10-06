"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { LOADER_INTRO_DELAY } from "@/components/Preloader";
import { delay, fade, DispoBadge, HeroBackground, HeroOverlays, HeroPortrait, ParisTime, condensed, useHeroMotion } from "@/components/hero/HeroParts";
import { useScrollToSection } from "@/lib/useScrollToSection";

const HD = LOADER_INTRO_DELAY / 1000;
const FIXED = "Développeur";
const WORDS = ["Web", "WordPress", "Next.js", "React"];
const TRADES = ["Développement web", "WordPress", "Next.js · React", "Web design"];
const EASE = "cubic-bezier(.22,1,.36,1)";

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 800,
  lineHeight: 0.86,
  letterSpacing: "-.045em",
  whiteSpace: "nowrap",
};

/** One word, letter by letter: rising in, or leaving upwards with a blur. */
function Word({ text, out, first }: { text: string; out?: boolean; first?: boolean }) {
  return (
    <span className="whitespace-nowrap [grid-area:1/1]">
      {[...text, "."].map((c, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: out
              ? `h-out .55s cubic-bezier(.65,0,.35,1) ${i * 0.025}s both`
              : `h-rise .9s ${EASE} ${first ? delay(0.85 + i * 0.045) : `${0.18 + i * 0.045}s`} both`,
            ...(i === text.length ? { color: "#FF3B00" } : {}),
          }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/** Second title line: cycles through the stacks every 2.6 s (static under reduced motion). */
function WordRotator() {
  const [{ cur, prev, tick }, set] = useState({ cur: 0, prev: -1, tick: 0 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setInterval>;
    // First swap once the intro (preloader + entrance) is over
    const start = setTimeout(() => {
      const next = () => set((s) => ({ prev: s.cur, cur: (s.cur + 1) % WORDS.length, tick: s.tick + 1 }));
      next();
      t = setInterval(next, 2600);
    }, (HD + 0.85 + 2.6) * 1000);
    return () => {
      clearTimeout(start);
      clearInterval(t);
    };
  }, []);
  return (
    <span className="grid h-[1.08em] overflow-hidden leading-[1.08]" style={{ color: "rgba(244,244,242,.2)" }}>
      {prev >= 0 && <Word key={`o${tick}`} text={WORDS[prev]} out />}
      <Word key={`i${tick}`} text={WORDS[cur]} first={tick === 0} />
    </span>
  );
}

export default function HeroSection() {
  const scrollToSection = useScrollToSection();
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const lead = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  useHeroMotion({ root, layers: [title], caps: lead, photo, light });

  const jump = (id: string) => (e: React.MouseEvent) => {
    if (scrollToSection(id)) e.preventDefault();
  };

  return (
    <section id="top" data-stack className="relative bg-[#050505] pb-16 text-white">
      {/* Intro waits for the preloader curtain */}
      <div ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#050505]" style={{ "--hd": `${HD}s` } as CSSProperties}>
        <HeroBackground lightRef={light} />

        {/* Giant title, behind the photo — overflows the right edge on purpose */}
        <div
          ref={title}
          className="absolute left-[clamp(12px,1.6vw,28px)] top-[11%] z-[1] text-[#f4f4f2] text-[clamp(4rem,17vw,24rem)] max-[700px]:top-[13%] max-[700px]:text-[19vw]"
        >
          <h1 style={titleStyle}>
            <span className="sr-only">Développeur web freelance — Othmane Bouakline</span>
            <span aria-hidden className="block">
              <span className="block overflow-hidden pb-[.12em] pt-[.04em] -mb-[.12em]">
                {[...FIXED].map((c, i) => (
                  <span key={i} className="inline-block" style={{ animation: `h-rise 1.1s ${EASE} ${delay(0.25 + i * 0.05)} both` }}>
                    {c}
                  </span>
                ))}
              </span>
              <WordRotator />
            </span>
          </h1>
        </div>

        <HeroPortrait photoRef={photo} />
        <HeroOverlays />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-[5] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(20px,3vw,44px)] py-[clamp(22px,3vw,40px)]" style={fade(0.2)}>
          <span className="uppercase" style={{ ...condensed, fontSize: 24, letterSpacing: ".01em" }}>
            O&apos;LDEV
          </span>
          <span className="hidden min-[701px]:inline-flex"><ParisTime /></span>
          <DispoBadge />
        </div>

        {/* Lead — left; drops to the bottom on phones */}
        <div
          ref={lead}
          className="absolute left-[clamp(20px,3vw,44px)] top-1/2 z-[5] max-w-[250px] [translate:0_-50%] max-[700px]:top-auto max-[700px]:bottom-[96px] max-[700px]:left-5 max-[700px]:right-5 max-[700px]:max-w-[300px] max-[700px]:[translate:none]"
        >
          <div className="flex flex-col gap-4" style={fade(1.3)}>
            <p className="m-0 font-sans text-[14px] leading-[1.6] text-[#f4f4f2]/80 text-pretty max-[700px]:text-[15px]">
              Je conçois et développe des sites web sur-mesure, rapides et pensés pour ramener des clients.
            </p>
            <a href="#about" onClick={jump("about")} className="group inline-flex w-fit items-center gap-2 text-[14px] font-semibold text-[#f4f4f2] transition-colors hover:text-white">
              En savoir plus
              <span aria-hidden className="text-abcs-red transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Projects card — bottom right (hidden on phones) */}
        <a
          href="#portfolio"
          onClick={jump("portfolio")}
          className="group absolute bottom-[clamp(76px,11vh,110px)] right-[clamp(20px,3vw,44px)] z-[5] flex items-center gap-4 whitespace-nowrap rounded-[14px] border border-white/[0.14] bg-[rgba(20,20,20,.55)] p-2 pr-5 backdrop-blur-[14px] transition-colors duration-300 hover:border-abcs-red max-[700px]:hidden"
          style={fade(1.5)}
        >
          <span className="relative block h-16 w-[110px] shrink-0 overflow-hidden rounded-[9px]">
            <Image src="/defil-travaux/hero-01.jpg" alt="" fill sizes="110px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span aria-hidden className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-abcs-red text-[14px] text-white">↗</span>
          </span>
          <span className="font-sans text-[14px] font-semibold text-[#f4f4f2]">Voir les projets</span>
        </a>

        {/* Trades — bottom line */}
        <ul
          className="absolute bottom-[clamp(24px,4vh,40px)] left-[clamp(20px,3vw,44px)] right-[clamp(20px,3vw,44px)] z-[5] m-0 flex list-none justify-between gap-4 p-0 font-sans text-[13px] text-[#f4f4f2]/75 max-[700px]:grid max-[700px]:grid-cols-2 max-[700px]:gap-x-4 max-[700px]:gap-y-1.5 max-[700px]:border-t max-[700px]:border-white/[0.14] max-[700px]:pt-[14px] max-[700px]:text-[12px]"
          style={fade(1.6)}
        >
          {TRADES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
