"use client";

import { useEffect, useRef } from "react";

/**
 * Giant outlined word repeated 3×, drifting horizontally with the scroll
 * (even index ← , odd index →). Parent must be `relative` and clip overflow-x.
 */
export default function Watermark({ text, index = 0 }: { text: string; index?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight, r = host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (vh - r.top) / (vh + r.height);
      el.style.transform = `translate(${index % 2 ? -32 + p * 14 : -8 - p * 14}%,-50%)`;
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
  }, [index]);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-1/2 z-0 select-none whitespace-nowrap uppercase leading-none"
      style={{
        transform: `translate(${index % 2 ? -25 : -15}%,-50%)`,
        fontFamily: "var(--font-archivo-flex), sans-serif",
        fontWeight: 900,
        fontStretch: "125%",
        fontSize: "clamp(9rem,24vw,26rem)",
        color: "transparent",
        WebkitTextStroke: "1px rgba(255,255,255,.075)",
      }}
    >
      {`${text} ${text} ${text}`}
    </span>
  );
}
