import type { MetadataRoute } from "next";
import { SERVICE_PAGES } from "@/lib/seoPages";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    ...SERVICE_PAGES.map((p) => ({ url: `${SITE_URL}/services/${p.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${SITE_URL}/creation-site-internet-seine-et-marne`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/realisations`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/legal`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
