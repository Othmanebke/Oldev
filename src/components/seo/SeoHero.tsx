"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import {
  siReact, siNextdotjs, siTypescript, siTailwindcss, siWordpress, siWoocommerce, siFigma,
  siNodedotjs, siJavascript, siHtml5, siCss, siVercel, siGooglemaps, siElementor,
  type SimpleIcon,
} from "simple-icons";
import { useContactModal } from "@/components/ContactModalProvider";
import { SERVICES, type ServiceKey } from "@/lib/services";

const ICONS = {
  react: siReact, next: siNextdotjs, ts: siTypescript, tailwind: siTailwindcss, wordpress: siWordpress,
  woo: siWoocommerce, figma: siFigma, node: siNodedotjs, js: siJavascript, html: siHtml5, css: siCss,
  vercel: siVercel, maps: siGooglemaps, elementor: siElementor,
} satisfies Record<string, SimpleIcon>;

export type HeroIcon = keyof typeof ICONS;

// [left, top, size (px), rotation (deg)] — kept on the right half so the title stays clear.
// Phones only keep the first two.
const SLOTS: [string, string, number, number][] = [
  [ "86%", "18%", 64, 8], ["74%", "62%", 58, -10], ["62%", "14%", 52, -6], ["90%", "46%", 56, 10],
  [ "70%", "36%", 48, 6], ["82%", "78%", 54, -4],
];

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

type Props = {
  crumbs: { name: string; href?: string }[];
  label: string;
  title: string;
  intro: string[];
  stats: { v: string; l: string }[];
  icons: HeroIcon[];
  /** Offer pre-filled in the contact form. */
  service?: ServiceKey;
  ctaLabel?: string;
  secondary?: { href: string; label: string };
};

/** Landing-page hero, same language as the home hero (grid, rings, floating icons, letter reveal). */
export default function SeoHero({ crumbs, label, title, intro, stats, icons, service, ctaLabel = "Demander un devis", secondary }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { openModal } = useContactModal();
  const s = service && SERVICES[service];

  useEffect(() => {
    const timer = setTimeout(() => ref.current?.classList.add("is-in"), 60);
    return () => clearTimeout(timer);
  }, []);

  let letter = 0;
  const all = [{ name: "Accueil", href: "/" }, ...crumbs];

  return (
    <section
      ref={ref}
      data-stack
      className="hero relative z-[1] flex min-h-[92svh] flex-col justify-between gap-12 overflow-hidden bg-abcs-bg text-abcs-black"
      style={{ padding: "clamp(28px,4vw,48px) clamp(20px,5vw,72px) clamp(110px,12vw,170px)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,17,17,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 75% 70% at 70% 50%, black 15%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 70% 50%, black 15%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        data-hero="ring"
        className="pointer-events-none absolute aspect-square rounded-full border-[1.5px] border-[rgba(255,59,0,0.35)]"
        style={{ ...idx(0), right: "-18%", top: "50%", translate: "0 -50%", width: "min(900px,120vw)" }}
      />
      <div
        aria-hidden
        data-hero="ring"
        className="pointer-events-none absolute aspect-square rounded-full border-[1.5px] border-dashed border-[rgba(255,59,0,0.25)]"
        style={{ ...idx(1), right: "-4%", top: "50%", translate: "0 -50%", width: "min(560px,80vw)" }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {icons.slice(0, SLOTS.length).map((key, i) => {
          const [x, y, size, rot] = SLOTS[i];
          return (
            <span
              key={key}
              data-hero="icon"
              className={`absolute items-center justify-center rounded-[18px] border border-[rgba(255,59,0,0.22)] bg-white/40 backdrop-blur-[2px] ${i < 2 ? "flex" : "hidden md:flex"}`}
              style={{
                ...idx(i),
                left: x,
                top: y,
                width: size,
                height: size,
                rotate: `${rot}deg`,
                animation: `hero-float ${6 + (i % 4)}s ease-in-out ${(i * 0.37).toFixed(2)}s infinite`,
              }}
            >
              <svg viewBox="0 0 24 24" className="h-[52%] w-[52%] opacity-55" fill="#FF3B00">
                <path d={ICONS[key].path} />
              </svg>
            </span>
          );
        })}
      </div>

      {/* Top bar: brand + breadcrumb */}
      <div data-hero="fade" className="relative z-[2] flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="font-heading text-[20px] tracking-[-0.01em]">O&apos;LDEV</Link>
        <nav aria-label="Fil d’Ariane" className="rounded-full bg-white/70 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-abcs-black/55 backdrop-blur-[8px]">
          <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
            {all.map((c, i) => (
              <li key={c.name} className="flex gap-2">
                {c.href && i < all.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-abcs-red-text">{c.name}</Link>
                ) : (
                  <span aria-current="page" className="text-abcs-black">{c.name}</span>
                )}
                {i < all.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="relative z-[2] flex max-w-[1000px] flex-col gap-6">
        <span data-hero="fade" className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(255,59,0,0.1)] px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-abcs-red-text">
          <span className="h-2 w-2 rounded-full bg-abcs-red" />
          {label}
        </span>
        <h1
          className="m-0 font-heading font-normal uppercase leading-[0.86] tracking-[-0.035em] text-balance"
          style={{ fontSize: "clamp(2.7rem,8.4vw,8.5rem)" }}
        >
          <span className="sr-only">{title}</span>
          {title.split(" ").map((word, wi) => (
            <span key={wi} aria-hidden>
              {wi > 0 && " "}
              {/* One mask per hyphen chunk, so "Seine-et-Marne" can wrap after a hyphen, never mid-chunk */}
              {word.split(/(?<=-)/).map((chunk, ci) => (
                <span key={ci} className="split-mask">
                  {chunk.split("").map((ch, i) => (
                    <span key={i} className="split-unit" style={idx(letter++)}>{ch}</span>
                  ))}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      <div data-hero="fade-late" className="relative z-[2] flex flex-wrap items-end justify-between gap-4 sm:gap-7">
        <div className="flex max-w-[540px] flex-col gap-[18px] rounded-[20px] bg-[rgba(240,240,238,0.86)] p-5 backdrop-blur-[8px]">
          {intro.map((p) => (
            <p key={p} className="m-0 text-[17px] leading-[1.55] text-abcs-black/80 text-pretty">{p}</p>
          ))}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={() => openModal(s ? { type: s.label, budget: s.budgets[0] } : undefined)}
              className="inline-flex items-center gap-2 rounded-full bg-abcs-black px-[22px] py-[15px] text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-abcs-red"
            >
              {ctaLabel} <span aria-hidden>↗</span>
            </button>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-abcs-black/25 px-[22px] py-[15px] text-[13px] font-bold uppercase tracking-[0.14em] text-abcs-black transition-colors hover:border-abcs-red hover:text-abcs-red-text"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>

        <dl className="m-0 flex flex-col gap-1.5 rounded-[20px] bg-[rgba(240,240,238,0.86)] px-5 py-[18px] backdrop-blur-[8px]">
          {stats.map((p) => (
            <div key={p.l} className="flex items-baseline gap-2.5">
              <dt className="order-2 text-[14px] text-abcs-black/70">{p.l}</dt>
              <dd className="m-0 font-heading text-[22px]">{p.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
