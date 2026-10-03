import Watermark from "@/components/fx/Watermark";

type Tone = "dark" | "light" | "bg";

const TONES: Record<Tone, { cls: string; wm: string; wm2: string; shadow: string }> = {
  dark:  { cls: "bg-abcs-black text-white",      wm: "rgba(255,255,255,0.08)", wm2: "rgba(255,59,0,0.22)", shadow: "0.5" },
  light: { cls: "bg-white text-abcs-black",      wm: "rgba(17,17,17,0.09)",    wm2: "rgba(255,59,0,0.18)", shadow: "0.35" },
  bg:    { cls: "bg-abcs-bg text-abcs-black",    wm: "rgba(17,17,17,0.08)",    wm2: "rgba(255,59,0,0.16)", shadow: "0.3" },
};

type Props = {
  tone: Tone;
  /** Stacking order — each card must be above the previous one (footer is 15). */
  z: number;
  watermark: string;
  watermark2?: string;
  dots?: boolean;
  id?: string;
  children: React.ReactNode;
};

/**
 * A rounded section card of the stack (see fx/StackEffect): overlaps the
 * previous card, which shrinks and darkens as this one slides over it.
 */
export default function StackCard({ tone, z, watermark, watermark2, dots, id, children }: Props) {
  const t = TONES[tone];
  return (
    <section
      id={id}
      data-stack
      className={`relative -mt-9 overflow-hidden rounded-t-[36px] md:-mt-16 md:rounded-t-[64px] ${t.cls}`}
      style={{
        zIndex: z,
        padding: "clamp(64px,9vw,120px) clamp(20px,5vw,72px) clamp(96px,10vw,140px)",
        boxShadow: `0 -30px 70px rgba(0,0,0,${t.shadow})`,
      }}
    >
      {dots && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(17,17,17,0.13) 1.2px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(180deg, black 0%, transparent 38%, transparent 72%, black 100%)",
            WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 38%, transparent 72%, black 100%)",
          }}
        />
      )}
      <Watermark text={watermark} stroke={t.wm} />
      {watermark2 && <Watermark variant="2" text={watermark2} stroke={t.wm2} />}
      <div className="relative z-[1] mx-auto flex max-w-[1200px] flex-col" style={{ gap: "clamp(40px,5vw,64px)" }}>
        {children}
      </div>
    </section>
  );
}
