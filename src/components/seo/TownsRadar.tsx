import type { CSSProperties } from "react";
import Reveal from "@/components/fx/Reveal";
import { LOCAL_TOWNS } from "@/lib/seoPages";

// Decorative placement around Brie-Comte-Robert: [town, angle (deg, 0 = north), radius (0–1)]
const PINS: [string, number, number][] = [
  ["Ozoir-la-Ferrière", 35, 0.62], ["Tournan-en-Brie", 75, 0.9], ["Grisy-Suisnes", 120, 0.42],
  ["Melun", 165, 0.88], ["Savigny-le-Temple", 200, 0.7], ["Combs-la-Ville", 235, 0.45],
  ["Brunoy", 285, 0.62], ["Pontault-Combault", 330, 0.85],
];

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <ul className="m-0 flex w-max list-none gap-2.5 p-0" style={{ animation: `${reverse ? "mq-r" : "mq-l"} ${reverse ? 46 : 40}s linear infinite` }}>
        {[...items, ...items].map((t, i) => (
          <li
            key={`${t}-${i}`}
            aria-hidden={i >= items.length}
            className="whitespace-nowrap rounded-full border border-abcs-black/12 bg-abcs-bg px-5 py-3 text-[15px] font-bold uppercase tracking-[0.06em]"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Radar centered on Brie-Comte-Robert + marquee of every town served. */
export default function TownsRadar() {
  const half = Math.ceil(LOCAL_TOWNS.length / 2);
  return (
    <div className="flex flex-col gap-12">
      <Reveal className="relative mx-auto aspect-square w-full max-w-[560px]">
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-full border border-abcs-black/15 bg-[radial-gradient(circle,rgba(255,59,0,0.06),transparent_70%)]">
          {[0.33, 0.66].map((r) => (
            <span key={r} className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-abcs-black/15" style={{ width: `${r * 100}%` }} />
          ))}
          <span className="absolute left-1/2 top-0 h-full w-px bg-abcs-black/10" />
          <span className="absolute left-0 top-1/2 h-px w-full bg-abcs-black/10" />
          {/* Sweep */}
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "conic-gradient(from 0deg, rgba(255,59,0,0.32), rgba(255,59,0,0) 70deg)", animation: "radar-sweep 6s linear infinite" }}
          />
        </div>

        {/* Center */}
        <div className="absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span aria-hidden className="absolute h-24 w-24 rounded-full border-2 border-abcs-red" style={{ animation: "radar-pulse 2.4s ease-out infinite" }} />
            <span className="h-5 w-5 rounded-full border-4 border-white bg-abcs-red shadow-[0_0_0_6px_rgba(255,59,0,0.25)]" />
          </span>
          <span className="whitespace-nowrap rounded-full bg-abcs-black px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-white sm:text-[13px]">
            Brie-Comte-Robert
          </span>
        </div>

        {/* Towns */}
        {PINS.map(([town, angle, r], i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <span
              key={town}
              data-pin
              className="absolute z-[1] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{ "--i": i, left: `${50 + Math.sin(rad) * r * 46}%`, top: `${50 - Math.cos(rad) * r * 46}%` } as CSSProperties}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-abcs-black ring-4 ring-white" />
              <span className="whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] shadow-sm sm:text-[12px]">
                {town}
              </span>
            </span>
          );
        })}
      </Reveal>

      <div className="-mx-5 flex flex-col gap-2.5 sm:mx-0">
        <span className="sr-only">Communes desservies : {LOCAL_TOWNS.join(", ")}.</span>
        <div aria-hidden className="flex flex-col gap-2.5">
          <Marquee items={LOCAL_TOWNS.slice(0, half)} />
          <Marquee items={LOCAL_TOWNS.slice(half)} reverse />
        </div>
      </div>
    </div>
  );
}
