import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import './print.css';
import I18nProvider from "@/i18n/I18nProvider";
import { getLocale } from "next-intl/server";
import { getMessages, type SupportedLocale } from "@/i18n/messages";
import ClientLayout from "./ClientLayout";

// Central message aggregation including top-level "content" bundling
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
  title: {
    template: "%s | Business Plan",
    default: "Business Plan",
  },
  description: "Business Plan Application",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Business Plan",
    description: "Business Plan Application",
    url: "/",
    siteName: "Business Plan",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Plan",
    description: "Business Plan Application",
    creator: "@yourtwitter",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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

// This is a server component that handles initial rendering
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawLocale = await getLocale();
  
  // Simple locale detection based on raw locale
  const primary = rawLocale || "de";
  
  // Normalize to 2-letter locale
  const normalizedLocale = (primary.split("-")[0] === "en" ? "en" : "de") as SupportedLocale;
  const messages = await getAppMessages(normalizedLocale);

  // Pass the initial locale to the client component
  return (
    <html lang={normalizedLocale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <I18nProvider locale={normalizedLocale} messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </I18nProvider>
      </body>
    </html>
  );
}
