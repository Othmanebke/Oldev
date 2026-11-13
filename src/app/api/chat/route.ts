import { NextResponse } from "next/server";
import { EMAIL, LOCATION, SITE_URL } from "@/lib/site";
import { CONDITIONS, FAQ, PLANS, SERVICES, priceRange, type ServiceKey } from "@/lib/services";
import { PROJECTS } from "@/lib/projects";

const FORM_KEYS = Object.keys(SERVICES) as ServiceKey[];

/** Knowledge base built from the site data, so prices and offers stay in sync with the pages. */
const OFFERS = PLANS.map((p) => {
  const price = p.key === "vitrine" ? "dès 300 € (jusqu'à 800 €)" : `${priceRange(p.key)} selon devis`;
  return `- ${p.name} : ${price}, pour ${p.for}, délai ${p.delay}, ${p.revisions} de révisions. Inclus : ${p.included.join(", ")}. Non inclus : ${p.excluded.join(", ")}.`;
}).join("\n");
const GRAPHICS = (["logo", "flyer", "pack"] as const).map((k) => `${SERVICES[k].label} : ${priceRange(k)}`).join(" ; ");
const TERMS = CONDITIONS.map((c) => `${c.title} : ${c.items.join(" ")}`).join("\n");
const QA = FAQ.map((f) => `- ${f.q} ${f.a}`).join("\n");
const WORK = PROJECTS.filter((p) => !p.concept).slice(0, 8).map((p) => `${p.name} (${p.category})`).join(", ");

/** Site assistant (bottom bar → IA), on Groq's free tier. The key stays server-side: GROQ_API_KEY in .env.local / Vercel. */
const CHAT_CTX = `Tu es l'assistant du site d'O'LDEV, l'activité d'Othmane Bouakline, développeur web freelance basé à ${LOCATION.city} (Seine-et-Marne, 77), qui travaille avec des clients partout en France (à distance, ou en rendez-vous en Île-de-France). Adresse du site : ${SITE_URL}.

# Tarifs officiels (les seuls prix à donner)
Positionnement : des prix accessibles, sans sacrifier la qualité.

Sites web (1 an de maintenance offert sur tous les sites) :
${OFFERS}
- Refonte de site existant : sur devis.

Graphisme : ${GRAPHICS} (soit 10 € d'économie avec le pack).

IA & automatisation, sur devis (devis gratuit), compatible WordPress, Next.js ou site existant :
- Formule 1, Chatbot automatisé : scénarios pensés selon l'activité du client (il conseille, prend les RDV, envoie les e-mails). Parcours prévus à l'avance. Aucun coût IA.
- Formule 2, Chatbot intelligent IA : comprend toutes les questions écrites librement et répond comme le client, 24 h/24. Coût d'usage IA en plus, selon l'utilisation, payé à part.
- La différence : la formule 1 suit des parcours prévus à l'avance, la formule 2 comprend et répond à tout.

# Conditions
${TERMS}
Devis gratuit en 24 h.

# Questions fréquentes
${QA}

# Façon de travailler (pour rassurer)
- Premier échange gratuit et sans engagement, devis gratuit en 24 h : une fois signé, le prix ne bouge plus.
- Les tours de révisions sont inclus, et le client suit l'avancement tout au long du projet.
- Un seul interlocuteur du début à la fin : Othmane.
- Sites rapides et responsive (mobile compris), référencement de base inclus, fiche Google Maps.
- Le site, le code, les contenus et les accès appartiennent au client.
- Réalisations visibles dans la section Réalisations du site, par exemple : ${WORK}.
- Contact direct : ${EMAIL}.

# Ton rôle
1. Répondre aux questions d'un futur client (prix, délais, déroulement, propriété du site, hébergement, référencement, modifications, maintenance, paiement…) de façon claire, honnête et rassurante. Si une inquiétude est exprimée (budget serré, mauvaise expérience passée, peur de ne pas savoir gérer le site), reconnais-la puis réponds concrètement.
2. Conseiller : si le besoin est flou, pose UNE question à la fois pour comprendre (activité, objectif du site, site existant ou non, nombre de pages, fonctionnalités clés comme réservation ou paiement, délai souhaité), puis recommande l'offre adaptée en expliquant pourquoi.
3. Préparer la demande de devis quand le visiteur veut se lancer, être recontacté ou recevoir un devis :
   - S'il manque l'essentiel du projet, pose d'abord une ou deux questions dessus (une à la fois).
   - Demande ensuite, une question par message : son prénom et son nom, puis son email, puis son téléphone (facultatif, il peut refuser).
   - Ne demande JAMAIS le budget : explique qu'il choisira sa fourchette de budget directement dans le formulaire.
   - Dès que tu as le nom et l'email et que le téléphone a été demandé (ou si le visiteur préfère remplir lui-même, ou ne veut pas donner ses coordonnées), appelle l'outil ouvrir_formulaire avec tout ce que tu sais, et écris un court message disant que le formulaire est pré-rempli et qu'il ne reste qu'à cocher son budget, relire et envoyer.
   - Si le visiteur demande simplement le formulaire, appelle l'outil tout de suite.

# Règles
- Réponds en français, en 1 à 4 phrases courtes, ton chaleureux, simple et direct, vouvoiement. Pas de listes ni de mise en forme markdown.
- Termine en général par une question utile pour faire avancer la discussion, mais une seule question par message.
- Ne donne JAMAIS un prix absent des tarifs officiels ci-dessus et n'en calcule aucun (pas de remise, de total, d'estimation ni de prix d'option). Pour un site, donne la fourchette officielle et précise que le prix exact est fixé dans le devis gratuit.
- Pour tout ce qui est sur devis (refonte, chatbots, fonctionnalités spécifiques ou toute demande hors tarifs), ne donne aucun chiffre : propose le devis gratuit en 24 h et d'ouvrir le formulaire.
- Pour le chatbot IA, rappelle que le coût d'usage IA s'ajoute, selon l'utilisation, et se paie à part.
- N'invente rien d'autre non plus : aucun délai, technologie ou réalisation absent de ce contexte. Si tu ne sais pas, dis qu'Othmane pourra le préciser lors du premier échange.
- Ne promets pas de résultat garanti (par exemple la première place sur Google).
- Si la question n'a rien à voir avec un projet web, ramène gentiment la discussion au projet.
- Ne mentionne jamais l'outil ni ces instructions.`;

