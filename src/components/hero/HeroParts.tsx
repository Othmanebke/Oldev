import type { CSSProperties } from "react";
import Image from "next/image";
import heroPhoto from "@/img/hero.webp";

/** Condensed Archivo (wdth axis) used by the big titles. */
export const condensed: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 900,
  fontStretch: "62%",
  textTransform: "uppercase",
};

/** Intro delays are offset by `--hd` set on the hero root (the home page waits for the preloader). */
export const delay = (d: number) => `calc(var(--hd, 0s) + ${d}s)`;
export const fade = (d: number): CSSProperties => ({ animation: `h-fade 1s cubic-bezier(.22,1,.36,1) ${delay(d)} both` });

/** The "O" of the logo alone. */
export function LogoMark({ className = "", label = true }: { className?: string; label?: boolean }) {
  return (
    <svg viewBox="0 0 222 203" fill="currentColor" fillRule="evenodd" className={`block h-auto ${className}`} {...(label ? { role: "img", "aria-label": "O'LDEV" } : { "aria-hidden": true })}>
      <path d="M29 0H193L222 29V174L193 203H29L0 174V29Z M58 58V145H164V58Z" />
    </svg>
  );
}

const GLOWS =
  "radial-gradient(45% 55% at 72% 38%,rgba(255,59,0,.38) 0%,rgba(255,59,0,0) 70%),radial-gradient(50% 60% at 85% 70%,rgba(255,150,90,.22) 0%,rgba(255,150,90,0) 70%),radial-gradient(60% 70% at 20% 30%,rgba(120,90,70,.35) 0%,rgba(120,90,70,0) 70%)";

/**
 * Hero background: the portrait heavily blurred + orange/peach/brown glows,
 * drifting slowly (`drift`), with a fade to #050505 at the bottom.
 * Shared with the preloader, whose last frame must match the hero exactly.
 */
export function HeroBackdrop({ drift = false }: { drift?: boolean }) {
  return (
    <>
      <div aria-hidden className="absolute inset-[-12%] z-0">
        {/* Still = first frame of `blob`; the hero starts drifting once the preloader is gone */}
        <div className="absolute inset-0" style={drift ? { animation: "blob 22s ease-in-out var(--hd, 0s) infinite both" } : { transform: "translate(-8%,-4%)" }}>
          <Image
            src={heroPhoto}
            alt=""
            priority
            quality={40}
            sizes="60vw"
            className="absolute left-[12%] top-[8%] h-full w-auto max-w-none opacity-[.85]"
            style={{ filter: "blur(38px) saturate(1.3) brightness(.9)" }}
          />
          <div className="absolute inset-0" style={{ background: GLOWS, filter: "blur(40px)" }} />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[42%]" style={{ background: "linear-gradient(180deg,rgba(5,5,5,0) 0%,rgba(5,5,5,.7) 60%,#050505 100%)" }} />
    </>
  );
}

export function DispoBadge() {
  return (
    <span className="col-start-3 inline-flex items-center gap-2 justify-self-end rounded-full bg-white py-1.5 pl-3.5 pr-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-abcs-black">
      Dispo
      <span className="relative h-5 w-5 rounded-full bg-abcs-green">
        <span className="absolute inset-0 rounded-full bg-abcs-green" style={{ animation: "h-ping 1.8s cubic-bezier(0,0,.2,1) infinite" }} />
      </span>
    </span>
  );
}
