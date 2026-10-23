"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useContactModal } from "@/components/ContactModalProvider";
import { FAQ, PLANS, SERVICES, onQuote, priceRange, startPrice, type ServiceKey } from "@/lib/services";
import { section, sectionInner, sectionPad } from "@/components/sections/layout";

const EXTRAS: { key: ServiceKey; name: string }[] = [
  { key: "branding_canva", name: "Logo & flyer" },
  { key: "refonte", name: "Refonte" },
  { key: "chatbot_ia", name: "Chatbot IA" },
];

/** Column copy and detail sheet of each plan, in PLANS order. */
const OFFERS: { short: string; desc: string; img: string; kicker: string; lead: string; body: string }[] = [
  {
    short: "Vitrine",
    desc: "Une page claire et rapide pour être trouvé sur Google et contacté.",
    img: "/offres/moreau.webp",
    kicker: "01 · LANCEMENT",
    lead: "Une présence en ligne claire, rapide et pensée pour convertir. Tout ce qu’il faut pour être trouvé et contacté.",
    body: "Idéal pour un artisan, un commerce ou un indépendant qui veut une page soignée sans complexité : votre activité, vos services, vos coordonnées et un formulaire qui arrive directement dans votre boîte mail.",
  },
  {
    short: "Sur-mesure",
    desc: "Design exclusif, Next.js et animations pour un site qui marque.",
    img: "/offres/wecars.webp",
    kicker: "02 · CROISSANCE — LE PLUS CHOISI",
    lead: "Un design exclusif, conçu de zéro pour votre marque. Rien de générique, tout est pensé pour vous démarquer.",
    body: "Développé en Next.js / React pour des performances maximales (Lighthouse 90+), avec des animations sur-mesure et un SEO technique avancé. Le prix dépend du nombre de pages et des fonctionnalités : on le fixe ensemble au devis.",
  },
  {
    short: "WordPress",
    desc: "Un site que vous gérez seul, thème à votre image et formation incluse.",
    img: "/offres/kinetik.webp",
    kicker: "03 · AUTONOMIE",
    lead: "Un site que vous modifiez vous-même, sans dépendre de personne. Textes, images, articles : tout est administrable.",
    body: "Je crée un thème personnalisé à votre image, j’installe le blog et le formulaire de contact, puis je vous forme pendant une heure à l’administration pour que vous soyez autonome dès la mise en ligne.",
  },
];

const archivo = { fontFamily: "var(--font-archivo-flex), sans-serif" } as const;
const SUN_X = ["16.66%", "50%", "83.33%"];
const PLANET = "absolute left-1/2 top-[90px] aspect-square w-[max(2600px,240%)] -translate-x-1/2 rounded-full";

const noop = () => () => {};
function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

