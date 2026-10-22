"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Grain from "@/components/fx/Grain";
import heroPhoto from "@/img/hero.webp";
import { section } from "@/components/sections/layout";

/** Projects cycling inside the mini mockup of the manifesto. */
const PILLS = ["eclat", "luxecars", "dental", "verdure", "renova"].map((n) => `/portfolio/${n}.webp`);
const PILL_AT = 4; // the mockup comes after "connaissez"
const MANIFESTO = [
  ["Vous", "ne", "me", "connaissez", "pas", "encore,"],
  ["mais", "vos", "clients", "vont", "adorer", "votre", "site."],
];
const LINES = ["Je code chaque site à la main.", "Je réponds en 48 h, pas en 2 semaines.", "Le reste, vous le verrez dans le travail"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const archivo: CSSProperties = { fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 500, letterSpacing: "-.025em" };

type Pt = { tx: number; ty: number; sx: number; sy: number; l: number; s: number; o: boolean; ph: number; vx: number; vy: number; ox: number; oy: number };

/** Samples the portrait (120 px wide) into particles: each one has a random start around the centre and its pixel as target. */
function sample(img: HTMLImageElement): { pts: Pt[]; aspect: number } | null {
  const W = 120, H = Math.round((W * img.height) / img.width);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  if (!x) return null;
  x.drawImage(img, 0, 0, W, H);
  let d: Uint8ClampedArray;
  try {
    d = x.getImageData(0, 0, W, H).data;
  } catch {
    return null;
  }
  let tr = 0;
  for (let k = 3; k < d.length; k += 4) if (d[k] < 128) tr++;
  const useAlpha = tr > (d.length / 4) * 0.1, pts: Pt[] = [];
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) {
      const k = (j * W + i) * 4, a = d[k + 3] / 255, l = (d[k] + d[k + 1] + d[k + 2]) / 765;
      if (useAlpha ? a < 0.5 : l < 0.12) continue;
      if (Math.random() > 0.25 + l * 0.6) continue;
      const ang = Math.random() * Math.PI * 2, rad = 0.6 + Math.random() * 0.9;
      pts.push({ tx: i / W, ty: j / H, sx: 0.5 + Math.cos(ang) * rad, sy: 0.5 + Math.sin(ang) * rad, l, s: 0.8 + l * 1.4, o: Math.random() < 0.035, ph: Math.random() * 6.28, vx: 0, vy: 0, ox: 0, oy: 0 });
    }
  return { pts, aspect: H / W };
}

/**
 * Who I am: a manifesto whose words sharpen with the scroll, then my portrait
 * drawn by particles converging as the (220vh, sticky) block scrolls by, with
 * three short lines and the signature.
 */
