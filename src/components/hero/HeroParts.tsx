import type { CSSProperties, Ref } from "react";

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

/** The "O" of the logo alone. Height comes from `className`, width stays auto. */
export function LogoMark({ className = "", label = true, id, ref }: { className?: string; label?: boolean; id?: string; ref?: Ref<SVGSVGElement> }) {
  return (
    <svg
      ref={ref}
      id={id}
      viewBox="0 0 222 203"
      fill="currentColor"
      fillRule="evenodd"
      className={`block w-auto ${className}`}
      {...(label ? { role: "img", "aria-label": "O'LDEV" } : { "aria-hidden": true })}
    >
      <path d="M29 0H193L222 29V174L193 203H29L0 174V29Z M58 58V145H164V58Z" />
    </svg>
  );
}
