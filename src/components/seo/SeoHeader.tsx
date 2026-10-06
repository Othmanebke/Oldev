import Link from "next/link";
import CallButton from "@/components/seo/CallButton";
import { btn, container } from "@/components/seo/ui";

const LINKS = [
  { href: "/services/site-vitrine", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
];

/** Sticky, translucent header of the SEO pages. */
export default function SeoHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(17,17,17,.12)] bg-[rgba(244,244,242,.86)] backdrop-blur-[12px]">
      <div className={`${container} flex h-16 items-center justify-between gap-6`}>
        <Link
          href="/"
          aria-label="O'LDEV — accueil"
          className="text-[24px] uppercase leading-none text-[#111]"
          style={{ fontFamily: "var(--font-archivo-flex), sans-serif", fontWeight: 900, fontStretch: "62%" }}
        >
          O&apos;LDEV<span className="text-abcs-red">.</span>
        </Link>
        <nav aria-label="Pages" className="hidden items-center gap-7 min-[760px]:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] font-medium text-[#555] transition-colors hover:text-[#111]">
              {l.label}
            </Link>
          ))}
        </nav>
        <CallButton label="Réserver un appel →" className={btn.dark} />
      </div>
    </header>
  );
}
