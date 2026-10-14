/**
 * Shared box of the home sections after the hero: each one is a card with a
 * rounded top sliding over the previous one (wallet effect).
 */
export const card = "relative -mt-9 rounded-t-[36px] shadow-[0_-30px_70px_rgba(0,0,0,.6)] md:-mt-16 md:rounded-t-[64px]";
export const section = `${card} overflow-x-clip border-t border-white/[.08] bg-[#050505] text-[#f4f4f2]`;
// Bottom padding leaves room for the next card, which overlaps it by 36/64px
export const sectionPad = { padding: "clamp(56px,7vw,96px) clamp(20px,5vw,72px) clamp(72px,9vw,120px)" };
export const sectionInner = "relative z-[1] mx-auto flex max-w-[1280px] flex-col";
