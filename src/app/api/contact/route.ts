import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SITE_URL } from "@/lib/site";

const OWNER_EMAIL = "othmane.bouakline.pro@gmail.com";
const SENDER_NAME = "O'ldev";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/** Escapes user input before it goes into the email HTML. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

/** Max length per field; anything longer is rejected. */
const LIMITS = { name: 100, email: 254, phone: 30, type: 100, budget: 100, message: 5000 } as const;

/** Best-effort per-IP limit (in memory, so per server instance): 3 sends / 10 min. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  return false;
}

/** Trims a field; single-line fields also lose line breaks. */
const field = (v: unknown, multiline = false) => {
  const s = typeof v === "string" ? v.trim() : "";
  return multiline ? s : s.replace(/[\r\n]+/g, " ");
};

const AVATAR_URL = `${SITE_URL}/email/avatar.jpg`;
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

const C = { ink: "#050505", card: "#111111", line: "#242424", paper: "#f4f4f2", red: "#FF3B00", green: "#22a05a" };
const FONT = "'Inter',Helvetica,Arial,sans-serif";
const HEAD = "'Archivo','Arial Narrow',Arial,sans-serif";

/** Small uppercase label above a value. */
const label = (text: string, color = "rgba(244,244,242,0.45)") =>
  `<span style="display:block;font-family:${FONT};font-size:10px;font-weight:700;color:${color};letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">${text}</span>`;

/** Shared shell: dark top bar (logo + dispo pill), avatar + title, footer; `body` fills the middle. */
function layout(opts: { title: string; preheader: string; kicker: string; heading: string; body: string }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${opts.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; -webkit-text-size-adjust:100%; }
  @media (max-width:600px) {
    .wrap { padding:0 !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }
    .stack, .stack tbody, .stack tr, .col { display:block !important; width:100% !important; }
    .col { padding-left:0 !important; padding-right:0 !important; box-sizing:border-box !important; }
    .h1 { font-size:42px !important; }
    .btn { display:block !important; text-align:center !important; }
    .right { text-align:left !important; }
    .pad-in { padding-left:22px !important; padding-right:22px !important; }
    .pad-in.right { padding-top:0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.ink};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};">
    <tr><td align="center" class="wrap" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.ink};">

        <!-- Top bar -->
        <tr>
          <td class="px" style="padding:24px 36px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:${HEAD};font-size:24px;font-weight:900;color:${C.paper};letter-spacing:0.5px;text-transform:uppercase;">O'LDEV</td>
                <td align="right">
                  <span style="display:inline-block;background:#ffffff;border-radius:999px;padding:6px 8px 6px 14px;font-family:${FONT};font-size:11px;font-weight:700;color:${C.card};letter-spacing:1.5px;text-transform:uppercase;line-height:16px;">Dispo&nbsp;<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${C.green};vertical-align:-3px;">&nbsp;</span></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Avatar + title -->
        <tr>
          <td class="px" style="padding:24px 36px 36px;border-bottom:1px solid ${C.line};">
            <img src="${AVATAR_URL}" width="72" height="72" alt="Othmane" style="display:block;width:72px;height:72px;border-radius:50%;border:3px solid ${C.red};margin-bottom:24px;">
            <span style="display:block;font-family:${FONT};font-size:11px;font-weight:700;color:${C.red};letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">${opts.kicker}</span>
            <h1 class="h1" style="margin:0;font-family:${HEAD};font-size:56px;font-weight:900;line-height:0.95;color:${C.paper};text-transform:uppercase;letter-spacing:-1px;word-break:break-word;">${opts.heading}</h1>
          </td>
        </tr>
${opts.body}
        <!-- Footer -->
        <tr>
          <td class="px" style="padding:28px 36px;border-top:1px solid ${C.line};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="stack">
              <tr>
                <td class="col" style="font-family:${FONT};font-size:12px;line-height:1.6;color:rgba(244,244,242,0.45);">
                  <strong style="color:${C.paper};">Othmane Bouakline</strong><br>Développeur web freelance · Seine-et-Marne
                </td>
                <td class="col right" align="right" style="padding-top:4px;font-family:${FONT};font-size:12px;">
                  <a href="${SITE_URL}" style="color:${C.paper};text-decoration:none;font-weight:700;">${SITE_HOST} <span style="color:${C.red};">↗</span></a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notificationHtml(name: string, email: string, phone: string, type: string, budget: string, message: string) {
  const info = (k: string, v: string) =>
    `<td class="col" width="50%" style="padding:0 8px 20px 0;vertical-align:top;">${label(k)}<span style="font-family:${FONT};font-size:15px;font-weight:600;color:${C.paper};word-break:break-word;">${v}</span></td>`;
  const reply = `mailto:${esc(email)}?subject=${esc(encodeURIComponent(`Re: Votre projet ${type}`))}`;
  const tel = phone.replace(/[^\d+]/g, "");

  const body = `
        <!-- Contact details -->
        <tr>
          <td class="px" style="padding:32px 36px 12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="stack">
              <tr>
                ${info("Email", `<a href="mailto:${esc(email)}" style="color:${C.paper};text-decoration:none;">${esc(email)}</a>`)}
                ${info("Téléphone", phone ? `<a href="tel:${tel}" style="color:${C.paper};text-decoration:none;">${esc(phone)}</a>` : "Non renseigné")}
              </tr>
              <tr>
                ${info("Type de projet", esc(type))}
                ${info("Budget estimé", `<span style="color:${C.red};">${esc(budget)}</span>`)}
              </tr>
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td class="px" style="padding:0 36px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border:1px solid ${C.line};border-radius:14px;">
              <tr>
                <td style="padding:22px 24px;">
                  ${label("Message")}
                  <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.7;color:rgba(244,244,242,0.85);word-break:break-word;">${esc(message).replace(/\n/g, "<br>")}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td class="px" style="padding:0 36px 40px;">
            <a href="${reply}" class="btn" style="display:inline-block;background:${C.red};color:#ffffff;border-radius:999px;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:16px 30px;text-decoration:none;">Répondre à ${esc(name.split(" ")[0])} →</a>
          </td>
        </tr>
`;

  return layout({
    title: "Nouveau projet",
    preheader: `${esc(type)} · ${esc(budget)} · ${esc(email)}`,
    kicker: "Nouvelle demande de projet",
    heading: esc(name),
    body,
  });
}

