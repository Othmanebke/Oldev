"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { useContactModal } from "@/components/ContactModalProvider";
import {
  cap, condensed, delay, fade, DispoBadge, HeroBackground, HeroOverlays, ParisTime, useHeroMotion,
} from "@/components/hero/HeroParts";
import { SERVICES, type ServiceKey } from "@/lib/services";

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

/** Landing-page hero: shorter stage with the title alone in the middle, then breadcrumb, intro, figures and CTA. */
export default function SeoHero({ crumbs, label, title, intro, stats, service, ctaLabel = "Demander un devis", secondary }: Props) {
  const { openModal } = useContactModal();
  const s = service && SERVICES[service];
  const root = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  useHeroMotion({ root, layers: [titleRef], light });

  const all = [{ name: "Accueil", href: "/" }, ...crumbs];

  return (
    <section id="top" data-stack className="relative z-[1] bg-[#050505] text-white">
      {/* Stage: just the title, centered */}
      <div ref={root} className="relative flex h-[68svh] min-h-[440px] items-center justify-center overflow-hidden bg-[#050505]">
        <HeroBackground lightRef={light} />

        <div ref={titleRef} className="relative z-[1] w-[min(92vw,1400px)] text-[#f4f4f2]" style={{ filter: "drop-shadow(0 0 40px rgba(255,255,255,.22))" }}>
          <h1 style={titleStyle}>
            <span className="sr-only">{title}</span>
            <span aria-hidden><TitleLetters title={title} /></span>
          </h1>
        </div>

        <HeroOverlays />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-[5] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(20px,3vw,44px)] py-[clamp(22px,3vw,40px)]" style={fade(0.2)}>
          <Link href="/" className="w-fit uppercase transition-colors hover:text-abcs-red" style={{ ...condensed, fontSize: 24, letterSpacing: ".01em" }}>
            O&apos;LDEV
          </Link>
          <span className="hidden md:inline-flex"><ParisTime /></span>
          <DispoBadge />
        </div>
      </div>

      {/* Breadcrumb, intro, key figures and CTA, under the stage (the next card overlaps the bottom padding) */}
      <div
        className="mx-auto flex max-w-[1200px] flex-col gap-10"
        style={{ padding: "clamp(8px,2vw,24px) clamp(20px,5vw,72px) clamp(110px,12vw,170px)" }}
      >
        <div className={`flex flex-wrap items-start justify-between gap-6 text-[#f4f4f2] ${cap}`}>
          <nav aria-label="Fil d’Ariane">
            <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
              {all.map((c, i) => (
                <li key={c.name} className={`flex gap-2 ${i < all.length - 1 ? "text-[#f4f4f2]/50" : ""}`}>
                  {c.href && i < all.length - 1 ? (
                    <Link href={c.href} className="transition-colors hover:text-abcs-red">{c.name}</Link>
                  ) : (
                    <span aria-current="page">{c.name}</span>
                  )}
                  {i < all.length - 1 && <span aria-hidden>/</span>}
                </li>
              ))}
            </ol>
          </nav>
          <span className="text-abcs-red">{label}</span>
        </div>

        <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex max-w-[640px] flex-col gap-[18px]">
            {intro.map((p) => (
              <p key={p} className="m-0 text-[17px] leading-[1.6] text-white/70 text-pretty">{p}</p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
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
      </div>
    </section>
  );
}
