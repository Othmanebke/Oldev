"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CallButton from "@/components/seo/CallButton";
import Logo from "@/components/brand/Logo";
import { btn, container } from "@/components/seo/ui";
import { PAGES } from "@/lib/pages";

/** Sticky, translucent dark header of the SEO pages (same black as the home page), current page highlighted. */
export default function SeoHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[.08] bg-black/80 backdrop-blur-[16px] backdrop-saturate-[170%]">
      <div className={`${container} flex h-16 items-center justify-between gap-6`}>
        <Link href="/" aria-label="O'LDEV — accueil" className="text-[#f4f4f2]">
          <Logo className="h-5" />
        </Link>
        <nav aria-label="Pages" className="hidden items-center gap-6 min-[1040px]:flex">
          {PAGES.map((p) => {
            const on = pathname === p.href;
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={on ? "page" : undefined}
                className={`relative whitespace-nowrap py-1 text-[14px] font-medium transition-colors ${on ? "text-white" : "text-[#a0a0a0] hover:text-white"}`}
              >
                {p.label}
                {on && <span aria-hidden className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-abcs-red" />}
              </Link>
            );
          })}
        </nav>
        <CallButton label="Réserver un appel ↗" className={btn.header} />
      </div>
    </header>
  );
}
