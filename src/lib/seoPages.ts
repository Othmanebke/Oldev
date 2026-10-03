/** Copy for the SEO landing pages (/services/*, /creation-site-internet-seine-et-marne). */

import type { ProjectTag } from "@/lib/projects";
import type { ServiceKey } from "@/lib/services";

export type Faq = { q: string; a: string };

export type ServicePage = {
  slug: string;
  key: ServiceKey;
  /** <title> — the template adds " | O'ldev". */
  metaTitle: string;
  metaDescription: string;
  /** Short name for links and breadcrumbs. */
  name: string;
  h1: string;
  intro: string[];
  audience: { title: string; text: string }[];
  /** Projects shown as examples. */
  tag: ProjectTag;
  faq: Faq[];
};

/** Same for every offer: how a project runs, from first call to launch. */
export const STEPS = [
  { title: "Appel découverte", text: "15 minutes au téléphone pour comprendre votre activité, vos objectifs et votre budget. Gratuit, sans engagement." },
  { title: "Devis détaillé", text: "Un prix ferme, un délai et la liste de ce qui est inclus. Vous savez exactement ce que vous payez." },
  { title: "Design", text: "Une maquette de votre site, que l’on ajuste ensemble avant de passer au développement." },
  { title: "Développement", text: "Je construis le site, responsive et optimisé pour Google, avec des tours de révision prévus au devis." },
  { title: "Mise en ligne", text: "Je m’occupe de la mise en ligne, du référencement de base et je vous transmets tous les accès." },
];

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "site-vitrine",
    key: "vitrine",
    metaTitle: "Création de site vitrine pour artisans et indépendants",
    metaDescription:
      "Création de site vitrine responsive dès 300 € : formulaire de contact, SEO de base, Google Maps et mise en ligne en 1 à 2 semaines. Développeur web freelance en Seine-et-Marne.",
    name: "Site vitrine",
    h1: "Création de site vitrine",
    intro: [
      "Un site vitrine, c’est votre carte de visite sur Google : il présente votre activité, rassure vos futurs clients et leur donne un moyen simple de vous contacter.",
      "Je crée des sites vitrines rapides et responsives pour les artisans, commerçants et indépendants, livrés en 1 à 2 semaines, à partir de 300 €.",
    ],
    audience: [
      { title: "Artisans & commerçants", text: "Présentez vos prestations, vos horaires et votre zone d’intervention, avec un accès direct à l’itinéraire Google Maps." },
      { title: "Indépendants & professions libérales", text: "Un site clair qui inspire confiance et transforme les visiteurs en demandes de contact." },
      { title: "Lancement d’activité", text: "Une présence en ligne professionnelle dès le premier jour, sans budget démesuré." },
    ],
    tag: "html",
    faq: [
      { q: "Combien coûte un site vitrine ?", a: "À partir de 300 € pour un site one-page responsive avec formulaire de contact, SEO de base et mise en ligne. Le devis final dépend du nombre de sections et des fonctionnalités souhaitées." },
      { q: "En combien de temps mon site est-il en ligne ?", a: "Comptez 1 à 2 semaines entre la validation du devis et la mise en ligne, avec 2 tours de révision inclus." },
      { q: "Mon site sera-t-il visible sur Google ?", a: "Oui : le SEO de base est inclus (balises, structure, vitesse, sitemap) ainsi que l’intégration Google Maps. Je peux aussi vous aider à créer votre fiche Google Business Profile." },
    ],
  },
  {
    slug: "site-sur-mesure-nextjs",
    key: "webapp",
    metaTitle: "Site web sur-mesure Next.js / React",
    metaDescription:
      "Site web sur-mesure en Next.js / React dès 800 € : design exclusif multi-pages, score Lighthouse 90+, SEO technique avancé et 1 mois de maintenance offert.",
    name: "Site sur-mesure Next.js",
    h1: "Site web sur-mesure en Next.js",
    intro: [
      "Pour les PME et startups qui veulent un site qui sort du lot : un design exclusif, des pages qui s’affichent instantanément et un référencement technique soigné.",
      "Je développe vos sites et applications web avec Next.js et React, les technologies utilisées par les plus grandes marques du web, à partir de 800 €.",
    ],
    audience: [
      { title: "PME", text: "Un site multi-pages à votre image, pensé pour convertir et facile à faire évoluer avec votre entreprise." },
      { title: "Startups", text: "Landing page, site produit ou application web : une base technique solide pour lancer et itérer vite." },
      { title: "Projets ambitieux", text: "Espace client, tableau de bord, catalogue, intégrations API : des fonctionnalités développées sur-mesure." },
    ],
    tag: "nextjs",
    faq: [
      { q: "Pourquoi choisir Next.js plutôt que WordPress ?", a: "Next.js offre des performances et une sécurité supérieures, et une liberté totale sur le design et les fonctionnalités. WordPress reste idéal si vous voulez modifier vous-même tous vos contenus." },
      { q: "Combien coûte un site sur-mesure ?", a: "À partir de 800 € pour un site multi-pages au design exclusif. Le prix dépend du nombre de pages et des fonctionnalités : vous recevez un devis détaillé après notre premier échange." },
      { q: "Quel est le délai de réalisation ?", a: "En général 3 à 4 semaines, avec 3 tours de révision et 1 mois de maintenance offert après la mise en ligne." },
    ],
  },
  {
    slug: "site-wordpress",
    key: "wordpress",
    metaTitle: "Création de site WordPress et boutique WooCommerce",
    metaDescription:
      "Création de site WordPress clé en main dès 1 200 € : site 100 % administrable, boutique WooCommerce, paiement en ligne et formation à l’administration incluse.",
    name: "Site WordPress",
    h1: "Création de site WordPress",
    intro: [
      "Un site WordPress clé en main que vous gérez vous-même : textes, photos, articles de blog et produits, sans toucher une ligne de code.",
      "Je crée des sites WordPress et des boutiques WooCommerce pour les entreprises, associations et e-commerçants, à partir de 1 200 €, avec une formation à l’administration incluse.",
    ],
    audience: [
      { title: "E-commerce", text: "Une boutique WooCommerce avec catalogue, panier et paiement en ligne sécurisé." },
      { title: "Blogs & contenus", text: "Publiez vos articles et actualités en autonomie pour nourrir votre référencement." },
      { title: "Entreprises & associations", text: "Un site corporate complet que vos équipes peuvent mettre à jour facilement." },
    ],
    tag: "wordpress",
    faq: [
      { q: "Pourrai-je modifier mon site moi-même ?", a: "Oui, c’est tout l’intérêt de WordPress : le site est 100 % administrable et une formation d’une heure à l’administration est incluse." },
      { q: "Pouvez-vous créer une boutique en ligne ?", a: "Oui, avec WooCommerce : catalogue produits, panier, paiement en ligne et gestion des commandes." },
      { q: "Combien coûte un site WordPress ?", a: "À partir de 1 200 €, pour un délai de 3 à 5 semaines avec 3 tours de révision. Les licences premium éventuelles (thèmes, extensions) ne sont pas incluses." },
    ],
  },
];

