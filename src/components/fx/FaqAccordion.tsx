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

  return (
    <div className={`flex flex-col border-t ${dark ? "border-white/15" : "border-abcs-black/15"}`}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`border-b ${dark ? "border-white/15" : "border-abcs-black/15"}`}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`${id}-${i}`}
              className={`flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-bold ${dark ? "text-white" : "text-abcs-black"}`}
            >
              <span>{f.q}</span>
              <span
                aria-hidden
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[18px] transition-colors ${
                  isOpen ? "bg-abcs-red text-white" : dark ? "bg-white/10 text-white" : "bg-abcs-black/6 text-abcs-black"
                }`}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id={`${id}-${i}`}
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <p className={`m-0 max-w-[560px] overflow-hidden text-[16px] leading-[1.6] ${dark ? "text-white/72" : "text-abcs-black/72"}`}>
                <span className="block pb-5">{f.a}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
