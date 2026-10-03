"use client";

import Link from "next/link";
import SplitTitle from "@/components/fx/SplitTitle";
import Watermark from "@/components/fx/Watermark";
import { useContactModal } from "@/components/ContactModalProvider";
import { SERVICE_PAGES } from "@/lib/seoPages";
import { EMAIL, LOCATION, SOCIALS } from "@/lib/site";

/** Contact card + footer, last card of the stack (not sticky itself). */
export default function Footer() {
  const { openModal } = useContactModal();

  return (
    <footer
      id="contact"
      data-stack
      className="relative z-[15] -mt-9 md:-mt-16 overflow-hidden rounded-t-[36px] md:rounded-t-[64px] bg-abcs-black text-white shadow-[0_-30px_70px_rgba(0,0,0,0.7)]"
      style={{ padding: "clamp(72px,10vw,130px) clamp(20px,5vw,72px) 120px" }}
    >
      <Watermark text="Contact · Hello · Contact · Hello · Contact ·" stroke="rgba(255,255,255,0.08)" />

      <div className="relative z-[1] mx-auto flex max-w-[1200px] flex-col" style={{ gap: "clamp(48px,6vw,80px)" }}>
        <div className="flex flex-col items-center gap-7 text-center">
          <SplitTitle
            lines={["On code", { text: "ensemble ?", className: "text-abcs-red" }]}
            className="m-0 font-heading font-normal uppercase leading-[0.85] tracking-[-0.03em]"
            style={{ fontSize: "clamp(3rem,10vw,9rem)" }}
          />
          <p className="m-0 max-w-[460px] text-[18px] leading-[1.55] text-white/72">
            15 minutes au téléphone pour cadrer votre projet. Gratuit, sans engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2.5 rounded-full bg-abcs-red px-[30px] py-[18px] text-[14px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-abcs-black"
            >
              Réserver un appel <span aria-hidden>↗</span>
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/30 px-[30px] py-[18px] text-[14px] font-bold tracking-[0.04em] sm:uppercase sm:tracking-[0.14em] text-white transition-colors hover:border-abcs-red hover:text-abcs-red"
            >
              {EMAIL.split("@")[0]}@<wbr />{EMAIL.split("@")[1]}
            </a>
          </div>
        </div>

        <nav aria-label="Services" className="flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/12 pt-7">
          {[
            ...SERVICE_PAGES.map((p) => ({ href: `/services/${p.slug}`, label: p.h1 })),
            { href: "/creation-site-internet-seine-et-marne", label: "Site internet en Seine-et-Marne" },
            { href: "/realisations", label: "Réalisations" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] text-white/70 transition-colors hover:text-abcs-red">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/12 pt-7">
          <div className="flex flex-wrap gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-abcs-red"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-5 text-[13px] text-white/60">
            <span>Seine-et-Marne (77) · {LOCATION.region}</span>
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
        </div>
      </div>
    </footer>
  );
}
