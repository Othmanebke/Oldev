import Image from "next/image";
import SectionHeader from "@/components/fx/SectionHeader";
import ScrollWords from "@/components/fx/ScrollWords";
import avatarPointing from "@/img/avatar-pointing.webp";

// Three marquee rows — each row moves in alternating directions
const ROWS = [
  {
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "HTML / CSS", "JavaScript"],
    dir: 1,
    speed: 22,
    style: "plain", // text only
  },
  {
    items: ["Node.js", "PostgreSQL", "Supabase", "Vercel", "REST API", "Figma", "Adobe CC", "Canva Pro"],
    dir: -1,
    speed: 18,
    style: "pill", // bordered pills
  },
  {
    items: ["ServiceNow", "WordPress", "Git / GitHub", "IA / OpenAI", "Zapier", "UX Design", "ITIL", "Glide"],
    dir: 1,
    speed: 26,
    style: "accent", // some in red
  },
] as const;

const STATS = [
  { val: "20+",   label: "Technologies" },
  { val: "10+",   label: "Projets livrés" },
  { val: "5 ans", label: "D'expérience" },
  { val: "100%",  label: "Satisfaction" },
];

const BIO = [
  { text: "Moi c'est Othmane. Je conçois et développe des sites qui" },
  { text: "bougent, convertissent", className: "font-light italic tracking-[-0.03em]" },
  { text: "et font plaisir à utiliser. Pensés dans Figma, codés à la main, faits en Seine-et-Marne et dans toute la" },
  { text: "France.", className: "text-abcs-red" },
];

function Marquee({ items, dir, speed, style: rowStyle }: (typeof ROWS)[number]) {
  const doubled = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden py-2"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div
        className="flex w-max items-center will-change-transform"
        style={{ animation: `${dir === 1 ? "mq-l" : "mq-r"} ${speed}s linear infinite` }}
      >
        {doubled.map((item, i) => {
          const isAccent = rowStyle === "accent" && i % 3 === 0;
          const isPill = rowStyle === "pill";
          return (
            <span key={i} className="flex shrink-0 items-center">
              <span
                className={`
                  font-heading uppercase tracking-[-0.025em] select-none whitespace-nowrap transition-colors duration-300
                  ${rowStyle === "plain" ? "text-white/50 hover:text-white/80" : ""}
                  ${isPill ? "text-white/35 hover:text-white/65 border border-white/15 hover:border-white/35 mx-2" : ""}
                  ${rowStyle === "accent" && !isAccent ? "text-white/45 hover:text-white/75" : ""}
                  ${isAccent ? "text-abcs-red" : ""}
                `}
                style={{
                  fontSize:
                    rowStyle === "plain" ? "clamp(3rem,5vw,4.5rem)" : isPill ? "clamp(1.875rem,3.5vw,3rem)" : "clamp(2.25rem,4vw,3.75rem)",
                  padding: isPill ? "6px clamp(20px,2vw,28px)" : "0 clamp(20px,2vw,28px)",
                }}
              >
                {item}
              </span>
              {!isPill && (
                <span
                  aria-hidden
                  className={`mx-1 shrink-0 font-bold ${isAccent ? "text-white/15" : "text-abcs-red/40"}`}
                  style={{ fontSize: "clamp(1.5rem,2vw,1.875rem)" }}
                >
                  ·
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Stack + who I am: tech marquees, key figures and a bio lit word by word on scroll. */
export function AboutSection() {
  return (
    <section
      id="about"
      data-stack
      className="relative z-[12] -mt-9 md:-mt-16 w-full overflow-hidden rounded-t-[36px] md:rounded-t-[64px] bg-abcs-deep text-white shadow-[0_-30px_70px_rgba(0,0,0,0.85)]"
      style={{ padding: "clamp(64px,9vw,120px) 0 clamp(150px,13vw,200px)" }}
    >
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <SectionHeader
        tone="dark"
        num="03"
        title={["À propos", "& stack"]}
        intro="20+ technologies maîtrisées, du frontend au déploiement, du design au no-code."
        aside="Bac+5 · 5 ans"
        className="relative z-[1]"
        style={{ padding: "0 clamp(20px,5vw,72px)" }}
      />

      {/* ── Marquee rows ─────────────────────────────────────────── */}
      <div className="relative z-[1] flex flex-col gap-1" style={{ marginTop: "clamp(56px,6vw,96px)" }}>
        {ROWS.map((row, i) => (
          <Marquee key={i} {...row} />
        ))}
      </div>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div
        className="relative z-[1] grid gap-8 border-t border-white/10 pt-10"
        style={{
          margin: "clamp(64px,6vw,80px) clamp(20px,5vw,90px) 0",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))",
        }}
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5">
            <span className="font-heading leading-none text-white" style={{ fontSize: "clamp(2.25rem,4vw,3rem)" }}>
              {s.val}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/45">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Bio, lit word by word ────────────────────────────────── */}
      <div className="relative z-[1]" style={{ padding: "clamp(96px,10vw,160px) clamp(20px,8vw,160px) 0" }}>
        <ScrollWords
          parts={BIO}
          className="m-0 max-w-[1500px] font-medium leading-[1.08] tracking-[-0.045em] text-[#f4f4f2] xl:pr-[200px]"
          style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontStretch: "82%", fontSize: "clamp(2.2rem,5vw,6.2rem)" }}
        />
        <p className="sr-only">
          Développeur web freelance avec 5 ans d&apos;expérience (Inetum, Fujitsu, AJC), diplômé d&apos;un Bac+5 Expert
          Informatique Web. Basé à Brie-Comte-Robert, en Seine-et-Marne (Île-de-France).
        </p>
      </div>

      {/* Avatar in the bottom-right corner, pointing at the text (wide screens only) */}
      <Image
        src={avatarPointing}
        alt=""
        aria-hidden
        sizes="200px"
        className="pointer-events-none absolute bottom-[clamp(60px,6vw,100px)] right-[clamp(20px,5vw,72px)] z-[1] hidden h-[clamp(240px,17vw,320px)] w-auto select-none xl:block"
      />
    </section>
  );
}
