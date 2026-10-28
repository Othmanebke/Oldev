"use client";

import { useEffect, useRef, useState } from "react";
import { useContactModal } from "@/components/ContactModalProvider";
import SectionHeading from "@/components/sections/SectionHeading";
import StaggeredText from "@/components/fx/StaggeredText";
import { archivo, gutter, section } from "@/components/sections/layout";
import { useMedia } from "@/lib/useMedia";

const STEPS = [
  { n: "01", time: "30 min", title: "Analyse", text: "Un appel pour comprendre votre activité, vos clients et ce que le site doit vous rapporter." },
  { n: "02", time: "1 semaine", title: "Maquette", text: "Je dessine un design unique à votre image. Vous validez avant la moindre ligne de code." },
  { n: "03", time: "2 à 4 semaines", title: "Mise en ligne", text: "Site codé à la main, rapide et optimisé pour Google, livré clé en main et prêt à vendre." },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * How it works. Desktop: a 280vh section with a sticky screen; each step shows
 * alone in the middle (big outlined number and glow behind it), then the three
 * glide to their place in a row and the CTA fades in. Each step's title (letter
 * by letter) and text (word by word) stagger in whenever the step shows, so the
 * three replay together at the end. Phones: a list, each step staggering in when
 * it scrolls into view. Reduced motion: shown as is.
 */
