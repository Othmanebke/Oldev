export type ServiceKey =
  | "branding_canva"
  | "branding_adobe"
  | "vitrine"
  | "webapp"
  | "wordpress"
  | "refonte"
  | "chatbot_ia";

export type Service = {
  label: string;
  price: string;
  /** Price with every option, for offers sold as a range. */
  max?: string;
  budgets: string[];
  category: "Design & Print" | "Web" | "IA & Automatisation";
};

export const SERVICES: Record<ServiceKey, Service> = {
  branding_canva: {
    label: "Flyer, Logo & Design Graphique (Canva)",
    price: "Dès 50€",
    budgets: ["50–100€", "100–200€", "+ de 200€"],
    category: "Design & Print",
  },
  branding_adobe: {
    label: "Identité Visuelle & Logo (Adobe CC)",
    price: "Dès 100€",
    budgets: ["100–250€", "250–500€", "+ de 500€"],
    category: "Design & Print",
  },
  vitrine: {
    label: "Site Vitrine & Landing Page",
    price: "Dès 300€",
    max: "600€",
    budgets: ["300–400€", "400–500€", "500–600€"],
    category: "Web",
  },
  webapp: {
    label: "Site & Application Web Sur-Mesure",
    price: "Sur devis",
    budgets: ["800–3 000€", "+ de 3 000€"],
    category: "Web",
  },
  wordpress: {
    label: "Site WordPress Clé en Main",
    price: "Sur devis",
    budgets: ["1 200–1 800€", "1 800–2 500€"],
    category: "Web",
  },
  refonte: {
    label: "Refonte & Modernisation Web",
    price: "Sur devis",
    budgets: ["< 800€", "800–1 500€", "+ de 1 500€"],
    category: "Web",
  },
  chatbot_ia: {
    label: "Intégration Chatbot IA & Automatisation",
    price: "Sur devis",
    budgets: ["< 1 000€", "1 000–2 500€", "+ de 2 500€"],
    category: "IA & Automatisation",
  },
};

/** True for offers priced on quote only ("Sur devis"). */
export const onQuote = (key: ServiceKey) => /devis/i.test(SERVICES[key].price);

/** "Dès 300€" → "300€" */
export const startPrice = (key: ServiceKey) => SERVICES[key].price.replace(/^dès\s*/i, "");

/** "300 – 600€" for ranged offers, otherwise the plain price ("Dès 50€", "Sur devis"). */
export const priceRange = (key: ServiceKey) => {
  const s = SERVICES[key];
  return s.max ? `${startPrice(key).replace("€", "")} – ${s.max}` : s.price;
};

/** The three main offers, shown on the home page and on /services/*. */
export const PLANS: {
  key: ServiceKey; num: string; name: string; for: string; delay: string; revisions: string;
  included: string[]; excluded: string[];
  /** What moves the price from the base towards the max. */
  options: string[];
  featured?: boolean;
}[] = [
  { key: "vitrine", num: "01", name: "Site vitrine", for: "Artisans · indépendants", delay: "1–2 sem.", revisions: "2 tours",
    included: ["One-page responsive", "Formulaire de contact", "SEO de base + Google Maps", "Mise en ligne"], excluded: ["Hébergement & domaine"],
    options: ["Identité visuelle (logo, couleurs)", "Animations", "Page de chargement", "Sections ou pages supplémentaires", "Rédaction des textes"] },
  { key: "webapp", num: "02", name: "Site sur-mesure", for: "PME · startups", delay: "3–4 sem.", revisions: "3 tours", featured: true,
    included: ["Design exclusif multi-pages", "Next.js / React, Lighthouse 90+", "SEO technique avancé", "Animations sur-mesure"], excluded: ["Rédaction des contenus"],
    options: ["Pages supplémentaires", "Animations avancées", "Espace client / connexion", "Paiement en ligne", "Intégrations (API, CRM)", "Chatbot IA"] },
  { key: "wordpress", num: "03", name: "WordPress clé en main", for: "Blog · e-commerce", delay: "3–5 sem.", revisions: "3 tours",
    included: ["Jusqu’à 5 pages 100 % administrables", "Thème personnalisé à votre image", "Blog, formulaire de contact, SEO de base", "Formation à l’admin (1 h) + mise en ligne"], excluded: ["Licences premium"],
    options: ["Boutique WooCommerce + paiement en ligne", "Pages supplémentaires", "Intégration de produits", "Réservation en ligne", "Site multilingue", "Design 100 % sur-mesure"] },
];

export const FAQ = [
  { q: "Comment est fixé le prix ?", a: "Chaque offre affiche un prix d’appel qui correspond à la formule de base : un prix d’appel est indiqué, le prix final est fixé au devis selon votre projet. Il évolue selon les options choisies (animations, pages supplémentaires, fonctionnalités…), comme une voiture avec des options. Vous recevez un devis détaillé après notre premier échange : une fois signé, le prix ne bouge plus." },
  { q: "L’hébergement est-il inclus ?", a: "Non, mais je m’en occupe : je vous conseille une offre adaptée et je fais la mise en ligne." },
  { q: "Puis-je payer en plusieurs fois ?", a: "Oui : en une seule fois ou en plusieurs fois, jusqu’à 3 versements." },
  { q: "Le site m’appartient-il ?", a: "Oui, entièrement. Code, contenus et accès vous sont transmis à la livraison." },
  { q: "Et après la livraison ?", a: "La première année de maintenance est offerte : mises à jour, sauvegardes et correctifs. Ensuite, maintenance mensuelle optionnelle, petites modifications comprises." },
];

export const SERVICE_GROUPS: { label: string; keys: ServiceKey[] }[] = [
  { label: "Création Web", keys: ["vitrine", "webapp", "wordpress", "refonte"] },
  { label: "Design & Identité Visuelle", keys: ["branding_canva", "branding_adobe"] },
  { label: "IA & Automatisation", keys: ["chatbot_ia"] },
];

export function getBudgets(serviceLabel: string): string[] {
  // Direct match or partial match
  const entry =
    Object.values(SERVICES).find((s) => s.label === serviceLabel) ||
    Object.values(SERVICES).find((s) => serviceLabel.includes(s.label) || s.label.includes(serviceLabel));
  return entry?.budgets ?? ["300€", "500–1 000€", "+ de 1 000€"];
}

// TODO: ajuster les prix d'appel affichés sur la page d'accueil (en euros).
export const PRICE_FROM: Partial<Record<ServiceKey, number>> = {
  vitrine: 300,
  webapp: 800, // TODO: confirmer
  wordpress: 1200, // TODO: confirmer
};

/** "1 200 €" — the entry price of an offer, or its plain price when it has none. */
export const fromPrice = (key: ServiceKey) =>
  PRICE_FROM[key] != null ? `${PRICE_FROM[key]!.toLocaleString("fr-FR")} €` : SERVICES[key].price;

/** "À partir de 1 200 €" */
export const fromLabel = (key: ServiceKey) => (PRICE_FROM[key] != null ? `À partir de ${fromPrice(key)}` : SERVICES[key].price);
