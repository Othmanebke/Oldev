"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { useContactModal } from "@/components/ContactModalProvider";
import {
  cap, condensed, delay, fade, DispoBadge, HeroBackground, HeroOverlays, HeroPortrait, HeroSocials, ParisTime, useHeroMotion,
} from "@/components/hero/HeroParts";
import { SERVICES, type ServiceKey } from "@/lib/services";
import { EMAIL } from "@/lib/site";

const titleStyle: CSSProperties = {
  ...condensed,
  margin: 0,
  padding: ".04em .02em 0",
  lineHeight: 0.84,
  letterSpacing: "-.01em",
  fontSize: "clamp(2.6rem,8.5vw,9.5rem)",
  textAlign: "center",
  textWrap: "balance",
};

type Props = {
  crumbs: { name: string; href?: string }[];
  label: string;
  title: string;
  intro: string[];
  stats: { v: string; l: string }[];
  /** Offer pre-filled in the contact form. */
  service?: ServiceKey;
  ctaLabel?: string;
  secondary?: { href: string; label: string };
};

/** Words wrap freely; each letter rises out of its word mask. */
function TitleLetters({ title }: { title: string }) {
  let n = 0;
  return (
    <>
      {title.split(" ").map((word, wi) => (
        <span key={wi}>
          {wi > 0 && " "}
          {/* One mask per hyphen chunk, so "Seine-et-Marne" can wrap after a hyphen */}
          {word.split(/(?<=-)/).map((chunk, ci) => (
            <span key={ci} className="inline-block overflow-hidden pt-[.04em] align-top">
              {chunk.split("").map((ch, i) => (
                <span key={i} className="inline-block" style={{ animation: `h-rise 1.1s cubic-bezier(.22,1,.36,1) ${delay(0.25 + n++ * 0.025)} both` }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

/** Landing-page hero, same stage as the home hero (portrait, filled + outline title, captions, bottom bar). */
export default function SeoHero({ crumbs, label, title, intro, stats, service, ctaLabel = "Demander un devis", secondary }: Props) {
  const { openModal } = useContactModal();
  const s = service && SERVICES[service];
  const root = useRef<HTMLDivElement>(null);
  const titleA = useRef<HTMLDivElement>(null);
  const titleB = useRef<HTMLDivElement>(null);
  const caps = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  useHeroMotion({ root, layers: [titleA, titleB], caps, photo, light });

  const all = [{ name: "Accueil", href: "/" }, ...crumbs];
  const box = "hero-title absolute left-1/2 top-[20%] w-[min(92vw,1400px)]";

  return (
    <section id="top" data-stack className="relative z-[1] bg-[#050505] text-white">
      <div ref={root} className="relative h-screen min-h-[640px] overflow-hidden bg-[#050505]">
        <HeroBackground lightRef={light} />

        {/* Title — filled, behind the photo */}
        <div ref={titleA} className={`${box} z-[1] text-[#f4f4f2]`} style={{ translate: "-50% 0", filter: "drop-shadow(0 0 40px rgba(255,255,255,.22))" }}>
          <h1 style={titleStyle}>
            <span className="sr-only">{title}</span>
            <span aria-hidden><TitleLetters title={title} /></span>
          </h1>
        </div>

        <HeroPortrait photoRef={photo} />

        {/* Title — outline, in front of the photo */}
        <div ref={titleB} aria-hidden className={`${box} pointer-events-none z-[3]`} style={{ translate: "-50% 0", color: "transparent", WebkitTextStroke: "1.2px rgba(244,244,242,.55)" }}>
          <div style={titleStyle}><TitleLetters title={title} /></div>
        </div>

        <HeroOverlays />

        {/* Captions under the title (invisible title copy sets the height) */}
        <div ref={caps} className={`${box} pointer-events-none z-[4] flex flex-col`} style={{ translate: "-50% 0" }}>
          <div aria-hidden style={{ ...titleStyle, visibility: "hidden" }}>{title}</div>
          <div className={`mt-[clamp(14px,1.6vw,24px)] flex items-start justify-between gap-6 text-[#f4f4f2] ${cap}`} style={fade(1.3)}>
            <nav aria-label="Fil d’Ariane" className="pointer-events-auto">
              <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
                {all.map((c, i) => (
                  <li key={c.name} className={i < all.length - 1 ? "text-[#f4f4f2]/50" : ""}>
                    {c.href && i < all.length - 1 ? (
                      <Link href={c.href} className="transition-colors hover:text-abcs-red">{c.name}</Link>
                    ) : (
                      <span aria-current="page">{c.name}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <span className="flex max-w-[50%] flex-col items-end gap-0.5 text-right">
              <span className="text-[#f4f4f2]/50">Freelance</span>
              <span className="text-abcs-red">{label}</span>
            </span>
          </div>
        </div>

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-[5] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(20px,3vw,44px)] py-[clamp(22px,3vw,40px)]" style={fade(0.2)}>
          <Link href="/" className="w-fit uppercase transition-colors hover:text-abcs-red" style={{ ...condensed, fontSize: 24, letterSpacing: ".01em" }}>
            O&apos;LDEV
          </Link>
          <span className="hidden md:inline-flex"><ParisTime /></span>
          <DispoBadge />
        </div>

        {/* Bottom bar */}
        <div
          className="absolute bottom-[clamp(28px,6vh,64px)] left-[clamp(20px,3vw,44px)] right-[clamp(20px,3vw,44px)] z-[5] grid grid-cols-1 items-center justify-items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:justify-items-stretch"
          style={fade(1.5)}
        >
          <HeroSocials className="order-2 md:order-none" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openModal(s ? { type: s.label, budget: s.budgets[0] } : undefined)}
              className="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-abcs-red py-[7px] pl-6 pr-[7px] text-[13px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_40px_-8px_rgba(255,59,0,0.6)] transition-all duration-200 hover:bg-white hover:text-abcs-black"
            >
              {ctaLabel}
              <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-abcs-black text-[15px] text-white">↗</span>
            </button>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-white/25 px-6 py-[17px] text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-abcs-red hover:text-abcs-red"
              >
                {secondary.label}
              </Link>
            )}
          </div>
          <a href={`mailto:${EMAIL}`} className={`hidden justify-self-end text-[#f4f4f2] transition-colors hover:text-abcs-red lg:block ${cap}`}>
            {EMAIL}
          </a>
        </div>
      </div>

      {/* Intro + key figures, under the stage (the next card overlaps the bottom padding) */}
      <div
        className="mx-auto grid max-w-[1200px] items-end gap-10 md:grid-cols-[minmax(0,1fr)_auto]"
        style={{ padding: "clamp(40px,6vw,80px) clamp(20px,5vw,72px) clamp(110px,12vw,170px)" }}
      >
        <div className="flex max-w-[640px] flex-col gap-[18px]">
          {intro.map((p) => (
            <p key={p} className="m-0 text-[17px] leading-[1.6] text-white/70 text-pretty">{p}</p>
          ))}
        </div>
        <dl className="m-0 flex flex-col gap-3 border-l border-white/15 pl-6">
          {stats.map((p) => (
            <div key={p.l} className="flex items-baseline gap-3">
              <dt className={`order-2 text-white/55 ${cap}`}>{p.l}</dt>
              <dd className="m-0 leading-none text-[#f4f4f2]" style={{ ...condensed, fontSize: 34, letterSpacing: ".01em" }}>{p.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
