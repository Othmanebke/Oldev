"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Globe from "@/components/Globe";
import Logo from "@/components/brand/Logo";
import { condensed } from "@/components/hero/HeroParts";
import { useContactModal } from "@/components/ContactModalProvider";
import { useScrollToSection } from "@/lib/useScrollToSection";
import { EMAIL } from "@/lib/site";

// Bars rising with the scroll, all orange: brightest in the middle, darker towards the edges
const BARS = [30, 42, 54, 66, 80, 66, 54, 42, 30];
const BAR_BG = [
  "linear-gradient(to top,#C2400F 0%,#7A2408 40%,rgba(0,0,0,0) 100%)",
  "linear-gradient(to top,#E2450A 0%,#9A300A 45%,rgba(0,0,0,0) 100%)",
  "linear-gradient(to top,#FF3B00 0%,#C2400F 40%,#4A1A08 80%,rgba(0,0,0,0) 100%)",
];
const barBg = (i: number) => BAR_BG[Math.min(2, Math.min(i, BARS.length - 1 - i))];

const link = "text-white/60 transition-colors hover:text-abcs-red";

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
        className="relative z-[2] mx-auto flex max-w-[1180px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-black min-[860px]:flex-row min-[860px]:items-center"
        style={{ marginTop: "clamp(-200px,-14vw,-110px)", minHeight: "clamp(320px,30vw,380px)" }}
      >
        {/* Globe: cut by the right edge on desktop, by the bottom edge under 860px (never over the text) */}
        <div className="relative z-0 order-2 -mb-[38%] -mr-[22%] aspect-square w-[min(440px,88%)] self-end min-[860px]:absolute min-[860px]:right-[-24%] min-[860px]:top-1/2 min-[860px]:m-0 min-[860px]:w-[min(720px,60%)] min-[860px]:-translate-y-[34%]">
          <Globe baseColor="#f4f4f2" accent="#FF3B00" phrase="oncodeensemble" />
        </div>
        <div
          className="pointer-events-none relative z-[1] flex max-w-[560px] flex-col items-start gap-[22px]"
          style={{ padding: "clamp(32px,5vw,64px)" }}
        >
          <h2 className="m-0 leading-[.9] tracking-[.005em] text-white" style={{ ...condensed, fontSize: "clamp(48px,7vw,96px)" }}>
            On code
            <br />
            ensemble&nbsp;?
          </h2>
          <div className="pointer-events-auto flex flex-wrap gap-3">
            <button
              onClick={() => openModal()}
              className="inline-flex min-h-12 items-center rounded-[10px] bg-white px-[22px] text-[15px] font-bold text-[#111] transition-colors duration-[250ms] hover:bg-abcs-red hover:text-white"
            >
              Réserver un appel
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex min-h-12 items-center rounded-[10px] border border-white/22 px-[22px] text-[15px] font-semibold text-white transition-colors duration-[250ms] hover:border-abcs-red"
            >
              M&apos;écrire
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

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 border-t border-white/12 pt-[22px] text-[14px] text-white/60">
          <nav aria-label="Offres" className="flex flex-wrap gap-x-6 gap-y-2">
            {OFFERS.map((o) => (
              <Link key={o.href} href={o.href} className={link}>
                {o.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
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
