"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslations, useFormatter, useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Store, Sparkles } from 'lucide-react';
import { Sora } from 'next/font/google';

// Kräftige, seriöse Display-Schrift
const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700','800']
});

type CoverPageProps = {
  preview?: boolean; // optional: zum Anzeigen im Screen-Modus
  versionOverride?: string | undefined; // optional: Version vom Server (z. B. aus package.json)
};

const CoverPage: React.FC<CoverPageProps> = ({ preview = false, versionOverride }) => {
  const t = useTranslations('coverPage');
  const format = useFormatter();
  const now = new Date();
  const dateISO = now.toISOString().slice(0, 10);
  const year = now.getFullYear();
  const reduceMotion = useReducedMotion();
  const locale = useLocale();
  const [qrHref, setQrHref] = React.useState<string | null>(null);
  // Unique gradient id to avoid collisions if the component renders multiple times
  const gradId = React.useId();
  React.useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // QR: direkt auf den Businessplan-PDF-Export für die aktuelle Locale
    const loc = locale || 'de';
    const target = origin ? `${origin}/${loc}/export/businessplan` : '';
    setQrHref(target || null);
  }, [locale]);

  // i18n mit sicheren Fallbacks
  const tt = (key: string, fallback: string) => {
    try { return (t(key) as string) || fallback; } catch { return fallback; }
  };

  // Untertitel typografisch in sinnvolle Satzblöcke teilen (ohne Textinhalt zu ändern)
  const subtitleText = tt(
    'subtitle',
    'Spezialisiert auf den Humanoid‑Robotics App‑Store: Haushalts‑Roboter als Service (RaaS) – alltägliche Aufgaben, modulare Apps und nahtlose Updates. Unsere Plattform vereint Hardware, App‑Ökosystem und KI‑Assistenz für den praktischen Einsatz zu Hause – heute skalierbar, morgen Standard. Mit Partner‑Ökosystem, Security by Design und Privacy als Grundprinzip ebnen wir den Weg für alltagstaugliche humanoide Assistenz.'
  );
  const subtitleSegments = React.useMemo(
    () => subtitleText.split(/(?<=\.)\s+(?=[A-ZÄÖÜ])/),
    [subtitleText]
  );

  // Framer Motion: Props nur setzen, wenn Motion gewünscht ist (vermeidet undefined-Typen bei exactOptionalPropertyTypes)
  const motionProps = reduceMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      } as const;

  return (
    <>
      {/* Skip-Link für Tastaturnutzer */}
      <a href="#cover-main" className="skip-link">Zum Inhalt springen</a>
    <motion.div
      {...motionProps}
      className={[
        'cover-page relative',
        preview ? 'block' : 'print:block hidden',
        // Edler Screen-Rahmen, im Druck neutral
        'print:absolute print:top-0 print:left-0 print:w-full print:h-full',
        'print:rounded-none print:shadow-none print:ring-0',
        'rounded-3xl ring-1 ring-[--color-border-subtle] shadow-sm overflow-hidden bg-[--color-surface]'
      ].join(' ')}
    >
      {/* Wasserzeichen-Hintergrund entfernt */}
      {/* Dezente Vignette (abgeschwächt) */}
      <div className="print:hidden absolute inset-0 -z-10 pointer-events-none">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(110% 70% at 50% 24%, rgba(16,185,129,0.015), rgba(0,0,0,0) 38%), radial-gradient(100% 60% at 50% 92%, rgba(56,189,248,0.015), rgba(0,0,0,0) 38%)'
          }}
        />
      </div>

      {/* Inhalt */}
      <div className="flex flex-col items-center justify-start min-h-[100dvh] text-center px-5 sm:px-7 pt-0 pb-0">
        {/* Brand/Logo-Zeile – im normalen Fluss */}
        <header role="banner" aria-label="Brand" className="w-full">
          <div className="mt-4 md:mt-5 xl:mt-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-[2px] ring-1 ring-[--color-border-subtle] px-2.5 py-0.5 shadow-sm/50">
              <Image
                src="/icon-512.svg"
                alt="SIGMACODE Logo"
                width={12}
                height={12}
                className="h-[12px] w-[12px] rounded-sm"
                priority
              />
              <span className="text-[10.5px] font-medium tracking-[0.02em] text-[--color-foreground]">SIGMACODE AI Robotics</span>
              <span aria-hidden className="text-[--color-border]">•</span>
              <span className="text-[9.5px] uppercase tracking-[0.14em] text-[--color-foreground-muted]">Businessplan · {year}</span>
            </div>
          </div>
        </header>
  <main id="cover-main" role="main" className="pt-6 md:pt-8">
        {/* Icon entfernt */}
        {/* Titel mit Brand-Gradient */}
        <h1
          className={`${sora.className} mt-0 text-5xl md:text-7xl xl:text-8xl font-extrabold tracking-[-0.015em] leading-[1.16] md:leading-[1.18] xl:leading-[1.2] bg-gradient-to-r from-emerald-600/65 via-cyan-600/65 to-sky-600/65 bg-clip-text text-transparent dark:from-emerald-400/87 dark:via-cyan-400/87 dark:to-sky-500/87 max-w-[15ch] mx-auto drop-shadow-[0_0.9px_0_rgba(0,0,0,0.06)] [font-feature-settings:'ss01','ss02','liga','clig','tnum'] [text-wrap:balance]`}
          aria-describedby="cover-subtitle"
        >
          {tt('title', 'Geschäftsplan')}
        </h1>
        {/* Subtile Trennlinie unter dem Titel */}
        <div aria-hidden className="mt-1 h-px w-56 bg-gradient-to-r from-transparent via-[--color-border-subtle] to-transparent" />

        {/* Badges direkt unter dem Titel */}
        <div className="mt-2 flex flex-col items-center gap-1.5 mx-auto">
          <ul className="m-0 flex flex-wrap justify-center items-center gap-2 md:gap-2.5 text-left leading-none list-none p-0 [&>li]:mt-0">
            <li className="flex items-center">
              <div className="chip-anim inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 h-[28px] leading-none whitespace-nowrap border-gradient bg-[color-mix(in_oklab,var(--color-surface)_92%,transparent)] supports-[backdrop-filter]:backdrop-blur-[2px]">
                <Store className="h-[13px] w-[13px] align-middle text-[--color-foreground-muted]" aria-hidden />
                <span className="text-[11px] tracking-[0.02em] leading-[1] text-[--color-foreground-muted]">{tt('value.appstore', 'Kuratiertes KI‑App‑Ökosystem · Developer‑Store')}</span>
              </div>
            </li>
            <li className="flex items-center">
              <div className="chip-anim inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 h-[28px] leading-none whitespace-nowrap border-gradient bg-[color-mix(in_oklab,var(--color-surface)_92%,transparent)] supports-[backdrop-filter]:backdrop-blur-[2px]">
                <Image
                  src="/icon-512.svg"
                  alt="SIGMACODE Logo"
                  width={13}
                  height={13}
                  className="h-[13px] w-[13px] align-middle rounded-sm opacity-80"
                />
                <span className="text-[11px] tracking-[0.02em] leading-[1] text-[--color-foreground-muted]">{tt('value.humanoid', 'Humanoide Robotik · praxisnah & sicher')}</span>
              </div>
            </li>
            <li className="flex items-center">
              <div className="chip-anim inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 h-[28px] leading-none whitespace-nowrap border-gradient bg-[color-mix(in_oklab,var(--color-surface)_92%,transparent)] supports-[backdrop-filter]:backdrop-blur-[2px]">
                <Sparkles className="h-[13px] w-[13px] align-middle text-[--color-foreground-muted]" aria-hidden />
                <span className="text-[11px] tracking-[0.02em] leading-[1] text-[--color-foreground-muted]">{tt('value.aas', 'Agents as a Service · Aufgaben statt Apps')}</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Untertitel unter den Badges */}
        <p
          id="cover-subtitle"
          className="mt-2 mb-0 text-[14.5px] md:text-[16px] text-[--color-foreground-muted] leading-[1.38] max-w-[60ch] md:max-w-[64ch] mx-auto [font-feature-settings:'ss01','ss02','liga','clig','tnum'] [text-wrap:balance]"
        >
          {subtitleSegments.map((seg, i) => (
            <span key={i} className="block">
              {seg}
            </span>
          ))}
        </p>

        {/* Version */}
        <div className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 bg-[color-mix(in_srgb,var(--muted)_16%,transparent)] ring-1 ring-[--color-border-subtle]">
          <span className="text-[--color-foreground-muted]">{tt('versionLabel', 'Version')}:</span>
          <span className="font-medium tracking-tight">{(versionOverride || process.env.NEXT_PUBLIC_APP_VERSION || tt('version', 'v1.0')) as string}</span>
          <span aria-hidden className="text-[--color-border]">•</span>
          <time className="text-[--color-foreground-muted]" dateTime={dateISO}>{dateISO}</time>
        </div>

        {/* Meta */}
        <div className="mt-6 md:mt-8 grid gap-1 text-[14px] text-[--color-foreground] md:grid-flow-col md:auto-cols-max [font-feature-settings:'tnum'] justify-center items-center text-center">
          <div className="inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 bg-[color-mix(in_srgb,var(--muted)_16%,transparent)] ring-1 ring-[--color-border-subtle]">
            <span className="text-[--color-foreground-muted]">{tt('date', 'Datum')}:</span>
            <time className="font-medium" dateTime={dateISO}>{format.dateTime(now, { dateStyle: 'long' })}</time>
          </div>
          <div className="inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 bg-[color-mix(in_srgb,var(--muted)_16%,transparent)] ring-1 ring-[--color-border-subtle]">
            <span className="text-[--color-foreground-muted]">{tt('preparedFor', 'Vorbereitet für')}:</span>
            <span className="font-medium">{tt('companyName', 'Investoren & Förderstellen')}</span>
          </div>
          {qrHref ? (
            <a
              href={qrHref}
              target="_blank"
              rel="noreferrer noopener"
              className="mx-auto md:mx-0 mt-1 inline-flex items-center gap-2 rounded-lg px-2 py-1 ring-1 ring-[--color-border-subtle] bg-[--color-surface]/85 supports-[backdrop-filter]:backdrop-blur-[3px] hover:bg-[--color-surface] transition-colors shadow-sm"
              aria-label="Pitch-Deck öffnen"
              aria-describedby="pitch-desc"
            >
              {/* Externer QR-Generator – leichtgewichtig, kein Zusatz-Paket */}
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(qrHref)}`}
                alt="QR Code"
                width={28}
                height={28}
                unoptimized
                loading="lazy"
                decoding="async"
                className="h-7 w-7 print:h-10 print:w-10 rounded-sm ring-1 ring-[--color-border-subtle]"
              />
              <span className="text-[11px] text-[--color-foreground-muted]">{tt('openPitch', 'Pitch-Deck öffnen')}</span>
              <span id="pitch-desc" className="sr-only">Öffnet das Pitch‑Deck in neuem Tab</span>
            </a>
          ) : null}
        </div>

        {/* Kontaktblock */}
        <div className="mt-5 md:mt-6 grid gap-2 text-[13.5px] md:text-[14px] text-[--color-foreground] [font-feature-settings:'tnum'] justify-center text-center">
          <div className="text-[--color-foreground-muted] uppercase tracking-wide text-[11px]">{tt('contact.title', 'Kontakt')}</div>
          <div className="flex flex-col gap-1">
            <div>
              <span className="text-[--color-foreground-muted]">{tt('contact.person', 'Ansprechpartner')}: </span>
              <span className="font-medium">{tt('contact.personName', 'Michael S. (Managing Director)')}</span>
            </div>
            <div>
              <span className="text-[--color-foreground-muted]">{tt('contact.email', 'E‑Mail')}: </span>
              <a href={`mailto:${tt('contact.emailAddress', 'contact@sigmacode.ai')}`} className="no-underline hover:underline">{tt('contact.emailAddress', 'contact@sigmacode.ai')}</a>
            </div>
            <div>
              <span className="text-[--color-foreground-muted]">{tt('contact.phone', 'Telefon')}: </span>
              <a href={`tel:${tt('contact.phoneNumber', '+43 660 0000000')}`} className="no-underline hover:underline">{tt('contact.phoneNumber', '+43 660 0000000')}</a>
            </div>
            <div>
              <span className="text-[--color-foreground-muted]">{tt('contact.address', 'Adresse')}: </span>
              <span className="font-medium">{tt('contact.addressValue', 'SIGMACODE AI Robotics · Wien, Österreich')}</span>
            </div>
          </div>
        </div>

      </main>
      </div>

      {/* Page break hinter dem Deckblatt im Druck */}
      <div className="page-break-after" />
    </motion.div>
    {/* Vertraulichkeitshinweis (am Seitenende, druckbar) */}
    <div className="mt-4 px-5 print:px-0 text-center text-[11.5px] leading-snug text-[--color-foreground-muted] max-w-[80ch] mx-auto">
      {tt(
        'confidential',
        'Vertraulich & urheberrechtlich geschützt. Dieses Dokument enthält proprietäre Informationen und ist ausschließlich für die adressierten Empfänger bestimmt. Eine Weitergabe, Vervielfältigung oder Veröffentlichung – vollständig oder in Teilen – ist ohne vorherige schriftliche Zustimmung untersagt.'
      )}
    </div>
    </>
  );
};

export default CoverPage;