export default function HowItWorksSection() {
  const { openModal } = useContactModal();
  const wide = useMedia("(min-width: 900px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const story = wide && !reduced;
  const root = useRef<HTMLElement>(null);
  // Steps whose text is shown (staggered in on each switch to true)
  const [litState, setLit] = useState([false, false, false]);
  const lit = reduced ? [true, true, true] : litState;

  // Phones: each step once it is well in view
  useEffect(() => {
    const el = root.current;
    if (story || reduced || !el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = steps.indexOf(e.target as HTMLElement);
          setLit((l) => (l[i] ? l : l.map((v, k) => v || k === i)));
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [story, reduced]);

  useEffect(() => {
    const el = root.current;
    if (!story || !el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const nums = Array.from(el.querySelectorAll<HTMLElement>("[data-num]"));
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"));
    const deco = el.querySelector<HTMLElement>("[data-deco]")!;
    const cta = el.querySelector<HTMLElement>("[data-cta]")!;
    const ol = el.querySelector<HTMLElement>("ol")!;

    // Offset from each step's place in the row to the middle, measured once (and on resize)
    let dx: number[] = [];
    const measure = () => {
      steps.forEach((s) => (s.style.transform = "none"));
      const mid = ol.clientWidth / 2;
      dx = steps.map((s) => mid - (s.offsetLeft + s.offsetWidth / 2));
    };
    measure();

    let cur = 0, raf = 0, last = performance.now(), mask = -1;
    const target = () => {
      const r = el.getBoundingClientRect();
      return clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
    };
    cur = target();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      let m = 0;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      cur += (target() - cur) * (1 - Math.exp(-dt * 9));
      const q = smooth(0.64, 0.9, cur);
      const active = Math.min(2, Math.floor(cur / 0.2));
      steps.forEach((s, i) => {
        const t = (cur - i * 0.2) / 0.2;
        const v = i === 2 ? smooth(0, 0.25, t) : smooth(0, 0.25, t) * (1 - smooth(0.75, 1, t));
        const o = Math.max(v, q);
        s.style.opacity = o.toFixed(3);
        if (o > 0.35) m |= 1 << i;
        s.style.transform = `translate3d(${(dx[i] * (1 - q)).toFixed(1)}px,${((1 - o) * 40).toFixed(1)}px,0) scale(${(1.22 - 0.22 * q).toFixed(3)})`;
      });
      const d = smooth(0, 0.04, cur) * (1 - q);
      deco.style.opacity = d.toFixed(3);
      nums.forEach((n, i) => (n.style.opacity = i === active ? "1" : "0"));
      dots.forEach((dot, i) => {
        dot.style.width = i === active ? "28px" : "12px";
        dot.style.backgroundColor = i === active ? "#FF3B00" : "rgba(255,255,255,.18)";
      });
      if (m !== mask) {
        mask = m;
        setLit([0, 1, 2].map((i) => !!(m & (1 << i))));
      }
      cta.style.opacity = smooth(0.86, 0.98, cur).toFixed(3);
      cta.style.pointerEvents = cur > 0.9 ? "auto" : "none";
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      steps.forEach((s) => {
        s.style.opacity = "";
        s.style.transform = "";
      });
      cta.style.opacity = "";
      cta.style.pointerEvents = "";
    };
  }, [story]);

  return (
    <section ref={root} id="methode" data-stack className={section} style={{ padding: `0 ${gutter}`, height: story ? "280vh" : undefined }}>
      <div
        className={`relative z-[1] mx-auto flex max-w-[1180px] flex-col justify-center isolate ${story ? "sticky top-0 h-screen" : ""}`}
        style={{ padding: story ? "clamp(72px,9vw,120px) 0" : "clamp(88px,11vw,150px) 0 clamp(48px,6vw,80px)", gap: "clamp(40px,5vw,64px)" }}
      >
        {story && (
          <div aria-hidden data-deco className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden opacity-0">
            <div
              data-glow
              className="absolute left-1/2 top-[58%] aspect-[1.6] w-[min(760px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[20px]"
              style={{ background: "radial-gradient(closest-side,rgba(255,59,0,.22),rgba(255,59,0,.06) 55%,rgba(255,59,0,0))" }}
            />
            {STEPS.map((s) => (
              <span
                key={s.n}
                data-num
                className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 font-extrabold leading-none tracking-[-.06em] text-transparent opacity-0 transition-opacity duration-500"
                style={{ ...archivo, fontSize: "clamp(220px,30vw,440px)", WebkitTextStroke: "1.5px rgba(255,255,255,.09)" }}
              >
                {s.n}
              </span>
            ))}
            <div className="absolute bottom-[clamp(28px,5vh,48px)] left-1/2 flex -translate-x-1/2 items-center gap-2.5">
              {STEPS.map((s) => (
                <span key={s.n} data-dot className="h-1 w-3 rounded-full bg-white/[.18] transition-[width,background-color] duration-300" />
              ))}
            </div>
          </div>
        )}

        <SectionHeading kicker="MÉTHODE" title="Comment ça marche" />

        <ol className={`relative m-0 flex list-none gap-[clamp(36px,4vw,48px)] p-0 ${story ? "flex-row" : "flex-col"}`}>
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              data-step
              className="flex min-w-0 flex-1 flex-col gap-4 will-change-transform"
              style={story ? { opacity: 0 } : undefined}
            >
              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="font-mono text-[13px] tracking-[.14em] text-[#8f8f8f]">{s.n}</span>
                <span
                  style={{ opacity: lit[i] ? 1 : 0, transition: lit[i] ? "opacity .6s .5s" : "opacity .2s" }}
                  className="inline-flex min-h-[30px] items-center whitespace-nowrap rounded-full bg-white/[.06] px-[13px] text-[13px] font-medium text-[#e6e6e6] shadow-[inset_0_1px_0_rgba(255,255,255,.14),inset_0_0_0_.5px_rgba(255,255,255,.1)] backdrop-blur-[16px]">
                  {s.time}
                </span>
              </div>
              <h3 className="m-0 font-semibold leading-[1.05] tracking-[-.03em] text-white" style={{ ...archivo, fontSize: "clamp(24px,2.4vw,32px)" }}>
                <StaggeredText text={s.title} by="letter" play={lit[i]} step={0.035} />
              </h3>
              <p className="m-0 max-w-[340px] text-[16px] leading-[1.6] text-[#b5b5b5] text-pretty max-sm:text-[15px]">
                <StaggeredText text={s.text} by="word" play={lit[i]} delay={0.25} step={0.04} />
              </p>
            </li>
          ))}
        </ol>

        <div data-cta className="flex justify-center" style={story ? { opacity: 0, pointerEvents: "none" } : undefined}>
          <button onClick={() => openModal()} className="btn-glass-primary">
            Démarrer mon projet <span aria-hidden className="text-[14px] opacity-90">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}