export function AboutSection() {
  const stmt = useRef<HTMLParagraphElement>(null);
  const me = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const [pill, setPill] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setPill((p) => (p + 1) % PILLS.length), 1600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pq = reduced ? 1 : 0, inView = false, raf = 0, praf = 0;
    let data: ReturnType<typeof sample> = null;

    const img = new window.Image();
    img.onload = () => {
      data = sample(img);
    };
    img.src = heroPhoto.src;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const st = stmt.current;
      if (st) {
        const r = st.getBoundingClientRect(), prog = reduced ? 1 : clamp01((vh * 0.9 - r.top) / (r.height + vh * 0.45));
        const ws = st.querySelectorAll<HTMLElement>("[data-w]"), n = ws.length;
        ws.forEach((w, i) => {
          const wp = clamp01(prog * (n + 3) - i);
          w.style.opacity = String(0.1 + wp * 0.9);
          w.style.filter = wp < 1 ? `blur(${(1 - wp) * 6}px)` : "";
          w.style.transform = wp < 1 ? `translateY(${(1 - wp) * 0.3}em)` : "";
        });
      }
      const m = me.current;
      if (m) {
        const r = m.getBoundingClientRect();
        pq = reduced ? 1 : clamp01((vh - r.top) / (r.height - vh * 0.2));
        m.style.setProperty("--q", pq.toFixed(3));
        inView = r.top < vh && r.bottom > 0;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const draw = () => {
      praf = requestAnimationFrame(draw);
      const cv = canvas.current;
      if (!data || !cv || !inView) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, hh = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(hh * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(hh * dpr);
      }
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, hh);
      const q = reduced ? 1 : clamp01(pq / 0.7), e = 1 - Math.pow(1 - q, 3);
      let ph = hh, pw = ph / data.aspect;
      if (pw > w) {
        pw = w;
        ph = pw * data.aspect;
      }
      const ox = (w - pw) / 2, oy = (hh - ph) / 2, t = performance.now() / 1000, M = mouse.current, orange: number[] = [];
      for (const p of data.pts) {
        const bx = ox + (p.sx + (p.tx - p.sx) * e) * pw + Math.sin(t * 0.8 + p.ph) * (1 - e) * 14;
        const by = oy + (p.sy + (p.ty - p.sy) * e) * ph + Math.cos(t * 0.7 + p.ph) * (1 - e) * 14;
        // Pushed away by the pointer, springs back
        const dx = bx + p.ox - M.x, dy = by + p.oy - M.y, dd = dx * dx + dy * dy;
        if (dd < 3600) {
          const dl = Math.sqrt(dd) || 1, fo = (1 - dl / 60) * 2.2;
          p.vx += (dx / dl) * fo;
          p.vy += (dy / dl) * fo;
        }
        p.vx = (p.vx - p.ox * 0.06) * 0.84;
        p.vy = (p.vy - p.oy * 0.06) * 0.84;
        p.ox += p.vx;
        p.oy += p.vy;
        const x = bx + p.ox, y = by + p.oy;
        if (p.o) {
          orange.push(x, y, p.s);
          continue;
        }
        ctx.fillStyle = `rgba(244,241,236,${(0.25 + p.l * 0.65) * (0.35 + e * 0.65)})`;
        ctx.fillRect(x, y, p.s, p.s);
      }
      ctx.fillStyle = "#FF3B00";
      for (let i = 0; i < orange.length; i += 3) ctx.fillRect(orange[i], orange[i + 1], orange[i + 2] + 0.6, orange[i + 2] + 0.6);
    };

    update();
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(praf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lineStyle = (from: number, to: number): CSSProperties => ({
    opacity: `calc((var(--q) - ${from}) * 8)`,
    transform: `translateY(calc(max(0, ${to} - var(--q)) * 60px))`,
    filter: `blur(calc(max(0, ${to} - var(--q)) * 40px))`,
  });

  return (
    <section id="about" data-stack className={section}>
      <Grain />

      {/* Manifesto */}
      <div className="relative z-[1]" style={{ padding: "clamp(90px,16vh,180px) 24px clamp(40px,8vh,80px)" }}>
        <p ref={stmt} className="m-0 mx-auto max-w-[880px] text-center leading-[1.25] text-[#f4f4f2] text-balance" style={{ ...archivo, fontSize: "clamp(26px,3.6vw,50px)" }}>
          {MANIFESTO.map((line, l) => (
            <span key={l}>
              {l > 0 && <br />}
              {line.map((w, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  {l === 0 && i === PILL_AT && (
                    <>
                      <span
                        data-w
                        aria-hidden
                        className="relative mx-[.08em] inline-block h-[1.1em] w-[2.4em] -translate-y-[.06em] overflow-hidden rounded-[.3em] bg-[#1E1B18] align-middle"
                      >
                        {PILLS.map((src, k) => (
                          <Image key={src} src={src} alt="" fill sizes="120px" className={`object-cover object-top transition-opacity duration-300 ${k === pill ? "opacity-100" : "opacity-0"}`} />
                        ))}
                      </span>{" "}
                    </>
                  )}
                  <span data-w className={`inline-block ${w === "site." ? "text-abcs-red" : ""}`}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      {/* Portrait in particles */}
      <div ref={me} className="relative z-[1] h-[220vh]" style={{ "--q": 0 } as CSSProperties}>
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center p-6" style={{ gap: "clamp(20px,4vh,36px)" }}>
          <canvas
            ref={canvas}
            aria-hidden
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
            }}
            onPointerLeave={() => {
              mouse.current = { x: -9999, y: -9999 };
            }}
            className="block h-[min(46vh,440px)] w-[min(420px,80vw)] touch-pan-y"
          />
          <div className="flex flex-col items-center gap-1 text-center leading-[1.35] tracking-[-.015em] text-[#f4f4f2]" style={{ ...archivo, fontSize: "clamp(18px,1.8vw,24px)" }}>
            <span style={lineStyle(0.7, 0.82)}>{LINES[0]}</span>
            <span style={lineStyle(0.78, 0.9)}>{LINES[1]}</span>
            <span style={lineStyle(0.86, 0.98)}>
              {LINES[2]}
              <span className="text-abcs-red">.</span>
            </span>
            <span className="mt-3.5 font-sans text-[13px] font-medium tracking-normal text-[rgba(244,241,236,.45)]" style={{ opacity: "calc((var(--q) - .92) * 12)" }}>
              Othmane, fondateur d&apos;O&apos;LDEV
            </span>
          </div>
        </div>
      </div>

      <p className="sr-only">
        Développeur web freelance avec 5 ans d&apos;expérience (Inetum, Fujitsu, AJC), diplômé d&apos;un Bac+5 Expert
        Informatique Web. Basé à Brie-Comte-Robert, en Seine-et-Marne (Île-de-France).
      </p>
    </section>
  );
}
