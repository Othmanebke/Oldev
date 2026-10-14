"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/** Land mask, 288×144 bits (1 = land), base64. */
const LAND = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPcBAOD/HwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA//+P//f/LwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4/v/4/////wcAAAAEAPABAAAAfAAAAAAAAAAAAAAAAAAAAADg9w/4/////wEAAP4AAAAAAAAA+AAAAAAAAAAAAAAAAAAAAIAG+Of//////wAAAHwGAAAAAAAAAAMAAAAAAAAAAAAAAACABwAc/4P//////wAAADAAAAAAQAAAAD4AAAAAAAAAAAAAAAAAfMbDcQAA/v///wAAAAAAAADABwAA//8HAMAPAAAAAAAAAABgAAAAAAAA/P///wAAAAAAAABwAADg//8AAAAAAAAAAAAAAADwG457dwcA8P//HwAAAAAAAAAYAAD///9/eAAAAAAAAAAAAAD4/g0H/w8A8P//PwAAAAAAAAAOgOv/////fwD/AAAAAAA/AAAA/B84/v8A8P//LwAAAAD4AAAA4PP//////////wAAAOD///H/+D/3cPgDoP//DwAAAID/BwAAx/v/////////P4AA/P///////////////////////w8AAOcBAAgAAAAAAAAAAAAAgP///////////////////////wcAACYAAAQAAAAAAAAAAAAAgf///////////////////////wMM8AAAAAAAAAAAAAAAAAAAIID/////////e+wPwH8AgA8AAP/5z/////////////////8/ANH///////9/AIALgD8AAAAAwH/+//////////////////9/APj///////8fADwAAD8AAAAA8D/+//////////////////sPAPC/+f////8fAPwAADgAAAAA8D/+////////////////D/wBAMCfAP////8PAPwYAAAAAAAA8H/4//////////////9/DgcAAAAcAOD///8/APw/AAAAAAAQAB7w//////////////8BgAMAAAACAMD/////Afh/AAAAAAA4gBz+/////////////38A4AMAAMAAAMD/////B/z/AAAAAABwwAb+/////////////x8A8AEAAAAAAAD/////P///AwAAAADmgOH//////////////z8A4AAAAAAAAAD+////P/7/BwAAAAD28P////////////////8D4AAAAAAAAAD8////f/7/BwAAAADz+f////////////////8HIAAAAAAAAAD6////////BAAAAABw/v////////////////8EAAAAAAAAAADo//////8jHgAAAACA//////////////////8MAAAAAAAAAADQ//////8OPgAAAADw//////////////////8AAAAAAAAAAADg//////+PIAAAAADA////v////////////38EAAAAAAAAAADg////////AAAAAACA//v/zD/8/////////z8AAAAAAAAAAADg//////8bAAAAAACA//N/gD///////////x8GAAAAAAAAAADw//////8AAAAAAAD+B8c/AD/+/////////wcPAAAAAAAAAADg//////8AAAAAAAD+gx4/DH74/////////wABAAAAAAAAAADg/////x8AAAAAAAD+gbCn///8////////fQABAAAAAAAAAADg/////w8AAAAAAAD/gCDn///4//////9/MgADAAAAAAAAAADA/////w8AAAAAAAD+AADm/3/4//////8/cIABAAAAAAAAAADA/////wcAAAAAAAA44AHC///5////////4+ABAAAAAAAAAACA/////wcAAAAAAACI/wEA4P//////////4OgAAAAAAAAAAAAA/////wMAAAAAAAD4/wAA4P//////////ADYAAAAAAAAAAAAA/P///wEAAAAAAAD+/wEA8P//////////AQcAAAAAAAAAAAAA+P//fwAAAAAAAAD//w8P8P//////////AQEAAAAAAAAAAAAAyP//fwAAAAAAAAD//3//////////////AQAAAAAAAAAAAAAA0P+PYQAAAAAAAAD//////z//////////AwAAAAAAAAAAAAAAoP8HwAAAAAAAAMD/////83/+////////AQAAAAAAAAAAAAAAIP8DwAAAAAAAAOD/////5//I////////AAAAAAAAAAAAAAAAQP4DgAAAAAAAAPD/////z/+A////////AAAAAAAAAAAAAAAAAPwDAAIAAAAAAPD/////z/8ZwP////9/AQAAAAAAAAAAAAAAAPgDQAAAAAAAAPj/////j/9/gP////8fAQAAAAAAAAAAAAAAAPADEAMAAAAAAPz/////v///AP9//P8DAAAAAAAAAAAAAAAAAPADAwwAAAAAAPj/////P/9/APw//B8AAAAAAAAAAAAIAAAAAPCHA8AAAAAAAPj/////P/4/APwP+J8BAAAAAAAAAAAAAAAAAMD/A0YEAAAAAPj/////f/4fAPwH+B8AAwAAAAAAAAAAAAAAAAD/AQAAAAAAAPj/////f/wHAPgD8D8AAwAAAAAAAAAAAAAAAADgHwAAAAAAAPj///////wDAPgAwH8AAQAAAAAAAAAAAAAAAADAHwAAAAAAAPz//////30AAPAAwH8AAAAAAAAAAAAAAAAAAAAAHAAAAAAAAPj//////wsAAPAAgH4AAQAAAAAAAAAAAAAAAAAAGEAAAAAAAPj//////wMBAPAAgHwAAAAAAAAAAAAAAAAAAAAAGPAhAAAAAPD///////cBAOAAgDiABAAAAAAAAAAAAAAAAAAAIPl/AAAAAOD///////8AAGABABBAFAAAAAAAAAAAAAAAAAAAgP7/AQAAAMD///////8AAAABgAAAHAAAAAAAAAAAAAAAAAAAAPz/AQAAAID///////8AAAABAAEgCAAAAAAAAAAAAAAAAAAAAPz/HwAAAAD/8P///38AAAAAAANgAAAAAAAAAAAAAAAAAAAAAPz/fwAAAAAAoP///z8AAAAAYAd4AAAAAAAAAAAAAAAAAAAAAPz/fwAAAAAAAP///x8AAAAAwAY8AAAAAAAAAAAAAAAAAAAAAP7//wAAAAAAAP///w8AAAAAgAc+AAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAP///wcAAAAAgIM/TwAAAAAAAAAAAAAAAAAAAP///wEAAAAAgP///wMAAAAAAIc/QAQAAAAAAAAAAAAAAAAAgP///w8AAAAAgP///wEAAAAAAA6fAUQAAAAAAAAAAAAAAAAAAP////8AAAAAAP///wAAAAAAAB6ewuwDAgAAAAAAAAAAAAAAgP////8DAAAAAP7//wAAAAAAABwAAvAPAgAAAAAAAAAAAAAAgP////8PAAAAAPz/fwAAAAAAABAAAMCfAQAAAAAAAAAAAAAAAP////8PAAAAAPz//wAAAAAAAOADAIA/MAAAAAAAAAAAAAAAAP7///8PAAAAAPz/fwAAAAAAAAAPAMBngAAAAAAAAAAAAAAAAP7///8PAAAAAPz//wAAAAAAAAAACABAAAAAAAAAAAAAAAAAAPz///8HAAAAAPj//wAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAPz///8DAAAAAPj//wAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAPj///8BAAAAAPz//4AAAAAAAAAAAB8GAAAAAAAAAAAAAAAAAPj///8BAAAAAPz//8EAAAAAAAAAIB8OAAAAAAAAAAAAAAAAAPD///8BAAAAAP7//+AAAAAAAAAA+B8OACAAAAAAAAAAAAAAAMD///8BAAAAAP7/f/gAAAAAAAAA/H8eAAAAAAAAAAAAAAAAAID///8AAAAAAP7/H/gAAAAAAAAA/P8fAABAAAAAAAAAAAAAAAD///8AAAAAAPz/D3AAAAAAAAAA/v8/AAAAAAAAAAAAAAAAAAD///8AAAAAAPj/D3gAAAAAAADA//9/AAgAAAAAAAAAAAAAAAD//38AAAAAAPj/DzgAAAAAAADw////AAAAAAAAAAAAAAAAAAD//x8AAAAAAPD/DzgAAAAAAAD4////AQAAAAAAAAAAAAAAAAD//wMAAAAAAPD/DzgAAAAAAAD4////AwAAAAAAAAAAAAAAAID//wEAAAAAAPD/AwAAAAAAAAD4////AwAAAAAAAAAAAAAAAID//wEAAAAAAPD/AwAAAAAAAAD4////BwAAAAAAAAAAAAAAAID//wEAAAAAAOD/AwAAAAAAAAD4////BwAAAAAAAAAAAAAAAID//wAAAAAAAOD/AQAAAAAAAADw////BwAAAAAAAAAAAAAAAID//wAAAAAAAMD/AAAAAAAAAADw////AwAAAAAAAAAAAAAAAID/fwAAAAAAAIB/AAAAAAAAAADgf/z/AwAAAAAAAAAAAAAAAID/PwAAAAAAAIA/AAAAAAAAAADgB/D/AQAAAAAAAAAAAAAAAMD/HQAAAAAAAIABAAAAAAAAAADwAND/AQAAAAAAAAAAAAAAAMD/AwAAAAAAAAAAAAAAAAAAAAAAAID/AAAIAAAAAAAAAAAAAMD/BwAAAAAAAAAAAAAAAAAAAAAAAAD/AAAQAAAAAAAAAAAAAOD/AwAAAAAAAAAAAAAAAAAAAAAAAAA+AABwAAAAAAAAAAAAAOA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAOA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAOAPAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAGAAAAAAAAAAAAAMAPAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAADAAAAAAAAAAAAAPAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMABAAAAAAAAAAAAAPADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOABAAAAAAAAAAAAAPAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPADAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAPABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPCBAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAA+AABAAJ8//j8PAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAPD/fwD///////8/AAAAAAAAAAAAAAAAAIA+AAAAAAAAAAAAPP///8D/////////HwAAAAAAAAAAAAAAAIA9AAAAAAAA8Pz/////P/j//////////wMAAAAAAAAAAMAAAPB9AAAAAID/////////P/7///////////8BAAAAAAAAAOABAwB/AAAAAPD///////////////////////8AAAAAAFACPoD///9/AAAAAPD//////////////////////x8AAAAA+P////////8HAAAAAP///////////////////////wcAAAAA/v///////wMAAAAA/v///////////////////////wcAAAD8/////////w8AAA7w/////////////////////////w8AAMAB/////////wMAgB84/////////////////////////wEAAAAA/P///////3/w4AcA/////////////////////////wAAAADg//////////8/gM///////////////////////////wMAAADg/////////////f///////////////////////////z8A7wMA/v////////////////////////////////////////8/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const MW = 288, MH = 144, QA = Math.PI / 36;
const FACE = '"Inter",-apple-system,"Segoe UI",Helvetica,Arial,sans-serif';
const DENSITY = 0.53, GLYPH = 0.9, SPEED = 2, DRIFT = 2.1, LETTERS = 1, MAX_PINS = 7;

