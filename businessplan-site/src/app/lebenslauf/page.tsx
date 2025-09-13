import Footer from "@components/layout/Footer";
import { getTranslations, getLocale } from 'next-intl/server';
import CVTimeline from "../components/chapters/sections/CVTimeline";
import PrintButton from "@/app/components/cv/PrintButton";
import CopyButton from "@/app/components/cv/CopyButton";
import VCardButton from "@/app/components/cv/VCardButton";
import CVJsonLd from "@/app/components/cv/CVJsonLd";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Metadata } from 'next';
import CVCoverPage from "@/components/document/CVCoverPage";
import ClosingPage from "@/components/document/ClosingPage";

export default async function LebenslaufRedirect() {
  const t = await getTranslations('cv');
  const locale = await getLocale();
  // Serverseitig i18n-Daten laden (keine inline-async IIFE im JSX)
  let skillsCategories: { name: string; items: string[] }[] = [];
  try {
    const raw = t.raw('skills.categories') as unknown;
    if (Array.isArray(raw)) skillsCategories = raw as { name: string; items: string[] }[];
  } catch {}
  let languages: { name: string; level: string }[] = [];
  try {
    const raw = t.raw('languages.items') as unknown;
    if (Array.isArray(raw)) languages = raw as { name: string; level: string }[];
  } catch {}
  let summaryBullets: string[] = [];
  try {
    const raw = t.raw('summary.bullets') as unknown;
    if (Array.isArray(raw)) summaryBullets = raw as string[];
  } catch {}
  // abgeleitete summaryChips entfernt (nicht genutzt)

  // Chips im Kopfbereich deaktiviert: keine Badges anzeigen
  const chips: string[] = [];

  // chipIcon entfernt – wir verwenden rein textuelle Chips

  // Theme (Light/Dark) aware chip color styles per semantic category (maximal subtil/edel)
  const chipTheme = (label: string) => {
    const l = label.toLowerCase();
    // Sanierung & Skalierung / Growth
    if (/(sanierung|turnaround|scal|wachstum|growth)/.test(l)) {
      return {
        badge:
          "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] md:text-[11px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] hover:bg-[--color-surface-2]/70 text-[--color-foreground]",
        dot: "bg-emerald-500/50 dark:bg-emerald-400/50",
        icon: "text-[--color-foreground-muted]",
      } as const;
    }
    // Technologie
    if (/(ai|robot|blockchain|tech|technologie|technology|r&d|f&e)/.test(l)) {
      return {
        badge:
          "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] md:text-[11px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] hover:bg-[--color-surface-2]/70 text-[--color-foreground]",
        dot: "bg-indigo-500/50 dark:bg-indigo-400/50",
        icon: "text-[--color-foreground-muted]",
      } as const;
    }
    // Operative Exzellenz
    if (/(operativ|operation|prozess|process|procure|logistik|logistics|compliance)/.test(l)) {
      return {
        badge:
          "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] md:text-[11px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] hover:bg-[--color-surface-2]/70 text-[--color-foreground]",
        dot: "bg-sky-500/50 dark:bg-sky-400/50",
        icon: "text-[--color-foreground-muted]",
      } as const;
    }
    // Leadership & Netzwerk
    if (/(leader|netzwerk|network|coaching|mentor|partnerschaft)/.test(l)) {
      return {
        badge:
          "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] md:text-[11px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] hover:bg-[--color-surface-2]/70 text-[--color-foreground]",
        dot: "bg-fuchsia-500/50 dark:bg-fuchsia-400/50",
        icon: "text-[--color-foreground-muted]",
      } as const;
    }
    // Default
    return {
      badge:
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] md:text-[11px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] hover:bg-[--color-surface-2]/70 text-[--color-foreground]",
      dot: "bg-slate-500/40 dark:bg-slate-400/40",
      icon: "text-[--color-foreground-muted]",
    } as const;
  };

  return (
    <>
      {/* Print-only CV cover page */}
      <div className="hidden print:block">
        <CVCoverPage />
      </div>
      <main id="content" role="main" className="min-h-screen bg-[--color-background] py-6 md:py-8">
      {/* Structured data for SEO */}
      <CVJsonLd locale={locale} />
      {/* Main Frame */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-5 lg:px-6">
        <div className="rounded-2xl bg-[--color-surface] shadow-sm ring-1 ring-[--color-border-subtle] print:bg-transparent print:ring-0 print:shadow-none">
          <div className="px-4 sm:px-6 py-5 md:py-8">
      <header className="max-w-4xl mx-auto">
        {/* Accent Gradient Header (dezent in Blau) */}
        <div className="h-px rounded-t-lg bg-[--color-border-subtle]/60 mb-4 print:hidden" />
        <div className="mb-4 print:hidden">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md ring-1 ring-[--color-border-subtle] bg-[--color-surface-2] text-[--color-foreground] hover:bg-[--color-surface] hover:ring-[--color-border] transition-colors"
            aria-label={t("backToPlan", { default: "Zurück zum Businessplan" })}
          >
            <span aria-hidden>←</span>
            <span>{t("backToPlan", { default: "Zurück zum Businessplan" })}</span>
          </Link>
        </div>
        {/* Top-right utility links entfernt */}
        <div className="grid md:grid-cols-1 lg:grid-cols-1 items-center justify-items-center gap-4 md:gap-6 text-center md:text-center">
          {/* Linke Spalte: Avatar */}
          <div className="flex md:block justify-center md:justify-center mt-0">
            <div className="relative h-[88px] w-[112px] md:h-[120px] md:w-[152px] rounded-xl p-[2px] bg-[conic-gradient(from_140deg,theme(colors.indigo.500)_0%,theme(colors.emerald.400)_40%,theme(colors.sky.500)_80%,theme(colors.indigo.500)_100%)] shadow-sm ring-1 ring-[--color-border-subtle] overflow-hidden">
              <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[radial-gradient(120%_120%_at_50%_50%,var(--color-surface)_0%,var(--color-surface-2)_100%)]">
                <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(160%_140%_at_50%_50%,_black_94%,_rgba(0,0,0,0.98)_105%,_transparent_160%)]" aria-hidden />
                <div className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_1.2px)] [background-size:6px_6px]" aria-hidden />
                <Image
                  src="/cv/profile.jpg"
                  alt="Profilfoto Ismet Mesic"
                  width={304}
                  height={240}
                  className="h-full w-full object-cover object-[48%_18%]"
                  priority
                />
              </div>
            </div>
          </div>
          {/* Rechte Spalte: Titel, Meta, Chips, Utility */}
          <div className="px-2 md:px-0">
            <div className="space-y-4">
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[--color-foreground-strong] text-center">
                  {t("pageTitle", { default: "Ismet Mesic" })}
                </h1>
                <p className="text-base md:text-lg text-[--color-foreground-muted] mt-1.5 mb-1.5 leading-[1.65] text-center">
                  {t("pageSubtitle", {
                    default:
                      "Executive – Unternehmer, Innovator, Sanierer, Mentor & Forscher",
                  })}
                </p>
                {/* Meta-Zeile: Availability • WorkMode • Location */}
                <div className="text-[12px] md:text-[13px] text-[--color-foreground] opacity-80 md:opacity-75 tracking-[0.01em] leading-tight mt-1 flex items-center md:justify-center justify-center gap-1.5">
                  <span>{t("availability", { default: "Verfügbar: Teilzeit · Projektbasis" })}</span>
                  <span className="opacity-40" aria-hidden>•</span>
                  <span>{t("workMode", { default: "Remote‑first | DACH" })}</span>
                  <span className="opacity-40" aria-hidden>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-[10px] w-[10px] opacity-65" aria-hidden />
                    {t("location", { default: "Wien, AT" })}
                  </span>
                </div>
                {chips.length > 0 && (
                  <div className="flex flex-wrap md:justify-center justify-center gap-1 pt-1.5 md:pt-2 mb-2.5 md:mb-3.5" aria-label={t('summary.title', { default: 'Executive Summary' })}>
                    {chips.map((c, i) => {
                      const theme = chipTheme(c);
                      return (
                        <span
                          key={`sum-chip-${i}`}
                          className={`${theme.badge} transition-colors bg-gradient-to-br from-[--color-surface] to-[--color-surface-2] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}
                        >
                          <span className={`inline-block h-1 w-1 rounded-full ${theme.dot}`} aria-hidden />
                          {c}
                        </span>
                      );
                    })}
                  </div>
                )}
                {/* Utility-Reihe kompakt unter den Chips */}
                {(() => {
                  const email = t('contact.email', { default: 'ismet@mesic.dev' });
                  const location = t('location', { default: 'Wien, AT' });
                  return (
                    <div className="mt-1.5 flex items-center md:justify-center justify-center gap-2 text-[11px] md:text-[12px] text-[--color-foreground]">
                      <a
                        href={`mailto:${email}`}
                        className="hover:text-[--color-primary] transition-colors underline-offset-2 hover:underline"
                        aria-label={`${t('contact.open', { default: 'Öffnen:' })} ${email}`}
                        title={email}
                      >
                        {email}
                      </a>
                      <span className="opacity-35" aria-hidden>•</span>
                      <CopyButton
                        text={email}
                        label={t('contact.copyEmail', { default: 'E-Mail kopieren' })}
                        successLabel={t('contact.copied', { default: 'Kopiert' })}
                        ariaLabel={t('contact.copyEmailAria', { default: 'E-Mail-Adresse kopieren' })}
                      />
                      <span className="opacity-35" aria-hidden>•</span>
                      <VCardButton fullName="Ismet Mesic" email={email} location={location} />
                      <span className="opacity-35" aria-hidden>•</span>
                      <PrintButton className="bg-transparent hover:bg-[--muted]/40 ring-1 ring-[--color-border-subtle] text-[--color-foreground-muted] hover:text-[--color-foreground]" />
                    </div>
                  );
                })()}
              </div>
              {/* Ende Titel-/Chips-Stack */}
            </div>
          </div>
          {/* Grid-Container schließen und Header beenden, bevor die Summary-Sektion beginnt */}
        </div> {/* end grid container */}
      </header>

            {/* Executive Summary – dezent/edel */}
            <section id="cv-summary" className="mt-6 md:mt-7 max-w-4xl mx-auto" aria-label={t('summary.title', { default: 'Executive Summary' })}>
              <div className="grid grid-cols-1 gap-4 md:gap-5 items-start">
                {/* Summary links */}
                {summaryBullets.length > 0 && (
                  <div className="col-span-12 self-stretch">
                    <div className="rounded-xl p-4 md:p-5 ring-1 ring-[--color-border-subtle]/50 bg-[--color-surface]/40 supports-[backdrop-filter]:backdrop-blur-md shadow-sm">
                      <h2 id="cv-summary-heading" className="text-[16px] md:text-[18px] font-semibold tracking-tight text-[--color-foreground-strong] mb-3">
                        {t('summary.title', { default: 'Executive Summary' })}
                      </h2>
                      <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3.5">
                        {summaryBullets.map((b, i) => (
                          <li
                            key={`s-${i}`}
                            className="grid grid-cols-[14px_1fr] items-start gap-2.5"
                          >
                            {/* Edler Dot mit Halo */}
                            <span
                              className="relative mt-[7px] inline-block h-2.5 w-2.5 rounded-full bg-emerald-400/90 ring-1 ring-emerald-300/60 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]"
                              aria-hidden
                            />
                            <span className="text-[13.5px] md:text-[15px] leading-[1.6] text-[--color-foreground] opacity-95">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>

      <section id="cv-timeline" className="max-w-4xl mx-auto mt-7 md:mt-9 mb-8 md:mb-10">
        {/* Client-Komponente mit Animationen */}
        <CVTimeline compactLevel="md" techPriority={false} deckMode={false} deckScrollLinked={false} showHeading={true} />
      </section>

      {/* Skills & Sprachen */}
      <section id="cv-skills" className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skills */}
        <div className="bg-[--color-surface] rounded-xl p-4 md:p-5 ring-1 ring-[--color-border-subtle]">
          <h2 className="text-base md:text-lg font-semibold text-[--color-foreground-strong] mb-2.5">{t('skills.title', { default: 'Expertise & Technologies' })}</h2>
          <div className="space-y-2.5">
            {skillsCategories.map((cat, i) => (
              <div key={`${cat.name}-${i}`}> 
                <h3 className="text-sm font-medium text-[--color-foreground-strong] mb-1.5">{cat.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((it, j) => (
                    <span
                      key={`${cat.name}-${j}`}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] hover:bg-[--color-surface-2]/70 text-[--color-foreground]"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <PrintButton className="bg-transparent hover:bg-[--muted]/40 ring-1 ring-[--color-border-subtle] text-[--color-foreground-muted] hover:text-[--color-foreground]" />
        </div>
        {/* Sprachen */}
        <div className="bg-[--color-surface] rounded-xl p-4 md:p-5 ring-1 ring-[--color-border-subtle]">
          <h2 className="text-base md:text-lg font-semibold text-[--color-foreground-strong] mb-2.5">{t('languages.title', { default: 'Languages' })}</h2>
          <div className="space-y-2">
            {languages.map((lng, i) => (
              <div key={`${lng.name}-${i}`} className="flex items-center justify-between p-2 rounded-md ring-1 ring-[--color-border-subtle] bg-[--color-surface-2]">
                <span className="text-sm text-[--color-foreground-strong]">{lng.name}</span>
                <span className="px-2.5 py-0.5 text-xs rounded bg-[--color-surface] ring-1 ring-[--color-border-subtle] text-[--color-foreground]">{lng.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      </div> {/* end px wrapper */}
    </div> {/* end rounded card wrapper */}
  </div> {/* end container */}
      {/* Print-Fußzeile: Seite X/Y, Datum */}
      {(() => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('de-AT', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const timeStr = now.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
        return (
          <div aria-hidden className="print-footer print:show">
            <div className="print-footer__inner">
              <span className="print-footer__left">Ismet Mesic — CV</span>
              <span className="print-footer__center">
                Seite <span className="page" /> / <span className="pages" />
              </span>
              <span className="print-footer__right">Stand: {dateStr} {timeStr}</span>
            </div>
          </div>
        );
      })()}
      </main>
      {/* Print-only closing/contact page */}
      <div className="hidden print:block">
        <ClosingPage />
      </div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cv');
  const locale = await getLocale();
  const title = t('pageTitle', { default: 'Lebenslauf Ismet Mesic' });
  const description = t('pageSubtitle', {
    default: 'Berufserfahrung, Projekte und Engagements – klar strukturiert mit interaktiver Timeline.',
  });
  const url = `/${locale}/lebenslauf`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      locale,
      siteName: 'Businessplan & CV',
      images: [
        { url: '/cv/profile.jpg', width: 1200, height: 630, alt: 'Profil – Ismet Mesic' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/cv/profile.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  } as const;
}
