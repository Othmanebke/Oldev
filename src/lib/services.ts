export type ServiceKey =
  | "vitrine"
  | "wordpress"
  | "webapp"
  | "refonte"
  | "logo"
  | "flyer"
  | "pack"
  | "chatbot_auto"
  | "chatbot_ia"
  | "autre";

export type Service = {
  /** Name in the contact form ("Service souhaité") and in the emails. */
  label: string;
  /** Displayed price: "Dès 300 €", "800 – 3 000 €", "30 €", "Sur devis". */
  price: string;
  /** Price range in euros, for offers with a public price (min = max for fixed prices). */
  min?: number;
  max?: number;
  category: "Web" | "Graphisme" | "IA & Automatisation" | "Autre";
};

/** Official prices (same as the flyers). */
export const SERVICES: Record<ServiceKey, Service> = {
  vitrine: { label: "Site vitrine", price: "Dès 300 €", min: 300, max: 800, category: "Web" },
  wordpress: { label: "WordPress", price: "800 – 3 000 €", min: 800, max: 3000, category: "Web" },
  webapp: { label: "Sur mesure Next.js", price: "1 200 – 5 000 €", min: 1200, max: 5000, category: "Web" },
  refonte: { label: "Refonte", price: "Sur devis", category: "Web" },
  logo: { label: "Logo", price: "30 €", min: 30, max: 30, category: "Graphisme" },
  flyer: { label: "Flyer", price: "45 €", min: 45, max: 45, category: "Graphisme" },
  pack: { label: "Pack logo + flyer", price: "65 €", min: 65, max: 65, category: "Graphisme" },
  chatbot_auto: { label: "Chatbot automatisé", price: "Sur devis", category: "IA & Automatisation" },
  chatbot_ia: { label: "Chatbot IA", price: "Sur devis", category: "IA & Automatisation" },
  autre: { label: "Autre", price: "Sur devis", category: "Autre" },
};

/** Budget ranges of the contact form, the same whatever the service. */
export const BUDGETS = ["Moins de 500 €", "500–1 000 €", "1 000–3 000 €", "3 000 € et +"];

/** Budget range holding the offer's entry price, to pre-select it in the form ("" for offers on quote). */
export function budgetFor(key: ServiceKey) {
  const min = SERVICES[key].min;
  if (min == null) return "";
  return BUDGETS[min < 500 ? 0 : min < 1000 ? 1 : min < 3000 ? 2 : 3];
}

/** True for offers priced on quote only ("Sur devis"). */
export const onQuote = (key: ServiceKey) => SERVICES[key].min == null;

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

/** "300 – 800 €", "30 €", or "Sur devis". */
export const priceRange = (key: ServiceKey) => {
  const { min, max, price } = SERVICES[key];
  if (min == null) return price;
  return max != null && max !== min ? `${min.toLocaleString("fr-FR")} – ${euros(max)}` : euros(min);
};

/** "1 200 €" — the entry price of an offer, or its plain price when it has none. */
export const fromPrice = (key: ServiceKey) => (SERVICES[key].min != null ? euros(SERVICES[key].min!) : SERVICES[key].price);

/** The three website offers, shown on the home page and on /services/*. */
export const PLANS: {
  key: ServiceKey; num: string; name: string; for: string; delay: string; revisions: string;
  included: string[]; excluded: string[];
  featured?: boolean;
}[] = [
  { key: "vitrine", num: "01", name: "Site vitrine one page", for: "Artisans · indépendants", delay: "1–2 sem.", revisions: "2 tours",
    included: ["1 page, jusqu’à 5 sections", "Formulaire de contact", "SEO de base", "Mise en ligne", "1 an de maintenance offert"],
    excluded: ["Domaine & hébergement (configuration incluse)", "Contenus : textes, photos, logo"] },
  { key: "webapp", num: "02", name: "Site sur mesure Next.js", for: "PME · startups", delay: "3–4 sem.", revisions: "3 tours", featured: true,
    included: ["Codé de zéro, design exclusif", "Ultra-performant (Next.js / React)", "Fonctionnalités spécifiques : espace client, réservation…", "Mise en ligne", "1 an de maintenance offert"],
    excluded: ["Domaine & hébergement (configuration incluse)", "Contenus : textes, photos, logo"] },
  { key: "wordpress", num: "03", name: "Site WordPress", for: "Blog · e-commerce", delay: "3–5 sem.", revisions: "3 tours",
    included: ["Site multi-pages", "Vous modifiez vos contenus vous-même", "Prise en main incluse", "Mise en ligne", "1 an de maintenance offert"],
    excluded: ["Domaine & hébergement (configuration incluse)", "Contenus : textes, photos, logo"] },
];

/** Conditions of the offers (flyers), by family. */
export const CONDITIONS: { title: string; items: string[] }[] = [
  {
    title: "Sites web",
    items: [
      "1 an de maintenance offert : mises à jour, sécurité, sauvegardes + 1 petite modif par mois. Au-delà : payant.",
      "Domaine et hébergement non inclus, je m’occupe de la configuration.",
      "Contenus (textes, photos, logo) fournis par vous.",
      "Paiement à la livraison du site, en 1 fois ou en 3 fois sans frais.",
    ],
  },
  {
    title: "Graphisme",
    items: [
      "Jusqu’à 3 retouches incluses.",
      "Fichiers livrés en PNG et PDF haute définition.",
      "Délai : 48 à 72 h après validation du brief.",
      "Impression non incluse. Paiement à la commande.",
    ],
  },
  {
    title: "IA & automatisation",
    items: [
      "Compatible WordPress, Next.js ou votre site existant.",
      "Chatbot automatisé : des parcours prévus à l’avance selon votre activité (conseils, prise de RDV, envoi d’e-mails). Aucun coût IA.",
      "Chatbot IA : comprend toutes les questions écrites librement et répond comme vous, 24 h/24. Coût d’usage IA en plus, payé à part.",
      "Sur devis, devis gratuit.",
    ],
  },
];

export const FAQ = [
  { q: "Comment est fixé le prix ?", a: "Chaque offre affiche son prix ou sa fourchette de prix. Le prix final est fixé dans un devis gratuit, envoyé en 24 h, selon votre projet : une fois signé, il ne bouge plus. La refonte et les chatbots sont sur devis." },
  { q: "L’hébergement est-il inclus ?", a: "Non, le nom de domaine et l’hébergement ne sont pas inclus, mais je m’occupe de toute la configuration." },
  { q: "Puis-je payer en plusieurs fois ?", a: "Oui : le site se paie à la livraison, en une fois ou en 3 fois sans frais. Le graphisme (logo, flyer) se paie à la commande." },
  { q: "Qui fournit les textes et les photos ?", a: "Vous : les contenus (textes, photos, logo) sont fournis par le client. Pas encore de logo ? Je peux le créer pour 30 €." },
  { q: "Le site m’appartient-il ?", a: "Oui, entièrement. Code, contenus et accès vous sont transmis à la livraison." },
  { q: "Et après la livraison ?", a: "La première année de maintenance est offerte sur tous les sites : mises à jour, sécurité, sauvegardes et une petite modification par mois. Au-delà, la maintenance est payante." },
];

export const SERVICE_GROUPS: { label: string; keys: ServiceKey[] }[] = [
  { label: "Sites web", keys: ["vitrine", "wordpress", "webapp", "refonte"] },
  { label: "Graphisme", keys: ["logo", "flyer", "pack"] },
  { label: "IA & automatisation", keys: ["chatbot_auto", "chatbot_ia"] },
  { label: "Autre", keys: ["autre"] },
];
