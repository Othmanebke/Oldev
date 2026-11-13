"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PAGES } from "@/lib/pages";
import { EMAIL, SOCIALS } from "@/lib/site";

export const MENU_LINKS = [
  { label: "Projets", id: "portfolio" },
  { label: "Méthode", id: "methode" },
  { label: "Tarifs", id: "services" },
  { label: "Avis", id: "avis" },
  { label: "FAQ", id: "faq" },
  { label: "À propos", id: "about" },
];

const archivo = { fontFamily: "var(--font-archivo-flex), sans-serif" } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  /** Scrolls to a home section; returns true when handled in place. */
  onSection: (id: string) => (e: React.MouseEvent) => void;
  onContact: () => void;
};

/**
 * Site menu: a light panel sliding in from the left (mirror of the contact form,
 * which comes from the right). Home sections, then the other pages, then contact.
 */
export default function NavMenu({ open, onClose, onSection, onContact }: Props) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[101] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="menu-panel"
            id="nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed bottom-0 left-0 top-0 z-[102] flex w-full max-w-md flex-col overflow-y-auto overscroll-contain bg-white text-[#111] shadow-[30px_0_80px_rgba(0,0,0,.35)] sm:rounded-r-[28px]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/[.08] bg-white/90 px-[clamp(20px,5vw,36px)] py-6 backdrop-blur-[12px]">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold tracking-[.14em] text-abcs-red">MENU</span>
                <span className="font-semibold leading-[1.1] tracking-[-.025em]" style={{ ...archivo, fontSize: "clamp(26px,3vw,34px)" }}>
                  Où va-t-on<span className="text-abcs-red"> ?</span>
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer le menu"
                className="grid size-10 flex-none place-items-center rounded-full bg-[#f0f0ee] text-[15px] transition-colors duration-200 hover:bg-abcs-red hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-9 px-[clamp(20px,5vw,36px)] py-7">
              {/* Home sections */}
              <nav aria-label="Navigation principale" className="flex flex-col">
                <span className="mb-2 text-[12px] font-semibold tracking-[.14em] text-black/45">SUR LE SITE</span>
                {MENU_LINKS.map((l, i) => (
                  <motion.div key={l.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.12 + i * 0.04 }}>
                    <Link
                      href={`/#${l.id}`}
                      onClick={onSection(l.id)}
                      className="group flex items-baseline gap-4 border-b border-black/[.07] py-3.5 transition-colors hover:text-abcs-red"
                    >
                      <span className="w-6 font-mono text-[12px] text-black/35 transition-colors group-hover:text-abcs-red">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[24px] font-semibold leading-none tracking-[-.025em]" style={archivo}>
                        {l.label}
                      </span>
                      <span aria-hidden className="ml-auto -translate-x-1 text-[16px] opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Other pages, as chips */}
              <nav aria-label="Pages" className="flex flex-col gap-3">
                <span className="text-[12px] font-semibold tracking-[.14em] text-black/45">PAGES</span>
                <div className="flex flex-wrap gap-2">
                  {PAGES.map((p) => {
                    const on = pathname === p.href;
                    return (
                      <Link
                        key={p.href}
                        href={p.href}
                        aria-current={on ? "page" : undefined}
                        onClick={onClose}
                        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors duration-150 ${
                          on ? "border-abcs-red bg-abcs-red text-white" : "border-black/12 bg-black/[.03] text-black/75 hover:border-black/40 hover:text-black"
                        }`}
                      >
                        {p.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Contact */}
              <div className="mt-auto flex flex-col gap-4 border-t border-black/[.08] pt-6">
                <button
                  onClick={onContact}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-abcs-red text-[15px] font-bold text-white transition-colors duration-[250ms] hover:bg-[#111]"
                >
                  Démarrer un projet
                  <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </button>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[14px]">
                  <a href={`mailto:${EMAIL}`} className="break-all text-black/65 transition-colors hover:text-abcs-red">
                    {EMAIL}
                  </a>
                  <div className="flex gap-3">
                    {SOCIALS.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-black/55 transition-colors hover:text-abcs-red">
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