const cl = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

function rgbOf(s: string, fb: number[]) {
  s = s.trim();
  if (s[0] === "#") {
    let x = s.slice(1);
    if (x.length < 6) x = x[0] + x[0] + x[1] + x[1] + x[2] + x[2];
    const r = parseInt(x.slice(0, 2), 16), g = parseInt(x.slice(2, 4), 16), b = parseInt(x.slice(4, 6), 16);
    return isNaN(r + g + b) ? fb : [r, g, b];
  }
  const m = s.match(/[\d.]+/g);
  return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : fb;
}

type GlobeNode = { lat: number; lon: number; land: boolean; c: string };
type Pin = { lat: number; lon: number; t: number };

/**
 * Dotted canvas globe: land written with the letters of `phrase`, drag to spin,
 * click to drop an accent pin. No wheel zoom, vertical page scroll kept on touch
 * (touch-action: pan-y), slowed down under prefers-reduced-motion.
 */
export default function Globe({
  baseColor = "#f4f4f2",
  accent = "#FF3B00",
  phrase = "oncodeensemble",
  className,
  style,
}: {
  baseColor?: string;
  accent?: string;
  phrase?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const cRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let land: Uint8Array | null = null;
    try {
      const b = atob(LAND);
      land = new Uint8Array(b.length);
      for (let i = 0; i < b.length; i++) land[i] = b.charCodeAt(i);
    } catch {}
    const isLand = (lon: number, lat: number) => {
      if (!land) return false;
      const gx = Math.floor(((lon + 180) / 360) * MW), gy = Math.floor(((90 - lat) / 180) * MH);
      if (gx < 0 || gx >= MW || gy < 0 || gy >= MH) return false;
      const b = gy * MW + gx;
      return ((land[b >> 3] >> (b & 7)) & 1) === 1;
    };

    // Points along parallels (half the sea skipped); land points carry the phrase letters
    const nodes: GlobeNode[] = [];
    {
      const step = 3.05 / DENSITY, every = Math.max(1, Math.round(2 / LETTERS));
      let k = 0, run = 0, s3 = 0;
      for (let lat = -86; lat <= 86; lat += step) {
        const n = Math.max(1, Math.round(98 * DENSITY * Math.cos((lat * Math.PI) / 180)));
        for (let i = 0; i < n; i++) {
          const lon = -180 + (360 * i) / n, l = isLand(lon, lat);
          if (!l && s3++ % 2) continue;
          let c = "";
          if (l && run++ % every === 0) c = phrase.charAt(k++ % phrase.length);
          nodes.push({ lat: (lat * Math.PI) / 180, lon: (lon * Math.PI) / 180, land: l, c });
        }
      }
    }

    const ptr = { on: 0, x: -1e9, y: -1e9, dragging: 0, dx: 0, dy: 0, moved: 0, click: 0 };
    const pins: Pin[] = [];
    const view = { cx: 0, cy: 0, R: 1, cs: 1, sn: 0, ct: 1, st: 0 };
    const unproject = (px: number, py: number) => {
      const x1 = (px - view.cx) / view.R, y2 = (view.cy - py) / view.R, q = 1 - x1 * x1 - y2 * y2;
      if (q <= 0.002) return null;
      const z2 = Math.sqrt(q), y0 = y2 * view.ct + z2 * view.st, z1 = -y2 * view.st + z2 * view.ct;
      const x0 = x1 * view.cs + z1 * view.sn, z0 = -x1 * view.sn + z1 * view.cs;
      return { lat: Math.asin(cl(y0, -1, 1)), lon: Math.atan2(z0, x0) };
    };

    let raf = 0, last = performance.now(), clock = 0, spin = 1.6, vel = 0.16, tilt = -0.36, vtilt = 0, seen = 0;
    const sea: number[] = [], soil: number[] = [], l8: number[][] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ink = rgbOf(baseColor, [244, 244, 242]).join(",");
    const acs = rgbOf(accent, [255, 59, 0]).join(",");
    const tone = (a: number) => "rgba(" + ink + "," + cl(a, 0, 1).toFixed(3) + ")";

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sp = reduced ? 0.15 : SPEED;
      clock += dt * sp;
      const dpr = Math.min(window.devicePixelRatio || 1, 2), cw = canvas.clientWidth || 1, ch = canvas.clientHeight || 1;
      const bw = Math.round(cw * dpr), bh = Math.round(ch * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      const u = Math.min(cw, ch), hv = ptr.on ? 1 : 0, cx = cw / 2, cy = ch / 2, R = u * 0.46, fs = u * 0.0275 * 0.62 * GLYPH * 1.45;

      if (ptr.dragging) {
        const ds = (ptr.dx * u) / R, dtl = (-ptr.dy * u) / R;
        ptr.dx = 0;
        ptr.dy = 0;
        spin += ds;
        tilt = cl(tilt + dtl, -1.15, 1.15);
        const k = Math.min(1, dt / 0.07), inv = 1 / Math.max(dt, 1 / 240);
        vel += (cl(ds * inv, -9, 9) - vel) * k;
        vtilt += (cl(dtl * inv, -9, 9) - vtilt) * k;
      } else {
        // Idle drift (slower while hovered), tilt eases back to its rest angle
        const idle = 0.16 * DRIFT * (hv > 0 ? 0.28 : 1);
        vel += (idle - vel) * Math.min(1, (dt * sp) / 0.9);
        vtilt *= Math.exp(-dt * sp * 6.6);
        tilt = cl(tilt + vtilt * dt * sp, -1.15, 1.15);
        tilt += (-0.36 - tilt) * Math.min(1, (dt * sp) / 4);
        spin += vel * dt * sp * 0.5;
      }
      if (ptr.click !== seen) {
        seen = ptr.click;
        const g = unproject(ptr.x, ptr.y);
        if (g) {
          pins.push({ lat: g.lat, lon: g.lon, t: clock });
          while (pins.length > MAX_PINS) pins.shift();
        }
      }

      const cs = Math.cos(spin), sn = Math.sin(spin), ct = Math.cos(tilt), st = Math.sin(tilt);
      Object.assign(view, { cx, cy, R, cs, sn, ct, st });
      // Soft light under the pointer
      const lx = hv > 0 && !ptr.dragging ? ptr.x : -1e9, ly = hv > 0 && !ptr.dragging ? ptr.y : -1e9, lr = u * 0.2, lr2 = lr * lr;

      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, "rgba(40,40,40,.55)");
      body.addColorStop(1, "rgba(10,10,10,.9)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      sea.length = 0;
      soil.length = 0;
      for (let b = 0; b < 8; b++) if (l8[b]) l8[b].length = 0;
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i], c = Math.cos(nd.lat);
        const x0 = c * Math.cos(nd.lon), y0 = Math.sin(nd.lat), z0 = c * Math.sin(nd.lon);
        const x1 = x0 * cs - z0 * sn, z1 = x0 * sn + z0 * cs, y2 = y0 * ct - z1 * st, z2 = y0 * st + z1 * ct;
        if (z2 <= 0.02) continue;
        const px = cx + x1 * R, py = cy - y2 * R, ddx = px - lx, ddy = py - ly, dd = ddx * ddx + ddy * ddy;
        const glow = dd < lr2 ? (1 - Math.sqrt(dd) / lr) * hv : 0;
        if (!nd.land) {
          sea.push(px, py, Math.min(0.999, z2 + glow * 0.55));
          continue;
        }
        if (!nd.c) {
          soil.push(px, py, Math.min(0.999, z2 + glow * 0.55));
          continue;
        }
        const tx0 = -Math.sin(nd.lon), tz0 = Math.cos(nd.lon), tx1 = tx0 * cs - tz0 * sn, tz1 = tx0 * sn + tz0 * cs;
        const ang = Math.round(Math.atan2(tz1 * st, tx1) / QA) * QA;
        const b = Math.min(7, Math.max(0, (Math.min(0.999, z2 + glow * 0.6) * 7.99) | 0));
        (l8[b] || (l8[b] = [])).push(px, py, ang, i);
      }

      const dmin = Math.max(0.7, u * 0.0029);
      const dots = (list: number[], ba: number, gain: number, grow: number) => {
        for (let lv = 0; lv < 6; lv++) {
          const z = (lv + 0.5) / 6, s = dmin * grow * (0.55 + 0.75 * z);
          ctx.fillStyle = tone(ba + gain * z);
          ctx.beginPath();
          for (let q = 0; q < list.length; q += 3) {
            const l = list[q + 2] >= 1 ? 5 : (list[q + 2] * 6) | 0;
            if (l !== lv) continue;
            ctx.rect(list[q] - s / 2, list[q + 1] - s / 2, s, s);
          }
          ctx.fill();
        }
      };
      dots(sea, 0.08, 0.18, 1);
      dots(soil, 0.34, 0.46, 1.7);

      for (let b = 0; b < 8; b++) {
        const a = l8[b];
        if (!a || !a.length) continue;
        const zb = (b + 0.5) / 8;
        ctx.font = "bold " + (fs * (0.42 + 0.58 * zb)).toFixed(2) + "px " + FACE;
        ctx.fillStyle = tone(0.28 + 0.72 * Math.pow(zb, 0.6));
        for (let t = 0; t < a.length; t += 4) {
          ctx.save();
          ctx.translate(a[t], a[t + 1]);
          ctx.rotate(a[t + 2]);
          ctx.fillText(nodes[a[t + 3]].c, 0, 0);
          ctx.restore();
        }
      }

      for (const pn of pins) {
        const pc = Math.cos(pn.lat), ax = pc * Math.cos(pn.lon), ay = Math.sin(pn.lat), az = pc * Math.sin(pn.lon);
        const bx = ax * cs - az * sn, bz1 = ax * sn + az * cs, by = ay * ct - bz1 * st, bz = ay * st + bz1 * ct;
        if (bz <= 0.02) continue;
        const ppx = cx + bx * R, ppy = cy - by * R, age = clock - pn.t, pop = Math.min(1, age / 0.22);
        const rr = u * 0.016 * (0.4 + 0.6 * pop) * (0.55 + 0.45 * bz);
        ctx.beginPath();
        ctx.arc(ppx, ppy, rr, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(" + acs + "," + (0.4 + 0.6 * bz).toFixed(3) + ")";
        ctx.lineWidth = Math.max(0.8, u * 0.0024);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ppx, ppy, Math.max(0.8, rr * 0.25), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + acs + ",1)";
        ctx.fill();
        if (age < 0.9) {
          const w = 1 - age / 0.9;
          ctx.beginPath();
          ctx.arc(ppx, ppy, rr + (1 - w) * u * 0.05, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(" + acs + "," + (0.6 * w * w).toFixed(3) + ")";
          ctx.lineWidth = Math.max(0.6, u * 0.0016);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(render);
    };

    let lx = 0, ly = 0;
    const lp = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return r.width > 0 ? { x: e.clientX - r.left, y: e.clientY - r.top } : null;
    };
    const track = (e: PointerEvent) => {
      const p = lp(e);
      if (!p) return;
      ptr.on = 1;
      if (ptr.dragging) {
        const u = Math.min(canvas.clientWidth, canvas.clientHeight) || 1;
        ptr.dx += (p.x - lx) / u;
        ptr.dy += (p.y - ly) / u;
        if (Math.abs(p.x - lx) + Math.abs(p.y - ly) > 1) ptr.moved = 1;
      }
      ptr.x = lx = p.x;
      ptr.y = ly = p.y;
    };
    const down = (e: PointerEvent) => {
      const p = lp(e);
      if (!p) return;
      ptr.dragging = 1;
      ptr.moved = 0;
      ptr.x = lx = p.x;
      ptr.y = ly = p.y;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
    };
    const up = () => {
      if (ptr.dragging && !ptr.moved) ptr.click++;
      ptr.dragging = 0;
    };
    const leave = () => {
      if (!ptr.dragging) ptr.on = 0;
    };

    canvas.addEventListener("pointermove", track);
    canvas.addEventListener("pointerenter", track);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", track);
      canvas.removeEventListener("pointerenter", track);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [baseColor, accent, phrase]);

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      <canvas
        ref={cRef}
        aria-hidden
        className="absolute inset-0 block h-full w-full cursor-grab select-none active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      />
    </div>
  );
}
