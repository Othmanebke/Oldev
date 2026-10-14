"use client";

import { useEffect, useRef } from "react";
import Watermark from "@/components/fx/Watermark";
import Grain from "@/components/fx/Grain";
import { section } from "@/components/sections/layout";

/**
 * `*word*` italic light · `^word` lights up orange · `~word` circled by hand
 * · `=word` highlighted. Everything else lights up in #f4f4f2.
 */
const ABOUT =
  "Moi c'est Othmane, développeur web freelance en Seine-et-Marne. Je conçois et code à la main des sites *rapides,* *sur-mesure* et pensés pour ~convertir. De la maquette Figma au déploiement en ^Next.js ou ^WordPress, j'accompagne artisans, PME et startups partout en =France.";

const WORDS = ABOUT.split(" ").map((raw) => {
  const kind = raw[0] === "*" ? "italic" : raw[0] === "^" ? "accent" : raw[0] === "~" ? "circle" : raw[0] === "=" ? "mark" : "";
  return { kind, t: kind ? raw.replace(/^[*^~=]/, "").replace(/\*(?=\W*$)/, "") : raw };
});

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Who I am: one big paragraph lit word by word as it scrolls through the viewport. */
export function AboutSection() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.setAttribute("data-on", ""));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight, r = el.getBoundingClientRect();
      const lit = clamp01((vh * 0.85 - r.top) / (r.height * 0.7 + vh * 0.25)) * words.length;
      words.forEach((w, i) => w.toggleAttribute("data-on", i < lit));
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
      id="about"
      className={`${section} flex min-h-[90vh] items-center justify-center`}
      style={{ padding: "clamp(56px,7vw,96px) clamp(20px,5vw,72px)" }}
    >
      <Grain />
      <Watermark text="Othmane" index={0} />
      <p
        ref={ref}
        className="about relative z-[1] m-0 max-w-[1180px] text-center"
        style={{
          fontFamily: "var(--font-archivo-flex), sans-serif",
          fontWeight: 600,
          fontStretch: "88%",
          fontSize: "clamp(2rem,4.8vw,5rem)",
          lineHeight: 1.06,
          textWrap: "balance",
        }}
      >
        {WORDS.map((w, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span
              data-w=""
              data-k={w.kind || undefined}
              className={w.kind === "italic" ? "font-light italic [font-stretch:100%]" : w.kind === "circle" ? "relative inline-block" : undefined}
            >
              {w.t}
              {w.kind === "circle" && (
                <svg aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-[.18em] -inset-y-[.12em] h-[calc(100%+.24em)] w-[calc(100%+.36em)] overflow-visible">
                  <path
                    d="M10 24C6 12 38 4 62 5c22 1 36 8 34 17-2 11-30 16-54 15C18 36 2 30 6 20 9 12 30 6 48 6"
                    pathLength={1}
                    fill="none"
                    stroke="#FF3B00"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </span>
        ))}
      </p>
      <p className="sr-only">
        Développeur web freelance avec 5 ans d&apos;expérience (Inetum, Fujitsu, AJC), diplômé d&apos;un Bac+5 Expert
        Informatique Web. Basé à Brie-Comte-Robert, en Seine-et-Marne (Île-de-France).
      </p>
    </section>
  );
}
