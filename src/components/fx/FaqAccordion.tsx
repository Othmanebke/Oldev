"use client";

import { useId, useState } from "react";

type Props = {
  items: { q: string; a: string }[];
  /** Index open on first render (-1 = all closed). */
  defaultOpen?: number;
};

/** Numbered FAQ like the home page's, one open at a time. Answers stay in the DOM (collapsed), so they are crawlable. */
export default function FaqAccordion({ items, defaultOpen = 0 }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="flex flex-col border-b border-white/10">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-t border-white/10">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`${id}-${i}`}
              className="group flex w-full items-start gap-4 py-5 text-left text-[#f4f4f2]"
            >
              <span className={`w-7 flex-none pt-[3px] text-[13px] font-semibold transition-colors duration-300 ${isOpen ? "text-abcs-red" : "text-[#a0a0a0]"}`}>
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="flex-1 text-[17px] font-semibold leading-[1.4]">{f.q}</span>
              <span
                aria-hidden
                className={`grid size-7 flex-none place-items-center rounded-full text-[16px] transition-all duration-[350ms] ease-out-expo ${isOpen ? "rotate-45 bg-abcs-red" : "bg-[#1F1C19] group-hover:bg-[#2A2622]"}`}
              >
                +
              </span>
            </button>
            <div
              id={`${id}-${i}`}
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows] duration-[450ms] ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="m-0 max-w-[680px] pb-[22px] pl-11 text-[16px] leading-[1.65] text-[#c8c8c8] text-pretty max-sm:text-[15px]">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
