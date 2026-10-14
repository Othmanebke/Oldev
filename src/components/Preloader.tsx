"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Moment où l'intro du hero démarre (le rideau s'ouvre). */
export const LOADER_INTRO_DELAY = 4600;
const LOADER_UNMOUNT = 5600;

const TYPED = "O.LDEV";
const WORD = "Bienvenue";
const E_OUT = "cubic-bezier(.22,1,.36,1)";
const E_IO = "cubic-bezier(.65,0,.35,1)";

const cond: CSSProperties = {
  fontFamily: "var(--font-archivo-flex), sans-serif",
  fontWeight: 900,
  fontStretch: "62%",
  fontVariationSettings: "'wdth' 62",
  textTransform: "uppercase",
  letterSpacing: ".005em",
  lineHeight: 0.8,
  color: "#f4f4f2",
};
const label: CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: "rgba(244,244,242,.45)",
};

/**
 * Barre de recherche verre liquide qui s'ouvre (0.15s) → « O.LDEV » tapé (1.05s)
 * → Entrée (1.85s) → la barre se referme (2.2s) → « BIENVENUE ■ » (3s)
 * → sortie des lettres (4s) → rideau qui s'ouvre en deux (4.45s).
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setVisible(false), reduce ? 0 : LOADER_UNMOUNT);
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 4000);
      const e = 1 - Math.pow(1 - p, 3);
      if (numRef.current) numRef.current.textContent = String(Math.round(e * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden className="preloader fixed inset-0 z-[300] overflow-hidden">
      {/* Rideau */}
      <div className="absolute inset-y-0 left-0 w-[50.2%] bg-[#050505]" style={{ animation: "cur-l 1.1s cubic-bezier(.83,0,.17,1) 4.45s forwards" }} />
      <div className="absolute inset-y-0 right-0 w-[50.2%] bg-[#050505]" style={{ animation: "cur-r 1.1s cubic-bezier(.83,0,.17,1) 4.45s forwards" }} />

      <div className="absolute inset-0 grid place-items-center" style={{ animation: "pl-fade-out .35s ease 4.4s forwards" }}>
        <div className="pl-grain pointer-events-none absolute inset-0 opacity-[.06]" />
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[min(820px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(255,255,255,.075) 0%,transparent 60%)", animation: "pl-fade-in 1.4s ease both" }}
        />

        {/* Barre de recherche */}
        <div
          className="pl-bar relative [grid-area:1/1]"
          style={{ animation: `sb-open 1s ${E_OUT} .15s both, sb-close .8s ${E_IO} 2.2s forwards` }}
        >
          <span className="pl-bar-ring" style={{ animation: "pl-ang 2.2s linear infinite, pl-fade-in .6s ease .6s both" }} />
          <span className="pl-bar-gloss" />
          <div
            className="relative flex h-full items-center"
            style={{
              gap: "clamp(12px,1.6vw,18px)",
              padding: "0 calc(var(--h) * .13) 0 calc(var(--h) * .34)",
              animation: "pl-fade-in .4s ease .7s both, pl-fade-out .2s ease 2.15s forwards",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(244,244,242,.5)" strokeWidth="2.2" strokeLinecap="round" className="shrink-0" style={{ width: "calc(var(--h) * .3)", height: "calc(var(--h) * .3)" }}>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <div className="relative flex min-w-0 flex-1 items-center" style={{ fontSize: "calc(var(--h) * .36)" }}>
              <span className="absolute left-0 whitespace-nowrap" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: ".82em", color: "rgba(244,244,242,.36)", animation: "pl-fade-out .15s ease 1s forwards" }}>
                Rechercher
              </span>
              <span
                className="flex items-center"
                style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 900, fontStretch: "125%", fontVariationSettings: "'wdth' 125", textTransform: "uppercase", letterSpacing: ".02em", lineHeight: 1, color: "#f4f4f2" }}
              >
                {[...TYPED].map((c, i) => {
                  const d = (1.05 + i * 0.1).toFixed(2);
                  return (
                    <span key={i} className="inline-block overflow-hidden whitespace-pre align-bottom" style={{ color: c === "." ? "#FF3B00" : undefined, animation: `pl-type .18s ${E_OUT} ${d}s both` }}>
                      <span className="inline-block" style={{ animation: `pl-ch-blur .35s ${E_OUT} ${d}s both` }}>{c}</span>
                    </span>
                  );
                })}
                <span className="inline-block rounded-[2px] bg-[#f4f4f2]" style={{ width: 2, height: "1.1em", marginLeft: ".14em", animation: "pl-caret .8s steps(1) .75s 2, pl-fade-out .1s linear 1.95s forwards" }} />
              </span>
            </div>
            <span
              className="relative grid shrink-0 place-items-center rounded-full"
              style={{ width: "calc(var(--h) * .7)", height: "calc(var(--h) * .7)", background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)", animation: "sb-enter .45s cubic-bezier(.34,1.56,.64,1) 1.85s both" }}
            >
              <span className="absolute inset-0 rounded-full opacity-0" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,.6)", animation: `pl-ripple .7s ${E_OUT} 1.95s` }} />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-[42%] w-[42%]">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Bienvenue ■ */}
        <div className="flex items-end px-5 [grid-area:1/1]" style={{ ...cond, gap: ".05em", fontSize: "clamp(56px,11vw,168px)" }}>
          {[...WORD].map((c, i) => (
            <span key={i} className="inline-block overflow-hidden" style={{ padding: ".12em .01em .04em", margin: "-.12em -.01em -.04em" }}>
              <span className="inline-block" style={{ animation: `pl-lt-in 1s ${E_OUT} ${(3 + i * 0.04).toFixed(2)}s both, pl-lt-out .6s cubic-bezier(.7,0,.3,1) ${(4 + i * 0.03).toFixed(2)}s forwards` }}>{c}</span>
            </span>
          ))}
          <span className="shrink-0 bg-[#FF3B00]" style={{ width: ".15em", height: ".15em", marginBottom: ".02em", animation: "sq-pop .5s cubic-bezier(.34,1.56,.64,1) 3.45s both, sq-out .35s cubic-bezier(.7,0,.3,1) 4.15s forwards" }} />
        </div>

        {/* Bas de l'écran */}
        <div className="absolute flex items-end justify-between gap-4" style={{ left: "clamp(20px,3vw,40px)", right: "clamp(20px,3vw,40px)", bottom: "clamp(20px,3vw,36px)", animation: "pl-fade-in .6s ease .3s both" }}>
          <div className="flex flex-col gap-2.5">
            <span style={label}>Chargement</span>
            <span ref={numRef} style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: "clamp(28px,3vw,40px)", lineHeight: 0.9, letterSpacing: "-.03em", color: "#f4f4f2" }}>
              000
            </span>
          </div>
          <span style={{ ...label, textAlign: "right" }}>
            Développeur web
            <br />
            Seine-et-Marne
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/[.08]">
          <div className="h-full origin-left scale-x-0 bg-[#f4f4f2]" style={{ animation: "bar-fill 4s cubic-bezier(.65,0,.2,1) forwards" }} />
        </div>
      </div>
    </div>
  );
}
