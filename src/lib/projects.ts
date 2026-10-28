export type ProjectTag = "nextjs" | "wordpress" | "html";

export type Project = {
  id: string;
  name: string;
  category: string;
  /** Short sector shown with the name (« Restaurant », « Coach sportif »…). */
  sector: string;
  tag: ProjectTag;
  tagline: string;
  stack: string[];
  image: string;
  /** Full-page capture (menu to footer) auto-scrolled in the preview popup; falls back to `image`. */
  fullImage?: string;
  /** Looping MP4 played on hover (desktop) / when visible (phones). TODO: add the reels in public/reels/. */
  video?: string;
  concept?: boolean;
};

/** `lead` = projects shown first in that tab, in this order. */
export const PROJECT_FILTERS: { tag: ProjectTag | "all"; label: string; lead?: string[] }[] = [
  { tag: "all",       label: "Tous" },
  { tag: "html",      label: "Vitrine",    lead: ["moreau", "fontaney", "sorel", "burga", "griddle", "volta", "petale", "djcley"] },
  { tag: "nextjs",    label: "Sur-mesure", lead: ["nocta", "aero", "hora", "wecars", "kinetik", "dental", "fauteo", "wonder", "renova", "moon", "baseclub"] },
  { tag: "wordpress", label: "WordPress",  lead: ["brows"] },
];

const HTML = ["HTML", "CSS", "JavaScript"];
const NEXT = ["Next.js", "React", "Tailwind"];
const WP = ["WordPress", "Responsive", "SEO"];
/** New projects: hero capture in /portfolio, full page (menu to footer) in /portfolio/web. */
const shots = (id: string, full = true) => ({ image: `/portfolio/${id}.webp`, ...(full && { fullImage: `/portfolio/web/${id}.webp` }) });

