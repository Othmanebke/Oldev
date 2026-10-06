"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useContactModal } from "@/components/ContactModalProvider";
import { useScrollToSection } from "@/lib/useScrollToSection";
import { EMAIL, SOCIALS } from "@/lib/site";

const SECTIONS = [
  { label: "Projets", id: "portfolio" },
  { label: "Tarifs", id: "services" },
  { label: "À propos", id: "about" },
  { label: "Parcours", id: "experiences" },
];

const PAGES = [
  { href: "/services/site-vitrine", label: "Site vitrine" },
  { href: "/services/site-sur-mesure-nextjs", label: "Site sur-mesure" },
  { href: "/services/site-wordpress", label: "Site WordPress" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
  { href: "/realisations", label: "Réalisations" },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const rise = (i: number) => ({
  initial: { y: "110%" },
  animate: { y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.18 + i * 0.06 } },
  exit: { y: "110%", transition: { duration: 0.3, ease: EASE } },
});
const fadeIn = (d: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: d } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
});

/** Phones: full-screen menu (sections, pages, call button, contact). */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const scrollToSection = useScrollToSection();
  const { openModal } = useContactModal();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Scroll lock, Esc, focus on the close button
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  // Closes if the viewport grows past the phone layout
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => mq.matches && onClose();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, onClose]);

  const goSection = (e: React.MouseEvent, id: string) => {
    onClose();
    if (pathname === "/" && document.getElementById(id)) {
      e.preventDefault();
      // Wait for the scroll lock to be released
      setTimeout(() => scrollToSection(id), 60);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          className="fixed inset-0 z-[140] flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-[#0a0a0a] text-[#f4f4f2] sm:hidden"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.6, ease: EASE } }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.5, ease: EASE, delay: 0.1 } }}
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5">
            <Link
              href="/"
              onClick={onClose}
              className="text-[26px] uppercase leading-none"
              style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 900, fontStretch: "62%" }}
            >
              O&apos;LDEV<span className="text-abcs-red">.</span>
            </Link>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Fermer le menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors active:bg-abcs-red"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.2]"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          {/* Sections — big */}
          <nav aria-label="Sections" className="flex flex-1 flex-col justify-center px-5 py-6">
            <ul className="m-0 flex list-none flex-col p-0">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="overflow-hidden border-b border-white/10">
                  <motion.div {...rise(i)}>
                    <Link
                      href={`/#${s.id}`}
                      onClick={(e) => goSection(e, s.id)}
                      className="flex items-baseline gap-4 py-3 transition-colors active:text-abcs-red"
                    >
                      <span className="w-6 text-[13px] font-bold text-abcs-red">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className="text-[clamp(2.4rem,12vw,3.6rem)] leading-[1]"
                        style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 800, letterSpacing: "-.035em" }}
                      >
                        {s.label}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.ul {...fadeIn(0.45)} className="m-0 mt-7 grid list-none grid-cols-2 gap-x-4 gap-y-2.5 p-0">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    onClick={onClose}
                    aria-current={pathname === p.href ? "page" : undefined}
                    className={`text-[15px] transition-colors active:text-abcs-red ${pathname === p.href ? "text-abcs-red" : "text-white/65"}`}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </nav>

          {/* Call + contact */}
          <motion.div {...fadeIn(0.55)} className="flex shrink-0 flex-col gap-5 px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
            <button
              onClick={() => {
                onClose();
                openModal();
              }}
              className="flex w-full items-center justify-between rounded-full bg-abcs-red py-2 pl-6 pr-2 text-[16px] font-semibold text-white"
            >
              Réserver un appel
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-[#0a0a0a] text-[16px]">↗</span>
            </button>
            <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
              <a href={`mailto:${EMAIL}`} className="break-all text-[14px] text-white/75">
                {EMAIL}
              </a>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
