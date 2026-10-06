import Link from "next/link";
import CallButton from "@/components/seo/CallButton";
import { btn, container, h2Style } from "@/components/seo/ui";

const LINKS = [
  { href: "/services/site-vitrine", label: "Site vitrine" },
  { href: "/services/site-sur-mesure-nextjs", label: "Site sur-mesure" },
  { href: "/services/site-wordpress", label: "Site WordPress" },
  { href: "/creation-site-internet-seine-et-marne", label: "Seine-et-Marne" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/legal", label: "Mentions légales" },
];

/** Dark closing block: call to action, then a one-line footer. */
export default function SeoContact() {
  return (
    <footer id="contact" className="bg-[#111] text-[#f4f4f2]">
      <div className={`${container} flex flex-col gap-8`} style={{ paddingBlock: "clamp(64px,9vw,120px) clamp(40px,5vw,56px)" }}>
        <h2 className="max-w-[14ch]" style={{ ...h2Style, fontSize: "clamp(2.4rem,6vw,5rem)" }}>
          Un projet ? Parlons-en<span className="text-abcs-red">.</span>
        </h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <CallButton label="Réserver un appel gratuit →" className={btn.primaryDark} />
          <span className="text-[15px] text-[#f4f4f2]/65">Réponse sous 48 h · devis gratuit</span>
        </div>
        <div className="mt-[clamp(32px,6vw,72px)] flex flex-col gap-4 border-t border-[rgba(244,244,242,.12)] pt-6 text-[13px] text-[#f4f4f2]/60 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
          <span>© O&apos;LDEV · Brie-Comte-Robert (77)</span>
          <nav aria-label="Pages du site" className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[#f4f4f2]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
