"use client";

import SectionTitle from "@/components/fx/SectionTitle";
import Watermark from "@/components/fx/Watermark";
import Grain from "@/components/fx/Grain";
import BorderRun from "@/components/fx/BorderRun";
import FaqAccordion from "@/components/fx/FaqAccordion";
import { useContactModal } from "@/components/ContactModalProvider";
import { FAQ, PLANS, SERVICES, onQuote, startPrice, type ServiceKey } from "@/lib/services";
import { section, sectionInner, sectionPad } from "@/components/sections/layout";

const EXTRAS: { key: ServiceKey; name: string; desc: string }[] = [
  { key: "branding_canva", name: "Logo & flyer", desc: "Canva ou Adobe, prêt à imprimer" },
  { key: "refonte",        name: "Refonte",      desc: "Audit, responsive, vitesse, sécurité" },
  { key: "chatbot_ia",     name: "Chatbot IA",   desc: "Agent connecté à vos données" },
];

const archivo = { fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 700 } as const;

/** Orange glare following the cursor (span[data-glare] of the hovered card). */
function glare(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
}

export function ServicesSection() {
  const { openModal } = useContactModal();
  const choose = (key: ServiceKey) => openModal({ type: SERVICES[key].label, budget: SERVICES[key].budgets[0] });

  return (
    <section id="services" className={section} style={sectionPad}>
      <Grain />
      <Watermark text="Tarifs" index={0} />
      <div className={sectionInner} style={{ gap: "clamp(40px,5vw,64px)" }}>
        <SectionTitle
          top="Services"
          word="Tarifs"
          count={`(${String(PLANS.length).padStart(2, "0")})`}
          intro="Un prix de départ ou un devis selon le projet, un délai et ce qui est inclus. Le prix final est fixé au devis, sans surprise."
          mark="sans surprise"
          aside={`Dès ${startPrice(PLANS[0].key)}`}
        />

        {/* Plans */}
        <div className="grid items-stretch gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,290px),1fr))" }}>
          {PLANS.map((p) => {
            const f = !!p.featured;
            const s = SERVICES[p.key];
            return (
              <article
                key={p.key}
                onMouseMove={glare}
                className={`group relative flex flex-col gap-2 rounded-[30px] border p-2 transition-[transform,border-color] duration-[450ms] ease-out-expo hover:-translate-y-1 ${
                  f ? "border-[#f4f4f2] bg-[#f4f4f2] text-[#111]" : "border-white/[.08] bg-[#121212] text-[#f4f4f2] hover:border-white/20"
                }`}
              >
                {f && <BorderRun radius={30} />}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%),rgba(255,59,0,.09),transparent 60%)" }}
                />

                <div
                  className="relative flex flex-col"
                  style={{ gap: "clamp(22px,2.4vw,30px)", padding: "clamp(20px,2.2vw,28px) clamp(18px,2vw,24px) clamp(14px,1.6vw,20px)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="m-0 leading-[1.05]" style={{ ...archivo, fontSize: "clamp(1.4rem,2vw,1.7rem)" }}>
                        {p.name}
                      </h3>
                      <span className={`text-[16px] ${f ? "text-[#111]/62" : "text-[#f4f4f2]/60"}`}>{p.for}</span>
                    </div>
                    {f && (
                      <span className="shrink-0 rounded-full bg-[#111] px-3.5 py-[9px] text-[13px] font-bold text-[#f4f4f2]">Le plus choisi</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      {!onQuote(p.key) && <span className={`text-[16px] ${f ? "text-[#111]/62" : "text-[#f4f4f2]/60"}`}>dès</span>}
                      <span className="leading-none tracking-[-.03em] tabular-nums" style={{ ...archivo, fontSize: "clamp(2.8rem,4.4vw,3.6rem)" }}>
                        {onQuote(p.key) ? "Sur devis" : startPrice(p.key)}
                      </span>
                      {s.max && <span className={`text-[16px] ${f ? "text-[#111]/62" : "text-[#f4f4f2]/60"}`}>/ jusqu’à {s.max}</span>}
                    </div>
                    <span className={`text-[14px] ${f ? "text-[#111]/62" : "text-[#f4f4f2]/60"}`}>
                      Délai {p.delay} · {p.revisions} de révisions
                    </span>
                  </div>

                  <button
                    onClick={() => choose(p.key)}
                    className={`flex items-center justify-center gap-2.5 rounded-full px-5 py-4 text-[15px] font-bold transition-colors duration-[250ms] ${
                      f
                        ? "bg-abcs-red text-white hover:bg-[#111]"
                        : "border border-white/22 text-[#f4f4f2] hover:border-abcs-red hover:bg-abcs-red"
                    }`}
                  >
                    Choisir cette offre <span aria-hidden>↗</span>
                  </button>
                </div>

                <div
                  className={`relative flex flex-1 flex-col gap-4 rounded-[22px] ${f ? "bg-[#111] text-[#f4f4f2]" : "bg-[#1b1b1b]"}`}
                  style={{ padding: "clamp(20px,2.2vw,26px) clamp(18px,2vw,24px)" }}
                >
                  <span className="text-[15px] font-bold">Inclus :</span>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px] leading-[1.45]">
                    {p.included.map((it) => (
                      <li key={it} className="grid grid-cols-[8px_1fr] items-baseline gap-3.5">
                        <span aria-hidden className="h-[7px] w-[7px] -translate-y-0.5 rounded-full bg-abcs-red" />
                        <span>{it}</span>
                      </li>
                    ))}
                    {p.excluded.map((it) => (
                      <li key={it} className="grid grid-cols-[8px_1fr] items-baseline gap-3.5 opacity-50">
                        <span aria-hidden className="h-[1.5px] w-[7px] -translate-y-1 bg-current" />
                        <span>
                          {it} (non inclus)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* Also available */}
        <div className="flex flex-col gap-4">
          <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#f4f4f2]/60">Aussi disponible</span>
          <div className="grid gap-x-6 border-t border-white/15" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))" }}>
            {EXTRAS.map((e) => (
              <button
                key={e.key}
                onClick={() => choose(e.key)}
                style={{ transition: "background-size .55s cubic-bezier(.22,1,.36,1)" }}
                className="group flex items-center justify-between gap-4 border-b border-white/15 bg-[linear-gradient(#FF3B00,#FF3B00)] bg-[length:0%_100%] bg-no-repeat px-4 py-5 text-left text-[#f4f4f2] hover:bg-[length:100%_100%] focus-visible:bg-[length:100%_100%]"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[17px] font-extrabold uppercase">{e.name}</span>
                  <span className="text-[14px] opacity-72">{e.desc}</span>
                </span>
                <span className="shrink-0 rounded-full bg-[rgba(255,59,0,.14)] px-3 py-1.5 text-[13px] font-bold text-[#FF6a3d] transition-colors group-hover:bg-white group-hover:text-[#C42F00]">
                  {SERVICES[e.key].price.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div
          className="grid items-start"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: "clamp(24px,4vw,56px)", paddingTop: "clamp(16px,3vw,32px)" }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="m-0 font-heading font-normal uppercase leading-[0.95] tracking-[-0.02em] text-[#f4f4f2]" style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
              Questions fréquentes
            </h3>
            <p className="m-0 text-[16px] leading-[1.6] text-[#f4f4f2]/60">Une autre question ? Réponse sous 48 h maximum.</p>
          </div>
          <FaqAccordion items={FAQ} tone="dark" />
        </div>
      </div>
    </section>
  );
}
