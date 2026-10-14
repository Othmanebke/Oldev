"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Globe from "@/components/Globe";
import Logo from "@/components/brand/Logo";
import { condensed } from "@/components/hero/HeroParts";
import { useContactModal } from "@/components/ContactModalProvider";
import { useScrollToSection } from "@/lib/useScrollToSection";
import { EMAIL, SOCIALS } from "@/lib/site";

const ICONS: Record<string, string> = {
  LinkedIn:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  GitHub:
    "M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3",
  Instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  TikTok:
    "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

const EXPLORE = [
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Travaux" },
  { id: "about", label: "À propos" },
  { id: "experiences", label: "Parcours" },
];

const OFFERS = [
  { href: "/services/site-vitrine", label: "Site vitrine" },
  { href: "/services/site-sur-mesure-nextjs", label: "Site Next.js" },
  { href: "/services/site-wordpress", label: "Site WordPress" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
];

const link = "text-[16px] text-white/70 transition-colors hover:text-abcs-red";

/**
 * Site footer, shared by every page: CTA card with the globe (overlapping the
 * previous section), brand + socials, link columns, contact line, copyright.
 * On the home page it is the last card of the stack.
 */
export default function Footer() {
  const { openModal } = useContactModal();
  const scrollToSection = useScrollToSection();
  const home = usePathname() === "/";

  return (
    <footer
      id="contact"
      data-stack={home ? "" : undefined}
      className="relative z-[15] overflow-visible bg-[#050505] text-white"
      style={{ padding: "clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(110px,12vw,160px)" }}
    >
      {/* Background + orange halo at the bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050505]">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(55% 60% at 50% 100%,rgba(255,80,20,.22) 0%,rgba(255,59,0,.06) 50%,transparent 80%)" }}
        />
      </div>

      {/* CTA card */}
      <div
        className="relative z-[2] mx-auto flex max-w-[1180px] flex-col overflow-hidden rounded-[24px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,.35)] min-[860px]:flex-row min-[860px]:items-center"
        style={{
          marginTop: "clamp(-200px,-14vw,-110px)",
          minHeight: "clamp(320px,30vw,380px)",
          background:
            "radial-gradient(70% 90% at 0% 100%,rgba(255,59,0,.22) 0%,transparent 60%),linear-gradient(135deg,#1a1a1a 0%,#0c0c0c 60%,#0a0a0a 100%)",
        }}
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
            ensemble<span className="text-abcs-red">&nbsp;?</span>
          </h2>
          <p className="m-0 max-w-[400px] text-[17px] leading-[1.55] text-white/72 text-pretty">
            Un site, une refonte ou juste une idée — on en parle 30 minutes, sans engagement.
          </p>
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
        className="relative z-[1] mx-auto flex max-w-[1280px] flex-col"
        style={{ marginTop: "clamp(56px,6vw,80px)", padding: "0 clamp(8px,3vw,48px)", gap: "clamp(40px,5vw,64px)" }}
      >
        <div className="flex flex-wrap justify-between gap-12">
          {/* Brand */}
          <div className="flex max-w-[340px] flex-col gap-[22px]">
            <Link href="/" className="self-start text-white">
              <Logo className="h-[30px]" />
            </Link>
            <p className="m-0 text-[16px] leading-[1.6] text-white/72 text-pretty">
              Développeur web freelance en Seine-et-Marne. Sites sur-mesure, rapides et pensés pour ramener des clients.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/18 bg-white/[0.03] text-white transition-colors duration-[250ms] hover:border-abcs-red hover:bg-abcs-red"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d={ICONS[s.label]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns, pushed to the right */}
          <div className="flex flex-wrap justify-end" style={{ gap: "clamp(32px,6vw,96px)" }}>
            <nav aria-label="Explorer" className="flex min-w-[140px] flex-col gap-[18px]">
              <span className="text-[15px] font-bold text-white">Explorer</span>
              <div className="flex flex-col gap-3.5">
                {EXPLORE.map((l) => (
                  <Link
                    key={l.id}
                    href={`/#${l.id}`}
                    onClick={(e) => {
                      if (home && scrollToSection(l.id)) e.preventDefault();
                    }}
                    className={link}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link href="/realisations" className={link}>
                  Réalisations
                </Link>
              </div>
            </nav>
            <nav aria-label="Offres" className="flex min-w-[140px] flex-col gap-[18px]">
              <span className="text-[15px] font-bold text-white">Offres</span>
              <div className="flex flex-col gap-3.5">
                {OFFERS.map((l) => (
                  <Link key={l.href} href={l.href} className={link}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Contact, one discreet line */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
          <span className="text-[13px] font-bold text-white">Contact</span>
          <a href={`mailto:${EMAIL}`} className="text-white/70 transition-colors [overflow-wrap:anywhere] hover:text-abcs-red">
            {EMAIL}
          </a>
          <button onClick={() => openModal()} className="text-white/70 transition-colors hover:text-abcs-red">
            Réserver un appel →
          </button>
          <span className="font-semibold text-white">Seine-et-Marne (77)</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/12 pt-7 text-[15px] text-white/70">
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            <span>© {new Date().getFullYear()} O&apos;LDEV. Tous droits réservés.</span>
            <Link href="/legal" className="transition-colors hover:text-abcs-red">
              Mentions légales
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                window.location.reload();
              }}
              className="transition-colors hover:text-abcs-red"
            >
              Cookies
            </button>
          </div>
          <span>Conçu &amp; codé à la main</span>
        </div>
      </div>
    </footer>
  );
}
