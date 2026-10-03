import type { Metadata, Viewport } from "next";
import { Inter, Archivo_Black, Archivo, Caveat } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ContactModalProvider from "@/components/ContactModalProvider";
import CookieBanner from "@/components/CookieBanner";
import { OWNER, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
});

// Variable width (wdth axis) for the condensed hero titles
const archivoFlex = Archivo({
  variable: "--font-archivo-flex",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Only used on /legal — not preloaded on every page
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: OWNER, url: SITE_URL }],
  creator: OWNER,
  keywords: [
    "développeur web freelance",
    "développeur web freelance Île-de-France",
    "création site internet Seine-et-Marne",
    "développeur web Brie-Comte-Robert",
    "création site internet",
    "site vitrine",
    "site sur-mesure",
    "développeur Next.js",
    "développeur React",
    "site WordPress",
    "WooCommerce",
    "refonte site web",
    "Othmane Bouakline",
    "O'ldev",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Google Search Console « balise HTML » : NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION sur Vercel
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${archivoBlack.variable} ${archivoFlex.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-black">
          <ContactModalProvider>
            <CustomCursor />
            <CookieBanner />
            <LenisProvider>
              <Navbar />
              <div className="flex-1 flex flex-col">{children}</div>
            </LenisProvider>
          </ContactModalProvider>
      </body>
    </html>
  );
}
