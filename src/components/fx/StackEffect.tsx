"use client";

import { useEffect } from "react";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Stacked section cards: every [data-stack] except the last is sticky with
 * top = min(0, 100vh − height). While the next card slides over it, it
 * shrinks (scale 1 → .92) and darkens (brightness 1 → .45).
 * Also drifts the outline watermarks ([data-wm]) horizontally.
 * Disabled entirely under prefers-reduced-motion.
 */
export default function StackEffect() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-stack]"));
    const wms = Array.from(document.querySelectorAll<HTMLElement>("[data-wm]")).map((el) => ({
      el,
      dir: el.dataset.wm,
      sec: el.closest<HTMLElement>("[data-stack]"),
    }));

    const layout = () => {
      const vh = window.innerHeight;
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return;
        c.style.position = "sticky";
        c.style.top = `${Math.min(0, vh - c.offsetHeight)}px`;
        c.style.transformOrigin = `50% ${Math.max(0, c.offsetHeight - vh / 2)}px`;
      });
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      wms.forEach(({ el, dir, sec }) => {
        if (!sec) return;
        // The first card starts at the top and sticks right away, so its rect never moves: use the scroll instead
        const t = sec === cards[0] ? -window.scrollY : sec.getBoundingClientRect().top;
        el.style.transform = dir === "1" ? `translateX(${t * 0.35 - 200}px)` : `translateX(${-t * 0.3 - 600}px)`;
      });
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const cover = clamp01(1 - next.getBoundingClientRect().top / vh);
        c.style.transform = cover ? `scale(${1 - cover * 0.08})` : "";
        c.style.filter = cover ? `brightness(${1 - cover * 0.55})` : "";
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      layout();
      onScroll();
    };

    // Card heights change when content changes (filters, FAQ, fonts…).
    const ro = new ResizeObserver(onResize);
    cards.forEach((c) => ro.observe(c));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    layout();
    update();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cards.forEach((c) => {
        c.style.position = "";
        c.style.top = "";
        c.style.transform = "";
        c.style.filter = "";
        c.style.transformOrigin = "";
      });
      wms.forEach(({ el }) => (el.style.transform = ""));
    };
  }, []);

  return null;
}
