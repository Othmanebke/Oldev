import Link from "next/link";
import CallButton from "@/components/seo/CallButton";
import Logo from "@/components/brand/Logo";
import { btn, container } from "@/components/seo/ui";

const LINKS = [
  { href: "/services/site-vitrine", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
];

/** Sticky, translucent dark header of the SEO pages (same black as the home page). */
export default function SeoHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-[12px]">
      <div className={`${container} flex h-16 items-center justify-between gap-6`}>
        <Link
          href="/"
          aria-label="O'LDEV — accueil"
          className="text-[#f4f4f2]"
        >
          <Logo className="h-5" />
        </Link>
        <nav aria-label="Pages" className="hidden items-center gap-7 min-[760px]:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] font-medium text-white/60 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <CallButton label="Réserver un appel →" className={btn.header} />
      </div>
    </header>
  );
}
