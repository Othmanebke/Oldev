import type { CSSProperties } from "react";
import Reveal from "@/components/fx/Reveal";
import { PLANS, SERVICES, startPrice, type ServiceKey } from "@/lib/services";

/**
 * "What moves the price": a gauge from the base price to the fully-optioned
 * one, and the options in between. Like a car: same model, more options.
 */
export default function PriceOptions({ service }: { service: ServiceKey }) {
  const plan = PLANS.find((p) => p.key === service)!;
  const max = SERVICES[service].max;
  if (!max) return null;

  return (
    <Reveal className="flex flex-col gap-8 rounded-[28px] border border-abcs-black/10 bg-abcs-bg p-6 md:p-10">
      <div className="flex flex-col gap-2" data-reveal>
        <h3 className="m-0 font-heading font-normal uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(1.7rem,3.4vw,2.6rem)" }}>
          Ce qui fait varier le prix
        </h3>
        <p className="m-0 max-w-[640px] text-[16px] leading-[1.6] text-abcs-black/70">
          Comme une voiture avec des options : la formule de base démarre à {startPrice(service)}, puis le prix monte selon ce que vous ajoutez.
          Le prix exact est fixé dans le devis, gratuit et sans engagement.
        </p>
      </div>

      {/* Gauge */}
      <div className="flex flex-col gap-3" data-reveal style={{ "--i": 1 } as CSSProperties}>
        <div className="relative h-3 overflow-hidden rounded-full bg-abcs-black/10">
          <span data-line className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-abcs-red/40 via-abcs-red/80 to-abcs-red" />
        </div>
        <div className="flex justify-between gap-4 text-[14px]">
          <span className="flex flex-col">
            <span className="font-heading text-[clamp(1.4rem,2.6vw,2rem)] leading-none text-abcs-red-text">{startPrice(service)}</span>
            <span className="text-abcs-black/60">Formule de base</span>
          </span>
          <span className="flex flex-col items-end text-right">
            <span className="font-heading text-[clamp(1.4rem,2.6vw,2rem)] leading-none">{max}</span>
            <span className="text-abcs-black/60">Toutes options</span>
          </span>
        </div>
      </div>

      {/* Options */}
      <ul className="m-0 grid list-none gap-3 p-0" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))" }}>
        {plan.options.map((o, i) => (
          <li
            key={o}
            data-reveal
            style={{ "--i": i + 2 } as CSSProperties}
            className="flex items-center gap-3 rounded-[18px] border border-abcs-black/10 bg-white px-4 py-3.5 text-[15px] font-bold transition-colors duration-300 hover:border-abcs-red/50"
          >
            <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(255,59,0,0.12)] text-[16px] text-abcs-red-text">+</span>
            {o}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
