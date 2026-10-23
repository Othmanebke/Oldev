"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import { useContactModal } from "@/components/ContactModalProvider";
import { useScrollToSection } from "@/lib/useScrollToSection";

const LINKS = [
  { label: "Projets", id: "portfolio" },
  { label: "Tarifs", id: "services" },
  { label: "À propos", id: "about" },
  { label: "Parcours", id: "experiences" },
];

// Offer pages, kept in the menu so they stay linked from every page
const PAGES = [
  { href: "/services/site-vitrine", label: "Site vitrine" },
  { href: "/services/site-sur-mesure-nextjs", label: "Site sur-mesure" },
  { href: "/services/site-wordpress", label: "Site WordPress" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
];

const round = "grid size-11 flex-none place-items-center rounded-full text-[#F4F1EC] transition-colors duration-[250ms] hover:bg-abcs-red hover:text-white max-[359px]:size-10";

/**
 * Floating bottom bar (every page): menu, AI chat, contact form, WhatsApp, Instagram.
 * Hidden over the home hero; shows once the services reach 60 % of the viewport.
 * Opening a panel closes the other one.
 */
export default function Navbar() {
  const pathname = usePathname();
  const scrollToSection = useScrollToSection();
  const { openModal } = useContactModal();
  const [pastHero, setPastHero] = useState(false);
  const [menu, setMenu] = useState(false);
  const [chat, setChat] = useState(false);
  const closeChat = useCallback(() => setChat(false), []);
  const visible = pastHero || menu || chat;

  // Pages without a hero show it right away
  useEffect(() => {
    const target = document.getElementById("services") ?? document.getElementById("top")?.nextElementSibling;
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

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const go = (id: string) => (e: React.MouseEvent) => {
    setMenu(false);
    setChat(false);
    if (scrollToSection(id)) e.preventDefault();
  };

  return (
    <>
      <div
        className={`fixed bottom-[clamp(14px,2.4vh,24px)] left-1/2 z-[100] -translate-x-1/2 transition-[translate,opacity] duration-700 ease-out-expo ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[100px] opacity-0"
        }`}
      >
        {/* Menu panel */}
        <div
          id="nav-menu"
          inert={!menu}
          className={`absolute bottom-[62px] left-0 flex min-w-[210px] origin-bottom-left flex-col rounded-[18px] bg-[rgba(20,18,16,.9)] p-1.5 shadow-[0_20px_50px_-14px_rgba(0,0,0,.8),inset_0_0_0_1px_rgba(244,241,236,.08)] backdrop-blur-[16px] transition-[translate,opacity] duration-[450ms] ease-out-expo ${
            menu ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <nav aria-label="Navigation principale" className="flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.id}
                href={`/#${l.id}`}
                onClick={go(l.id)}
                className="flex h-[42px] items-center rounded-xl px-4 text-[14px] font-semibold text-[#F4F1EC] transition-colors hover:bg-[rgba(244,241,236,.06)] hover:text-abcs-red"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span aria-hidden className="mx-4 my-1.5 h-px bg-[rgba(244,241,236,.08)]" />
          <nav aria-label="Offres" className="flex flex-col">
            {PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setMenu(false)}
                className="flex h-[34px] items-center rounded-xl px-4 text-[13px] text-[rgba(244,241,236,.6)] transition-colors hover:bg-[rgba(244,241,236,.06)] hover:text-abcs-red"
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-[rgba(20,18,16,.6)] p-1.5 shadow-[0_14px_40px_-12px_rgba(0,0,0,.7),inset_0_0_0_1px_rgba(244,241,236,.08)] backdrop-blur-[16px]">
          <button
            onClick={() => {
              setMenu((v) => !v);
              setChat(false);
            }}
            aria-label={menu ? "Fermer le menu" : "Menu"}
            aria-expanded={menu}
            aria-controls="nav-menu"
            className={`${round} ${menu ? "bg-abcs-red" : "bg-[#1F1C19]"}`}
          >
            <span aria-hidden className="flex w-4 flex-col gap-1">
              <span className={`block h-[1.5px] rounded-sm bg-current transition-transform duration-300 ${menu ? "translate-y-[2.75px] rotate-45" : ""}`} />
              <span className={`block h-[1.5px] rounded-sm bg-current transition-transform duration-300 ${menu ? "-translate-y-[2.75px] -rotate-45" : ""}`} />
            </span>
          </button>
          <button
            onClick={() => {
              setChat((v) => !v);
              setMenu(false);
            }}
            aria-label="Discuter avec l'IA"
            aria-expanded={chat}
            className={`${round} ${chat ? "bg-abcs-red" : "bg-[#1F1C19]"}`}
          >
            <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z" />
              <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
            </svg>
          </button>
          <button
            onClick={() => {
              setMenu(false);
              setChat(false);
              openModal();
            }}
            className="flex h-11 items-center whitespace-nowrap rounded-full bg-[#F4F1EC] px-[30px] text-[14px] font-semibold text-[#0A0908] transition-colors duration-[250ms] hover:bg-abcs-red hover:text-white max-[399px]:px-5 max-[359px]:h-10 max-[359px]:px-4"
          >
            Contact
          </button>
          <a href="https://wa.me/33660805337" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={`${round} bg-[#1F1C19]`}>
            <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.33l-.35-.21-3.6.94.96-3.5-.23-.36a9.47 9.47 0 0 1-1.45-5.05c0-5.24 4.27-9.5 9.52-9.5a9.5 9.5 0 0 1 9.5 9.51c0 5.25-4.27 9.5-9.5 9.5M20.13 3.88A11.4 11.4 0 0 0 12.05.5C5.76.5.64 5.62.64 11.9c0 2.01.52 3.97 1.52 5.7L.54 23.5l6.04-1.58a11.4 11.4 0 0 0 5.46 1.39h.01c6.29 0 11.41-5.12 11.41-11.4 0-3.05-1.19-5.91-3.33-8.07" />
            </svg>
          </a>
          <a href="https://www.instagram.com/o.ldev/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${round} bg-[#1F1C19]`}>
            <svg aria-hidden viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </a>
        </div>
      </div>

      <ChatPanel open={chat && visible} onClose={closeChat} />
    </>
  );
}
