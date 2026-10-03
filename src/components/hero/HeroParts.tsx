"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import Image from "next/image";
import { siGithub, siInstagram, siTiktok } from "simple-icons";
import heroPhoto from "@/img/hero.webp";

/** Condensed Archivo (wdth axis) used by the hero titles. */
export const condensed: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 900,
  fontStretch: "62%",
  textTransform: "uppercase",
};

export const cap = "font-sans text-[clamp(11px,.95vw,13px)] font-bold uppercase leading-[1.5] tracking-[0.18em]";

/** Intro delays are offset by `--hd` set on the hero root (the home page waits for the preloader). */
export const delay = (d: number) => `calc(var(--hd, 0s) + ${d}s)`;
export const fade = (d: number): CSSProperties => ({ animation: `h-fade 1s cubic-bezier(.22,1,.36,1) ${delay(d)} both` });

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/o.ldev/", icon: siInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/othmane-bouakline/", icon: null },
  { label: "GitHub", href: "https://github.com/Othmanebke", icon: siGithub },
  { label: "TikTok", href: "https://www.tiktok.com/@o.ldev", icon: siTiktok },
];

/** Mouse parallax + scroll drift (direct DOM writes, no re-render). */
export function useHeroMotion(refs: {
  root: RefObject<HTMLElement | null>;
  layers: RefObject<HTMLElement | null>[];
  caps?: RefObject<HTMLElement | null>;
  photo?: RefObject<HTMLElement | null>;
  light: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { root, layers, caps, photo, light } = refs;
    let mx = 0, my = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      const b = root.current?.getBoundingClientRect();
      if (!b) return;
      tx = (e.clientX - b.left) / b.width - 0.5;
      ty = (e.clientY - b.top) / b.height - 0.5;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      if (!root.current) return;
      // The hero is sticky (StackEffect), so its rect barely moves: drive the drift with the page scroll (it is the first section)
      const sy = window.scrollY;
      const t = `translate(${-mx * 22}px,${-my * 12 + sy * 0.35}px)`;
      for (const l of layers) if (l.current) l.current.style.transform = t;
      if (caps?.current) {
        caps.current.style.transform = t;
        caps.current.style.opacity = String(Math.max(0, 1 - sy / 400));
      }
      if (photo?.current) photo.current.style.transform = `translate(${mx * 16}px,${sy * 0.12}px)`;
      if (light.current) {
        light.current.style.left = `${50 + mx * 50}%`;
        light.current.style.top = `${35 + my * 40}%`;
      }
    };
    window.addEventListener("mousemove", onMove);
    loop();
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
    // Refs are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Dark radial background + soft light following the cursor (z-0). */
export function HeroBackground({ lightRef }: { lightRef: RefObject<HTMLDivElement | null> }) {
  return (
    <>
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: "radial-gradient(60% 55% at 50% 28%,#1d1d1d 0%,#0a0a0a 55%,#050505 100%)", animation: `h-light 2s ease ${delay(0.1)} both` }} />
      <div
        ref={lightRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[35%] z-0 aspect-square w-[min(900px,110vw)] rounded-full"
        style={{ translate: "-50% -50%", background: "radial-gradient(circle,rgba(255,255,255,.09) 0%,transparent 60%)", animation: `h-light 2s ease ${delay(0.4)} both` }}
      />
    </>
  );
}

/** Orange rim glow (z-1) + portrait with simulated studio side-light (z-2). */
export function HeroPortrait({ photoRef }: { photoRef: RefObject<HTMLDivElement | null> }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[8%] left-1/2 z-[1] h-[60%] w-[min(720px,80vw)]"
        style={{ translate: "-50% 0", background: "radial-gradient(50% 50% at 50% 45%,rgba(255,59,0,.28) 0%,rgba(255,59,0,.06) 45%,transparent 72%)", animation: `h-light 2.4s ease ${delay(1)} both` }}
      />
      <div ref={photoRef} className="hero-photo pointer-events-none absolute bottom-0 left-1/2 z-[2] h-[86%]" style={{ translate: "-50% 0", aspectRatio: `${heroPhoto.width} / ${heroPhoto.height}` }}>
        <div className="relative h-full" style={{ animation: `h-photo 1.6s cubic-bezier(.22,1,.36,1) ${delay(0.5)} both` }}>
          <Image
            src={heroPhoto}
            alt="Othmane Bouakline"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 50vw"
            className="object-contain object-bottom"
            style={{ filter: "grayscale(1) contrast(1.25) brightness(.85) drop-shadow(10px -4px 18px rgba(255,255,255,.18))" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(100deg,rgba(0,0,0,.78) 0%,rgba(0,0,0,.45) 32%,rgba(0,0,0,0) 58%,rgba(255,255,255,.10) 80%,rgba(255,255,255,0) 100%)",
              WebkitMaskImage: `url(${heroPhoto.src})`,
              maskImage: `url(${heroPhoto.src})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }}
          />
        </div>
      </div>
    </>
  );
}

/** Bottom fade, vignette, grain (z-3). */
export function HeroOverlays() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[44%]" style={{ background: "linear-gradient(180deg,rgba(5,5,5,0) 0%,rgba(5,5,5,.72) 55%,#050505 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]" style={{ background: "radial-gradient(120% 90% at 50% 40%,transparent 55%,rgba(0,0,0,.65) 100%)" }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundSize: "160px",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

export function ParisTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);
  if (!now) return <span className="opacity-0">00:00</span>;
  const [hh, mm] = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Paris" })
    .format(now)
    .split(":");
  return (
    <span className="leading-none tabular-nums text-[#f4f4f2]" style={{ ...condensed, fontSize: 24, letterSpacing: ".02em" }}>
      {hh}
      <span className="text-abcs-red" style={{ animation: "h-blink 1s steps(1) infinite" }}>:</span>
      {mm}
    </span>
  );
}

export function DispoBadge() {
  return (
    <span className="col-start-3 inline-flex items-center gap-2 justify-self-end rounded-full bg-white py-1.5 pl-3.5 pr-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-abcs-black">
      Dispo
      <span className="relative h-5 w-5 rounded-full bg-abcs-green">
        <span className="absolute inset-0 rounded-full bg-abcs-green" style={{ animation: "h-ping 1.8s cubic-bezier(0,0,.2,1) infinite" }} />
      </span>
    </span>
  );
}

export function HeroSocials({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="grid h-[34px] w-[34px] place-items-center rounded-full border border-white/20 transition-all duration-200 hover:border-abcs-red hover:bg-abcs-red"
        >
          {s.icon ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#fff" aria-hidden>
              <path d={s.icon.path} />
            </svg>
          ) : (
            <span className="text-[12px] font-extrabold">in</span>
          )}
        </a>
      ))}
    </div>
  );
}
