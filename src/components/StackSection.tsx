"use client";

import SectionTitle from "@/components/fx/SectionTitle";
import Watermark from "@/components/fx/Watermark";
import { useContactModal } from "@/components/ContactModalProvider";
import { PLANS, SERVICES, type ServiceKey } from "@/lib/services";
import { section, sectionPad } from "@/components/sections/layout";

// Three marquee rows, alternating directions
const ROWS = [
  {
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "HTML / CSS", "JavaScript"],
    animation: "mq-l 22s linear infinite",
    style: "plain",
  },
  {
    items: ["Node.js", "PostgreSQL", "Supabase", "Vercel", "REST API", "Figma", "Adobe CC", "Canva Pro"],
    animation: "mq-r 18s linear infinite",
    style: "pill",
  },
  {
    items: ["ServiceNow", "WordPress", "Git / GitHub", "IA / OpenAI", "Zapier", "UX Design", "ITIL", "Glide"],
    animation: "mq-l 26s linear infinite",
    style: "accent",
  },
] as const;

const SIZE = { plain: "clamp(3rem,5vw,4.5rem)", pill: "clamp(1.875rem,3.5vw,3rem)", accent: "clamp(2.25rem,4vw,3.75rem)" };

const ALSO: { key: ServiceKey; label: string }[] = [
  { key: "refonte", label: "Refonte" },
  { key: "branding_canva", label: "Logo & flyer" },
  { key: "chatbot_ia", label: "Chatbot IA" },
];

function Marquee({ items, animation, style: kind }: (typeof ROWS)[number]) {
  return (
    <div
      aria-hidden
      className="w-full overflow-hidden py-2"
      style={{
        maskImage: "linear-gradient(to right,transparent,black 6%,black 94%,transparent)",
        WebkitMaskImage: "linear-gradient(to right,transparent,black 6%,black 94%,transparent)",
      }}
    >
      <div className="flex w-max items-center will-change-transform" style={{ animation }}>
        {[...items, ...items].map((item, i) => {
          const accent = kind === "accent" && i % 3 === 0;
          const pill = kind === "pill";
          return (
            <span key={i} className="flex shrink-0 items-center">
              <span
                className={`select-none whitespace-nowrap font-heading uppercase tracking-[-0.025em] ${
                  pill
                    ? "mx-2 border border-white/15 text-white/35"
                    : accent
                      ? "text-abcs-red"
                      : kind === "plain"
                        ? "text-white/50"
                        : "text-white/45"
                }`}
                style={{ fontSize: SIZE[kind], padding: pill ? "6px clamp(20px,2vw,28px)" : "0 clamp(20px,2vw,28px)" }}
              >
                {item}
              </span>
              {!pill && (
                <span className="mx-1 shrink-0 font-bold text-[rgba(255,59,0,.4)]" style={{ fontSize: "clamp(1.5rem,2vw,1.875rem)" }}>
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

/** Tech marquees + the offers as a list, each one starting a project. */
export default function StackSection() {
  const { openModal } = useContactModal();
  const choose = (key: ServiceKey) => openModal({ type: SERVICES[key].label, budget: SERVICES[key].budgets[0] });
  const box = "relative z-[1] mx-auto w-full max-w-[1424px]";

  return (
    <section id="stack" className={section} style={sectionPad}>
      <Watermark text="Stack" index={1} />
      <div className={box}>
        <SectionTitle
          top="Stack"
          word="Technique"
          count="(20+)"
          intro="20+ technologies maîtrisées, du frontend au déploiement, du design au no-code."
          mark="du frontend au déploiement"
          aside="Front → Prod®"
        />
      </div>

      <div className="relative z-[1] flex flex-col gap-1" style={{ margin: "clamp(48px,6vw,88px) calc(-1 * clamp(20px,5vw,72px)) 0" }}>
        {ROWS.map((row, i) => (
          <Marquee key={i} {...row} />
        ))}
      </div>

      <div className={`${box} flex flex-col`} style={{ marginTop: "clamp(48px,6vw,88px)" }}>
        <ul className="m-0 list-none border-t border-white/[.14] p-0">
          {PLANS.map((p) => (
            <li key={p.key} className="grid items-center gap-x-6 gap-y-4 border-b border-white/[.14] py-[clamp(20px,2.6vw,32px)] min-[760px]:grid-cols-[auto_1fr_auto]">
              <span className="font-mono text-[14px] text-white/60">{p.num}</span>
              <span className="flex flex-col gap-1">
                <span className="text-[15px] text-white/60">{p.for}</span>
                <span className="leading-[1] tracking-[-.03em]" style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 600, fontSize: "clamp(1.8rem,4vw,3.4rem)" }}>
                  {p.name}
                </span>
              </span>
              <button
                onClick={() => choose(p.key)}
                className="justify-self-start whitespace-nowrap rounded-full bg-abcs-red px-6 py-3.5 text-[14px] font-bold text-white transition-colors duration-[250ms] hover:bg-[#f4f4f2] hover:text-[#111] min-[760px]:justify-self-end"
              >
                Démarrer un projet ↗
              </button>
            </li>
          ))}
        </ul>
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 pt-5 text-[15px] text-white/60">
          Aussi :
          {ALSO.map((a, i) => (
            <span key={a.key}>
              <button onClick={() => choose(a.key)} className="text-[#f4f4f2] transition-colors hover:text-abcs-red">
                {a.label}
              </button>
              {i < ALSO.length - 1 ? " ·" : " →"}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
