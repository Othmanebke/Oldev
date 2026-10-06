"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useContactModal } from "@/components/ContactModalProvider";
import MobileMenu from "@/components/MobileMenu";
import { useScrollToSection } from "@/lib/useScrollToSection";
import avatarPhoto from "@/img/avatar.webp";

// Loaded on first open only — keeps it out of the initial bundle
const ChatWindow = dynamic(() => import("@/components/Chatbot"), { ssr: false });

const LINKS = [
  { label: "Projets",  id: "portfolio"   },
  { label: "Tarifs",   id: "services"    },
  { label: "À propos", id: "about"       },
  { label: "Parcours", id: "experiences" },
];

export default function Navbar() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMounted, setChatMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const visible = pastHero || chatOpen || menuOpen;
  const { openModal } = useContactModal();
  const scrollToSection = useScrollToSection();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Show hint once — after 2.5s, only if never dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("chat-hint-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShowHint(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Hidden over the hero: shows once the first section after it (#portfolio on the home page)
  // reaches 60% of the viewport. Pages without a hero show it right away.
  useEffect(() => {
    const target = document.getElementById("portfolio") ?? document.getElementById("top")?.nextElementSibling;
    if (!target) {
      const id = requestAnimationFrame(() => setPastHero(true));
      return () => cancelAnimationFrame(id);
    }
    const onScroll = () => setPastHero(target.getBoundingClientRect().top <= window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const dismissHint =(e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHint(false);
    localStorage.setItem("chat-hint-dismissed", "1");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setMenuOpen(false);
    if (pathname === "/" && scrollToSection(id)) e.preventDefault();
  };

  return (
    <>
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-[calc(100vw-24px)] sm:w-auto sm:max-w-[calc(100vw-24px)] ${visible ? "" : "pointer-events-none"}`}
    >
      {/* Chat window — pops above the avatar */}
      {chatMounted && <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />}

      {/* Main pill */}
      <div className="relative flex items-center gap-1 p-1.5 rounded-full bg-[rgba(26,26,26,0.95)] backdrop-blur-[16px] border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">

        {/* Avatar — chat trigger */}
        <div className="relative flex-shrink-0">

          {/* ── One-time hint popup ───────────────────────────────── */}
          <AnimatePresence>
            {showHint && !chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.92 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-full left-0 mb-3 z-10 pointer-events-auto"
              >
                <div className="relative bg-abcs-red rounded-xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse flex-shrink-0" />
                  <span className="font-bold text-[12px] text-white uppercase tracking-wide">
                    Discutez avec mon IA
                  </span>
                  <button
                    onClick={dismissHint}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white text-[12px] font-bold transition-colors leading-none flex-shrink-0"
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                  <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-abcs-red rotate-45 rounded-sm" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar button */}
          <button
            onClick={() => {
              setChatMounted(true);
              setChatOpen((v) => !v);
              if (showHint) {
                setShowHint(false);
                localStorage.setItem("chat-hint-dismissed", "1");
              }
            }}
            aria-label="Ouvrir le chat"
            className="relative w-10 h-10 rounded-full bg-[#111] overflow-visible block"
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={avatarPhoto}
                alt="Othmane"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ring — orange when chat open */}
            <span
              className={`absolute -inset-0.5 rounded-full border-2 transition-colors duration-300 ${
                chatOpen ? "border-abcs-red/80" : "border-transparent"
              }`}
            />

            {/* Green online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1a1a1a] z-10">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </button>
        </div>

        {/* Nav links — inline from sm, in the menu below on phones */}
        <nav aria-label="Navigation principale" className="hidden min-w-0 items-center sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="px-3.5 py-2.5 rounded-full font-bold text-[13px] uppercase tracking-[0.08em] whitespace-nowrap text-white/75 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phones: menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="flex-1 rounded-full px-3.5 py-2.5 text-left text-[13px] font-bold uppercase tracking-[0.08em] text-white/75 transition-colors hover:text-white sm:hidden"
        >
          Menu
        </button>

        {/* Contact button */}
        <button
          onClick={() => {
            setMenuOpen(false);
            openModal();
          }}
          className="flex-shrink-0 bg-white text-abcs-black font-bold text-[13px] uppercase tracking-[0.08em] px-[18px] py-[11px] rounded-full whitespace-nowrap hover:bg-abcs-red hover:text-white transition-colors"
        >
          Contact +
        </button>
      </div>

    </motion.div>

    {/* Phones: full-screen menu (outside the transformed pill, so `fixed` covers the viewport) */}
    <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
