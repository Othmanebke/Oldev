import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SeoHeader from "@/components/seo/SeoHeader";
import { container, display, H2 } from "@/components/seo/ui";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et politique de confidentialité du site O'ldev (Othmane Bouakline, développeur web freelance).",
  alternates: { canonical: "/legal" },
  openGraph: { type: "website", locale: "fr_FR", siteName: "O'ldev", url: "/legal", title: "Mentions légales | O'ldev" },
};

const TABLES = [
  {
    t: "Éditeur du site",
    rows: [
      ["Nom du site", "O'ldev"],
      ["Responsable de la publication", "Othmane Bouakline"],
      ["Statut", "Auto-entrepreneur"],
      ["Email", EMAIL],
      ["Téléphone", "06 60 80 53 37"],
    ],
  },
  {
    t: "Hébergement",
    rows: [
      ["Hébergeur", "Vercel Inc."],
      ["Adresse", "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis"],
      ["Site web", "vercel.com"],
    ],
  },
];

const TEXTS = [
  {
    t: "Propriété intellectuelle",
    p: "L’ensemble des contenus (textes, images, logos, graphismes, code source) est la propriété exclusive d’O’ldev (Othmane Bouakline). Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite.",
  },
  {
    t: "Cookies",
    p: "Ce site utilise des cookies fonctionnels strictement nécessaires. Aucun cookie publicitaire ou de tracking tiers n’est utilisé sans votre consentement.",
  },
  {
    t: "Limitation de responsabilité",
    p: "O’ldev s’efforce d’assurer l’exactitude des informations publiées. Concernant les liens externes, O’ldev n’est pas responsable du contenu des sites tiers.",
  },
  { t: "Loi applicable", p: "Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents." },
];

const RIGHTS = ["Droit d’accès à vos données", "Droit de rectification", "Droit à l’effacement (« droit à l’oubli »)", "Droit à la portabilité", "Droit d’opposition au traitement"];

const num = (i: number) => <span className="font-mono text-[14px] tracking-[.14em] text-abcs-red">{String(i).padStart(2, "0")}</span>;
const text = "m-0 max-w-[680px] text-[16px] leading-[1.65] text-[#c8c8c8] text-pretty";

export default function LegalPage() {
  return (
    <>
      <SeoHeader />
      <main className="flex flex-col bg-black text-[#f4f4f2]">
        <section className={`${container} flex flex-col gap-4`} style={{ paddingBlock: "clamp(48px,7vw,96px) clamp(40px,5vw,72px)" }}>
          <span className="text-[12px] font-semibold tracking-[.14em] text-abcs-red">LÉGAL</span>
          <h1 className="text-white" style={{ ...display, fontSize: "clamp(2.4rem,6.4vw,5.6rem)", letterSpacing: "-.045em" }}>
            Mentions légales
          </h1>
          <p className="m-0 text-[14px] text-[#a0a0a0]">Dernière mise à jour : février 2026</p>
        </section>

        <div className={`${container} flex flex-col`} style={{ paddingBottom: "clamp(64px,8vw,112px)" }}>
          {TABLES.map((s, i) => (
            <section key={s.t} className="flex flex-col gap-5 border-t border-white/10 py-[clamp(32px,4vw,48px)]">
              <div className="flex items-baseline gap-4">
                {num(i + 1)}
                <H2>{s.t}</H2>
              </div>
              <dl className="m-0 flex flex-col">
                {s.rows.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 border-b border-white/[.06] py-3 sm:flex-row sm:items-baseline sm:gap-6">
                    <dt className="text-[14px] text-[#a0a0a0] sm:w-60 sm:shrink-0">{k}</dt>
                    <dd className="m-0 break-words text-[16px] font-medium text-white">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          <section className="flex flex-col gap-5 border-t border-white/10 py-[clamp(32px,4vw,48px)]">
            <div className="flex items-baseline gap-4">
              {num(3)}
              <H2>{TEXTS[0].t}</H2>
            </div>
            <p className={text}>{TEXTS[0].p}</p>
          </section>

          <section className="flex flex-col gap-5 border-t border-white/10 py-[clamp(32px,4vw,48px)]">
            <div className="flex items-baseline gap-4">
              {num(4)}
              <H2>Données personnelles &amp; RGPD</H2>
            </div>
            <p className={text}>Données collectées : nom, email, message (formulaire de contact uniquement). Vous disposez des droits suivants :</p>
            <ul className="m-0 flex max-w-[680px] list-none flex-col p-0">
              {RIGHTS.map((r) => (
                <li key={r} className="flex gap-3 border-b border-white/[.06] py-3 text-[16px] text-[#e6e6e6]">
                  <span aria-hidden className="text-abcs-red">→</span>
                  {r}
                </li>
              ))}
            </ul>
            <p className={text}>
              Délai de réponse : 30 jours ouvrés. Contact :{" "}
              <a href={`mailto:${EMAIL}`} className="break-all text-abcs-red hover:underline">
                {EMAIL}
              </a>
            </p>
          </section>

          {TEXTS.slice(1).map((s, i) => (
            <section key={s.t} className="flex flex-col gap-5 border-t border-white/10 py-[clamp(32px,4vw,48px)]">
              <div className="flex items-baseline gap-4">
                {num(i + 5)}
                <H2>{s.t}</H2>
              </div>
              <p className={text}>{s.p}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
