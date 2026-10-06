"use client";

import { useId, useState } from "react";

type Props = {
  items: { q: string; a: string }[];
  tone?: "light" | "dark";
  /** Index open on first render (-1 = all closed). */
  defaultOpen?: number;
};

/** One-open-at-a-time FAQ. Answers stay in the DOM (collapsed), so they are crawlable. */
export default function FaqAccordion({ items, tone = "light", defaultOpen = 0 }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const dark = tone === "dark";
  const line = dark ? "border-white/15" : "border-[rgba(17,17,17,.12)]";

  return (
    <div className={`flex flex-col border-t ${line}`}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`border-b ${line}`}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`${id}-${i}`}
              className={`group flex w-full items-center justify-between gap-5 py-5 text-left text-[17px] font-semibold leading-[1.4] ${dark ? "text-white" : "text-[#111]"}`}
            >
              <span>{f.q}</span>
              <span
                aria-hidden
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[16px] leading-none transition-[rotate,background-color,border-color,color] duration-300 ease-out-expo ${
                  isOpen
                    ? "rotate-45 border-abcs-red bg-abcs-red text-white"
                    : dark
                      ? "border-white/25 text-white group-hover:border-white"
                      : "border-[rgba(17,17,17,.2)] text-[#111] group-hover:border-[#111]"
                }`}
              >
                +
              </span>
            </button>
            <div
              id={`${id}-${i}`}
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <p className={`m-0 max-w-[640px] overflow-hidden text-[15px] leading-[1.6] text-pretty ${dark ? "text-white/70" : "text-[#555]"}`}>
                <span className="block pb-5">{f.a}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
