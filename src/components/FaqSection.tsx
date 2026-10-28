"use client";

import { useState } from "react";
import SectionHeading from "@/components/sections/SectionHeading";
import { section, sectionPadEven } from "@/components/sections/layout";
import { FAQ } from "@/lib/services";

/** Numbered FAQ, one open at a time; answers stay in the DOM (crawlable). */
export default function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" data-stack className={section} style={sectionPadEven}>
      <div className="relative z-[1] mx-auto flex w-full max-w-[720px] flex-col" style={{ gap: "clamp(28px,4vh,40px)" }}>
        <SectionHeading kicker="QUESTIONS" title="Ce qu’on me demande souvent" align="left" />
        <div data-reveal className="flex flex-col">
          {FAQ.map((f, i) => {
            const o = open === i;
            return (
              <div key={f.q} className="border-t border-[rgba(244,241,236,.1)]">
                <button
                  onClick={() => setOpen(o ? -1 : i)}
                  aria-expanded={o}
                  aria-controls={`faq-${i}`}
                  className="group flex w-full items-start gap-4 py-5 text-left text-[#F4F1EC]"
                >
                  <span className={`w-7 flex-none pt-[3px] text-[13px] font-semibold transition-colors duration-300 ${o ? "text-abcs-red" : "text-[#a0a0a0]"}`}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span className="flex-1 text-[17px] font-semibold leading-[1.4]">{f.q}</span>
                  <span
                    aria-hidden
                    className={`grid size-7 flex-none place-items-center rounded-full text-[16px] transition-all duration-[350ms] ease-out-expo ${o ? "rotate-45 bg-abcs-red" : "bg-[#1F1C19] group-hover:bg-[#2A2622]"}`}
                  >
                    +
                  </span>
                </button>
                <div id={`faq-${i}`} aria-hidden={!o} className={`grid transition-[grid-template-rows] duration-[450ms] ease-out-expo ${o ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="m-0 px-11 pb-[22px] text-[16px] leading-[1.65] text-[#c8c8c8] text-pretty max-sm:pr-0 max-sm:text-[15px]">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
