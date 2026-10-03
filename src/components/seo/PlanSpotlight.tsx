"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import CountPrice from "@/components/fx/CountPrice";
import { tiltLeave, tiltMove } from "@/components/fx/tilt";
import { useContactModal } from "@/components/ContactModalProvider";
import { PLANS, SERVICES, startPrice, type ServiceKey } from "@/lib/services";

const PROMISES = [
  { t: "Prix fixé au devis", d: "Le prix dépend des options choisies. Une fois le devis signé, il ne bouge plus : pas de surprise sur la facture." },
  { t: "Paiement en 3 fois", d: "En une seule fois ou en plusieurs fois, jusqu’à 3 versements." },
  { t: "Le site vous appartient", d: "Code, contenus et accès vous sont transmis à la livraison." },
];

/** Offer card (tilt + rolling price) next to the three promises, revealed on scroll. */
export default function PlanSpotlight({ service }: { service: ServiceKey }) {
  const plan = PLANS.find((p) => p.key === service)!;
  const { openModal } = useContactModal();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`plans reveal grid items-center gap-10 md:grid-cols-[1fr_minmax(0,440px)] md:gap-14 ${inView ? "is-in" : ""}`}>
      <ul className="m-0 flex list-none flex-col p-0">
        {PROMISES.map((p, i) => (
          <li key={p.t} data-reveal className="flex gap-5 border-b border-abcs-black/12 py-6 first:pt-0" style={{ "--i": i } as CSSProperties}>
            <span className="font-heading text-[clamp(2.4rem,4vw,3.2rem)] leading-none text-abcs-red">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 text-[20px] font-extrabold uppercase">{p.t}</h3>
              <p className="m-0 text-[16px] leading-[1.6] text-abcs-black/70">{p.d}</p>
            </div>
          </li>
        ))}
      </ul>

      <article
        data-plan
        onMouseMove={tiltMove}
        onMouseLeave={tiltLeave}
        className="relative flex flex-col gap-[22px] rounded-[28px] border border-white/14 bg-abcs-black px-7 py-8 text-white shadow-[0_40px_80px_-30px_rgba(255,59,0,0.5)] will-change-transform [transform-style:preserve-3d] md:px-9 md:py-10"
        style={{ "--i": 1, "--r": "4deg" } as CSSProperties}
      >
        <span data-glare aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300" />
        <span className="absolute -top-[13px] left-7 rounded-full bg-abcs-red px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.16em]">
          {plan.for}
        </span>
        <h3 className="m-0 font-heading font-normal uppercase leading-[0.95]" style={{ fontSize: "clamp(1.6rem,2.6vw,2.1rem)" }}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] opacity-70">dès</span>
          <span className="font-heading leading-none tracking-[-0.02em] text-abcs-red tabular-nums" style={{ fontSize: "clamp(3rem,6vw,4.4rem)" }}>
            <CountPrice value={startPrice(service)} start={inView} delay={300} />
          </span>
        </div>
        {SERVICES[service].max && (
          <p className="-mt-3 m-0 text-[15px] text-white/70">
            jusqu’à <strong className="text-white">{SERVICES[service].max}</strong> selon les options
          </p>
        )}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] bg-white/14">
          {[
            ["Délai", plan.delay],
            ["Révisions", plan.revisions],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 bg-abcs-black px-3.5 py-3">
              <span className="text-[12px] uppercase tracking-[0.12em] opacity-60">{k}</span>
              <span className="text-[16px] font-bold">{v}</span>
            </div>
          ))}
        </div>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {plan.included.map((it) => (
            <li key={it} className="grid grid-cols-[18px_1fr] gap-2.5 text-[16px] leading-[1.45]">
              <span aria-hidden className="font-extrabold text-abcs-red">✓</span>
              <span>{it}</span>
            </li>
          ))}
          {plan.excluded.map((it) => (
            <li key={it} className="grid grid-cols-[18px_1fr] gap-2.5 text-[16px] leading-[1.45] opacity-60">
              <span aria-hidden>–</span>
              <span>Non inclus : {it}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => openModal({ type: SERVICES[service].label, budget: SERVICES[service].budgets[0] })}
          className="flex items-center justify-center gap-2.5 rounded-full bg-abcs-red px-5 py-4 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors duration-[250ms] hover:bg-white hover:text-abcs-black"
        >
          Choisir cette offre <span aria-hidden>↗</span>
        </button>
      </article>
    </div>
  );
}
