"use client";

import { useEffect } from "react";

/**
 * Home scroll effects, mounted once:
 * - stacked cards: while the next `[data-stack]` card slides up over one, it
 *   recedes (scale, desktop only) and darkens (`--cover`, read by CSS);
 * - reveals: `[data-reveal]` elements get `.is-in` when they enter the viewport
 *   (the animation itself, staggered by `--i`, lives in globals.css).
 * Nothing runs under reduced motion.
 */
export default function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    const cards = Array.from(document.querySelectorAll<HTMLElement>("main > [data-stack]"));
    const wide = window.matchMedia("(min-width: 768px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const p = Math.max(0, Math.min(1, (vh - next.getBoundingClientRect().top) / vh));
        card.style.setProperty("--cover", (p * 0.6).toFixed(3));
        if (p > 0 && wide.matches) {
          // Shrink towards the middle of the viewport, where the card is still seen
          card.style.transformOrigin = `50% ${vh / 2 - card.getBoundingClientRect().top}px`;
          card.style.transform = `scale(${1 - p * 0.06})`;
        } else {
          card.style.transform = "";
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
