import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

/** Share image (src/app/opengraph-image.png), set explicitly so pages that define their own openGraph keep it. */
export const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Othmane Bouakline — développeur web freelance (othledev)",
};

/** Metadata for an inner page: its own title, description, canonical, Open Graph and Twitter card. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME, url: path, title: full, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}
