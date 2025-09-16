"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslations, useFormatter, useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot, Store, Sparkles } from 'lucide-react';
import { Sora } from 'next/font/google';

// Kräftige, seriöse Display-Schrift
const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700','800']
});

type CoverPageProps = {
  preview?: boolean; // optional: zum Anzeigen im Screen-Modus
};

const CoverPage: React.FC<CoverPageProps> = ({ preview = false }) => {
  const t = useTranslations('coverPage');
  const format = useFormatter();
  const now = new Date();
  const dateISO = now.toISOString().slice(0, 10);
  const year = now.getFullYear();
  const reduceMotion = useReducedMotion();
  useLocale();
  const [qrHref, setQrHref] = React.useState<string | null>(null);
  const gradId = React.useId();
  React.useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // QR mit Link zum Pitch-Deck (kompakter Businessplan)
    const target = origin ? `${origin}/pitch` : '';
    setQrHref(target || null);
  }, []);

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
      {/* Sehr dezenter Wasserzeichen-Hintergrund (neutral, druckfreundlich) */}
      <div className="print:hidden absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <Bot aria-hidden className="h-[42vmin] w-[42vmin] opacity-[0.012] dark:opacity-[0.02] text-[--color-foreground]" />
      </div>
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
              <Bot aria-hidden className="h-[12px] w-[12px] text-emerald-500" />
              <span className="text-[10.5px] font-medium tracking-[0.02em] text-[--color-foreground]">SIGMACODE AI Robotics</span>
              <span aria-hidden className="text-[--color-border]">•</span>
              <span className="text-[9.5px] uppercase tracking-[0.14em] text-[--color-foreground-muted]">Businessplan · {year}</span>
            </div>
          </div>
        </header>
        <main id="cover-main" role="main" className="pt-6 md:pt-8">
        {/* Bot-Icon oberhalb des Titels – identische Farbverlauf-Optik wie der Titeltext */}
        <div className="flex items-center justify-center" aria-hidden>
          <div className="mt-1 mb-2 md:mb-3">
            {/* Gradient-Variablen passend zum Titel */}
            <div className="relative [--g1:#059669] [--g2:#0891b2] [--g3:#0284c7] dark:[--g1:#34d399] dark:[--g2:#22d3ee] dark:[--g3:#0ea5e9]" style={{ width: 96, height: 96 }}>
              {/* Definiere den Verlauf außerhalb des lucide-Icons (lucide-Icons rendern keine children) */}
              <svg width="0" height="0" aria-hidden className="absolute">
                <defs>
                  <linearGradient id={gradId as any} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--g1)" />
                    <stop offset="50%" stopColor="var(--g2)" />
                    <stop offset="100%" stopColor="var(--g3)" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Custom Robo-Mark mit expliziten Augen/Ohren (an Titel-Icon angelehnt) */}
              <svg
                className="drop-shadow-[0_0.9px_0_rgba(0,0,0,0.06)]"
                width={96}
                height={96}
                viewBox="0 0 24 24"
                role="img"
                aria-label="Roboter-Icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Antenne */}
                <line x1="12" y1="3" x2="12" y2="5.5" stroke={`url(#${gradId})`} strokeWidth="2.25" strokeLinecap="round" />
                <circle cx="12" cy="2.2" r="1.1" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.0" />

                {/* Kopf */}
                <rect x="4" y="6" width="16" height="12" rx="3.2" ry="3.2" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.25" />

                {/* Ohren (Seiten) */}
                <line x1="3" y1="10" x2="3" y2="14" stroke={`url(#${gradId})`} strokeWidth="2.25" strokeLinecap="round" />
                <line x1="21" y1="10" x2="21" y2="14" stroke={`url(#${gradId})`} strokeWidth="2.25" strokeLinecap="round" />

                {/* Augen */}
                <circle cx="9" cy="11" r="1.4" fill={`url(#${gradId})`} stroke={`url(#${gradId})`} strokeWidth="0.8" />
                <circle cx="15" cy="11" r="1.4" fill={`url(#${gradId})`} stroke={`url(#${gradId})`} strokeWidth="0.8" />

                {/* Mund */}
                <line x1="8" y1="15" x2="16" y2="15" stroke={`url(#${gradId})`} strokeWidth="2.25" strokeLinecap="round" />
              </svg>
              {/* Overlay-Coverband: verdeckt Augen/Ohren zunächst (y≈12..16) und blendet sich nach 1s aus → Reveal */}
              {reduceMotion ? (
                <svg className="absolute inset-0 z-10 pointer-events-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="0" y="12" width="24" height="4" fill="var(--color-surface)" />
                </svg>
              ) : (
                <motion.svg
                  className="absolute inset-0 z-10 pointer-events-none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -24 }}
                  transition={{ delay: 0.25, duration: 0.35, ease: ([0.22, 1, 0.36, 1] as [number, number, number, number]) }}
                  aria-hidden
                >
                  <rect x="0" y="12" width="24" height="4" fill="var(--color-surface)" />
                </motion.svg>
              )}
              {/* Subtile Scan-Animation (verdeckt nicht, nur leichter Glanz) */}
              {reduceMotion ? null : (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-y-1 left-0 h-[calc(100%+4px)] w-6 rounded-sm"
                  initial={{ x: -28, opacity: 0.0 }}
                  animate={{ x: 108, opacity: 0.45 }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatType: 'loop', ease: ([0.22, 1, 0.36, 1] as [number, number, number, number]) }}
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(0,0,0,0) 0%, color-mix(in_oklab, var(--g2)_45%, transparent) 50%, rgba(0,0,0,0) 100%)'
                  }}
                />
              )}
            </div>
          </div>
        </div>
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
                <Bot className="h-[13px] w-[13px] align-middle text-[--color-foreground-muted]" aria-hidden />
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

      </main>
      </div>

      {/* Page break hinter dem Deckblatt im Druck */}
      <div className="page-break-after" />
    </motion.div>
    </>
  );
};

export default CoverPage;