function confirmationHtml(name: string, type: string, budget: string) {
  const firstName = name.split(" ")[0];
  const step = (n: number, text: string, last = false) => `
              <tr>
                <td width="44" style="padding:0 0 ${last ? 0 : 18}px 0;vertical-align:top;">
                  <span style="display:inline-block;width:30px;height:30px;border-radius:50%;background:${C.red};text-align:center;line-height:30px;font-family:${FONT};font-size:12px;font-weight:700;color:#ffffff;">${n}</span>
                </td>
                <td style="padding:5px 0 ${last ? 0 : 18}px 0;vertical-align:top;font-family:${FONT};font-size:15px;line-height:1.5;color:rgba(244,244,242,0.8);">${text}</td>
              </tr>`;

  const body = `
        <!-- Intro -->
        <tr>
          <td class="px" style="padding:32px 36px 8px;">
            <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.7;color:rgba(244,244,242,0.75);">
              Salut <strong style="color:${C.paper};">${esc(firstName)}</strong> 👋<br>
              Ton message est bien arrivé. Je prends connaissance de ton projet et je te réponds personnellement <strong style="color:${C.paper};">sous 48&nbsp;h maximum</strong>.
            </p>
          </td>
        </tr>

        <!-- Recap -->
        <tr>
          <td class="px" style="padding:24px 36px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border:1px solid ${C.line};border-radius:14px;">
              <tr>
                <td style="padding:22px 24px 4px;">${label("Récap de ta demande", C.red)}</td>
              </tr>
              <tr>
                <td style="padding:8px 24px 14px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="stack">
                    <tr>
                      <td class="col" width="50%" style="padding:0 8px 12px 0;vertical-align:top;">${label("Projet")}<span style="font-family:${FONT};font-size:15px;font-weight:600;color:${C.paper};">${esc(type)}</span></td>
                      <td class="col" width="50%" style="padding:0 0 12px 8px;vertical-align:top;">${label("Budget")}<span style="font-family:${FONT};font-size:15px;font-weight:600;color:${C.paper};">${esc(budget)}</span></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Next steps -->
        <tr>
          <td class="px" style="padding:8px 36px 32px;">
            ${label("La suite")}
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
              ${step(1, "Je lis ton brief et j'analyse ton besoin")}
              ${step(2, "Je te reviens sous 48&nbsp;h avec une proposition concrète")}
              ${step(3, "On démarre et je livre un site qui te ramène des clients", true)}
            </table>
          </td>
        </tr>

        <!-- Direct contact -->
        <tr>
          <td class="px" style="padding:0 36px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="stack" style="background:${C.red};border-radius:14px;">
              <tr>
                <td class="col pad-in" style="padding:22px 24px;">
                  ${label("Contact direct", "rgba(255,255,255,0.75)")}
                  <a href="mailto:${OWNER_EMAIL}" style="font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;overflow-wrap:anywhere;">${OWNER_EMAIL}</a>
                </td>
                <td class="col right pad-in" align="right" style="padding:22px 24px;">
                  <a href="${SITE_URL}/realisations" class="btn" style="display:inline-block;background:#ffffff;color:${C.card};border-radius:999px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:12px 20px;text-decoration:none;white-space:nowrap;">Voir mes projets ↗</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
`;

  return layout({
    title: "Message reçu",
    preheader: `Merci ${esc(firstName)}, je te réponds sous 48 h.`,
    kicker: "Message bien reçu",
    heading: `Merci ${esc(firstName)}<span style="color:${C.red};">.</span>`,
    body,
  });
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    const name = field(body.name);
    const email = field(body.email);
    const phone = field(body.phone);
    const type = field(body.type);
    const budget = field(body.budget);
    const message = field(body.message, true);

    if (!name || !email || !type) {
      return NextResponse.json({ error: "Veuillez remplir votre nom, email et type de projet." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    const fields = { name, email, phone, type, budget, message };
    if ((Object.keys(LIMITS) as (keyof typeof LIMITS)[]).some((k) => fields[k].length > LIMITS[k])) {
      return NextResponse.json({ error: "Un des champs est trop long." }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Trop de messages envoyés. Réessaie dans quelques minutes." }, { status: 429 });
    }

    const finalBudget = budget || "Non précisé";
    const finalMessage = message || "Demande de devis / contact direct via le formulaire.";
    const from = `${SENDER_NAME} <${process.env.GMAIL_USER}>`;

    // 1. Notification to Othmane
    await transporter.sendMail({
      from,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `🚀 Nouveau projet — ${type} · ${name}`,
      html: notificationHtml(name, email, phone, type, finalBudget, finalMessage),
    });

    // 2. Confirmation to client
    await transporter.sendMail({
      from,
      to: email,
      subject: `Bien reçu ${name.split(" ")[0]} ! Je te reviens sous 48h 👋`,
      html: confirmationHtml(name, type, finalBudget),
    });


    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Contact API]", msg);
    return NextResponse.json(
      { error: `L’envoi a échoué. Réessaie plus tard ou écris-moi directement à ${OWNER_EMAIL}.` },
      { status: 500 },
    );
  }
}