function Check() {
  return (
    <span aria-hidden className="mt-px grid size-[22px] flex-none place-items-center rounded-full bg-[rgba(255,59,0,.12)] text-abcs-red-text">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

/**
 * Plan detail, light sheet sliding down from the top. Portaled to <body> so the
 * scroll effects on the section (transforms) don't trap the fixed positioning.
 * Content stays mounted while it slides out.
 */
function DetailSheet({ index, onClose, onChoose }: { index: number | null; onClose: () => void; onChoose: (key: ServiceKey) => void }) {
  const lenis = useLenis();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const scroller = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState(0);
  const open = index !== null;
  if (open && index !== last) setLast(index);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    if (scroller.current) scroller.current.scrollTop = 0;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, lenis, onClose]);

  if (!mounted) return null;
  const p = PLANS[last];
  const o = OFFERS[last];
  const infos = [
    ["Prix", priceRange(p.key)],
    ["Délai", p.delay.replace("sem.", "semaines")],
    ["Révisions", p.revisions],
    ["Maintenance", "1 an offerte"],
  ];

  return createPortal(
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[102] bg-black/75 backdrop-blur-[8px] transition-opacity duration-[450ms] ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        inert={!open}
        className={`fixed inset-x-0 top-0 z-[103] flex flex-col overflow-hidden border border-t-0 border-[rgba(17,17,17,.08)] bg-white text-[#111] transition-transform duration-700 ease-[cubic-bezier(.32,.72,0,1)] ${open ? "translate-y-0" : "-translate-y-[105%]"}`}
        style={{
          bottom: "clamp(24px,5vh,44px)",
          borderRadius: "0 0 clamp(28px,4vw,56px) clamp(28px,4vw,56px)",
          boxShadow: "0 30px 80px rgba(0,0,0,.7),0 40px 120px -40px rgba(255,59,0,.35)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 z-[2] grid size-11 place-items-center rounded-full bg-[rgba(17,17,17,.06)] text-[22px] leading-none text-[#111] transition-colors duration-[250ms] hover:bg-abcs-red hover:text-white"
          style={{ right: "clamp(16px,3vw,32px)" }}
        >
          ×
        </button>
        <div
          ref={scroller}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ padding: "clamp(72px,8vw,96px) clamp(20px,5vw,72px) clamp(32px,5vw,56px)" }}
        >
          <div className="mx-auto flex max-w-[880px] flex-col" style={{ gap: "clamp(40px,6vw,72px)" }}>
            <div className="flex flex-col" style={{ gap: "clamp(32px,5vw,56px)" }}>
              <div className="relative aspect-[1898/868] overflow-hidden rounded-[28px] border border-[rgba(17,17,17,.08)] bg-[#eee]">
                <Image src={o.img} alt="" fill sizes="(max-width: 960px) 100vw, 880px" className="object-cover object-top" />
              </div>
              <div className="flex max-w-[620px] flex-col gap-5">
                <span className="text-[13px] font-bold tracking-[.14em] text-abcs-red-text">{o.kicker}</span>
                <h2 className="m-0 font-semibold leading-none tracking-[-.04em]" style={{ ...archivo, fontSize: "clamp(2.4rem,5vw,3.6rem)" }}>
                  {p.name}
                </h2>
                <p className="m-0 leading-[1.45] text-pretty" style={{ fontSize: "clamp(18px,1.6vw,21px)" }}>{o.lead}</p>
                <p className="m-0 leading-[1.45] text-[rgba(17,17,17,.62)] text-pretty" style={{ fontSize: "clamp(18px,1.6vw,21px)" }}>{o.body}</p>
              </div>
              <div className="grid gap-x-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,160px),1fr))" }}>
                {infos.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1.5 border-t border-[rgba(17,17,17,.1)] py-[18px]">
                    <span className="text-[13px] font-semibold uppercase tracking-[.08em] text-[rgba(17,17,17,.5)]">{k}</span>
                    <span className="text-[22px] font-bold tracking-[-.02em]" style={archivo}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-[18px]">
                <h3 className="m-0 font-semibold tracking-[-.03em]" style={{ ...archivo, fontSize: "clamp(1.5rem,2.4vw,2rem)" }}>
                  Ce qui est inclus
                </h3>
                <ul className="m-0 grid list-none gap-x-8 gap-y-3.5 p-0 text-[17px] leading-[1.45]" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))" }}>
                  {p.included.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <Check />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className="flex flex-wrap items-center justify-between gap-5 rounded-[28px] bg-[rgba(255,59,0,.08)] shadow-[inset_0_0_0_1px_rgba(255,59,0,.25)]"
              style={{ padding: "clamp(24px,3vw,36px)" }}
            >
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold tracking-[-.03em]" style={{ ...archivo, fontSize: "clamp(1.4rem,2.2vw,1.8rem)" }}>On en parle ?</span>
                <span className="text-[15px] text-[rgba(17,17,17,.6)]">Réponse sous 48 h, devis gratuit.</span>
              </div>
              <button
                onClick={() => onChoose(p.key)}
                className="inline-flex items-center gap-2.5 rounded-full bg-abcs-red px-6 py-4 text-[15px] font-bold text-white transition-colors duration-[250ms] hover:bg-[#ff5a24]"
              >
                Choisir cette offre <span aria-hidden>↗</span>
              </button>
            </div>
          </div>
        </div>
        <button onClick={onClose} aria-label="Fermer" className="flex w-full flex-none justify-center bg-transparent pb-[18px] pt-3.5">
          <span className="h-[5px] w-12 rounded-full bg-[rgba(17,17,17,.2)]" />
        </button>
      </div>
    </>,
    document.body
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
  // Every offer opens the contact form, pre-filled with the service and its budget range
  const choose = (key: ServiceKey) => openModal({ type: SERVICES[key].label, budget: SERVICES[key].budgets[0] });

  const wide = useMedia("(min-width: 900px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const [sun, setSun] = useState(1);
  const [detail, setDetail] = useState<number | null>(null);
  const paused = useRef(false);
  const resume = useRef<ReturnType<typeof setTimeout>>(undefined);

  // The sun moves to the next offer every 4.2 s, unless a column is hovered or a sheet is open.
  // Phones stack the offers and can't hover: all of them stay lit there, no rotation.
  useEffect(() => {
    if (reduced || !wide) return;
    const t = setInterval(() => !paused.current && setSun((s) => (s + 1) % 3), 4200);
    return () => {
      clearInterval(t);
      clearTimeout(resume.current);
    };
  }, [reduced, wide]);

  const hover = (i: number) => {
    paused.current = true;
    clearTimeout(resume.current);
    resume.current = setTimeout(() => (paused.current = false), 6000);
    setSun(i);
  };
  const openDetail = (i: number) => {
    paused.current = true;
    clearTimeout(resume.current);
    setSun(i);
    setDetail(i);
  };
  const closeDetail = useCallback(() => {
    paused.current = false;
    setDetail(null);
  }, []);

  const sunX = wide ? SUN_X[sun] : "50%";
  const dawnMask = `radial-gradient(min(26vw,380px) 140px at ${sunX} 90px,#000 0%,rgba(0,0,0,0) 100%)`;
  const gutter = "clamp(20px,5vw,72px)";

  return (
    <section id="services" data-stack className={section} style={sectionPad}>
      <div className={sectionInner} style={{ gap: "clamp(40px,5vw,64px)" }}>
        <h2 className="sr-only">Offres et tarifs</h2>

        {/* Three offers over a planet horizon (full viewport width, so the arc never stops at the
            content edges); the dawn follows the active one */}
        <div className="relative overflow-hidden" style={{ margin: "0 calc(50% - 50vw)" }}>
          <div
            className="relative z-[2] mx-auto grid"
            style={{
              maxWidth: `calc(1280px + 2 * ${gutter})`,
              gap: "clamp(40px,5vw,24px)",
              padding: `clamp(56px,8vw,96px) ${gutter} 0`,
              gridTemplateColumns: wide ? "repeat(3,minmax(0,1fr))" : "minmax(0,1fr)",
            }}
          >
            {PLANS.map((p, i) => {
              const on = !wide || sun === i;
              const o = OFFERS[i];
              const fade = "transition-colors duration-[800ms]";
              const label = on ? "text-[#FF8A3D]" : "text-[rgba(244,244,242,.4)]";
              const title = on ? "text-white" : "text-[rgba(244,244,242,.28)]";
              const desc = on ? "text-[rgba(244,244,242,.85)]" : "text-[rgba(244,244,242,.3)]";
              return (
                <button
                  key={p.key}
                  onMouseEnter={() => hover(i)}
                  onFocus={() => hover(i)}
                  onClick={() => openDetail(i)}
                  aria-haspopup="dialog"
                  className="flex cursor-pointer flex-col items-center gap-3.5 bg-transparent p-0 text-center"
                >
                  <span className={`text-[15px] font-medium tabular-nums ${label} ${fade}`}>Délai {p.delay}</span>
                  <span className={`font-bold leading-none tracking-[-.035em] ${title} ${fade}`} style={{ ...archivo, fontSize: "clamp(2.2rem,4.4vw,3.6rem)" }}>
                    {o.short}
                  </span>
                  <span className={`max-w-[300px] text-[16px] leading-[1.6] text-pretty ${desc} ${fade}`}>{o.desc}</span>
                  <span className={`flex items-baseline gap-2 font-extrabold tracking-[-.03em] tabular-nums ${title} ${fade}`} style={{ ...archivo, fontSize: "clamp(1.6rem,2.4vw,2rem)" }}>
                    {onQuote(p.key) ? "Sur devis" : startPrice(p.key)}
                    {SERVICES[p.key].max && <span className={`text-[14px] font-medium tracking-normal ${desc} ${fade}`}>→ {SERVICES[p.key].max}</span>}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${label} ${fade}`}>
                    Voir le détail <span aria-hidden>↓</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pointer-events-none relative z-[1]" style={{ height: "clamp(200px,22vw,300px)", marginTop: "clamp(-20px,-2vw,0px)" }}>
            <div aria-hidden className={PLANET} style={{ boxShadow: "0 -1px 0 rgba(255,140,70,.35),0 -10px 40px rgba(255,90,20,.16),0 -40px 120px rgba(255,59,0,.1)" }} />
            <div aria-hidden className="absolute inset-0" style={{ WebkitMaskImage: dawnMask, maskImage: dawnMask }}>
              <div
                className={PLANET}
                style={{
                  boxShadow:
                    "0 -2px 0 #fff,0 -3px 14px rgba(255,200,160,.95),0 -12px 50px rgba(255,120,60,.7),inset 0 3px 2px -1px rgba(255,220,190,.9),inset 0 30px 50px -24px rgba(255,140,80,.45)",
                }}
              />
            </div>
            <div className="pointer-events-auto absolute inset-x-0 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-5" style={{ bottom: "clamp(28px,4vw,48px)" }}>
              <span className="text-[14px] text-[rgba(244,244,242,.6)]">Maintenance 1 an offerte sur chaque offre</span>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.04] px-[18px] py-[11px] text-[14px] font-bold text-white transition-colors duration-[250ms] hover:border-abcs-red hover:bg-abcs-red"
              >
                Demander un devis <span aria-hidden>↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* Also available */}
        <div data-reveal className="flex flex-col items-center" style={{ gap: "clamp(24px,3vw,36px)" }}>
          <span className="text-[15px] font-medium text-[rgba(244,244,242,.45)]">Aussi disponible</span>
          <div className="grid w-full max-w-[960px] gap-2" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))" }}>
            {EXTRAS.map((e) => (
              <button
                key={e.key}
                onClick={() => choose(e.key)}
                className="flex flex-col items-center gap-2 rounded-[20px] bg-transparent px-4 py-5 text-center text-[rgba(244,244,242,.4)] transition-colors duration-500 hover:bg-[rgba(255,90,20,.06)] hover:text-white focus-visible:text-white"
              >
                <span className="font-bold leading-none tracking-[-.03em]" style={{ ...archivo, fontSize: "clamp(1.4rem,2.2vw,1.8rem)" }}>
                  {e.name}
                </span>
                <span className="text-[14px] font-medium text-[#FF8A3D]">{SERVICES[e.key].price.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>

        <Faq />
      </div>

      <DetailSheet
        index={detail}
        onClose={closeDetail}
        onChoose={(key) => {
          closeDetail();
          choose(key);
        }}
      />
    </section>
  );
}