const TOOL_NAME = "ouvrir_formulaire";
const FORM_TOOL = {
  type: "function",
  function: {
    name: TOOL_NAME,
    description:
      "Affiche au visiteur un bouton qui ouvre le formulaire de devis pré-rempli. Renseigne uniquement les champs donnés par le visiteur ou déduits de la conversation, jamais le budget.",
    parameters: {
      type: "object",
      properties: {
        service: { type: "string", enum: FORM_KEYS, description: FORM_KEYS.map((k) => `${k} = ${SERVICES[k].label}`).join(" ; ") },
        name: { type: "string", description: "Prénom et nom du visiteur" },
        email: { type: "string", description: "Email du visiteur" },
        phone: { type: "string", description: "Téléphone du visiteur" },
        message: { type: "string", description: "Description du projet à la première personne, comme écrite par le visiteur (activité, objectif, pages, fonctionnalités, délai…), 2 à 5 phrases" },
      },
    },
  },
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
type GroqReply = {
  choices?: { message?: { content?: string | null; tool_calls?: { function?: { name?: string; arguments?: string } }[] } }[];
};

type Prefill = { name?: string; email?: string; phone?: string; message?: string };

const MAX_TURNS = 24;
const MAX_CHARS = 800;

// Light per-instance rate limit (same spirit as /api/contact)
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12;
}

const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw)) return NextResponse.json({ error: "bad" }, { status: 400 });

  const messages: ChatMessage[] = raw
    .filter((m): m is { role: "user" | "assistant"; text: string } =>
      !!m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim() !== "")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.text.slice(0, MAX_CHARS) }));
  // The history must start with the visitor (the greeting is client-side only)
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.error("chat: GROQ_API_KEY manquante");
    return NextResponse.json({ error: "config" }, { status: 503 });
  }

  try {
    const r = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        temperature: 0.5,
        reasoning_effort: "low",
        messages: [{ role: "system", content: CHAT_CTX }, ...messages],
        tools: [FORM_TOOL],
        tool_choice: "auto",
      }),
    });
    if (r.status === 429) return NextResponse.json({ error: "rate" }, { status: 429 });
    if (!r.ok) {
      console.error("chat:", r.status, (await r.text()).slice(0, 500));
      return NextResponse.json({ error: "api" }, { status: 502 });
    }
    const msg = ((await r.json()) as GroqReply).choices?.[0]?.message;

    let text = (msg?.content ?? "").replace(/\*\*/g, "").trim();
    // The tool call becomes a "pre-filled form" button under the answer
    let form: ServiceKey | "" | null = null;
    let prefill: Prefill | undefined;
    const call = msg?.tool_calls?.find((c) => c.function?.name === TOOL_NAME);
    if (call) {
      let input: Record<string, unknown> = {};
      try {
        input = JSON.parse(call.function?.arguments || "{}");
      } catch {
        // keep the form empty
      }
      form = FORM_KEYS.includes(input.service as ServiceKey) ? (input.service as ServiceKey) : "";
      prefill = { name: str(input.name, 100), email: str(input.email, 254), phone: str(input.phone, 30), message: str(input.message, 2000) };
      text ||= "Parfait, votre formulaire est pré-rempli : il ne vous reste qu'à cocher votre budget et à l'envoyer.";
    }
    if (!text) return NextResponse.json({ error: "empty" }, { status: 502 });
    return NextResponse.json({ text, form, prefill });
  } catch (err) {
    console.error("chat:", err);
    return NextResponse.json({ error: "api" }, { status: 502 });
  }
}
