import type { CSSProperties, ReactNode } from "react";

/** Shared layout for the SEO landing pages (/services/*, /creation-site-internet-seine-et-marne, /realisations, /legal): same black and type as the home page. */

export const container = "mx-auto w-full max-w-[1240px] px-[clamp(20px,4vw,48px)]";

/** Archivo 600, tight — every H1/H2 of these pages (same as the home section titles). */
export const display: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 600,
  letterSpacing: "-.03em",
  lineHeight: 1,
  margin: 0,
  textWrap: "balance",
};

export const h2Style: CSSProperties = { ...display, fontSize: "clamp(28px,3.4vw,44px)", lineHeight: 1.05 };

export const btn = {
  primary: "btn-glass-primary",
  secondary: "btn-glass",
  /** Compact primary button of the header. */
  header:
    "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-abcs-red px-5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#f4f4f2] hover:text-[#111]",
};

export function H2({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={`text-[#f4f4f2] ${className}`} style={h2Style}>
      {children}
    </h2>
  );
}

type SectionProps = {
  num?: string;
  label: string;
  /** Slightly lifted background, to set a section apart. */
  dark?: boolean;
  id?: string;
  children: ReactNode;
};

/** Section with a small "01  Pour qui" label on the left (1fr) and the content on the right (3fr); one column under 760 px. */
export function Section({ num, label, dark, id, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`border-t border-white/[.08] text-[#f4f4f2] ${dark ? "bg-[#0a0a0a]" : ""}`}
      style={{ paddingBlock: "clamp(64px,8vw,112px)" }}
    >
      <div className={`${container} grid gap-6 min-[760px]:grid-cols-[1fr_3fr] min-[760px]:gap-10`}>
        <p className="m-0 flex gap-3 pt-1 text-[13px] font-semibold tracking-[.08em] text-[#a0a0a0] uppercase">
          {num && <span className="text-abcs-red">{num}</span>}
          {label}
        </p>
        <div className="flex min-w-0 flex-col gap-[clamp(28px,4vw,48px)]">{children}</div>
      </div>
    </section>
  );
}
