"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { LogoMark } from "@/components/hero/HeroParts";

/** Moment where the hero intro starts (the preloader is fading out). */
export const LOADER_INTRO_DELAY = 4600;
const LOADER_UNMOUNT = 5000;

const E_OUT = "cubic-bezier(.22,1,.36,1)";
const LINES = [["Des", "sites", "codés", "à", "la", "main,"], ["pensés", "pour", "que", "vos", "clients"], ["vous", "appellent", "vraiment."]];
// Index of the first word of each line, for the 70 ms stagger across lines
const START = LINES.map((_, l) => LINES.slice(0, l).flat().length);

/** Mockups flying up from under the screen: [left %, width clamp (min px, vw, max px), rotation, duration, delay, image]. */
const FLY: [number, number, number, number, number, number, number, number][] = [
  [4, 116, 14.6, 210, 4, 1.79, 0.45, 1],
  [53, 154, 19.4, 280, -3, 1.63, 0.55, 2],
  [86, 132, 16.7, 240, 5, 1.87, 0.65, 3],
  [39, 165, 20.8, 300, -2, 1.71, 0.75, 4],
  [72, 121, 15.3, 220, 6, 1.55, 0.85, 5],
  [25, 143, 18.1, 260, -5, 1.79, 0.95, 6],
  [26, 116, 14.6, 210, 3, 1.63, 1.07, 7],
  [75, 154, 19.4, 280, -6, 1.87, 1.17, 8],
  [3, 132, 16.7, 240, 4, 1.71, 1.27, 9],
  [52, 165, 20.8, 300, -3, 1.55, 1.37, 10],
  [85, 121, 15.3, 220, 5, 1.79, 1.47, 11],
  [38, 143, 18.1, 260, -2, 1.63, 1.57, 1],
  [7, 116, 14.6, 210, 6, 1.87, 1.69, 2],
  [56, 154, 19.4, 280, -5, 1.71, 1.79, 3],
  [89, 132, 16.7, 240, 3, 1.55, 1.89, 4],
  [42, 165, 20.8, 300, -6, 1.79, 1.99, 5],
  [75, 121, 15.3, 220, 4, 1.63, 2.09, 6],
  [19, 143, 18.1, 260, -3, 1.87, 2.19, 7],
];

/**
 * Sentence word by word (0.15s) while project mockups fly up across the screen
 * → a card rises from the bottom (2.45s) and opens to the full screen (3.25s)
 * on the hero's glowing band → cross-fade (4.25s) onto the hero, whose ASCII
 * background already draws that band. The "O" stays pinned on the hero's own
 * "O" (#hero-logo) the whole time. Not rendered under reduced motion.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const logo = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setVisible(false), reduce ? 0 : LOADER_UNMOUNT);
    const sync = () => {
      const h = document.getElementById("hero-logo"), l = logo.current;
      if (!h || !l) return;
      const r = h.getBoundingClientRect();
      l.style.left = `${r.left}px`;
      l.style.top = `${r.top}px`;
      l.style.height = `${r.height}px`;
      l.style.translate = "none";
    };
    sync();
    const raf = requestAnimationFrame(sync);
    const late = setTimeout(sync, 300);
    window.addEventListener("resize", sync);
    return () => {
      clearTimeout(timer);
      clearTimeout(late);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sync);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="preloader fixed inset-0 z-[300] overflow-hidden bg-black"
      style={{ "--cw": "min(440px,72vw)", "--ch": "calc(var(--cw) * .625)", animation: "fade-out .7s cubic-bezier(.4,0,.2,1) 4.25s forwards" } as CSSProperties}
    >
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
            animation: "ld-out .5s cubic-bezier(.65,0,.35,1) 3.1s forwards",
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
                    style={{ animation: `ld-in .7s ${E_OUT} ${(0.15 + (START[l] + i) * 0.07).toFixed(2)}s both` }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      {/* Starts at top:100%, so never visible at the bottom before it flies */}
      {FLY.map(([left, min, vw, max, r, dur, delay, img], i) => (
        <div
          key={i}
          className="absolute top-full aspect-[16/10] overflow-hidden rounded-[14px] bg-[#1A1A1A]"
          style={
            {
              "--r": `${r}deg`,
              left: `${left}%`,
              width: `clamp(${min}px,${vw}vw,${max}px)`,
              boxShadow: "0 30px 70px -25px rgba(0,0,0,.95),inset 0 0 0 1px rgba(255,255,255,.08)",
              animation: `ld-fly ${dur}s cubic-bezier(.35,.1,.25,1) ${delay}s both`,
            } as CSSProperties
          }
        >
          <Image src={`/defil-travaux/hero-${String(img).padStart(2, "0")}.jpg`} alt="" fill sizes="300px" className="object-cover" />
        </div>
      ))}

      {/* Hero card: rises from the bottom, then opens to the full screen on the
          same glowing band as the hero's ASCII background, which cross-fades in under it */}
      <div
        className="absolute inset-0 overflow-hidden bg-black opacity-0"
        style={{ animation: `ld-rise .85s ${E_OUT} 2.45s both, ld-expand 1s cubic-bezier(.76,0,.24,1) 3.25s both, fade-in .01s linear 2.45s both` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 15% at 50% 48%,rgba(240,253,250,.85) 0%,rgba(249,115,22,.85) 45%,rgba(249,115,22,0) 100%),radial-gradient(95% 30% at 50% 48%,rgba(249,115,22,.3) 0%,rgba(249,115,22,0) 70%)",
            filter: "blur(18px)",
          }}
        />
      </div>

      {/* Above everything, pinned on the hero logo (see sync) */}
      <LogoMark ref={logo} label={false} className="absolute left-1/2 top-[clamp(22px,3vw,40px)] z-[5] h-[26px] w-auto -translate-x-1/2 text-[#f4f4f2]" />
    </div>
  );
}
