import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { EMAIL } from "@/lib/site";

/** Site assistant (bottom bar → IA). The key stays server-side: ANTHROPIC_API_KEY in .env.local / Vercel. */
const CHAT_CTX = `Tu es l'assistant du site d'O'LDEV, l'activité d'Othmane Bouakline, développeur web freelance en Seine-et-Marne (77). Offres : Site vitrine dès 300 € jusqu'à 600 € (artisans et indépendants, 1–2 semaines, one-page responsive, formulaire de contact, SEO de base + Google Maps, mise en ligne ; hébergement et domaine non inclus). Site sur-mesure sur devis (PME et startups, 3–4 semaines, Next.js/React, SEO technique avancé, animations sur-mesure). WordPress clé en main sur devis (3–5 semaines, pages administrables, formation 1 h). Maintenance 1 an offerte (mises à jour, sauvegardes, correctifs) sur les trois offres. Aussi : logo & flyer dès 50 €, refonte sur devis, chatbot IA sur devis. Paiement en 1 ou 3 fois. Le site appartient au client. Réponse sous 48 h. Contact : ${EMAIL}. Réponds en français, en 2 à 4 phrases maximum, ton chaleureux et direct, propose un devis gratuit quand c'est pertinent. N'invente aucune information.`;

const MAX_TURNS = 12;
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

// Created on first request, so a missing key never breaks the build
let client: Anthropic | null = null;

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

  const messages: Anthropic.Beta.BetaMessageParam[] = raw
    .filter((m): m is { role: "user" | "assistant"; text: string } =>
      !!m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim() !== "")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.text.slice(0, MAX_CHARS) }));
  // The history must start with the visitor (the greeting is client-side only)
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }

  try {
    client ??= new Anthropic();
    const res = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: CHAT_CTX,
      messages,
    });
    if (res.stop_reason === "refusal") return NextResponse.json({ error: "refusal" }, { status: 502 });
    const text = res.content
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join("")
      .trim();
    if (!text) return NextResponse.json({ error: "empty" }, { status: 502 });
    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "rate" }, { status: 429 });
    console.error("chat:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
    return NextResponse.json({ error: "api" }, { status: 502 });
  }
}