export const PROJECTS: Project[] = [
  { id: "nocta", name: "Nocta", category: "Location auto · Next.js", sector: "Location de voitures", tag: "nextjs", stack: NEXT, ...shots("nocta"),
    tagline: "Location de voitures d’exception : recherche par lieu et dates, flotte premium et réservation en quelques clics." },
  { id: "moreau", name: "Léna Moreau", category: "Photographe · HTML", sector: "Photographe", tag: "html", stack: HTML, ...shots("moreau"),
    tagline: "Portfolio d’une photographe portrait et mode : direction artistique forte, séries éditoriales et prise de contact." },
  { id: "wecars", name: "WeCars", category: "Location auto · Next.js", sector: "Location de voitures", tag: "nextjs", stack: NEXT, ...shots("wecars"),
    tagline: "Plateforme de location de voitures de sport : catalogue, disponibilités en temps réel et réservation en ligne." },
  { id: "hora", name: "Hora", category: "Horlogerie · Next.js", sector: "Horlogerie de luxe", tag: "nextjs", stack: NEXT, ...shots("hora", false),
    tagline: "Marketplace de montres de luxe : collection rare, estimation en ligne et espace membre conciergerie." },
  { id: "aero", name: "Aéro", category: "Aviation privée · Next.js", sector: "Aviation privée", tag: "nextjs", stack: NEXT, ...shots("aero"),
    tagline: "Réservation de vols privés en Europe : estimation de trajet, flotte d’avions et espace membres." },
  { id: "sorel", name: "Sorel Avocats", category: "Cabinet d’avocats · HTML", sector: "Cabinet d’avocats", tag: "html", stack: HTML, ...shots("sorel"),
    tagline: "Site d’un cabinet d’avocats d’affaires : expertises, honoraires transparents, actualités et prise de rendez-vous." },
  { id: "baseclub", name: "Base Club", category: "Web3 · Next.js", sector: "Web3", tag: "nextjs", stack: NEXT, ...shots("baseclub"),
    tagline: "Club social Web3 : statistiques membres, tokenomics, airdrop et connexion wallet." },
  { id: "djcley", name: "DJ Cley", category: "Artiste · HTML", sector: "Artiste DJ", tag: "html", stack: HTML, ...shots("djcley"),
    tagline: "Site d’un DJ techno et house : dates de tournée, musique, vidéos et formulaire de booking." },
  { id: "fauteo", name: "Fauteo", category: "Plateforme · Next.js", sector: "Plateforme beauté", tag: "nextjs", stack: NEXT, ...shots("fauteo"),
    tagline: "Location de postes beauté et bien-être entre salons et indépendants : recherche, réservations et avis." },
  { id: "fontaney", name: "Guillaume Fontaney", category: "Vidéaste · HTML", sector: "Vidéaste", tag: "html", stack: HTML, ...shots("fontaney"),
    tagline: "Portfolio d’un vidéaste : œuvres, expositions et chiffres clés dans une mise en page éditoriale." },
  { id: "volta", name: "Volta", category: "Architecture · HTML", sector: "Architecture", tag: "html", stack: HTML, ...shots("volta"),
    tagline: "Studio d’architecture : projets en plein écran, savoir-faire et prise de contact." },
  { id: "petale", name: "Atelier Floral", category: "Fleuriste · HTML", sector: "Fleuriste", tag: "html", stack: HTML, ...shots("petale"),
    tagline: "Atelier floral à Bordeaux : compositions sur mesure pour mariages et événements, galerie et réservation." },
  { id: "griddle", name: "Griddle", category: "Restaurant · HTML", sector: "Restaurant", tag: "html", stack: HTML, ...shots("griddle"),
    tagline: "Smash burgers de Brooklyn : menu, histoire de la maison et commande en ligne." },
  { id: "burga", name: "Burga", category: "Gastronomie · HTML", sector: "Gastronomie", tag: "html", stack: HTML, ...shots("burga"),
    tagline: "Restaurant gastronomique à Paris : carte, le chef, expériences et réservation de table." },
  { id: "dental", name: "Dental Clinic", category: "Santé · Next.js", sector: "Chirurgien-dentiste", tag: "nextjs", stack: NEXT, ...shots("dental"),
    tagline: "Site d’un chirurgien-dentiste implantologue : soins, solutions d’implants, diagnostic en ligne et prise de rendez-vous." },
  { id: "kinetik", name: "Kinetik", category: "Salle de sport · Next.js", sector: "Coach sportif", tag: "nextjs", stack: NEXT, ...shots("kinetik"),
    tagline: "Site d’un training club : espaces, coachs, programmes d’entraînement et réservation de séances." },
  { id: "moon", name: "Moon", category: "Beauté · React", sector: "Maquillage", tag: "nextjs", stack: ["React", "Vite", "Tailwind"], image: "/portfolio/moon.webp",
    tagline: "Marque de maquillage : collection, rituel en trois gestes, avis clientes et réservation de séances beauté." },
  { id: "renova", name: "Renova", category: "Rénovation · Next.js", sector: "Rénovation", tag: "nextjs", stack: NEXT, image: "/portfolio/renova.webp",
    tagline: "Entreprise de rénovation d’intérieur : méthode, avantages, réalisations et demande de devis en ligne." },
  { id: "wonder", name: "Wonder Club", category: "Barbier · React", sector: "Barbier", tag: "nextjs", stack: ["React", "Tailwind"], image: "/portfolio/wonder.webp", fullImage: "/portfolio/web/wonder.webp",
    tagline: "Salon de coiffure et barbier : prestations et tarifs, galerie de coupes, infos pratiques et réservation de créneau." },
  { id: "brows", name: "Brows Creative", category: "E-commerce · WordPress", sector: "Salon de beauté", tag: "wordpress", stack: ["WordPress", "WooCommerce", "Elementor"], image: "/portfolio/brows.webp", fullImage: "/portfolio/web/brows.webp",
    tagline: "Boutique WooCommerce pour salon de beauté : catalogue soins, réservations en ligne et boutique intégrée." },
  { id: "ajc", name: "AJC Ingénierie", category: "Formation · WordPress", sector: "Organisme de formation", tag: "wordpress", stack: WP, image: "/portfolio/ajc.webp",
    tagline: "Site d’un organisme de formation certifié Qualiopi : catalogue de formations, dispositifs de financement et espaces entreprise / candidat." },
  { id: "papillon-dor", name: "Papillon d’Or", category: "Transport adapté · WordPress", sector: "Transport adapté", tag: "wordpress", stack: WP, image: "/portfolio/papillon-dor.webp", fullImage: "/portfolio/web/papillon-dor.webp",
    tagline: "Site vitrine pour un service de transport de personnes à mobilité réduite : missions, engagements et contact disponible 7j/7." },
  { id: "auxitrol", name: "Auxitrol Weston", category: "Industrie · WordPress", sector: "Industrie", tag: "wordpress", stack: WP, image: "/portfolio/auxitrol.webp", fullImage: "/portfolio/web/auxitrol.webp",
    tagline: "Site corporate d’un fabricant international de capteurs aéronautiques : catalogue produits, marchés, carrières et support." },
  { id: "tennis-bry", name: "Tennis Club Bry", category: "Club sportif · WordPress", sector: "Club de tennis", tag: "wordpress", stack: WP, image: "/portfolio/tennis-bry.webp", fullImage: "/portfolio/web/tennis-bry.webp",
    tagline: "Site du Tennis Club de Bry-sur-Marne : installations, adhésions, enseignement, actualités du club et réservation de courts." },
  { id: "cfi", name: "CFI Groupe", category: "Intégrateur IT · WordPress", sector: "Intégrateur IT", tag: "wordpress", stack: WP, image: "/portfolio/cfi.webp", fullImage: "/portfolio/web/cfi.webp",
    tagline: "Site corporate d’un intégrateur de solutions numériques : éducation, retail, santé, smart office, cybersécurité et IA." },
  { id: "elior", name: "Elior", category: "Restauration · WordPress", sector: "Restauration", tag: "wordpress", stack: WP, image: "/portfolio/elior.webp", fullImage: "/portfolio/web/elior.webp",
    tagline: "Site d’un leader de la restauration collective : offres, engagements responsables, recrutement et actualités." },
  { id: "idemia", name: "IDEMIA", category: "Tech & sécurité · WordPress", sector: "Sécurité numérique", tag: "wordpress", stack: WP, image: "/portfolio/idemia.webp", fullImage: "/portfolio/web/idemia.webp",
    tagline: "Site d’un groupe international de l’identité et de la sécurité numérique : solutions, entités, carrières et actualités." },
];

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id)!;

/** Projects of one tab, in order (the tab's `lead` projects first). */
export function projectsForTag(tag: ProjectTag) {
  const lead = PROJECT_FILTERS.find((f) => f.tag === tag)?.lead ?? [];
  const rank = (p: Project) => (lead.includes(p.id) ? lead.indexOf(p.id) : lead.length);
  return PROJECTS.filter((p) => p.tag === tag).sort((a, b) => rank(a) - rank(b));
}
