import type { CSSProperties } from "react";
import Reveal from "@/components/fx/Reveal";
import { STEPS } from "@/lib/seoPages";

/** Project timeline on a dark card: the red line draws itself, steps rise in one by one. */
export default function Steps() {
  return (
    <Reveal as="ol" className="relative m-0 grid list-none gap-9 p-0 md:grid-cols-5 md:gap-6">
      {/* Track + progress: vertical on phones, horizontal from md */}
      <span aria-hidden className="absolute bottom-6 left-7 top-6 w-px bg-white/15 md:hidden" />
      <span aria-hidden data-line="y" className="absolute bottom-6 left-7 top-6 w-[2px] origin-top bg-abcs-red md:hidden" />
      <span aria-hidden className="absolute left-7 right-7 top-7 hidden h-px bg-white/15 md:block" />
      <span aria-hidden data-line className="absolute left-7 right-7 top-7 hidden h-[2px] origin-left bg-abcs-red md:block" />

      {STEPS.map((s, i) => (
        <li key={s.title} data-reveal className="relative flex gap-5 md:flex-col" style={{ "--i": i } as CSSProperties}>
          <span className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-abcs-red bg-abcs-black font-heading text-[20px] text-white shadow-[0_0_0_8px_#111]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-2 pt-2 md:pt-0">
            <h3 className="m-0 text-[19px] font-extrabold uppercase tracking-[0.02em]">{s.title}</h3>
            <p className="m-0 text-[15px] leading-[1.6] text-white/70">{s.text}</p>
          </div>
        </li>
      ))}
    </Reveal>
  );
}
