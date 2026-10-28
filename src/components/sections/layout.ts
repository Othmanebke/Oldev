import type { CSSProperties } from "react";

/** Shared boxes of the home sections after the hero: plain black like the hero. */
export const section = "relative overflow-x-clip bg-black text-[#f4f4f2]";
export const gutter = "clamp(20px,5vw,72px)";
export const sectionPad: CSSProperties = { padding: `clamp(88px,11vw,150px) ${gutter} clamp(48px,6vw,80px)` };
/** Same room above and below (reviews, FAQ). */
export const sectionPadEven: CSSProperties = { padding: `clamp(88px,11vw,150px) ${gutter}` };
export const sectionInner = "relative z-[1] mx-auto flex max-w-[1280px] flex-col";
export const archivo: CSSProperties = { fontFamily: "var(--font-archivo-flex), sans-serif" };
