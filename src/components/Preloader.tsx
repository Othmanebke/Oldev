"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Logo from "@/components/brand/Logo";

/** Delay after which the hero intro starts (the curtain is half-way up by then). */
export const LOADER_INTRO_DELAY = 3700;
const LOADER_UNMOUNT = 4700;

const WORD = "Bienvenue";

const type: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 900,
  fontStretch: "62%",
  fontVariationSettings: "'wdth' 62",
  textTransform: "uppercase",
  letterSpacing: ".005em",
  lineHeight: 0.78,
  color: "#f4f4f2",
  whiteSpace: "nowrap",
};
const size = { fontSize: "clamp(36px,7vw,104px)" };

/**
 * "BIENVENUE" letters blur in then out (0.15 → 2s), "CHEZ O'LDEV ■" drops in
 * (2.15s), the bar fills over 3.3s, then the curtain rises (3.5s).
 * Not rendered under reduced motion (and hidden by CSS until hydration).
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
      className="preloader fixed inset-0 z-[300] grid place-items-center overflow-hidden bg-[#050505]"
      style={{ animation: "loader-up 1.1s cubic-bezier(.83,0,.17,1) 3.5s forwards" }}
    >
      <div className="relative [grid-area:1/1]" style={size}>
        <span className="flex" style={type}>
          {[...WORD].map((c, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                animation: `ld-ch-in .7s cubic-bezier(.22,1,.36,1) ${0.15 + i * 0.055}s both, ld-ch-out .55s cubic-bezier(.7,0,.3,1) ${1.45 + i * 0.04}s forwards`,
              }}
            >
              {c}
            </span>
          ))}
        </span>
      </div>

      <div className="relative overflow-hidden [grid-area:1/1]" style={{ ...size, padding: ".08em .1em" }}>
        <div className="flex items-center gap-[.22em]" style={{ animation: "ld-t-in .9s cubic-bezier(.22,1,.36,1) 2.15s both" }}>
          <span style={type}>Chez</span>
          {/* Logo + orange square sitting on its baseline, like a full stop */}
          <span className="flex items-end" style={{ gap: ".05em" }}>
            <Logo className="h-[.7em] text-[#f4f4f2]" />
            <span
              className="shrink-0 bg-abcs-red"
              style={{ width: ".15em", height: ".15em", animation: "sq-pop .5s cubic-bezier(.34,1.56,.64,1) 2.8s both" }}
            />
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[.08]">
        <div
          className="h-full origin-left scale-x-0"
          style={{
            background: "linear-gradient(90deg,rgba(255,59,0,0),rgba(255,59,0,.5) 60%,#FF3B00)",
            boxShadow: "0 0 14px rgba(255,59,0,.55)",
            animation: "bar-fill 3.3s cubic-bezier(.65,0,.2,1) forwards",
          }}
        />
      </div>
    </div>
  );
}
