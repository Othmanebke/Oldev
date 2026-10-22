"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  /** First line, cropped to the top of its letters. */
  top: string;
  /** Second line, behind the orange square. */
  word: string;
  /** "(03)", bottom right of the second line. */
  count?: string;
  intro: string;
  /** Substring of `intro` highlighted once revealed. */
  mark?: string;
  aside?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

const wide: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 900,
  fontStretch: "125%",
  textTransform: "uppercase",
  letterSpacing: "-.025em",
  lineHeight: 0.86,
  fontSize: "min(7.8vw,110px)",
};

/**
 * Editorial section title: cropped first line, orange square + word, count,
 * then a "//" intro row with a highlighted passage. Revealed once at 20 %
 * visibility (CSS `.st.is-in`), static under reduced motion.
 */
export default function SectionTitle({ top, word, count, intro, mark, aside, tone = "dark", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const dark = tone === "dark";
  const c = dark
    ? { ink: "#ebebe9", faint: "rgba(244,244,242,.45)", body: "rgba(244,244,242,.82)", accent: "#FF3B00" }
    : { ink: "#111", faint: "rgba(17,17,17,.55)", body: "rgba(17,17,17,.78)", accent: "#C42F00" };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const at = mark ? intro.indexOf(mark) : -1;

  return (
    <header ref={ref} className={`st flex w-full flex-col ${className}`}>
      <h2 className="m-0 flex flex-col" style={{ ...wide, color: c.ink }}>
        <span className="block h-[.66em] overflow-hidden">
          <span className="st-top block whitespace-nowrap">{top}</span>
        </span>
        <span className="flex items-end" style={{ gap: ".1em" }}>
          <span aria-hidden className="st-square mb-[.1em] block shrink-0" style={{ width: ".29em", height: ".29em", background: "#FF3B00" }} />
          <span className="block overflow-hidden pt-[.08em] -mt-[.08em]">
            <span className="st-word block whitespace-nowrap">{word}</span>
          </span>
          {count && (
            <span
              aria-hidden
              className="st-fade mb-[.12em] ml-auto shrink-0 pl-3 font-sans normal-case"
              style={{ fontWeight: 400, fontStretch: "100%", letterSpacing: 0, fontSize: "clamp(16px,1.6vw,26px)", color: c.faint }}
            >
              {count}
            </span>
          )}
        </span>
      </h2>

      <div
        className={`st-fade grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 ${aside ? "sm:grid-cols-[auto_1fr_auto]" : ""}`}
        style={{ marginTop: "clamp(28px,3.5vw,52px)" }}
      >
        <span aria-hidden className="pt-[.1em] font-medium italic" style={{ color: c.accent, fontSize: "clamp(16px,1.35vw,20px)" }}>
          {"//"}
        </span>
        <p className="m-0 max-w-[700px] text-pretty leading-[1.6]" style={{ color: c.body, fontSize: "clamp(16px,1.35vw,20px)" }}>
          {at < 0 ? (
            intro
          ) : (
            <>
              {intro.slice(0, at)}
              <span className="st-mark">{mark}</span>
              {intro.slice(at + mark!.length)}
            </>
          )}
        </p>
        {aside && (
          <span
            className="col-start-2 whitespace-nowrap pt-[.2em] font-heading sm:col-start-auto"
            style={{ color: c.ink, fontSize: "clamp(13px,1vw,16px)" }}
          >
            {aside}
          </span>
        )}
      </div>
    </header>
  );
}
