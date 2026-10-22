"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { HeroBackdrop, LogoMark } from "@/components/hero/HeroParts";

/** Moment where the hero intro starts (the preloader is fading out). */
export const LOADER_INTRO_DELAY = 4600;
const LOADER_UNMOUNT = 4750;

const E_OUT = "cubic-bezier(.22,1,.36,1)";
const LINES = [["Des", "sites", "codés", "à", "la", "main,"], ["pensés", "pour", "que", "vos", "clients"], ["vous", "appellent", "vraiment."]];
// Index of the first word of each line, for the 70 ms stagger across lines
const START = LINES.map((_, l) => LINES.slice(0, l).flat().length);
const CARDS = [-6, 4, -3, 5, -2, 3, -1, 0];

/**
 * Sentence word by word (0.3s) → it leaves (1.75s) → 8 project mockups pile up
 * in the middle (2s) → a layer with the exact hero backdrop grows from the card
 * to the full screen (3.2s) → fade out (4.2s) onto the identical hero.
 * Not rendered under reduced motion.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setVisible(false), reduce ? 0 : LOADER_UNMOUNT);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="preloader fixed inset-0 z-[300] overflow-hidden bg-[#050505]"
      style={{ "--cw": "min(440px,72vw)", "--ch": "calc(var(--cw) * .625)", animation: "fade-out .45s ease 4.2s forwards" } as CSSProperties}
    >
      <div className="absolute left-1/2 top-[clamp(20px,3vw,32px)] grid h-[34px] w-[34px] -translate-x-1/2 place-items-center" style={{ animation: "fade-in .6s ease .1s both" }}>
        <LogoMark label={false} className="w-[26px] text-[#f4f4f2]" />
      </div>

      <div className="absolute inset-0 grid place-items-center p-6">
        <p
          className="m-0 max-w-[900px] text-center text-[#f4f4f2]"
          style={{
            fontFamily: "var(--font-archivo-flex), sans-serif",
            fontWeight: 500,
            fontSize: "clamp(26px,3.6vw,50px)",
            lineHeight: 1.3,
            letterSpacing: "-.025em",
            textWrap: "balance",
            animation: "ld-out .55s cubic-bezier(.65,0,.35,1) 1.75s forwards",
          }}
        >
          {LINES.map((line, l) => (
            <span key={l}>
              {l > 0 && <br />}
              {line.map((word, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  <span
                    className={`inline-block ${word === "vraiment." ? "text-abcs-red" : ""}`}
                    style={{ animation: `ld-in .8s ${E_OUT} ${(0.3 + (START[l] + i) * 0.07).toFixed(2)}s both` }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      {CARDS.map((r, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 aspect-[16/10] w-[var(--cw)] overflow-hidden rounded-[16px] bg-[#1A1A1A]"
          style={
            {
              "--r": `${r}deg`,
              boxShadow: "0 30px 70px -25px rgba(0,0,0,.95),inset 0 0 0 1px rgba(255,255,255,.08)",
              animation: `ld-card .6s ${E_OUT} ${(2 + i * 0.11).toFixed(2)}s both`,
            } as CSSProperties
          }
        >
          <Image src={`/defil-travaux/hero-0${i + 1}.jpg`} alt="" fill sizes="440px" className="object-cover" />
        </div>
      ))}

      {/* The hero backdrop, opening from the card size to the full screen */}
      <div
        className="absolute inset-0 overflow-hidden bg-[#050505] opacity-0"
        style={{ animation: "ld-expand .95s cubic-bezier(.76,0,.24,1) 3.2s both, fade-in .01s linear 3.2s both" }}
      >
        <HeroBackdrop />
      </div>
    </div>
  );
}
