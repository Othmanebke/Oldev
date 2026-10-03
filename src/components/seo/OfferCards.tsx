"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Reveal from "@/components/fx/Reveal";
import { tiltLeave, tiltMove } from "@/components/fx/tilt";

type Offer = { href: string; eyebrow: string; title: string; text?: string };

/** Linked offer cards with the home-page tilt, fanned in on scroll. */
export default function OfferCards({ items, tone = "dark" }: { items: Offer[]; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <Reveal className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))" }}>
      {items.map((o, i) => (
        <div key={o.href} data-reveal style={{ "--i": i, "--r": `${(i - 1) * 4}deg` } as CSSProperties}>
          <Link
            href={o.href}
            onMouseMove={tiltMove}
            onMouseLeave={tiltLeave}
            className={`group relative flex h-full flex-col gap-4 rounded-[28px] border p-7 will-change-transform [transform-style:preserve-3d] md:p-8 ${
              dark
                ? "border-white/12 bg-abcs-surface text-white hover:border-abcs-red/60"
                : "border-abcs-black/10 bg-white text-abcs-black shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)] hover:border-abcs-red/50"
            }`}
          >
            <span data-glare aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300" />
            <span className={`text-[13px] font-bold uppercase tracking-[0.14em] ${dark ? "text-abcs-red" : "text-abcs-red-text"}`}>{o.eyebrow}</span>
            <span className="font-heading text-[clamp(1.5rem,2.4vw,2rem)] uppercase leading-[0.95]">{o.title}</span>
            {o.text && <span className={`text-[15px] leading-[1.6] ${dark ? "text-white/70" : "text-abcs-black/70"}`}>{o.text}</span>}
            <span className="mt-auto flex items-center gap-2 pt-3 text-[13px] font-bold uppercase tracking-[0.14em]">
              En savoir plus
              <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-abcs-red text-white transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-rotate-45">→</span>
            </span>
          </Link>
        </div>
      ))}
    </Reveal>
  );
}
