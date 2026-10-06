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

/** Breadcrumb, H1, then intro + buttons on the left and key figures on the right. */
export default function SeoHero({ crumbs, title, intro, stats, ctaLabel, service, secondary }: Props) {
  const all = [{ name: "Accueil", href: "/" }, ...crumbs];

  return (
    <section style={{ paddingBlock: "clamp(40px,6vw,80px) clamp(56px,8vw,104px)" }}>
      <div className={`${container} flex flex-col gap-[clamp(28px,4vw,48px)]`}>
        <nav aria-label="Fil d’Ariane">
          <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-[13px] text-[#666]">
            {all.map((c, i) => (
              <li key={c.name} className="flex gap-2">
                {c.href && i < all.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-[#111]">{c.name}</Link>
                ) : (
                  <span aria-current="page" className="text-[#111]">{c.name}</span>
                )}
                {i < all.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="max-w-[15ch] text-[#111]" style={{ ...display, fontSize: "clamp(2.6rem,7.4vw,6.8rem)", lineHeight: 0.95 }}>
          {title}
          <span className="text-abcs-red">.</span>
        </h1>

        <div className="grid gap-10 min-[900px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] min-[900px]:gap-16">
          <div className="flex max-w-[620px] flex-col gap-4">
            {intro.map((p) => (
              <p key={p} className="m-0 text-[17px] leading-[1.6] text-[#555] text-pretty">{p}</p>
            ))}
            <div className="flex flex-wrap gap-3 pt-3">
              <CallButton label={`${ctaLabel} →`} service={service} className={btn.primary} />
              {secondary && (
                <Link href={secondary.href} className={btn.secondary}>
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>

          <dl className="m-0 flex flex-col self-end">
            {stats.map((s) => (
              <div key={s.l} className="flex items-baseline justify-between gap-4 border-t border-[rgba(17,17,17,.12)] py-4">
                <dt className="text-[14px] text-[#666]">{s.l}</dt>
                <dd className="m-0 whitespace-nowrap text-[clamp(1.4rem,2.4vw,2rem)] leading-none text-[#111]" style={{ ...display, fontWeight: 700 }}>
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
