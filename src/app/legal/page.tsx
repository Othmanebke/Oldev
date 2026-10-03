import PageHeader from "@/components/PageHeader";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et politique de confidentialité du site O'ldev (Othmane Bouakline, développeur web freelance).",
  alternates: { canonical: "/legal" },
  openGraph: { type: "website", locale: "fr_FR", siteName: "O'ldev", url: "/legal", title: "Mentions légales | O'ldev" },
};

export default function LegalPage() {
  const sections = [
    {
      n: "01", t: "ÉDITEUR DU SITE",
      content: [
        ["Nom du site", "O'ldev"],
        ["Responsable de la publication", "Othmane Bouakline"],
        ["Statut", "Auto-entrepreneur"],
        ["Email", "othmane.bouakline.pro@gmail.com"],
        ["Téléphone", "06 60 80 53 37"],
      ]
    },
    {
      n: "02", t: "HÉBERGEMENT",
      content: [
        ["Hébergeur", "Vercel Inc."],
        ["Adresse", "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis"],
        ["Site web", "vercel.com"],
      ]
    },
  ];

  return (
    <>
    <main className="flex-1 flex flex-col items-center px-0 pb-32 bg-white">
      <PageHeader />
      <div className="w-full flex flex-col items-center px-5 md:px-8 pt-16">
        <div className="w-full max-w-4xl">
        <div className="inline-block bg-abcs-black text-white font-bold text-xs uppercase tracking-widest px-4 py-2 mb-6">Légal</div>
        <h1 className="font-heading text-[clamp(2.5rem,12vw,3.75rem)] md:text-[9rem] text-abcs-black uppercase leading-[0.8] mb-4">MENTIONS<br/><span className="text-abcs-red">LÉGALES</span></h1>
        <p className="font-bold text-sm opacity-50 mb-24 uppercase tracking-widest">Dernière mise à jour : Février 2026</p>

        <div className="flex flex-col gap-0">
          {sections.map((s) => (
            <div key={s.n} className="border-4 border-abcs-black border-b-0 p-5 sm:p-8">
              <div className="font-script text-abcs-red text-5xl mb-2 -rotate-2">{s.n}</div>
              <h2 className="font-heading text-2xl sm:text-4xl uppercase mb-6">{s.t}</h2>
              <div className="flex flex-col gap-3">
                {s.content.map(([k, v]) => (
                  <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-black/10 pb-3">
                    <span className="font-bold text-[10px] sm:text-sm uppercase tracking-widest opacity-50 sm:w-48 sm:shrink-0">{k}</span>
                    <span className="font-bold text-sm sm:text-base break-all sm:break-normal">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="border-4 border-abcs-black border-b-0 p-5 sm:p-8">
            <div className="font-script text-abcs-red text-5xl mb-2 -rotate-2">03</div>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase mb-4">PROPRIÉTÉ INTELLECTUELLE</h2>
            <p className="font-bold opacity-80">L&apos;ensemble des contenus (textes, images, logos, graphismes, code source) est la propriété exclusive d&apos;O&apos;ldev (Othmane Bouakline). Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite.</p>
          </div>

          <div className="border-4 border-abcs-black border-b-0 p-5 sm:p-8">
            <div className="font-script text-abcs-red text-5xl mb-2 -rotate-2">04</div>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase mb-6">DONNÉES PERSONNELLES & RGPD</h2>
            <p className="font-bold opacity-80 mb-6">Données collectées : nom, email, message (formulaire de contact uniquement). Vous disposez des droits suivants :</p>
            <ul className="flex flex-col gap-3">
              {["Droit d'accès à vos données", "Droit de rectification", "Droit à l'effacement (« droit à l'oubli »)", "Droit à la portabilité", "Droit d'opposition au traitement"].map((r) => (
                <li key={r} className="flex gap-3 font-bold border-b border-black/10 pb-3"><span className="text-abcs-red">→</span>{r}</li>
              ))}
            </ul>
            <p className="font-bold opacity-70 mt-6">Délai de réponse : 30 jours ouvrés. Contact : <a href="mailto:othmane.bouakline.pro@gmail.com" className="break-all text-abcs-red hover:underline">othmane.bouakline.pro@gmail.com</a></p>
          </div>

          <div className="border-4 border-abcs-black border-b-0 p-5 sm:p-8">
            <div className="font-script text-abcs-red text-5xl mb-2 -rotate-2">05</div>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase mb-4">COOKIES</h2>
            <p className="font-bold opacity-80">Ce site utilise des cookies fonctionnels strictement nécessaires. Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé sans votre consentement.</p>
          </div>

          <div className="border-4 border-abcs-black border-b-0 p-5 sm:p-8">
            <div className="font-script text-abcs-red text-5xl mb-2 -rotate-2">06</div>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase mb-4">LIMITATION DE RESPONSABILITÉ</h2>
            <p className="font-bold opacity-80">O&apos;ldev s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées. Concernant les liens externes, O&apos;ldev n&apos;est pas responsable du contenu des sites tiers.</p>
          </div>

          <div className="border-4 border-abcs-black p-5 sm:p-8">
            <div className="font-script text-abcs-red text-5xl mb-2 -rotate-2">07</div>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase mb-4">LOI APPLICABLE</h2>
            <p className="font-bold opacity-80">Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </div>
        </div>
      </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
