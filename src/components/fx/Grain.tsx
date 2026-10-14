const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Film grain + vignette pinned to the viewport while its (relative) parent scrolls by. */
export default function Grain() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-[-20%] opacity-[.09]" style={{ backgroundImage: NOISE, backgroundSize: "220px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 50%,transparent 50%,rgba(0,0,0,.6) 100%)" }} />
      </div>
    </div>
  );
}
