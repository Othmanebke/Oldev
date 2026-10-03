"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useContactModal } from "@/components/ContactModalProvider";
import type { Project } from "@/lib/projects";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.22, 1, 0.36, 1] as const;
const noop = () => () => {};

type Props = {
  projects: Project[];
  /** Index of the open project, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/**
 * Full-screen "browser window" showing the whole site capture, scrollable.
 * Auto-scrolls slowly like a preview until the visitor touches it.
 * Esc closes, ←/→ switch project. Rendered in a portal: the stacked cards
 * are transformed, which would otherwise trap `position: fixed`.
 */
export default function ProjectViewer({ projects, index, onChange }: Props) {
  const lenis = useLenis();
  const { openModal } = useContactModal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const project = index === null ? null : projects[index];
  const open = project !== null;
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  const go = useCallback(
    (d: number) => index !== null && onChange((index + d + projects.length) % projects.length),
    [index, onChange, projects.length]
  );

  // Page scroll locked while open; focus moves in, then back to the card
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      prev?.focus();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onChange]);

  // Slow preview scroll, stopped by any interaction
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || index === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.scrollTop = 0;
    let raf = 0;
    let last = 0;
    let pos = 0;
    const step = (t: number) => {
      if (last) pos += ((t - last) / 1000) * 70;
      last = t;
      el.scrollTop = pos;
      if (el.scrollTop + el.clientHeight < el.scrollHeight - 1) raf = requestAnimationFrame(step);
    };
    const start = setTimeout(() => (raf = requestAnimationFrame(step)), 900);
    const stop = () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
    };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach((ev) => el.addEventListener(ev, stop, { passive: true }));
    window.addEventListener("keydown", stop);
    return () => {
      stop();
      events.forEach((ev) => el.removeEventListener(ev, stop));
      window.removeEventListener("keydown", stop);
    };
  }, [index]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Aperçu du site ${project.name}`}
          className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-[rgba(8,8,8,0.82)] backdrop-blur-md" onClick={() => onChange(null)} />

          <motion.div
            className="relative flex h-full max-h-[min(100svh-16px,980px)] w-full max-w-[1320px] flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#141414] text-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] md:rounded-[26px]"
            initial={{ y: 60, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {/* Browser chrome */}
            <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3 py-2.5 md:px-5 md:py-3">
              <div aria-hidden className="hidden gap-1.5 sm:flex">
                <span className="h-3 w-3 rounded-full bg-abcs-red" />
                <span className="h-3 w-3 rounded-full bg-white/25" />
                <span className="h-3 w-3 rounded-full bg-white/25" />
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-2 text-[13px] text-white/70">
                <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-none stroke-current stroke-2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                <span className="truncate">{project.name}</span>
                <span className="ml-auto hidden shrink-0 text-[12px] uppercase tracking-[0.14em] text-white/45 sm:inline">{project.category}</span>
              </div>
              <span className="hidden font-mono text-[13px] tracking-[0.14em] text-white/55 sm:inline">
                {pad(index! + 1)} / {pad(projects.length)}
              </span>
              <div className="flex gap-1.5">
                {[
                  ["Projet précédent", -1, "M15 18l-6-6 6-6"],
                  ["Projet suivant", 1, "M9 18l6-6-6-6"],
                ].map(([label, d, path]) => (
                  <button
                    key={label as string}
                    onClick={() => go(d as number)}
                    aria-label={label as string}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] transition-colors hover:bg-abcs-red"
                  >
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.4]"><path d={path as string} /></svg>
                  </button>
                ))}
                <button
                  ref={closeRef}
                  onClick={() => onChange(null)}
                  aria-label="Fermer l’aperçu"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-abcs-black transition-colors hover:bg-abcs-red hover:text-white"
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.4]"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              {/* The site itself */}
              <div ref={scrollRef} data-lenis-prevent className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#0c0c0c]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <Image
                      src={project.full?.src ?? project.image}
                      alt={`Capture du site ${project.name}`}
                      width={1440}
                      height={project.full?.height ?? 1800}
                      sizes="(max-width: 1024px) 100vw, 1000px"
                      className="block h-auto w-full"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Details */}
              <aside className="flex shrink-0 flex-col gap-3 border-t border-white/10 p-4 md:p-6 lg:w-[320px] lg:gap-5 lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-abcs-red">{project.category}</span>
                    <h2 className="m-0 truncate font-heading text-[24px] font-normal uppercase leading-none md:text-[34px] lg:whitespace-normal">{project.name}</h2>
                  </div>
                  {project.concept && (
                    <span className="shrink-0 rounded-full bg-white px-3 py-[6px] text-[11px] font-bold uppercase tracking-[0.14em] text-abcs-black">Concept</span>
                  )}
                </div>
                <p className="m-0 hidden text-[15px] leading-[1.6] text-white/75 sm:block">{project.tagline}</p>
                <ul className="m-0 hidden list-none flex-wrap gap-1.5 p-0 sm:flex">
                  {project.stack.map((s) => (
                    <li key={s} className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-white/70">{s}</li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    onChange(null);
                    openModal({ message: `Bonjour, j’aimerais un site dans l’esprit de « ${project.name} ».` });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-abcs-red px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-abcs-black lg:mt-auto"
                >
                  Un site comme celui-ci <span aria-hidden>↗</span>
                </button>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
