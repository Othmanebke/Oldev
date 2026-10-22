"use client";

import { useState, type CSSProperties } from "react";
import SectionTitle from "@/components/fx/SectionTitle";
import Grain from "@/components/fx/Grain";
import { useContactModal } from "@/components/ContactModalProvider";
import { useScrollToSection } from "@/lib/useScrollToSection";
import { FAQ, PLANS, SERVICES, onQuote, startPrice, type ServiceKey } from "@/lib/services";
import { section, sectionInner, sectionPad } from "@/components/sections/layout";

const EXTRAS: { key: ServiceKey; name: string }[] = [
  { key: "branding_canva", name: "Logo & flyer" },
  { key: "refonte", name: "Refonte" },
  { key: "chatbot_ia", name: "Chatbot IA" },
];

const archivo = { fontFamily: "var(--font-archivo-flex), sans-serif" } as const;

/** Orange glare following the cursor (span[data-glare] of the hovered card). */
function glare(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
}

function Check({ light }: { light: boolean }) {
  return (
    <span aria-hidden className={`mt-px grid size-5 flex-none place-items-center rounded-full ${light ? "bg-[#111] text-white" : "bg-[rgba(255,59,0,.14)] text-abcs-red"}`}>
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

/** Numbered FAQ, one open at a time; answers stay in the DOM (crawlable). */
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div data-reveal className="mx-auto flex w-full max-w-[620px] flex-col" style={{ gap: "clamp(28px,4vh,40px)", paddingTop: "clamp(40px,8vh,80px)" }}>
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-semibold tracking-[.14em] text-abcs-red">QUESTIONS</span>
        <h3 className="m-0 font-semibold tracking-[-.025em] text-[#f4f4f2]" style={{ ...archivo, fontSize: "clamp(26px,3vw,36px)" }}>
          Ce qu&apos;on me demande souvent
        </h3>
      </div>
      <div className="flex flex-col">
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
                <span className={`w-7 flex-none pt-0.5 text-[12px] font-semibold transition-colors duration-300 ${o ? "text-abcs-red" : "text-[rgba(244,241,236,.4)]"}`}>
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <span className="flex-1 text-[16px] font-semibold">{f.q}</span>
                <span
                  aria-hidden
                  className={`grid size-7 flex-none place-items-center rounded-full text-[16px] transition-all duration-[350ms] ease-out-expo ${o ? "rotate-45 bg-abcs-red" : "bg-[#1F1C19] group-hover:bg-[#2A2622]"}`}
                >
                  +
                </span>
              </button>
              <div id={`faq-${i}`} aria-hidden={!o} className={`grid transition-[grid-template-rows] duration-[450ms] ease-out-expo ${o ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="m-0 px-11 pb-[22px] text-[15px] leading-[1.6] text-[rgba(244,241,236,.6)] text-pretty max-[480px]:pr-0">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ServicesSection() {
  const { openModal } = useContactModal();
  const scrollToSection = useScrollToSection();
  const choose = (key: ServiceKey) => openModal({ type: SERVICES[key].label, budget: SERVICES[key].budgets[0] });

  return (
    <section id="services" data-stack className={section} style={sectionPad}>
      <Grain />
      <div className={sectionInner} style={{ gap: "clamp(40px,5vw,64px)" }}>
        <SectionTitle
          top="Services"
          word="Tarifs"
          intro="Un prix de départ ou un devis selon le projet, un délai et ce qui est inclus. Le prix final est fixé au devis, sans surprise."
          mark="sans surprise"
        />

        {/* Plans */}
        <div className="grid items-stretch gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,290px),1fr))" }}>
          {PLANS.map((p, i) => {
            const light = !!p.featured;
            const s = SERVICES[p.key];
            const soft = light ? "text-[#111]/60" : "text-[#f4f4f2]/60";
            return (
              <article
                key={p.key}
                data-reveal
                // "Le plus choisi" comes in last
                style={{ "--i": light ? PLANS.length : i, padding: "clamp(26px,2.6vw,36px)" } as CSSProperties}
                onMouseMove={glare}
                className={`group relative flex flex-col gap-6 overflow-hidden rounded-[28px] border transition-[transform,border-color] duration-[450ms] ease-out-expo hover:-translate-y-1 ${
                  light
                    ? "border-white bg-[linear-gradient(180deg,#fff_0%,#f1efea_100%)] text-[#111] shadow-[0_40px_90px_-30px_rgba(255,59,0,.35),0_0_0_1px_rgba(255,59,0,.15)]"
                    : "border-white/[.09] bg-[linear-gradient(180deg,#151515_0%,#0c0c0c_100%)] text-[#f4f4f2] shadow-[inset_0_1px_0_rgba(255,255,255,.06)] hover:border-white/[.22]"
                }`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%),rgba(255,59,0,.09),transparent 60%)" }}
                />

                <div className="relative flex min-h-[30px] items-center justify-between gap-3">
                  <span className={`font-mono text-[13px] font-semibold ${light ? "text-abcs-red" : "text-[#f4f4f2]/45"}`}>{p.num}</span>
                  {light && (
                    <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-abcs-red px-3 py-[7px] text-[12px] font-bold text-white">
                      <span aria-hidden className="size-1.5 rounded-full bg-white" />
                      Le plus choisi
                    </span>
                  )}
                </div>

                <div className="relative flex flex-col gap-3.5">
                  <h3 className="m-0 font-bold leading-[1.1] tracking-[-.02em]" style={{ ...archivo, fontSize: "clamp(1.4rem,1.9vw,1.7rem)" }}>
                    {p.name}
                  </h3>
                  <div className="flex flex-wrap items-baseline gap-2">
                    {!onQuote(p.key) && <span className={`text-[15px] ${soft}`}>dès</span>}
                    <span className="font-extrabold leading-none tracking-[-.04em] tabular-nums" style={{ ...archivo, fontSize: "clamp(2.8rem,4.2vw,3.6rem)" }}>
                      {onQuote(p.key) ? "Sur devis" : startPrice(p.key)}
                    </span>
                    {s.max && <span className={`text-[15px] ${soft}`}>/ jusqu’à {s.max}</span>}
                  </div>
                  <span className={`text-[14px] ${soft}`}>
                    Délai {p.delay} · {p.revisions} de révisions
                  </span>
                </div>

                <a
                  href="#contact"
                  onClick={(e) => {
                    if (scrollToSection("contact")) e.preventDefault();
                  }}
                  className={`relative flex items-center justify-center gap-2.5 rounded-full px-5 py-4 text-[15px] font-bold transition-colors duration-[250ms] ${
                    light ? "bg-[#111] text-white hover:bg-abcs-red" : "border border-white/20 bg-white/[.04] text-white hover:border-abcs-red hover:bg-abcs-red"
                  }`}
                >
                  Choisir cette offre <span aria-hidden>↗</span>
                </a>

                <div className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-3 ${light ? "bg-[#111]" : "bg-[rgba(255,59,0,.08)] shadow-[inset_0_0_0_1px_rgba(255,59,0,.25)]"}`}>
                  <span aria-hidden className="grid size-8 flex-none place-items-center rounded-[10px] bg-abcs-red text-white">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <span className="flex flex-col gap-px">
                    <span className="text-[14px] font-bold text-[#f4f4f2]">Maintenance 1 an offerte</span>
                    <span className="text-[13px] text-[#f4f4f2]/60">Mises à jour, sauvegardes, correctifs</span>
                  </span>
                </div>

                <ul className={`relative m-0 flex flex-1 list-none flex-col gap-[13px] border-t p-0 pt-[22px] text-[15px] leading-[1.45] ${light ? "border-[rgba(17,17,17,.12)]" : "border-white/10"}`}>
                  {p.included.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <Check light={light} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Also available */}
        <div data-reveal className="flex flex-col gap-4">
          <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#f4f4f2]/60">Aussi disponible</span>
          <div className="grid gap-x-6 border-t border-white/15" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))" }}>
            {EXTRAS.map((e) => (
              <button
                key={e.key}
                onClick={() => choose(e.key)}
                style={{ transition: "background-size .55s cubic-bezier(.22,1,.36,1), color .3s" }}
                className="group flex items-center justify-between gap-4 border-b border-white/15 bg-[linear-gradient(#FF3B00,#FF3B00)] bg-[length:0%_100%] bg-no-repeat px-4 py-5 text-left text-[#f4f4f2] hover:bg-[length:100%_100%] hover:text-white focus-visible:bg-[length:100%_100%]"
              >
                <span className="text-[17px] font-extrabold uppercase">{e.name}</span>
                <span className="shrink-0 rounded-full bg-[rgba(255,59,0,.14)] px-3 py-1.5 text-[13px] font-bold uppercase text-[#FF6a3d] transition-colors group-hover:bg-white group-hover:text-[#C42F00]">
                  {SERVICES[e.key].price.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Faq />
      </div>
    </section>
  );
}
