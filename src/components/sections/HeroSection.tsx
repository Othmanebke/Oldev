"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  siReact, siNextdotjs, siTypescript, siTailwindcss, siWordpress, siFigma,
  siNodedotjs, siJavascript, siHtml5, siSupabase, siVercel, siPostgresql,
  type SimpleIcon,
} from "simple-icons";
import { useContactModal } from "@/components/ContactModalProvider";
import { LOADER_INTRO_DELAY } from "@/components/Preloader";
import { useScrollToSection } from "@/lib/useScrollToSection";
import heroPhoto from "@/img/hero.webp";

// [icon, left, top, size (px), rotation (deg)]
// Phones only keep the side icons (indexes below) so the name and face stay clear
const PHONE_ICONS = new Set([2, 3, 6, 7]);
const ICONS: [SimpleIcon, string, string, number, number][] = [
  [siReact, "6%", "16%", 68, -8], [siNextdotjs, "18%", "34%", 56, 6], [siTypescript, "4%", "58%", 60, 10], [siTailwindcss, "15%", "74%", 64, -6],
  [siWordpress, "88%", "14%", 66, 8], [siFigma, "78%", "30%", 54, -10], [siNodedotjs, "91%", "50%", 62, -4], [siJavascript, "80%", "70%", 58, 12],
  [siHtml5, "30%", "12%", 50, -12], [siSupabase, "66%", "10%", 52, 10], [siVercel, "34%", "60%", 46, 4], [siPostgresql, "62%", "56%", 48, -8],
];

const PROOF = [
  { v: "10+", l: "projets livrés" },
  { v: "5 ans", l: "d’expérience" },
  { v: "48 h", l: "délai de réponse max" },
];

const NAME = ["Othmane", "B."];

/** Roles cycling under the name — one per offer. */
const ROLES = ["Développeur web", "Web designer", "Expert WordPress", "Dev Next.js", "Créateur de sites"];

