/** 3D tilt following the mouse + orange glare (fine pointers, motion allowed). */
const canTilt = () =>
  window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function tiltMove(e: React.MouseEvent<HTMLElement>) {
  if (!canTilt()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.transition = "transform .15s ease-out";
  el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-6px)`;
  const g = el.querySelector<HTMLElement>("[data-glare]");
  if (g) {
    g.style.opacity = "1";
    g.style.background = `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(255,59,0,0.16), transparent 60%)`;
  }
}

export function tiltLeave(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  if (!el.style.transform) return;
  el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
  el.style.transform = "";
  const g = el.querySelector<HTMLElement>("[data-glare]");
  if (g) g.style.opacity = "0";
}

