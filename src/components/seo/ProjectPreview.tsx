"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLenis } from "lenis/react";
import type { Project } from "@/lib/projects";

const noop = () => () => {};
const FOCUSABLE = "button, a[href], [tabindex]:not([tabindex='-1'])";

type Props = {
  projects: Project[];
  /** Index of the open project in `projects`, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/**
 * Browser-like popup showing a project's full-page capture, scrolling by itself
 * (top → bottom → top, with a short pause at each end). No manual scroll.
 * Esc / click outside / ✕ close it, ←/→ switch project, focus stays inside.
 */
export default function ProjectPreview({ projects, index, onChange }: Props) {
  const lenis = useLenis();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const dialog = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const anim = useRef<Animation | null>(null);
  const project = index === null ? null : projects[index];
  const open = project !== null;

  const go = useCallback(
    (d: number) => index !== null && onChange((index + d + projects.length) % projects.length),
    [index, onChange, projects.length]
  );

  // Scroll lock + focus in, then back to the card on close
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      prev?.focus();
    };
  }, [open, lenis]);

  // Keyboard: Esc, arrows, focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        const els = Array.from(dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!dialog.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onChange]);

  /** (Re)starts the auto-scroll from the top, once the capture is loaded. */
  const play = useCallback(() => {
    anim.current?.cancel();
    const el = img.current;
    const frame = box.current;
    if (!el || !frame || !el.complete || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = el.offsetHeight - frame.clientHeight;
    if (d <= 0) return;
    anim.current = el.animate(
      [
        { transform: "translateY(0)", offset: 0 },
        { transform: "translateY(0)", offset: 0.06 },
        { transform: `translateY(${-d}px)`, offset: 0.94 },
        { transform: `translateY(${-d}px)`, offset: 1 },
      ],
      { duration: Math.max(6000, d * 7), iterations: Infinity, direction: "alternate", easing: "linear" }
    );
  }, []);

  useEffect(() => {
    if (!project) return;
    play();
    window.addEventListener("resize", play);
    return () => {
      window.removeEventListener("resize", play);
      anim.current?.cancel();
    };
  }, [project, play]);

  if (!mounted || !project) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-[rgba(10,10,10,.7)] p-[clamp(8px,3vw,40px)] backdrop-blur-[6px]"
      style={{ animation: "pp-fade .3s ease both" }}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Aperçu du site ${project.name}`}
        className="flex h-[min(90vh,100%)] w-[min(1120px,100%)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,.6)]"
        style={{ animation: "pp-in .45s cubic-bezier(.22,1,.36,1) both" }}
      >
        {/* Browser bar */}
        <div className="flex shrink-0 items-center gap-3 border-b border-[rgba(17,17,17,.1)] bg-[#f4f4f2] px-3 py-2.5 sm:px-4">
          <span aria-hidden className="hidden gap-1.5 sm:flex">
            <span className="h-3 w-3 rounded-full bg-[#d5d5d2]" />
            <span className="h-3 w-3 rounded-full bg-[#d5d5d2]" />
            <span className="h-3 w-3 rounded-full bg-[#d5d5d2]" />
          </span>
          <p className="m-0 flex min-w-0 flex-1 items-baseline gap-2 text-[14px] sm:pl-2">
            <span className="shrink-0 font-semibold text-[#111]">{project.name}</span>
            <span className="truncate text-[#666]">{project.category}</span>
          </p>
          <div className="flex shrink-0 gap-1.5">
            {(
              [
                ["Projet précédent", -1, "M15 18l-6-6 6-6"],
                ["Projet suivant", 1, "M9 18l6-6-6-6"],
              ] as const
            ).map(([label, d, path]) => (
              <button
                key={label}
                onClick={() => go(d)}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(17,17,17,.15)] text-[#111] transition-colors hover:border-[#111]"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.2]"><path d={path} /></svg>
              </button>
            ))}
            <button
              data-close
              onClick={() => onChange(null)}
              aria-label="Fermer l’aperçu"
              className="grid h-9 w-9 place-items-center rounded-full bg-[#111] text-white transition-colors hover:bg-abcs-red"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.2]"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        </div>

        {/* Capture, scrolled by the animation only */}
        <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-[#ececea]">
          <Image
            key={project.id}
            ref={img}
            src={project.fullImage ?? project.image}
            alt={`Capture du site ${project.name}`}
            width={1440}
            height={1800}
            sizes="(max-width: 1160px) 100vw, 1120px"
            onLoad={play}
            className="absolute left-0 top-0 block h-auto w-full will-change-transform"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
