"use client";

import { useEffect, useState } from "react";

/** Price rolling from 0 to its value (1.2s) once `start` is true. */
export default function CountPrice({ value, start, delay }: { value: string; start: boolean; delay: number }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!start || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = parseInt(value.replace(/\D/g, ""), 10);
    if (!n) return;
    const fmt = (v: number) => (v >= 1000 ? `${Math.floor(v / 1000)} ${String(v % 1000).padStart(3, "0")}€` : `${v}€`);
    let raf = 0;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1200);
        const e = 1 - Math.pow(1 - k, 3);
        setText(k < 1 ? fmt(Math.round((n * e) / 10) * 10) : value);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      setText(fmt(0));
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [start, value, delay]);

  return <>{text}</>;
}

