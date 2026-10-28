"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;
// Left / right edges are warped by an animated fbm grain and darkened
const FRAG = `precision highp float;uniform sampler2D tDiffuse;uniform float uTime;uniform vec2 uResolution;uniform float uEdgeWidth;uniform float uNoiseSpeed;uniform float uGrainScale;uniform float uGrainAmount;varying vec2 vUv;
vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m*m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291400159-.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<4;i++){v+=a*snoise(p);p=p*2.1+vec2(1.7,9.2);a*=.5;}return v;}
void main(){float l=1.-smoothstep(0.,uEdgeWidth,vUv.x);float r=smoothstep(1.-uEdgeWidth,1.,vUv.x);float xm=max(l,r);
if(xm<=.001){gl_FragColor=texture2D(tDiffuse,vUv);return;}
float mask=pow(xm,3.)*3.;float ar=uResolution.x/max(uResolution.y,1.);float t=uTime*uNoiseSpeed*(uGrainScale*.015);
vec2 n=vec2(vUv.x*ar,vUv.y)*uGrainScale;float dx=fbm(n+vec2(t,t*.5))*uGrainAmount;float dy=fbm(n+vec2(-t*.3,t*.8))*uGrainAmount;
vec2 w=vUv+vec2(dx,dy)*mask;vec4 col=vec4(0.);if(w.x>=0.&&w.x<=1.&&w.y>=0.&&w.y<=1.)col=texture2D(tDiffuse,w);
float d=max(smoothstep(1.,.1,mask/6.),.1);gl_FragColor=vec4(col.rgb*d,col.a*d);}`;

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Card cropped to the top of the image (the hero of the site shows). */
function drawCard(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, r: number) {
  ctx.save();
  rrect(ctx, x, y, w, h, r);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.clip();
  if (img.complete && img.naturalWidth) {
    const ir = img.naturalWidth / img.naturalHeight, br = w / h;
    const [sw, sh] = ir > br ? [img.naturalHeight * br, img.naturalHeight] : [img.naturalWidth, img.naturalWidth / br];
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, 0, sw, sh, x, y, w, h);
  }
  ctx.restore();
}

type Props = {
  images: string[];
  /** px/s, negative = the other way. */
  speed?: number;
  gap?: number;
  radius?: number;
  ratio?: number;
  className?: string;
};

/**
 * Endless row of cards drawn on a 2D canvas, then sent as a WebGL texture to a
 * shader that warps and darkens the left / right edges (plain canvas without
 * WebGL). Slows down under the pointer, draggable (vertical scroll kept),
 * paused off screen, static under reduced motion.
 */
export default function GrainyRow({ images, speed = 40, gap = 12, radius = 16, ratio = 16 / 9, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const glCanvas = useRef<HTMLCanvasElement>(null);
  const flatCanvas = useRef<HTMLCanvasElement>(null);
  const key = images.join("|");

  useEffect(() => {
    const el = root.current, gc = glCanvas.current, fc = flatCanvas.current;
    if (!el || !gc || !fc) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const imgs = key.split("|").filter(Boolean).map((src) => {
      const i = new Image();
      i.decoding = "async";
      i.src = src;
      return i;
    });
    const strip = document.createElement("canvas");
    const sctx = strip.getContext("2d");
    if (!sctx) return;

    // WebGL setup (falls back to the plain canvas)
    let gl: WebGLRenderingContext | null = gc.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    const u: Record<string, WebGLUniformLocation | null> = {};
    if (gl) {
      const g = gl;
      const sh = (t: number, s: string) => {
        const o = g.createShader(t)!;
        g.shaderSource(o, s);
        g.compileShader(o);
        return o;
      };
      const p = g.createProgram()!;
      g.attachShader(p, sh(g.VERTEX_SHADER, VERT));
      g.attachShader(p, sh(g.FRAGMENT_SHADER, FRAG));
      g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) gl = null;
      else {
        g.useProgram(p);
        const buf = (data: number[], name: string) => {
          g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
          g.bufferData(g.ARRAY_BUFFER, new Float32Array(data), g.STATIC_DRAW);
          const a = g.getAttribLocation(p, name);
          g.enableVertexAttribArray(a);
          g.vertexAttribPointer(a, 2, g.FLOAT, false, 0, 0);
        };
        buf([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1], "position");
        buf([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1], "uv");
        for (const n of ["uTime", "uResolution", "uEdgeWidth", "uNoiseSpeed", "uGrainScale", "uGrainAmount"]) u[n] = g.getUniformLocation(p, n);
        g.bindTexture(g.TEXTURE_2D, g.createTexture());
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true);
        g.enable(g.BLEND);
        g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
      }
    }
    gc.style.opacity = gl ? "1" : "0";
    fc.style.opacity = gl ? "0" : "1";

    let dpr = 1, vw = 0, vh = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = Math.max(1, el.clientWidth);
      vh = Math.max(1, el.clientHeight);
      for (const c of [gc, fc, strip]) {
        c.width = Math.round(vw * dpr);
        c.height = Math.round(vh * dpr);
      }
      gl?.viewport(0, 0, gc.width, gc.height);
    };
    resize();

    let x = 0, tx = 0, slow = 1, hover = false, visible = true, last = performance.now(), raf = 0;
    let drag: { id: number; last: number } | null = null;
    const onDown = (e: PointerEvent) => {
      drag = { id: e.pointerId, last: e.clientX };
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      tx -= (e.clientX - drag.last) * 1.4;
      drag.last = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      el.style.cursor = "grab";
    };
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!visible) return;
      if (el.clientWidth !== vw || el.clientHeight !== vh) resize();
      if (vw < 2 || vh < 2) return;
      const h = vh, w = h * ratio, item = w + gap, n = imgs.length, total = Math.max(1, n * item);
      slow += ((hover || drag ? 0.15 : 1) - slow) * Math.min(1, dt * 4);
      if (!drag && !reduced) tx += speed * slow * dt;
      x += (tx - x) * (1 - Math.pow(1 - 0.18, dt * 60));
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, vw, vh);
      if (n) {
        let wr = x % total;
        if (wr < 0) wr += total;
        for (let base = -wr - total; base < vw + total; base += total)
          for (let i = 0; i < n; i++) {
            const px = base + i * item;
            if (px + w > 0 && px < vw) drawCard(sctx, imgs[i], px, 0, w, h, radius);
          }
      }
      if (gl) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, strip);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(u.uTime, reduced ? 0 : now * 0.001);
        gl.uniform2f(u.uResolution, gc.width, gc.height);
        gl.uniform1f(u.uEdgeWidth, Math.min(0.32, Math.max(0.12, (w / vw) * 0.7)));
        gl.uniform1f(u.uNoiseSpeed, 0.15);
        gl.uniform1f(u.uGrainScale, 250);
        gl.uniform1f(u.uGrainAmount, 0.1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        const f = fc.getContext("2d");
        if (!f) return;
        f.setTransform(1, 0, 0, 1, 0, 0);
        f.clearRect(0, 0, fc.width, fc.height);
        f.drawImage(strip, 0, 0);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [key, speed, gap, radius, ratio]);

  return (
    <div ref={root} aria-hidden className={`relative cursor-grab touch-pan-y select-none overflow-hidden ${className}`}>
      <canvas ref={glCanvas} className="pointer-events-none absolute inset-0 size-full" />
      <canvas ref={flatCanvas} className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}
