"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { useContactModal } from "@/components/ContactModalProvider";
import { useScrollToSection } from "@/lib/useScrollToSection";
import { EMAIL, SOCIALS } from "@/lib/site";

// Bars rising with the scroll, all orange: brightest in the middle, darker towards the edges
const BARS = [30, 42, 54, 66, 80, 66, 54, 42, 30];
const BAR_BG = [
  "linear-gradient(to top,#C2400F 0%,#7A2408 40%,rgba(0,0,0,0) 100%)",
  "linear-gradient(to top,#E2450A 0%,#9A300A 45%,rgba(0,0,0,0) 100%)",
  "linear-gradient(to top,#FF3B00 0%,#C2400F 40%,#4A1A08 80%,rgba(0,0,0,0) 100%)",
];
const barBg = (i: number) => BAR_BG[Math.min(2, Math.min(i, BARS.length - 1 - i))];

const NAV = [
  { id: "portfolio", label: "Réalisations" },
  { id: "methode", label: "Méthode" },
  { id: "services", label: "Services" },
  { id: "avis", label: "Avis" },
  { id: "faq", label: "FAQ" },
];
const OFFERS = [
  { href: "/services/site-vitrine", label: "Site vitrine" },
  { href: "/services/site-sur-mesure-nextjs", label: "Site sur-mesure" },
  { href: "/services/site-wordpress", label: "Site WordPress" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
];
const NETWORKS = SOCIALS.filter((s) => s.label !== "GitHub");
const ICONS: Record<string, string> = {
  LinkedIn:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  Instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  TikTok:
    "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

// Taller tap area on phones
const link = "self-start py-1.5 text-[15px] text-[#c8c8c8] transition-colors duration-[250ms] hover:text-abcs-red sm:py-0";
const colTitle = "text-[16px] font-semibold text-white";
const archivo = { fontFamily: "var(--font-archivo-flex), sans-serif" } as const;

/**
 * Site footer, shared by every page: one liquid glass panel (call to action,
 * navigation, contact, networks) over orange bars rising with the scroll (`--f`),
 * then the copyright line.
 */
export default function Footer() {
  const { openModal } = useContactModal();
  const scrollToSection = useScrollToSection();
  const home = usePathname() === "/";
  const ref = useRef<HTMLElement>(null);

  // --f: 0 → 1 while the footer comes up the viewport (eased)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--f", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight, r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.95)));
      el.style.setProperty("--f", (1 - Math.pow(1 - p, 2)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jump = (id: string) => (e: MouseEvent) => {
    if (home && scrollToSection(id)) e.preventDefault();
  };

  return (
    <footer
      ref={ref}
      id="contact"
      data-stack={home ? "" : undefined}
      className="relative z-[15] overflow-hidden bg-black text-white"
      style={{ "--f": 0, padding: "clamp(40px,5vw,72px) clamp(12px,2vw,24px) clamp(96px,8vw,112px)" } as CSSProperties}
    >
      {/* Behind the panel: orange glow + blurred bars growing with --f */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[45%]">
        <div
          className="absolute -inset-x-[10%] -bottom-[30%] h-[90%]"
          style={{
            background: "radial-gradient(40% 60% at 18% 100%,rgba(255,59,0,.35) 0%,rgba(255,59,0,0) 70%),radial-gradient(40% 60% at 82% 100%,rgba(255,59,0,.35) 0%,rgba(255,59,0,0) 70%)",
            filter: "blur(30px)",
            opacity: "var(--f)",
          }}
        />
        <div
          className="absolute inset-0 flex items-end"
          style={{ filter: "blur(12px)", WebkitMaskImage: "linear-gradient(to bottom,transparent,#000 30%)", maskImage: "linear-gradient(to bottom,transparent,#000 30%)" }}
        >
          {BARS.map((h, i) => (
            <div key={i} className="-mx-px flex-1" style={{ height: `calc(${h}% * var(--f))`, background: barBg(i) }} />
          ))}
        </div>
      </div>

      <div
        className="relative z-[1] mx-auto max-w-[1320px] overflow-hidden isolate shadow-[inset_0_1px_0_rgba(255,255,255,.18),inset_0_-1px_0_rgba(255,59,0,.25),inset_0_0_0_1px_rgba(255,255,255,.08),0_30px_80px_-30px_rgba(0,0,0,.8)] backdrop-blur-[28px] backdrop-saturate-[170%]"
        style={{ borderRadius: "clamp(24px,3vw,36px)", background: "linear-gradient(180deg,rgba(18,18,18,.72) 0%,rgba(18,18,18,.38) 100%)" }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(40px,5vw,72px)", padding: "clamp(32px,5vw,72px) clamp(24px,5vw,72px) clamp(28px,4vw,48px)" }}
        >
          <div className="flex flex-col items-start" style={{ gap: "clamp(20px,2.4vw,28px)" }}>
            <Link href="/" aria-label="Accueil O'LDEV" className="text-white">
              <Logo className="h-6" />
            </Link>
            <div className="flex flex-col gap-3.5">
              <span className="inline-flex items-center gap-2 text-[15px] font-medium text-abcs-red">
                <span aria-hidden className="size-[7px] rounded-full bg-abcs-red shadow-[0_0_10px_#FF3B00]" />
                Réponse sous 48 h
              </span>
              <h2 className="m-0 font-bold leading-[.95] tracking-[-.045em] text-white text-balance" style={{ ...archivo, fontSize: "clamp(40px,5vw,64px)" }}>
                On code
                <br />
                ensemble&nbsp;?
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openModal()}
                className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-bold text-[#111] transition-colors duration-[250ms] hover:bg-abcs-red hover:text-white"
              >
                Réserver un appel <span aria-hidden>↗</span>
              </button>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-[52px] items-center rounded-full border border-white/[.18] bg-white/[.04] px-6 text-[15px] font-semibold text-white backdrop-blur-[10px] transition-colors duration-[250ms] hover:border-abcs-red hover:bg-[rgba(255,59,0,.12)] hover:text-white"
              >
                M&apos;écrire
              </a>
            </div>
          </div>

          <div className="grid content-start gap-x-6 gap-y-8 pt-1.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))" }}>
            <nav aria-label="Navigation" className="flex min-w-0 flex-col gap-3.5">
              <span className={colTitle} style={archivo}>Navigation</span>
              {NAV.map((n) => (
                <Link key={n.id} href={`/#${n.id}`} onClick={jump(n.id)} className={link}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Offres" className="flex min-w-0 flex-col gap-3.5">
              <span className={colTitle} style={archivo}>Offres</span>
              {OFFERS.map((o) => (
                <Link key={o.href} href={o.href} className={link}>
                  {o.label}
                </Link>
              ))}
            </nav>
            <div className="flex min-w-0 flex-col gap-3.5">
              <span className={colTitle} style={archivo}>Contact</span>
              <button onClick={() => openModal()} className={`${link} text-left`}>
                Réserver un appel
              </button>
              <a href={`mailto:${EMAIL}`} className={link}>
                M&apos;écrire
              </a>
              <span className="text-[15px] text-[#a0a0a0]">Seine-et-Marne</span>
            </div>
            <div className="flex min-w-0 flex-col gap-3.5">
              <span className={colTitle} style={archivo}>Réseaux</span>
              {NETWORKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10" style={{ margin: "0 clamp(24px,5vw,72px)", padding: "clamp(20px,2.4vw,28px) 0 clamp(28px,3.4vw,44px)" }}>
          <div className="flex flex-wrap gap-2.5">
            {NETWORKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-11 place-items-center rounded-full border border-white/[.18] bg-white/[.03] text-white transition-colors duration-[250ms] hover:border-abcs-red hover:bg-abcs-red hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                  <path d={ICONS[s.label]} />
                </svg>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[14px]">
            <Link href="/realisations" className="py-2 text-[#c8c8c8] transition-colors hover:text-abcs-red">
              Réalisations
            </Link>
            <Link href="/legal" className="py-2 text-[#c8c8c8] transition-colors hover:text-abcs-red">
              Mentions légales
            </Link>
            {/* Lets visitors change their cookie choice (GDPR) */}
            <button
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                window.location.reload();
              }}
              className="py-2 text-[#c8c8c8] transition-colors hover:text-abcs-red"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>

      <p className="relative z-[1] m-0 mt-[clamp(20px,2.4vw,28px)] text-center text-[14px] font-medium text-white" style={{ textShadow: "0 1px 8px rgba(0,0,0,.7),0 0 2px rgba(0,0,0,.6)" }}>
        © 2026 O&apos;LDEV · Tous droits réservés
      </p>
    </footer>
  );
}
