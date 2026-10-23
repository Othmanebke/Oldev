"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Globe from "@/components/Globe";
import Logo from "@/components/brand/Logo";
import { useContactModal } from "@/components/ContactModalProvider";
import { useScrollToSection } from "@/lib/useScrollToSection";
import { SOCIALS } from "@/lib/site";

// Bars rising with the scroll, all orange: brightest in the middle, darker towards the edges
const BARS = [30, 42, 54, 66, 80, 66, 54, 42, 30];
const BAR_BG = [
  "linear-gradient(to top,#C2400F 0%,#7A2408 40%,rgba(0,0,0,0) 100%)",
  "linear-gradient(to top,#E2450A 0%,#9A300A 45%,rgba(0,0,0,0) 100%)",
  "linear-gradient(to top,#FF3B00 0%,#C2400F 40%,#4A1A08 80%,rgba(0,0,0,0) 100%)",
];
const barBg = (i: number) => BAR_BG[Math.min(2, Math.min(i, BARS.length - 1 - i))];

const TIKTOK = SOCIALS.find((s) => s.label === "TikTok")!.href;

// Taller tap area on phones
const link = "inline-block py-2.5 text-white/60 transition-colors hover:text-abcs-red sm:py-0";

const OFFERS = [
  { href: "/services/site-vitrine", label: "Site vitrine" },
  { href: "/services/site-sur-mesure-nextjs", label: "Site sur-mesure" },
  { href: "/services/site-wordpress", label: "Site WordPress" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
];

/**
 * Site footer, shared by every page: CTA card with the globe (overlapping the
 * previous section) over bars rising with the scroll (`--f`), then the logo
 * (centred) and one line of links (offers, work, legal). On the home page it is
 * the last card of the stack.
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

  return (
    <footer
      ref={ref}
      id="contact"
      data-stack={home ? "" : undefined}
      className="relative z-[15] overflow-visible bg-black text-white"
      style={{ "--f": 0, padding: "clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(110px,12vw,160px)" } as CSSProperties}
    >
      {/* Background: orange glow on the sides + blurred bars growing with --f */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
        <div
          className="absolute -inset-x-[10%] -bottom-[20%] h-[70%]"
          style={{
            background: "radial-gradient(40% 60% at 18% 100%,rgba(255,59,0,.35) 0%,rgba(255,59,0,0) 70%),radial-gradient(40% 60% at 82% 100%,rgba(255,59,0,.35) 0%,rgba(255,59,0,0) 70%)",
            filter: "blur(30px)",
            opacity: "var(--f)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 flex h-[58vh] items-end"
          style={{ filter: "blur(12px)", WebkitMaskImage: "linear-gradient(to bottom,transparent,#000 22%)", maskImage: "linear-gradient(to bottom,transparent,#000 22%)" }}
        >
          {BARS.map((h, i) => (
            <div key={i} className="-mx-px flex-1" style={{ height: `calc(${h}% * var(--f))`, background: barBg(i) }} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[46%]" style={{ background: "linear-gradient(to top,rgba(0,0,0,.55),rgba(0,0,0,0))" }} />
      </div>

      {/* CTA card */}
      <div
        className="relative z-[2] mx-auto flex max-w-[1180px] flex-col overflow-hidden rounded-[32px] border border-white/[.08] shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_40px_100px_-40px_rgba(0,0,0,.8),0_30px_120px_-60px_rgba(255,59,0,.4)] min-[860px]:flex-row min-[860px]:items-center"
        style={{
          marginTop: "clamp(-200px,-14vw,-110px)",
          minHeight: "clamp(340px,32vw,420px)",
          background: "radial-gradient(60% 90% at 85% 50%,rgba(255,59,0,.14) 0%,rgba(255,59,0,0) 60%),linear-gradient(180deg,#0e0e0e 0%,#070707 100%)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] top-0 z-[2] h-px"
          style={{ background: "linear-gradient(90deg,rgba(255,138,61,0),rgba(255,138,61,.6),rgba(255,138,61,0))" }}
        />
        {/* Globe: cut by the right edge on desktop, by the bottom edge under 860px (never over the text) */}
        <div className="relative z-0 order-2 -mb-[38%] -mr-[22%] aspect-square w-[min(440px,88%)] self-end min-[860px]:absolute min-[860px]:right-[-24%] min-[860px]:top-1/2 min-[860px]:m-0 min-[860px]:w-[min(720px,60%)] min-[860px]:-translate-y-[34%]">
          <Globe baseColor="#f4f4f2" accent="#FF3B00" phrase="oncodeensemble" />
        </div>
        <div
          className="pointer-events-none relative z-[1] flex max-w-[580px] flex-col items-start"
          style={{ padding: "clamp(32px,5vw,64px)", gap: "clamp(24px,3vw,32px)" }}
        >
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 text-[15px] font-medium text-[#FF8A3D]">
              <span aria-hidden className="size-[7px] rounded-full bg-[#FF8A3D] shadow-[0_0_10px_#FF8A3D]" />
              Réponse sous 48 h
            </span>
            <h2
              className="m-0 font-bold leading-[.95] tracking-[-.045em] text-white text-balance"
              style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontSize: "clamp(44px,6vw,80px)" }}
            >
              On code
              <br />
              ensemble&nbsp;?
            </h2>
          </div>
          <div className="pointer-events-auto flex flex-wrap gap-3">
            <button
              onClick={() => openModal()}
              className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-bold text-[#111] transition-colors duration-[250ms] hover:bg-abcs-red hover:text-white"
            >
              Réserver un appel <span aria-hidden>↗</span>
            </button>
            <a
              href={TIKTOK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center rounded-full border border-white/[.18] bg-white/[.04] px-6 text-[15px] font-semibold text-white backdrop-blur-[10px] transition-colors duration-[250ms] hover:border-abcs-red hover:bg-[rgba(255,59,0,.12)]"
            >
              Me suivre
            </a>
          </div>
        </div>
      </div>

      <div
        className="relative z-[1] mx-auto flex max-w-[1180px] flex-col gap-7"
        style={{ marginTop: "clamp(48px,5vw,72px)", padding: "0 clamp(8px,3vw,48px)" }}
      >
        <Link href="/" aria-label="Accueil O'LDEV" className="self-center text-white">
          <Logo className="h-[22px]" />
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-x-6 sm:gap-y-2.5 border-t border-white/12 pt-[22px] text-[14px] text-white/60">
          <nav aria-label="Offres" className="flex flex-wrap gap-x-6 sm:gap-y-2">
            {OFFERS.map((o) => (
              <Link key={o.href} href={o.href} className={link}>
                {o.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 sm:gap-y-2">
            <Link
              href="/#portfolio"
              onClick={(e) => {
                if (home && scrollToSection("portfolio")) e.preventDefault();
              }}
              className={link}
            >
              Réalisations
            </Link>
            <Link href="/legal" className={link}>
              Mentions légales
            </Link>
            {/* Lets visitors change their cookie choice (GDPR) */}
            <button
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                window.location.reload();
              }}
              className={link}
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