/** Cycles through ROLES: letters roll up out of a mask, the next word rolls in. Static under reduced motion. */
function RoleRotator() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval>;
    // First switch once the intro has played
    const start = setTimeout(() => {
      setI(1);
      timer = setInterval(() => setI((v) => (v + 1) % ROLES.length), 2600);
    }, LOADER_INTRO_DELAY + 2600);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, []);

  return (
    <p
      aria-hidden
      className="m-0 flex items-center gap-[0.4em] font-heading uppercase leading-none tracking-[-0.02em]"
      style={{ fontSize: "clamp(1.4rem,2.7vw,2.7rem)" }}
    >
      <span className="h-[0.14em] w-[1.1em] shrink-0 rounded-full bg-abcs-black/25" />
      <span className="relative block h-[1.08em] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={ROLES[i]} className="flex whitespace-pre text-abcs-red">
            {ROLES[i].split("").map((ch, k) => (
              <motion.span
                key={k}
                className="inline-block"
                initial={{ y: "110%", rotate: 6 }}
                animate={{ y: "0%", rotate: 0 }}
                exit={{ y: "-110%", rotate: -4, transition: { duration: 0.32, ease: [0.64, 0, 0.78, 0], delay: k * 0.01 } }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.38 + k * 0.025 }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { openModal } = useContactModal();
  const scrollToSection = useScrollToSection();

  // Intro plays once the loader curtain is rising (immediately under reduced motion)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => ref.current?.classList.add("is-in"), reduce ? 0 : LOADER_INTRO_DELAY);
    return () => clearTimeout(timer);
  }, []);

  let letter = 0;

  return (
    <section
      ref={ref}
      id="top"
      data-stack
      className="hero relative flex min-h-screen flex-col justify-between overflow-hidden bg-abcs-bg text-abcs-black"
      style={{ padding: "clamp(28px,4vw,48px) clamp(20px,4vw,48px) 160px" }}
    >
      {/* Grid, faded out by a radial mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,17,17,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 65% at 50% 55%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 55%, black 20%, transparent 80%)",
        }}
      />

      {/* Orange circles behind the photo */}
      <div
        aria-hidden
        data-hero="ring"
        className="pointer-events-none absolute left-1/2 z-[1] aspect-square -translate-x-1/2 rounded-full border-[1.5px] border-[rgba(255,59,0,0.35)]"
        style={{ ...idx(0), bottom: "-38%", width: "min(1000px,110vw)" }}
      />
      <div
        aria-hidden
        data-hero="ring"
        className="pointer-events-none absolute left-1/2 z-[1] aspect-square -translate-x-1/2 rounded-full border-[1.5px] border-dashed border-[rgba(255,59,0,0.25)]"
        style={{ ...idx(1), bottom: "-22%", width: "min(720px,80vw)" }}
      />

      {/* Floating stack logos */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        {ICONS.map(([icon, x, y, size, rot], i) => (
          <span
            key={icon.slug}
            data-hero="icon"
            className={`absolute items-center justify-center rounded-[18px] ${PHONE_ICONS.has(i) ? "flex" : "hidden md:flex"} border border-[rgba(255,59,0,0.22)] bg-white/35`}
            style={{
              ...idx(i),
              left: x,
              top: y,
              width: size,
              height: size,
              rotate: `${rot}deg`,
              animation: `hero-float ${6 + (i % 4)}s ease-in-out ${(i * 0.37).toFixed(2)}s infinite`,
            }}
          >
            <svg viewBox="0 0 24 24" className="h-[52%] w-[52%] opacity-55" fill="#FF3B00">
              <path d={icon.path} />
            </svg>
          </span>
        ))}
      </div>

      {/* Top bar */}
      <div data-hero="fade" className="relative z-[6] order-1 flex items-center justify-between gap-4">
        <span className="font-heading text-[20px] tracking-[-0.01em]">O&apos;LDEV</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(34,160,90,0.12)] px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-abcs-green-text">
          <span className="h-2 w-2 rounded-full bg-abcs-green" />
          Disponible
        </span>
      </div>

      {/* Name — behind the photo */}
      <h1
        className="relative z-[4] order-2 flex flex-wrap gap-x-[0.3em] font-heading font-normal uppercase leading-[0.82] tracking-[-0.04em]"
        style={{ margin: "clamp(40px,8vh,96px) 0 0", fontSize: "clamp(3.2rem,10.5vw,11rem)" }}
      >
        <span className="sr-only">Othmane Bouakline, développeur web freelance</span>
        {NAME.map((word) => (
          <span key={word} aria-hidden className="split-mask">
            {word.split("").map((ch, i) => (
              <span key={i} className="split-unit" style={idx(letter++)}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* Rotating roles — in front of the photo so they stay readable */}
      <div data-hero="fade-late" className="relative z-[6] order-2 mt-[clamp(10px,1.6vw,22px)]">
        <RoleRotator />
      </div>

      {/* Photo — in front of the name. Phones: in the flow under the name; ≥ md: anchored at the bottom */}
      <div
        className="pointer-events-none relative z-[5] order-3 mx-auto mt-4 h-[62svh] max-h-[640px] md:absolute md:bottom-0 md:left-1/2 md:order-none md:mt-0 md:h-[84%] md:max-h-none md:-translate-x-1/2"
        style={{ aspectRatio: `${heroPhoto.width} / ${heroPhoto.height}` }}
      >
        <Image
          data-hero="photo"
          src={heroPhoto}
          alt="Othmane Bouakline"
          fill
          fetchPriority="low"
          sizes="(max-width: 768px) 70vw, 45vw"
          className="object-contain object-bottom"
        />
      </div>

      {/* Bottom blocks */}
      <div data-hero="fade-late" className="relative z-[6] order-4 -mt-16 flex flex-wrap items-end justify-between gap-4 sm:gap-7 md:mt-auto">
        <div className="flex max-w-[360px] flex-col gap-[18px] rounded-[20px] bg-[rgba(240,240,238,0.86)] p-5 backdrop-blur-[8px]">
          <p className="text-[19px] font-semibold leading-[1.4] text-pretty">
            Je crée des sites rapides pour les indépendants et PME qui veulent plus de clients, pas juste un joli site.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-full bg-abcs-black px-[22px] py-[15px] text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-abcs-red"
            >
              Réserver un appel <span aria-hidden>↗</span>
            </button>
            <a
              href="#portfolio"
              onClick={(e) => {
                if (scrollToSection("portfolio")) e.preventDefault();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-abcs-black/25 px-[22px] py-[15px] text-[13px] font-bold uppercase tracking-[0.14em] text-abcs-black transition-colors hover:border-abcs-red hover:text-abcs-red-text"
            >
              Voir mes projets
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 rounded-[20px] bg-[rgba(240,240,238,0.86)] px-5 py-[18px] backdrop-blur-[8px]">
          {PROOF.map((p) => (
            <div key={p.l} className="flex items-baseline gap-2.5">
              <span className="font-heading text-[22px]">{p.v}</span>
              <span className="text-[14px] text-abcs-black/70">{p.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
