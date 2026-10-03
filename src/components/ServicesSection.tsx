"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import SectionHeader from "@/components/fx/SectionHeader";
import Watermark from "@/components/fx/Watermark";
import { useContactModal } from "@/components/ContactModalProvider";
import CountPrice from "@/components/fx/CountPrice";
import FaqAccordion from "@/components/fx/FaqAccordion";
import { tiltLeave, tiltMove } from "@/components/fx/tilt";
import { FAQ, PLANS, SERVICES, startPrice, type ServiceKey } from "@/lib/services";

const EXTRAS: { key: ServiceKey; name: string; desc: string }[] = [
  { key: "branding_canva", name: "Logo & flyer", desc: "Canva ou Adobe, prêt à imprimer" },
  { key: "refonte",        name: "Refonte",      desc: "Audit, responsive, vitesse, sécurité" },
  { key: "chatbot_ia",     name: "Chatbot IA",   desc: "Agent connecté à vos données" },
];

export function ServicesSection() {
  const { openModal } = useContactModal();
  const plansRef = useRef<HTMLDivElement>(null);
  const [plansIn, setPlansIn] = useState(false);

  const choose = (key: ServiceKey) => openModal({ type: SERVICES[key].label, budget: SERVICES[key].budgets[0] });

  useEffect(() => {
    const el = plansRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlansIn(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="services"
      data-stack
      className="relative z-[11] -mt-9 md:-mt-16 overflow-hidden rounded-t-[36px] md:rounded-t-[64px] bg-white text-abcs-black shadow-[0_-30px_70px_rgba(0,0,0,0.35)]"
      style={{ padding: "clamp(64px,9vw,120px) clamp(20px,5vw,72px) clamp(96px,10vw,140px)" }}
    >
      {/* Dot grid, visible at the top and bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(17,17,17,0.13) 1.2px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(180deg, black 0%, transparent 38%, transparent 72%, black 100%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 38%, transparent 72%, black 100%)",
        }}
      />
      <Watermark text="Services · Tarifs · Services · Tarifs · Services ·" stroke="rgba(17,17,17,0.09)" />
      <Watermark variant="2" text="Sur-mesure · Rapide · Transparent · Sur-mesure · Rapide ·" stroke="rgba(255,59,0,0.18)" />

      <div className="relative z-[1] mx-auto flex max-w-[1200px] flex-col" style={{ gap: "clamp(40px,5vw,64px)" }}>
        <SectionHeader
          tone="light"
          label="02 · Tarifs transparents"
          title="Mes services"
          titleSize="clamp(2.8rem,9vw,120px)"
          intro="Une fourchette de prix selon les options, un délai et ce qui est inclus. Le prix final est fixé au devis, sans surprise."
        />

        {/* Plans */}
        <div
          ref={plansRef}
          className={`plans grid items-stretch gap-5 ${plansIn ? "is-in" : ""}`}
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))" }}
        >
          {PLANS.map((p, i) => {
            const f = !!p.featured;
            const price = startPrice(p.key);
            return (
              <article
                key={p.key}
                data-plan
                onMouseMove={tiltMove}
                onMouseLeave={tiltLeave}
                className={`relative flex flex-col gap-[22px] rounded-[28px] border px-7 py-8 will-change-transform [transform-style:preserve-3d] ${
                  f
                    ? "border-white/14 bg-abcs-black text-white shadow-[0_40px_80px_-30px_rgba(255,59,0,0.45)]"
                    : "border-abcs-black/10 bg-abcs-bg text-abcs-black shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]"
                }`}
                style={{ "--i": i, "--r": `${(i - 1) * 5}deg` } as CSSProperties}
              >
                <span data-glare aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300" />
                {f && (
                  <span className="absolute -top-[13px] left-7 rounded-full bg-abcs-red px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white">
                    Le plus choisi
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[13px] tracking-[0.14em] opacity-60">{p.num}</span>
                  <span className="text-[13px] font-bold uppercase tracking-[0.12em] opacity-70">{p.for}</span>
                </div>
                <h3 className="m-0 font-heading font-normal uppercase leading-[0.95]" style={{ fontSize: "clamp(1.5rem,2.2vw,1.9rem)" }}>
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] opacity-70">dès</span>
                  <span
                    className={`font-heading leading-none tracking-[-0.02em] tabular-nums ${f ? "text-abcs-red" : "text-abcs-red-text"}`}
                    style={{ fontSize: "clamp(2.6rem,4vw,3.4rem)" }}
                  >
                    <CountPrice value={price} start={plansIn} delay={i * 140} />
                  </span>
                </div>
                {SERVICES[p.key].max && (
                  <p className="-mt-3 m-0 text-[14px] leading-[1.45] opacity-70">
                    jusqu’à <strong className="font-bold opacity-100">{SERVICES[p.key].max}</strong> selon les options
                  </p>
                )}
                <div className={`grid grid-cols-2 gap-px overflow-hidden rounded-[14px] ${f ? "bg-white/14" : "bg-abcs-black/10"}`}>
                  {[
                    ["Délai", p.delay],
                    ["Révisions", p.revisions],
                  ].map(([k, v]) => (
                    <div key={k} className={`flex flex-col gap-0.5 px-3.5 py-3 ${f ? "bg-abcs-black" : "bg-abcs-bg"}`}>
                      <span className="text-[12px] uppercase tracking-[0.12em] opacity-60">{k}</span>
                      <span className="text-[16px] font-bold">{v}</span>
                    </div>
                  ))}
                </div>
                <ul className="m-0 flex flex-1 list-none flex-col gap-2.5 p-0">
                  {p.included.map((it) => (
                    <li key={it} className="grid grid-cols-[18px_1fr] gap-2.5 text-[15px] leading-[1.45]">
                      <span aria-hidden className={`font-extrabold ${f ? "text-abcs-red" : "text-abcs-red-text"}`}>✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                  {p.excluded.map((it) => (
                    <li key={it} className="grid grid-cols-[18px_1fr] gap-2.5 text-[15px] leading-[1.45] opacity-60">
                      <span aria-hidden>–</span>
                      <span>
                        <span className="sr-only">Non inclus : </span>
                        {it}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => choose(p.key)}
                  className={`flex items-center justify-center gap-2.5 rounded-full px-5 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-[250ms] ${
                    f ? "bg-abcs-red hover:bg-white hover:text-abcs-black" : "bg-abcs-black hover:bg-abcs-red"
                  }`}
                >
                  Choisir cette offre <span aria-hidden>↗</span>
                </button>
              </article>
            );
          })}
        </div>

        {/* Also available */}
        <div className="flex flex-col gap-4">
          <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-abcs-black/60">Aussi disponible</span>
          <div
            className="grid gap-x-6 border-t border-abcs-black/15"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))" }}
          >
            {EXTRAS.map((e) => (
              <button
                key={e.key}
                onClick={() => choose(e.key)}
                style={{ transition: "background-size .55s cubic-bezier(.22,1,.36,1), color .3s" }}
                className="flex items-center justify-between gap-4 border-b border-abcs-black/15 bg-no-repeat px-4 py-5 text-left bg-[linear-gradient(#111,#111)] bg-[length:0%_100%] hover:bg-[length:100%_100%] hover:text-white focus-visible:bg-[length:100%_100%] focus-visible:text-white"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[17px] font-extrabold uppercase">{e.name}</span>
                  <span className="text-[14px] opacity-72">{e.desc}</span>
                </span>
                <span className="shrink-0 rounded-full bg-[rgba(255,59,0,0.1)] px-3 py-1.5 text-[13px] font-bold uppercase text-abcs-red-text">
                  {SERVICES[e.key].price.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))",
            gap: "clamp(24px,4vw,56px)",
            paddingTop: "clamp(16px,3vw,32px)",
          }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="m-0 font-heading font-normal uppercase leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
              Questions fréquentes
            </h3>
            <p className="m-0 text-[16px] leading-[1.6] text-abcs-black/70">Une autre question ? Réponse sous 48 h maximum.</p>
          </div>
          <FaqAccordion items={FAQ} />
        </div>
      </div>
    </section>
  );
}
