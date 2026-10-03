import { SERVICES, type ServiceKey } from "@/lib/services";
import { EMAIL, LOCATION, OWNER, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIALS } from "@/lib/site";

const OFFERS: ServiceKey[] = ["vitrine", "webapp", "wordpress", "branding_canva", "refonte", "chatbot_ia"];

/** "Dès 1 200€" or "2 500€" → the number ; "Sur devis" → undefined */
const minPrice = (price: string) => {
  const n = parseInt(price.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : undefined;
};

/** schema.org graph for the home page (Person + ProfessionalService + WebSite). */
export function homeJsonLd() {
  const person = `${SITE_URL}/#person`;
  const business = `${SITE_URL}/#business`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": person,
        name: OWNER,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image.png`,
        jobTitle: "Développeur web freelance",
        email: `mailto:${EMAIL}`,
        sameAs: SOCIALS.map((s) => s.href),
        knowsAbout: ["Next.js", "React", "TypeScript", "WordPress", "WooCommerce", "Tailwind CSS", "Node.js", "SEO", "ServiceNow"],
        worksFor: { "@id": business },
      },
      {
        "@type": "ProfessionalService",
        "@id": business,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image.png`,
        logo: `${SITE_URL}/icon.png`,
        email: EMAIL,
        founder: { "@id": person },
        address: {
          "@type": "PostalAddress",
          addressLocality: LOCATION.city,
          postalCode: LOCATION.postalCode,
          addressRegion: LOCATION.region,
          addressCountry: LOCATION.country,
        },
        areaServed: [
          { "@type": "Country", name: "France" },
          { "@type": "AdministrativeArea", name: LOCATION.region },
        ],
        currenciesAccepted: "EUR",
        makesOffer: OFFERS.map((key) => {
          const s = SERVICES[key];
          const min = minPrice(s.price);
          const max = s.max ? minPrice(s.max) : undefined;
          return {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.label },
            ...(min !== undefined && {
              priceSpecification: { "@type": "PriceSpecification", minPrice: min, ...(max && { maxPrice: max }), priceCurrency: "EUR" },
            }),
          };
        }),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "fr-FR",
        publisher: { "@id": business },
      },
    ],
  };
}

/** schema.org BreadcrumbList, starting from the home page. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** schema.org Service offered by the business declared in homeJsonLd(). */
export function serviceJsonLd({ key, name, description, path }: { key: ServiceKey; name: string; description: string; path: string }) {
  const min = minPrice(SERVICES[key].price);
  const max = SERVICES[key].max ? minPrice(SERVICES[key].max) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "AdministrativeArea", name: LOCATION.region },
    ],
    ...(min !== undefined && {
      offers: { "@type": "Offer", priceSpecification: { "@type": "PriceSpecification", minPrice: min, ...(max && { maxPrice: max }), priceCurrency: "EUR" } },
    }),
  };
}
