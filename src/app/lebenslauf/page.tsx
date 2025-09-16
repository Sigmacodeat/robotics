import Footer from "@components/layout/Footer";
import { getTranslations, getLocale } from 'next-intl/server';
import CVTimeline from "@components/chapters/sections/CVTimeline";
import PrintButton from "@components/cv/PrintButton";
import CopyButton from "@components/cv/CopyButton";
import VCardButton from "@components/cv/VCardButton";
import CVJsonLd from "@components/cv/CVJsonLd";
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

  // Chips-Logik entfernt – nicht in Verwendung

  // sameAs Links aus i18n (LinkedIn/GitHub etc.)
  const sameAs: string[] = [
    t('contact.linkedin', { default: '' }) as unknown as string,
    t('contact.github', { default: '' }) as unknown as string,
  ].filter((x) => typeof x === 'string' && x.trim().startsWith('http')) as string[];

  return (
    <>
      {/* Print-only CV cover page */}
      <div className="hidden print:block">
        <CVCoverPage />
      </div>
      <main id="content" role="main" className="min-h-screen bg-[--color-background] py-4 md:py-8">
      {/* Structured data for SEO */}
      <CVJsonLd locale={locale} sameAs={sameAs} />
      {/* Main Frame */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-5 lg:px-6 overflow-visible">
        <div className="rounded-none bg-transparent shadow-none ring-0 overflow-visible print:bg-transparent print:ring-0 print:shadow-none">
          <div className="px-3 sm:px-6 py-4 md:py-8 overflow-visible">
      <header className="max-w-4xl mx-auto">
        {/* Accent Gradient Header (dezent in Blau) */}
        <div className="h-px rounded-t-lg bg-[--color-border-subtle]/60 mb-4 print:hidden" />
        <div className="mb-3 print:hidden">
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
        <div className="grid md:grid-cols-1 lg:grid-cols-1 items-center justify-items-center gap-3 md:gap-5 text-center md:text-center">
          {/* Linke Spalte: Avatar */}
          <div className="flex md:block justify-center md:justify-center mt-0">
            <div className="relative w-[96px] h-[120px] md:w-[152px] md:h-[196px] rounded-xl p-[2px] bg-[conic-gradient(from_140deg,theme(colors.indigo.500)_0%,theme(colors.emerald.400)_40%,theme(colors.sky.500)_80%,theme(colors.indigo.500)_100%)] shadow-sm ring-1 ring-[--color-border-subtle] overflow-hidden">
              <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[radial-gradient(120%_120%_at_50%_50%,var(--color-surface)_0%,var(--color-surface-2)_100%)]">
                <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(160%_140%_at_50%_50%,_black_94%,_rgba(0,0,0,0.98)_105%,_transparent_160%)]" aria-hidden />
                <div className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_1.2px)] [background-size:6px_6px]" aria-hidden />
                <Image
                  src="/cv/profile.jpg"
                  alt="Profilfoto Ismet Mesic"
                  fill
                  sizes="(max-width: 768px) 112px, 152px"
                  className="object-cover object-[50%_20%] md:object-[50%_24%]"
                  quality={90}
                  priority
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
          {/* Rechte Spalte: Titel, Meta, Chips, Utility */}
          <div className="px-2 md:px-0">
            <div className="space-y-4">
              <div className="space-y-3">
                <h1 className="text-base md:text-xl lg:text-2xl font-semibold tracking-tight text-[--color-foreground-strong] text-center">
                  <span className="align-middle mr-2">Ismet Mesic</span>
                  <span
                    className="align-middle inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] md:text-xs lowercase font-light tracking-wide
                               text-[--color-foreground-muted]
                               bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-accent)_8%,transparent),color-mix(in_oklab,var(--color-accent-3)_8%,transparent))]
                               ring-1 ring-[color-mix(in_oklab,color-mix(in_oklab,var(--color-accent)_50%,var(--color-accent-3)_50%)_35%,transparent)]
                               shadow-[inset_0_0_0_1px_color-mix(in_oklab,color-mix(in_oklab,var(--color-accent)_50%,var(--color-accent-3)_50%)_18%,transparent)]
                               backdrop-blur-[0.5px]"
                    aria-label="Titel: Ingenieur"
                    title="ing"
                  >
                    ing
                  </span>
                </h1>
                <p className="text-sm md:text-base text-[--color-foreground-muted] mt-1 mb-1.5 leading-[1.6] text-center">
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
                {/* Hinweis: Chips entfernt, um Layout ruhiger zu halten */}
                {/* Utility-Reihe kompakt unter den Chips */}
                {(() => {
                  const email = t('contact.email', { default: 'ismet@mesic.dev' });
                  const location = t('location', { default: 'Wien, AT' });
                  return (
                    <div className="mt-1.5 flex flex-wrap items-center md:justify-center justify-center gap-1.5 text-[11px] md:text-[12px] text-[--color-foreground]">
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

            {/* Executive Summary – dezente, graue Card (konsistent zu anderen Cards) */}
            <section
              id="cv-summary"
              className="mt-3 md:mt-6 max-w-4xl mx-auto"
              aria-label={t('summary.title', { default: 'Executive Summary' })}
            >
              {summaryBullets.length > 0 && (
                <div className="rounded-xl border shadow-sm 
                  [background:color-mix(in_oklab,var(--color-surface)_88%,black)]
                  dark:[background:color-mix(in_oklab,var(--color-surface)_82%,white)]
                  [border-color:color-mix(in_oklab,var(--color-border-strong)_78%,transparent)]
                  shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-border-strong)_65%,transparent)]">
                  <div className="px-3.5 md:px-5 pt-3 md:pt-4">
                    <h2
                      id="cv-summary-heading"
                      className="text-[12px] md:text-[13px] font-medium tracking-[0.02em] text-[--color-foreground-strong]"
                    >
                      {t('summary.title', { default: 'Executive Summary' })}
                    </h2>
                  </div>
                  <div className="mx-3.5 md:mx-5 mt-2 h-px 
                    [background:color-mix(in_oklab,var(--color-border-strong)_72%,transparent)]" aria-hidden />
                  <div className="px-3.5 md:px-5 py-3 md:py-4">
                    <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 md:gap-2.5">
                      {summaryBullets.map((b, i) => (
                        <li key={`s-${i}`} className="flex items-start gap-2.5">
                          <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full 
                            [background:color-mix(in_oklab,var(--color-surface)_94%,black)] dark:[background:color-mix(in_oklab,var(--color-surface)_88%,white)]
                            [border:1px_solid_color-mix(in_oklab,var(--color-border-strong)_80%,transparent)] text-emerald-500">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.07 7.073a1 1 0 01-1.415 0L3.296 9.856a1 1 0 111.414-1.415l3.096 3.096 6.364-6.364a1 1 0 011.534.117z" clipRule="evenodd"/></svg>
                          </span>
                          <span className="text-[12px] md:text-[13.5px] leading-[1.55] text-[--color-foreground]">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </section>

      <section id="cv-timeline" className="mt-7 md:mt-9 mb-8 md:mb-10 overflow-visible">
        {/* Client-Komponente mit Animationen */}
        <CVTimeline compactLevel="sm" techPriority={false} deckMode={false} deckScrollLinked={false} showHeading={true} />
      </section>

      {/* Skills & Sprachen */}
      <section id="cv-skills" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Skills */}
        <div className="bg-[--color-surface] rounded-xl p-3.5 md:p-5 ring-1 ring-[--color-border-subtle]">
          <h2 className="text-sm md:text-lg font-semibold text-[--color-foreground-strong] mb-2">{t('skills.title', { default: 'Expertise & Technologies' })}</h2>
          <div className="space-y-2">
            {skillsCategories.map((cat, i) => (
              <div key={`${cat.name}-${i}`}> 
                <h3 className="text-[13px] font-medium text-[--color-foreground-strong] mb-1.5">{cat.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((it, j) => (
                    <span
                      key={`${cat.name}-${j}`}
                      className="inline-flex items-center gap-1.5 px-1.5 py-[2px] text-[10.5px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] hover:bg-[--color-surface-2]/70 text-[--color-foreground]"
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
        <div className="bg-[--color-surface] rounded-xl p-3.5 md:p-5 ring-1 ring-[--color-border-subtle]">
          <h2 className="text-sm md:text-lg font-semibold text-[--color-foreground-strong] mb-2">{t('languages.title', { default: 'Languages' })}</h2>
          <div className="space-y-1.5">
            {languages.map((lng, i) => (
              <div key={`${lng.name}-${i}`} className="flex items-center justify-between p-1.5 rounded-md ring-1 ring-[--color-border-subtle] bg-[--color-surface-2]">
                <span className="text-[13px] text-[--color-foreground-strong]">{lng.name}</span>
                <span className="px-2 py-[2px] text-[11px] rounded bg-[--color-surface] ring-1 ring-[--color-border-subtle] text-[--color-foreground]">{lng.level}</span>
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
  const title = t('pageTitle', { default: 'Ismet Mesic' });
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
