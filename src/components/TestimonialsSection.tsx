"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/sections/SectionHeading";
import { archivo, section, sectionPadEven } from "@/components/sections/layout";
import { TESTIMONIALS } from "@/lib/testimonials";

const RV_MS = 6500;
const glass = "inline-flex min-h-8 items-center rounded-full bg-white/[.06] px-3.5 text-[13px] font-semibold text-[#e6e6e6] shadow-[inset_0_1px_0_rgba(255,255,255,.14),inset_0_0_0_.5px_rgba(255,255,255,.12)] backdrop-blur-[16px]";

/**
 * Client reviews: the quote on the left, the clients on the right. The next one
 * comes every 6.5 s (an orange bar fills under the current client); paused
 * while hovered, when the tab is hidden and under reduced motion.
 */
export default function TestimonialsSection() {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsed = useRef(0);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = performance.now();
    const t = setInterval(() => {
      const now = performance.now();
      if (!document.hidden) elapsed.current += now - last;
      last = now;
      if (elapsed.current >= RV_MS) {
        elapsed.current = 0;
        setCur((c) => (c + 1) % TESTIMONIALS.length);
      }
    }, 100);
    return () => clearInterval(t);
  }, [paused]);

  const pick = (i: number) => {
    elapsed.current = 0;
    setCur(i);
  };
  const t = TESTIMONIALS[cur];

  return (
    <section id="avis" data-stack className={section} style={sectionPadEven}>
      <div
        className="relative z-[1] mx-auto flex max-w-[1180px] flex-col"
        style={{ gap: "clamp(40px,5vw,64px)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <SectionHeading kicker="AVIS CLIENTS" title="Ils en parlent mieux que moi" />

        <div data-reveal className="grid items-start" style={{ gap: "clamp(40px,6vw,96px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))" }}>
          <figure className="m-0 flex min-w-0 flex-col" style={{ gap: "clamp(24px,3vw,36px)" }}>
            <span aria-hidden className="h-7 font-extrabold leading-[.6] text-abcs-red" style={{ ...archivo, fontSize: 64 }}>
              “
            </span>
            <blockquote
              key={cur}
              className="m-0 min-h-[5.2em] font-semibold leading-[1.22] tracking-[-.025em] text-white text-pretty max-sm:min-h-[6.2em]"
              style={{ ...archivo, fontSize: "clamp(26px,3vw,40px)", animation: "rv-quote .7s cubic-bezier(.22,1,.36,1) both" }}
              aria-live="polite"
            >
              {t.quote}
            </blockquote>
            <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-3.5">
              <span className="flex items-center gap-3.5">
                <span
                  aria-hidden
                  className="grid size-[52px] place-items-center rounded-full text-[19px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.4),0_8px_24px_-8px_rgba(255,59,0,.7)]"
                  style={{ ...archivo, background: "radial-gradient(circle at 30% 25%,#FF3B00,#FF3B00 60%,#a32600)" }}
                >
                  {t.name[0]}
                </span>
                <span className="flex flex-col gap-[3px]">
                  <span className="text-[16px] font-semibold text-white">{t.name}</span>
                  <span className="text-[15px] text-[#a0a0a0]">{t.job}</span>
                </span>
              </span>
              <span className={glass}>{t.stat}</span>
            </figcaption>
          </figure>

          <ul className="m-0 flex list-none flex-col p-0">
            {TESTIMONIALS.map((r, i) => {
              const on = i === cur;
              return (
                <li key={r.name} className="relative border-b border-white/10">
                  <button
                    onClick={() => pick(i)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-4 text-left transition-opacity duration-[400ms] hover:opacity-100 ${on ? "opacity-100" : "opacity-[.42]"}`}
                    style={{ padding: "clamp(20px,2.6vw,30px) 0" }}
                  >
                    <span aria-hidden className="grid size-12 flex-none place-items-center rounded-full bg-[rgba(255,59,0,.14)] text-[17px] font-bold text-abcs-red" style={archivo}>
                      {r.name[0]}
                    </span>
                    <span className="flex min-w-0 flex-col gap-[3px]">
                      <span className="text-[16px] font-semibold text-white">{r.name}</span>
                      <span className="text-[14px] text-[#a0a0a0]">{r.job}</span>
                    </span>
                  </button>
                  {on && (
                    <span
                      key={cur}
                      aria-hidden
                      className="absolute -bottom-px left-0 h-0.5 w-full origin-left bg-abcs-red"
                      style={{ animation: `rv-fill ${RV_MS}ms linear both`, animationPlayState: paused ? "paused" : "running" }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
