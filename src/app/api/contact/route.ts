import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

function notificationHtml(name: string, email: string, phone: string, type: string, budget: string, message: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nouveau projet</title></head>
<body style="margin:0;padding:0;background:#f0f0ee;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0ee;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:32px 40px;">
            <span style="font-size:36px;font-weight:900;color:#FF3B00;letter-spacing:-1px;text-transform:uppercase;">O'LDEV</span>
            <span style="display:block;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:4px;text-transform:uppercase;margin-top:4px;">Nouveau message entrant</span>
          </td>
        </tr>

        <!-- Red banner -->
        <tr>
          <td style="background:#FF3B00;padding:12px 40px;display:flex;justify-content:space-between;">
            <span style="font-size:10px;font-weight:700;color:#fff;letter-spacing:3px;text-transform:uppercase;">DEMANDE DE PROJET</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">

            <h2 style="font-size:28px;font-weight:900;text-transform:uppercase;color:#111;margin:0 0 8px 0;letter-spacing:-0.5px;">
              ${esc(name)}
            </h2>
            <p style="font-size:12px;font-weight:700;color:#FF3B00;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px 0;">${esc(type)}</p>

            <!-- Info grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="50%" style="padding:0 8px 0 0;vertical-align:top;">
                  <div style="border-left:3px solid #FF3B00;padding-left:12px;margin-bottom:20px;">
                    <span style="display:block;font-size:9px;font-weight:700;color:rgba(0,0,0,0.35);letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Email</span>
                    <a href="mailto:${esc(email)}" style="font-size:14px;font-weight:700;color:#111;text-decoration:none;">${esc(email)}</a>
                  </div>
                  <div style="border-left:3px solid #FF3B00;padding-left:12px;margin-bottom:20px;">
                    <span style="display:block;font-size:9px;font-weight:700;color:rgba(0,0,0,0.35);letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Téléphone</span>
                    <span style="font-size:14px;font-weight:700;color:#111;">${esc(phone || "Non renseigné")}</span>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 0 8px;vertical-align:top;">
                  <div style="border-left:3px solid #111;padding-left:12px;margin-bottom:20px;">
                    <span style="display:block;font-size:9px;font-weight:700;color:rgba(0,0,0,0.35);letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Type de projet</span>
                    <span style="font-size:14px;font-weight:700;color:#111;">${esc(type)}</span>
                  </div>
                  <div style="border-left:3px solid #111;padding-left:12px;margin-bottom:20px;">
                    <span style="display:block;font-size:9px;font-weight:700;color:rgba(0,0,0,0.35);letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Budget estimé</span>
                    <span style="font-size:14px;font-weight:700;color:#111;">${esc(budget)}</span>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <div style="background:#f0f0ee;border-left:4px solid #FF3B00;padding:20px 24px;margin-bottom:32px;">
              <span style="display:block;font-size:9px;font-weight:700;color:rgba(0,0,0,0.35);letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">Message</span>
              <p style="font-size:15px;font-weight:600;color:#111;margin:0;line-height:1.7;">${esc(message).replace(/\n/g, "<br>")}</p>
            </div>

            <!-- CTA -->
            <a href="mailto:${esc(email)}?subject=${esc(encodeURIComponent(`Re: Votre projet ${type}`))}" style="display:inline-block;background:#FF3B00;color:#fff;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:16px 32px;text-decoration:none;">
              Répondre à ${esc(name)} →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#111;padding:24px 40px;text-align:center;">
            <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;">O'LDEV · FREELANCE WEB · oldev.vercel.app</span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function confirmationHtml(name: string, type: string, budget: string) {
  const firstName = name.split(" ")[0];
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Message reçu</title></head>
<body style="margin:0;padding:0;background:#111111;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:48px 40px 32px;border-bottom:3px solid #FF3B00;">
            <span style="font-size:48px;font-weight:900;color:#FF3B00;letter-spacing:-2px;text-transform:uppercase;line-height:1;">O'LDEV</span>
            <span style="display:block;font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:4px;text-transform:uppercase;margin-top:8px;">FREELANCE WEB · FULL STACK</span>
          </td>
        </tr>

        <!-- Big title -->
        <tr>
          <td style="background:#111111;padding:48px 40px 0;">
            <h1 style="font-size:56px;font-weight:900;color:#ffffff;text-transform:uppercase;margin:0;letter-spacing:-2px;line-height:0.85;">
              Bien<br><span style="color:#FF3B00;">reçu !</span>
            </h1>
          </td>
        </tr>

        <!-- Intro text -->
        <tr>
          <td style="background:#111111;padding:32px 40px 0;">
            <p style="font-size:16px;font-weight:700;color:rgba(255,255,255,0.7);margin:0;line-height:1.7;">
              Salut <strong style="color:#fff;">${esc(firstName)}</strong> 👋<br>
              Ton message est arrivé. Je prends connaissance de ton projet et je te reviens personnellement <strong style="color:#FF3B00;">sous 48h maximum</strong>.
            </p>
          </td>
        </tr>

        <!-- Project summary card -->
        <tr>
          <td style="background:#111111;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.08);">
              <tr>
                <td style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;">Récap de ta demande</span>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding-bottom:20px;vertical-align:top;">
                        <span style="display:block;font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Projet</span>
                        <span style="font-size:14px;font-weight:700;color:#fff;">${esc(type)}</span>
                      </td>
                      <td width="50%" style="padding-bottom:20px;vertical-align:top;">
                        <span style="display:block;font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Budget</span>
                        <span style="font-size:14px;font-weight:700;color:#FF3B00;">${esc(budget)}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- What's next -->
        <tr>
          <td style="background:#111111;padding:0 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:24px 0;border-top:1px solid rgba(255,255,255,0.08);">
                  <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;display:block;margin-bottom:20px;">La suite</span>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:0 16px 16px 0;vertical-align:top;">
                        <div style="width:28px;height:28px;background:#FF3B00;border-radius:50%;text-align:center;line-height:28px;font-size:11px;font-weight:900;color:#fff;">1</div>
                      </td>
                      <td style="padding-bottom:16px;vertical-align:top;">
                        <span style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);">Je lis ton brief et analyse ton besoin</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 16px 16px 0;vertical-align:top;">
                        <div style="width:28px;height:28px;background:#FF3B00;border-radius:50%;text-align:center;line-height:28px;font-size:11px;font-weight:900;color:#fff;">2</div>
                      </td>
                      <td style="padding-bottom:16px;vertical-align:top;">
                        <span style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);">Je te reviens sous 48h avec une proposition concrète</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 16px 0 0;vertical-align:top;">
                        <div style="width:28px;height:28px;background:#FF3B00;border-radius:50%;text-align:center;line-height:28px;font-size:11px;font-weight:900;color:#fff;">3</div>
                      </td>
                      <td style="vertical-align:top;">
                        <span style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);">On démarre et on livre quelque chose de 🔥</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA banner -->
        <tr>
          <td style="background:#FF3B00;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;display:block;margin-bottom:4px;">Contact direct</span>
                  <a href="mailto:othmane.bouakline.pro@gmail.com" style="font-size:15px;font-weight:700;color:#fff;text-decoration:none;">othmane.bouakline.pro@gmail.com</a>
                </td>
                <td align="right">
                  <a href="https://oldev.vercel.app" style="display:inline-block;background:#fff;color:#FF3B00;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:12px 20px;text-decoration:none;">Portfolio ↗</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0a0a0a;padding:20px 40px;text-align:center;">
            <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.2);letter-spacing:3px;text-transform:uppercase;">© ${new Date().getFullYear()} O'LDEV · OTHMANE BOUAKLINE · FREELANCE WEB</span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
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
