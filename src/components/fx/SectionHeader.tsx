"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  /** Section number, shown as "(01)" on the right. */
  num: string;
  /** Two lines: the first is flush left, the second is indented behind the orange square. */
  title: [string, string];
  intro?: React.ReactNode;
  /** Short bold note on the right of the intro row (e.g. a starting price). */
  aside?: React.ReactNode;
  tone: "dark" | "light";
  titleSize?: string;
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Wide Archivo (wdth 125, black) used by the section titles. */
const titleFont: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 900,
  fontStretch: "125%",
};

/**
 * Editorial section header: giant two-line wide title (each line rises out of
 * a mask when it enters the viewport), orange square, "(0X)" on the right,
 * then a "//" intro row. Static under reduced motion (CSS).
 */
export default function SectionHeader({
  num,
  title,
  intro,
  aside,
  tone,
  titleSize = "clamp(2.4rem,10.5vw,190px)",
  children,
  className = "",
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <header ref={ref} className={`sh flex w-full flex-col ${className}`} style={style}>
      <h2
        className={`m-0 flex flex-col uppercase leading-[0.86] tracking-[-0.02em] ${dark ? "text-[#ececea]" : "text-abcs-black"}`}
        style={{ ...titleFont, fontSize: titleSize }}
      >
        <span className="sh-mask">
          <span className="sh-line" style={{ "--i": 0 } as CSSProperties}>
            {title[0]}
          </span>
        </span>{" "}
        <span className="flex items-end" style={{ gap: "0.12em" }}>
          <span aria-hidden className="sh-square mb-[0.08em] block shrink-0 bg-abcs-red" style={{ width: "0.36em", height: "0.36em" }} />
          <span className="sh-mask">
            <span className="sh-line" style={{ "--i": 1 } as CSSProperties}>
              {title[1]}
            </span>
          </span>
          <span
            aria-hidden
            className={`sh-fade mb-[0.1em] ml-auto hidden shrink-0 pl-4 font-sans sm:block font-normal normal-case tracking-normal ${dark ? "text-white/45" : "text-abcs-black/50"}`}
            style={{ fontSize: "clamp(16px,1.6vw,28px)", fontStretch: "100%" }}
          >
            ({num})
          </span>
        </span>
      </h2>

      {(intro || aside) && (
        <div
          className="sh-fade grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr_auto]"
          style={{ marginTop: "clamp(28px,3.5vw,52px)" }}
        >
          <span aria-hidden className="pt-[0.1em] font-medium italic text-abcs-red" style={{ fontSize: "clamp(17px,1.4vw,22px)" }}>
            {"//"}
          </span>
          <p
            className={`m-0 max-w-[620px] leading-[1.55] text-pretty ${dark ? "text-white/72" : "text-abcs-black/72"}`}
            style={{ fontSize: "clamp(16px,1.3vw,20px)" }}
          >
            {intro}
          </p>
          {aside ? (
            <span className={`col-start-2 whitespace-nowrap pt-[0.2em] font-heading sm:col-start-auto text-[14px] ${dark ? "text-white" : "text-abcs-black"}`}>{aside}</span>
          ) : (
            <span className="hidden sm:block" />
          )}
        </div>
      )}
      {children}
    </header>
  );
}
