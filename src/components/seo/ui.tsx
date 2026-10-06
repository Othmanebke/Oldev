import type { CSSProperties, ReactNode } from "react";

/** Shared layout for the SEO landing pages (/services/*, /creation-site-internet-seine-et-marne, /realisations). */

export const container = "mx-auto w-full max-w-[1240px] px-[clamp(20px,4vw,48px)]";

/** Archivo 800, tight — every H1/H2 of these pages. */
export const display: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 800,
  letterSpacing: "-.03em",
  lineHeight: 0.98,
  margin: 0,
  textWrap: "balance",
};

export const h2Style: CSSProperties = { ...display, fontSize: "clamp(2rem,4vw,3.4rem)" };

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-abcs-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#111]",
  /** Primary button on a dark section (hover can't go to #111 there). */
  primaryDark:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-abcs-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#f4f4f2] hover:text-[#111]",
  secondary:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[rgba(17,17,17,.2)] px-6 py-3.5 text-[15px] font-semibold text-[#111] transition-colors duration-200 hover:border-[#111]",
  dark:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#111] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-abcs-red",
};

export function H2({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={className} style={h2Style}>
      {children}
    </h2>
  );
}

type SectionProps = {
  num?: string;
  label: string;
  dark?: boolean;
  id?: string;
  children: ReactNode;
};

/** Section with a small "01  Pour qui" label on the left (1fr) and the content on the right (3fr); one column under 760 px. */
export function Section({ num, label, dark, id, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`border-t ${dark ? "border-[rgba(244,244,242,.12)] bg-[#111] text-[#f4f4f2]" : "border-[rgba(17,17,17,.12)]"}`}
      style={{ paddingBlock: "clamp(56px,8vw,104px)" }}
    >
      <div className={`${container} grid gap-6 min-[760px]:grid-cols-[1fr_3fr] min-[760px]:gap-10`}>
        <p className={`m-0 flex gap-3 pt-1 text-[13px] font-medium ${dark ? "text-[#f4f4f2]/60" : "text-[#666]"}`}>
          {num && <span className={`font-bold ${dark ? "text-abcs-red" : "text-abcs-red-text"}`}>{num}</span>}
          {label}
        </p>
        <div className="flex min-w-0 flex-col gap-[clamp(28px,4vw,48px)]">{children}</div>
      </div>
    </section>
  );
}
