"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Part = { text: string; className?: string };

type Props = {
  parts: Part[];
  className?: string;
  style?: CSSProperties;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Paragraph lit word by word as it scrolls in: --p goes 0 → 1 between "top at
 * 90% of the viewport" and "bottom at viewport − 130px", each word's opacity
 * is derived from it in CSS (.sw-word). Fully lit under reduced motion.
 */
export default function ScrollWords({ parts, className = "", style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const start = vh * 0.9;
      const end = vh - 130 - r.height;
      el.style.setProperty("--p", String(clamp01((start - r.top) / Math.max(1, start - end))));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  let i = 0;
  const words = parts.map((p) => ({ ...p, words: p.text.split(/\s+/).filter(Boolean) }));
  const n = words.reduce((acc, p) => acc + p.words.length, 0);

  return (
    <p ref={ref} className={className} style={{ ...style, "--n": n } as CSSProperties}>
      {words.map((p, pi) => (
        <span key={pi} className={p.className}>
          {p.words.map((w, wi) => (
            <span key={wi}>
              {(pi > 0 || wi > 0) && " "}
              <span className="sw-word" style={{ "--i": i++ } as CSSProperties}>
                {w}
              </span>
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