export const getServicePage = (slug: string) => SERVICE_PAGES.find((p) => p.slug === slug);

/** Towns around Brie-Comte-Robert, for the local landing page. */
export const LOCAL_TOWNS = [
  "Brie-Comte-Robert", "Combs-la-Ville", "Lésigny", "Servon", "Chevry-Cossigny", "Grisy-Suisnes",
  "Moissy-Cramayel", "Lieusaint", "Savigny-le-Temple", "Melun", "Ozoir-la-Ferrière", "Pontault-Combault",
  "Roissy-en-Brie", "Tournan-en-Brie", "Brunoy", "Yerres", "Villecresnes", "Boissy-Saint-Léger",
];

export const LOCAL_FAQ: Faq[] = [
  { q: "Travaillez-vous uniquement en Seine-et-Marne ?", a: "Non : je suis basé à Brie-Comte-Robert et je travaille avec des clients partout en France. Tout peut se faire à distance, par téléphone ou en visio." },
  { q: "Combien coûte un site internet ?", a: "À partir de 300 € pour un site vitrine, 800 € pour un site sur-mesure et 1 200 € pour un site WordPress. Vous recevez un devis détaillé et gratuit après un premier appel." },
  { q: "Pouvez-vous m’aider à apparaître sur Google ?", a: "Oui : chaque site est optimisé pour le référencement dès sa création, et je peux vous accompagner sur votre fiche Google Business Profile pour apparaître dans les recherches locales." },
];
