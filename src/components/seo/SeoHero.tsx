import Link from "next/link";
import CallButton from "@/components/seo/CallButton";
import { btn, container, display } from "@/components/seo/ui";
import type { ServiceKey } from "@/lib/services";

type Props = {
  crumbs: { name: string; href?: string }[];
  title: string;
  intro: string[];
  stats: { v: string; l: string }[];
  ctaLabel: string;
  /** Offer pre-filled in the contact form. */
  service?: ServiceKey;
  secondary?: { href: string; label: string };
};

/** Breadcrumb, H1, then intro + buttons on the left and key figures on the right, under the home page's orange glow. */
export default function SeoHero({ crumbs, title, intro, stats, ctaLabel, service, secondary }: Props) {
  const all = [{ name: "Accueil", href: "/" }, ...crumbs];

  return (
    <section className="relative isolate overflow-hidden" style={{ paddingBlock: "clamp(48px,7vw,96px) clamp(56px,8vw,104px)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-[1] h-[clamp(320px,50vw,620px)] w-[min(1200px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[30px]"
        style={{ background: "radial-gradient(closest-side,rgba(255,59,0,.28),rgba(255,59,0,.08) 55%,rgba(255,59,0,0))" }}
      />
      <div className={`${container} flex flex-col gap-[clamp(28px,4vw,48px)]`}>
        <nav aria-label="Fil d’Ariane">
          <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-[14px] text-[#a0a0a0]">
            {all.map((c, i) => (
              <li key={c.name} className="flex gap-2">
                {c.href && i < all.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-white">{c.name}</Link>
                ) : (
                  <span aria-current="page" className="text-[#f4f4f2]">{c.name}</span>
                )}
                {i < all.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="max-w-[16ch] text-white" style={{ ...display, fontSize: "clamp(2.4rem,6.4vw,5.6rem)", lineHeight: 0.98, letterSpacing: "-.045em" }}>
          {title}
        </h1>

        <div className="grid gap-10 min-[900px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] min-[900px]:gap-16">
          <div className="flex max-w-[620px] flex-col gap-4">
            {intro.map((p) => (
              <p key={p} className="m-0 text-[17px] leading-[1.6] text-[#c8c8c8] text-pretty max-sm:text-[16px]">{p}</p>
            ))}
            <div className="flex flex-wrap gap-3 pt-3">
              <CallButton label={`${ctaLabel} ↗`} service={service} className={btn.primary} />
              {secondary && (
                <Link href={secondary.href} className={btn.secondary}>
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>

          <dl className="m-0 flex flex-col self-end">
            {stats.map((s) => (
              <div key={s.l} className="flex items-baseline justify-between gap-4 border-t border-white/10 py-4">
                <dt className="text-[14px] text-[#a0a0a0]">{s.l}</dt>
                <dd className="m-0 whitespace-nowrap text-[clamp(1.4rem,2.4vw,2rem)] leading-none text-white" style={{ ...display, fontWeight: 700 }}>
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
