/**
 * Shared boxes of the home sections after the hero. Dark sections are plain
 * black like the hero; the light one (Parcours) is a card rounded top and bottom.
 */
const overlap = "relative -mt-9 md:-mt-16";
export const card = `${overlap} rounded-[36px] shadow-[0_-30px_70px_rgba(0,0,0,.6)] md:rounded-[64px]`;
export const section = `${overlap} overflow-x-clip bg-black text-[#f4f4f2]`;
// Bottom padding leaves room for the next card, which overlaps it by 36/64px
export const sectionPad = { padding: "clamp(56px,7vw,96px) clamp(20px,5vw,72px) clamp(72px,9vw,120px)" };
export const sectionInner = "relative z-[1] mx-auto flex max-w-[1280px] flex-col";
