import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import './print.css';
import I18nProvider from "@/i18n/I18nProvider";
import { getLocale } from "next-intl/server";
import { getMessages, type SupportedLocale } from "@/i18n/messages";
import Header from "@components/layout/Header";
import { ThemeProvider } from "next-themes";
import PrintHeaderFooter from "@components/print/PrintHeaderFooter";
import MotionProvider from "@components/animation/MotionProvider";
import ThemeMarker from "@/app/components/theme/ThemeMarker";
import { cookies, headers } from "next/headers";

// Zentrale Aggregation der Messages inkl. top-level "content"-Bundling
const getAppMessages = async (locale: SupportedLocale) => {
  return await getMessages(locale);
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "SIGMACODE AI Robotics – Businessplan",
  description: "Mehrsprachiger Businessplan (DE/EN) – SIGMACODE AI Robotics",
  metadataBase: new URL(siteUrl),
  keywords: [
    "Businessplan",
    "AI",
    "Humanoide Robotik",
    "RaaS",
    "Go-To-Market",
    "Financial Plan",
    "Technology Roadmap",
  ],
  alternates: {
    languages: {
      de: "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "SIGMACODE AI Robotics",
    title: "SIGMACODE AI Robotics – AI Businessplan",
    description: "High-Level AI Businessplan (DE/EN): Produkt, Technologie, GTM, Finanzen.",
    locale: "de_AT",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGMACODE AI Robotics – AI Businessplan",
    description: "Produkt, Technologie, GTM und Finanzen – kompakt & hochwertig.",
    creator: "@sigmacode_ai",
  },
  // Favicon/Icons explizit setzen – bevorzugt das Robo-Icon (SVG)
  icons: {
    icon: [
      { url: "/icon.svg" },
    ],
    shortcut: [
      "/icon.svg",
    ],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0ea5e9" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawLocale = await getLocale();
  // next-intl Middleware setzt das Cookie NEXT_LOCALE → das nutzen wir mit Priorität,
  // damit Pfadpräfixe wie "/en" sicher den html lang steuern, selbst wenn getLocale() zu früh ist
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  // SSR Theme-Vorbelegung für E2E/Determinismus
  const initialTheme = (cookieStore.get("theme")?.value || "light") as string;
  // Header-Heuristik: Wenn der angefragte Pfad mit "/en" beginnt, priorisiere EN
  const hdrs = await headers();
  const matched = hdrs.get("x-matched-path") || hdrs.get("x-invoke-path") || hdrs.get("x-nextjs-route") || "";
  const pathSuggestsEn = matched === "/en" || matched.startsWith("/en/");
  const primary = pathSuggestsEn ? "en" : ((cookieLocale ?? rawLocale) || "de");
  // Auf 2-letter Locale normalisieren, um regionale Varianten wie de-AT abzufangen
  const normalizedLocale = (primary.split("-")[0] === "en" ? "en" : "de") as SupportedLocale;
  // Aggregierte Sprachpakete laden (inkl. content-Bundling)
  const messages = await getAppMessages(normalizedLocale);

  return (
    <html lang={normalizedLocale} suppressHydrationWarning data-scroll-behavior="smooth" data-theme={initialTheme}>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeMarker />
          <MotionProvider>
          <I18nProvider messages={messages} locale={normalizedLocale} timeZone="Europe/Vienna">
            {/* Skip-Link for accessibility */}
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded"
            >
              Zum Inhalt springen
            </a>
            <Header />
            <PrintHeaderFooter />
            <main id="content" role="main" className="min-h-dvh focus:outline-none">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </I18nProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
