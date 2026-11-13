"use client";

import { useEffect, useRef, useState } from "react";
import { useContactModal } from "@/components/ContactModalProvider";
import SectionHeading from "@/components/sections/SectionHeading";
import StaggeredText from "@/components/fx/StaggeredText";
import { archivo, gutter, section } from "@/components/sections/layout";
import { useMedia } from "@/lib/useMedia";

const STEPS = [
  { n: "01", time: "30 min", title: "Analyse", text: "Un appel pour comprendre votre activité, vos clients et ce que le site doit vous rapporter." },
  { n: "02", time: "Quelques jours", title: "Maquette", text: "Je dessine un design unique à votre image. Vous validez avant la moindre ligne de code." },
  { n: "03", time: "1 à 5 semaines", title: "Mise en ligne", text: "Site codé à la main, rapide et optimisé pour Google, livré clé en main et prêt à vendre." },
];

/**
 * How it works: the three steps in a row (a list on phones). When the section
 * scrolls into view, the three fade up together and their title and text
 * stagger in at the same time. Reduced motion: shown as is.
 */
export default function HowItWorksSection() {
  const { openModal } = useContactModal();
  const wide = useMedia("(min-width: 900px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const list = useRef<HTMLOListElement>(null);
  const [shownState, setShown] = useState(false);
  const shown = reduced || shownState;

  useEffect(() => {
    const el = list.current;
    if (reduced || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section id="methode" data-stack className={section} style={{ padding: `0 ${gutter}` }}>
      <div
        className="relative z-[1] mx-auto flex max-w-[1180px] flex-col justify-center isolate"
        style={{ padding: "clamp(88px,11vw,150px) 0 clamp(48px,6vw,80px)", gap: "clamp(40px,5vw,64px)" }}
      >
        <SectionHeading kicker="MÉTHODE" title="Comment ça marche" />

        <ol
          ref={list}
          className={`relative m-0 flex list-none gap-[clamp(36px,4vw,48px)] p-0 ${wide ? "flex-row" : "flex-col"}`}
          style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(40px)", transition: "opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)" }}
        >
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex min-w-0 flex-1 flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="font-mono text-[13px] tracking-[.14em] text-[#8f8f8f]">{s.n}</span>
                <span
                  style={{ opacity: shown ? 1 : 0, transition: shown ? "opacity .6s .5s" : "opacity .2s" }}
                  className="inline-flex min-h-[30px] items-center whitespace-nowrap rounded-full bg-white/[.06] px-[13px] text-[13px] font-medium text-[#e6e6e6] shadow-[inset_0_1px_0_rgba(255,255,255,.14),inset_0_0_0_.5px_rgba(255,255,255,.1)] backdrop-blur-[16px]">
                  {s.time}
                </span>
              </div>
              <h3 className="m-0 font-semibold leading-[1.05] tracking-[-.03em] text-white" style={{ ...archivo, fontSize: "clamp(24px,2.4vw,32px)" }}>
                <StaggeredText text={s.title} by="letter" play={shown} step={0.035} />
              </h3>
              <p className="m-0 max-w-[340px] text-[16px] leading-[1.6] text-[#b5b5b5] text-pretty max-sm:text-[15px]">
                <StaggeredText text={s.text} by="word" play={shown} delay={0.25} step={0.04} />
              </p>
            </li>
          ))}
        </ol>

        <div className="flex justify-center" style={{ opacity: shown ? 1 : 0, transition: "opacity .8s .4s" }}>
          <button onClick={() => openModal()} className="btn-glass-primary">
            Démarrer mon projet <span aria-hidden className="text-[14px] opacity-90">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}
