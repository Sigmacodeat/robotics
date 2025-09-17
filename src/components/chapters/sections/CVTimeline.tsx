"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMessages, useTranslations, useLocale } from "next-intl";
import { z } from "zod";
import TimelineEventCard from "@/components/chapters/timeline/TimelineEventCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Briefcase, GraduationCap, Layers } from "lucide-react";
import { variantsMap, defaultTransition } from "@/components/chapters/timeline/variants";

export type TimelineItem = {
  period: string; // e.g. "2023–Heute"
  title: string; // Role / Degree
  subtitle?: string | undefined; // Company / Institution
  bullets?: string[] | undefined; // Achievements / responsibilities
  /** Optional: Klassifizierung, falls in i18n gepflegt. Fallback via Heuristik. */
  kind?: 'work' | 'education';
};

const TimelineItemSchema = z.object({
  period: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  kind: z.enum(['work', 'education']).optional(),
});
const TimelineArraySchema = z.array(TimelineItemSchema);

interface CVTimelineProps {
  items?: TimelineItem[];
  /** Deprecated: use compactLevel instead. If true, behaves like compactLevel='sm'. */
  compact?: boolean;
  /** Fine-grained compactness: 'sm' | 'md' | 'lg' (default: derived from compact or 'lg') */
  compactLevel?: 'sm' | 'md' | 'lg';
  /** Priorisiere Technologie-relevante Einträge (AI, Robotics, Cloud, ML). Default: true */
  techPriority?: boolean;
  /** Pitchdeck-/Slides-Modus: horizontaler Snap-Scroller. Default: false */
  deckMode?: boolean;
  /** Verknüpfe vertikales Page‑Scrolling mit seitlicher Slide‑Bewegung. Default: true */
  deckScrollLinked?: boolean;
  /** Scrollrichtung im Deck‑Modus: 'ltr' oder 'rtl'. Default: 'rtl' (von rechts nach links einblenden) */
  deckScrollDirection?: 'ltr' | 'rtl';
  /** Dunkle/helle Rand‑Vignetten für Tiefe im Deck‑Modus. Default: false */
  deckVignette?: boolean;
  /** Überschrift innerhalb der Komponente anzeigen. Default: true */
  showHeading?: boolean;
  /** Zeige die Segment-Filter (Alle/Beruflich/Schulisch). Default: false */
  showFilters?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CVTimeline: React.FC<CVTimelineProps> = ({ items, compact, compactLevel, techPriority = true, deckMode = false, deckScrollLinked: _deckScrollLinked = true, deckScrollDirection = 'rtl', deckVignette = false, showHeading = true, showFilters = false }) => {
  const t = useTranslations("cv");
  const messages = useMessages() as Record<string, unknown> | undefined;
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  // Segment-Filter: 'all' | 'work' | 'education'
  const [segment, setSegment] = useState<'all' | 'work' | 'education'>('all');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Deck nur ab md-Viewport aktiv (mobile vertikal)
  const [isDeck, setIsDeck] = useState<boolean>(false);
  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)') : null;
    const update = () => {
      setIsDeck(Boolean(deckMode && mq?.matches));
    };
    update();
    mq?.addEventListener('change', update);
    return () => mq?.removeEventListener('change', update);
  }, [deckMode]);

  // Segment initial aus URL (?seg) oder localStorage lesen – nur wenn Filter sichtbar
  useEffect(() => {
    if (!showFilters) return;
    try {
      const fromUrl = (searchParams?.get('seg') ?? '').toLowerCase();
      const isValid = fromUrl === 'all' || fromUrl === 'work' || fromUrl === 'education';
      if (isValid) {
        setSegment(fromUrl as 'all' | 'work' | 'education');
        return;
      }

      const ls = typeof window !== 'undefined' ? window.localStorage.getItem('cvSegment') : null;
      if (ls === 'all' || ls === 'work' || ls === 'education') setSegment(ls as any);
    } catch {}
  }, [showFilters, searchParams]);

  // Segment in URL (shallow) & localStorage persistieren – nur wenn Filter sichtbar
  useEffect(() => {
    if (!showFilters) return;
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('cvSegment', segment);
      if (!pathname || !searchParams) return;
      const params = new URLSearchParams(searchParams.toString());
      if (segment === 'all') {
        params.delete('seg');
      } else {
        params.set('seg', segment);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    } catch {}
  }, [segment, pathname, searchParams, router, showFilters]);

  // Bei Segmentwechsel: aktuellen Index zurücksetzen und Deck-Scroller an den Anfang
  useEffect(() => {
    setCurrentIdx(0);
    if (!isDeck) return;
    const el = deckRef.current; if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    el.scrollLeft = deckScrollDirection === 'rtl' ? max : 0;
  }, [segment, isDeck, deckScrollDirection]);

  // Determine size from compactLevel or legacy compact flag
  const size: 'sm' | 'md' | 'lg' = compactLevel ?? (compact ? 'sm' : 'lg');

  const fallbackItems: TimelineItem[] = useMemo(() => (
    [
      {
        period: t("fallback.0.period"),
        title: t("fallback.0.title"),
        subtitle: t("fallback.0.subtitle"),
        bullets: [t("fallback.0.bullets.0"), t("fallback.0.bullets.1")],
      },
      {
        period: t("fallback.1.period"),
        title: t("fallback.1.title"),
        subtitle: t("fallback.1.subtitle"),
        bullets: [t("fallback.1.bullets.0")],
      },
    ]
  ), [t]);

  // Prefer explicit items prop, then i18n-driven cv.items, then fallback
  const itemsFromI18n = useMemo(() => {
    const root = messages as Record<string, unknown> | undefined;
    if (!root || typeof root !== "object") return undefined;
    const cvRaw = "cv" in root ? (root["cv"] as unknown) : undefined;
    if (!cvRaw || typeof cvRaw !== "object") return undefined;
    const cvObj = cvRaw as Record<string, unknown>;
    return "items" in cvObj ? (cvObj["items"] as unknown) : undefined;
  }, [messages]);

  // einfache Scoring-Funktion für Tech-Priorisierung
  const scoreItem = (it: TimelineItem): number => {
    const text = `${it.title} ${it.subtitle ?? ''} ${(it.bullets ?? []).join(' ')}`.toLowerCase();
    // expand weights list
    const patterns: [RegExp, number][] = [
      [/(ai|künstliche intelligenz)/g, 3],
      [/(robot|robotik|humanoid)/g, 3],
      [/(ml|machine learning|diffusion|transformer|policy)/g, 2],
      [/(perception|planning|controls|ros2|sdk)/g, 2],
      [/(cloud|edge|inferenz|triton|tensorrt)/g, 1],
    ];
    let score = 0;
    for (const [re, w] of patterns) {
      if (re.test(text)) score += w;
    }
    return score;
  };

  const data: TimelineItem[] = useMemo(() => {
    // 1) Explicit prop via Zod
    if (items && TimelineArraySchema.safeParse(items).success) return items;
    // 2) i18n-driven items via Zod
    const parsed = itemsFromI18n ? TimelineArraySchema.safeParse(itemsFromI18n) : undefined;
    if (parsed?.success) {
      const arr = parsed.data as TimelineItem[];
      if (!techPriority) return arr;
      // stabile Sortierung: tech score desc, ansonsten Originalreihenfolge
      return arr
        .map((it, i) => ({ it, i, s: scoreItem(it) }))
        .sort((a, b) => (b.s - a.s) || (a.i - b.i))
        .map(x => x.it);
    }
    // 3) fallback
    return fallbackItems;
  }, [items, itemsFromI18n, fallbackItems, techPriority]);

  // Heuristik zur Klassifizierung, wenn kind fehlt
  const getKind = (it: TimelineItem): 'work' | 'education' => {
    if (it.kind === 'work' || it.kind === 'education') return it.kind;
    const hay = `${it.title} ${it.subtitle ?? ''} ${(it.bullets ?? []).join(' ')}`.toLowerCase();
    const edu = [
      /schule|schulisch|ausbildung|studium|hochschule|universität|universitaet|college|campus/,
      /bachelor|master|diplom|ph\.?d|doktor|msc|bsc|mba/,
      /matura|abitur|gymnasium|htl|hak|fh|tu|uni/,
      /kurs|lehrgang|zertifikat|certificate|bootcamp/,
    ];
    if (edu.some(re => re.test(hay))) return 'education';
    return 'work';
  };

  const dataFiltered = useMemo(() => {
    if (segment === 'all') return data;
    return data.filter((it) => getKind(it) === segment);
  }, [data, segment]);

  const headingId = "cv-timeline-heading";

  // Deck-Ref
  const deckRef = useRef<HTMLUListElement>(null);

  // Section-Ref für IO und Sticky Header
  const sectionRef = useRef<HTMLElement>(null);

  // Aktuelle Slide via IntersectionObserver ermitteln (nur deckMode)
  useEffect(() => {
    const rootEl = deckRef.current ?? sectionRef.current; if (!rootEl) return;
    const items = Array.from(rootEl.querySelectorAll('[data-cv-idx]')) as HTMLElement[];
    if (items.length === 0) return;
    const options: IntersectionObserverInit = deckRef.current
      ? { root: rootEl, threshold: [0.5, 0.75, 0.9], rootMargin: '0px 0px 0px 0px' }
      : { root: null, threshold: 0.6, rootMargin: '-20% 0px -20% 0px' };
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const idxAttr = (visible.target as HTMLElement).getAttribute('data-cv-idx');
        const idxNum = idxAttr ? parseInt(idxAttr, 10) : 0;
        if (!Number.isNaN(idxNum)) setCurrentIdx(idxNum);
      }
    }, options);
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [deckMode, dataFiltered.length]);

  // Alle Parallax-/Follow-Effekte entfernt – wir nutzen nur IO für currentIdx

  return (
    <section ref={sectionRef} className={`relative w-full ${size === 'sm' ? 'py-10 md:py-12' : size === 'md' ? 'py-12 md:py-14' : 'py-14 md:py-18'} scroll-mt-20`} role="region" aria-labelledby={headingId}>
      {showHeading && (
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2
            id={headingId}
            className={`${size === 'sm' ? 'text-base md:text-lg mb-3.5 md:mb-5' : size === 'md' ? 'text-lg md:text-xl mb-4.5 md:mb-6' : 'text-xl md:text-2xl mb-5 md:mb-7'} font-semibold tracking-tight leading-[1.12] text-[--color-foreground-strong] text-center`}
          >
            {t("title")}
          </h2>
        </div>
      )}

      {/* Mittellinie und bewegte Badge entfernt */}

      {/* Neuer: Sticky-Header für aktuellen Zeitraum (mobil & desktop) */}
      {!isDeck && (
        <div className="sticky top-16 z-30 flex justify-center print:hidden">
          <span className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] md:text-[13px] font-medium ring-1 ring-[--color-border] bg-[--color-surface] text-[--color-foreground] shadow-sm">
            {dataFiltered[currentIdx]?.period ?? ''}
          </span>
        </div>
      )}

      {/* Bewegte seitliche Badge entfernt */}

      {/* Inhalt statisch, keine Parallax; nutzt den vorhandenen Seiten-Container */}
      <div className="relative w-full">

      {showFilters && (
        <div className="mb-4 md:mb-5 grid grid-cols-3 gap-1.5 p-1 rounded-full ring-1 ring-[var(--color-border)] bg-[var(--color-surface)]/70 supports-[backdrop-filter]:backdrop-blur-sm print:hidden" role="tablist" aria-label={t('filter.title', { default: 'Filter' })}>
          {([
            { key: 'all' as const, label: t('filter.all', { default: 'Alle' }), icon: Layers },
            { key: 'work' as const, label: t('filter.work', { default: 'Beruflich' }), icon: Briefcase },
            { key: 'education' as const, label: t('filter.education', { default: 'Schulisch' }), icon: GraduationCap },
          ]).map((opt) => {
            const Icon = opt.icon;
            const selected = segment === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`cv-filter-panel`}
                onClick={() => setSegment(opt.key)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]
                  ${selected
                    ? 'bg-[var(--color-surface)] text-[--color-foreground] ring-[var(--color-border)]'
                    : 'bg-[var(--color-surface)]/60 text-[--color-foreground] ring-[var(--color-border)]/60 hover:bg-[var(--color-surface)]'}
                `}
              >
                <Icon aria-hidden className="h-[14px] w-[14px] opacity-90" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Carousel Controls (nur im Deck‑Modus) */}
      {isDeck && (
        <div className="relative mb-2 flex items-center justify-between gap-2 print:hidden">
          {/* Dots */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label={t('title')}>
            {dataFiltered.map((_, i) => (
              <button
                key={`dot-${i}`}
                role="tab"
                aria-selected={currentIdx === i}
                aria-controls={`cv-slide-${i}`}
                className={`h-1.5 rounded-full transition-all duration-240 ease-[cubic-bezier(.45,.05,.55,.95)] ${currentIdx === i ? 'w-8 bg-[--color-foreground-strong]' : 'w-3 bg-[--color-border]'}`}
                aria-label={`${i + 1} / ${dataFiltered.length}`}
                tabIndex={0}
                onClick={() => {
                  const root = deckRef.current; if (!root) return;
                  const el = root.querySelector(`[data-cv-idx='${i}']`) as HTMLElement | null;
                  el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
              >
                <span className="sr-only">{`${i + 1} / ${dataFiltered.length}`}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs ring-1 ring-[var(--color-border)] bg-[var(--color-surface)]/70 supports-[backdrop-filter]:backdrop-blur-sm hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            onClick={() => {
              const el = deckRef.current; if (!el) return; el.scrollBy({ left: -el.clientWidth * 0.8, behavior: 'smooth' });
            }}
            aria-label={t('less', { default: 'Vorheriger Slide' })}
          >
            ←
            <span className="sr-only">{t('less', { default: 'Vorheriger Slide' })}</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs ring-1 ring-[--color-border] bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm hover:bg-[--color-surface] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]"
            onClick={() => {
              const el = deckRef.current; if (!el) return; el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
            }}
            aria-label={t('more', { default: 'Nächster Slide' })}
          >
            →
            <span className="sr-only">{t('more', { default: 'Nächster Slide' })}</span>
          </button>
        </div>
      )}

      {isDeck && deckVignette && (
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-14 bg-gradient-to-r from-[--color-background] via-[--color-background]/40 to-transparent/0" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-14 bg-gradient-to-l from-[--color-background] via-[--color-background]/40 to-transparent/0" />
        </div>
      )}
      {/* A11y: Live-Region für aktuelle Slide-Position im Deck-Modus */}
      {isDeck && (
        <div aria-live="polite" className="sr-only" id="cv-deck-status">
          {`${currentIdx + 1} / ${dataFiltered.length}`}
        </div>
      )}
      <motion.ul
        ref={deckRef}
        className={isDeck
          ? `relative flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`
          : `relative flex flex-col ${size === 'sm' ? 'gap-4 md:gap-6' : size === 'md' ? 'gap-5 md:gap-6' : 'gap-5 md:gap-7'}`}
        aria-label={t('title')}
        {...(isDeck ? { 'aria-roledescription': 'carousel' } : {})}
        role="list"
        {...(isDeck ? { tabIndex: 0, onKeyDown: (e: React.KeyboardEvent<HTMLUListElement>) => {
          const el = deckRef.current; if (!el) return;
          const page = el.clientWidth * 0.8;
          if (e.key === 'ArrowRight') { e.preventDefault(); el.scrollBy({ left: page, behavior: 'smooth' }); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); el.scrollBy({ left: -page, behavior: 'smooth' }); }
          if (e.key === 'Home') { e.preventDefault(); el.scrollTo({ left: 0, behavior: 'smooth' }); }
          if (e.key === 'End') { e.preventDefault(); el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' }); }
        }} : {})}
      >
        {/* keine absolute Linie mehr – Mittellinie ist die mittlere Grid‑Spalte pro Item */}
        {dataFiltered.map((item, idx) => {
          const itemId = `cv-item-${idx}`;
          const titleId = `${itemId}-title`;
          const periodId = `${itemId}-period`;
          return (
            <motion.li
              key={`${item.period}-${idx}`}
              className={isDeck ? 'list-none shrink-0 snap-start w-[85%] md:w-[65%] lg:w-[55%] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] rounded-xl' : 'list-none w-full'}
              {...(isDeck ? { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${idx + 1} / ${dataFiltered.length}`, 'aria-setsize': dataFiltered.length, 'aria-posinset': idx + 1 } : { role: 'listitem' })}
              id={`cv-slide-${idx}`}
            >
              {!isDeck && (() => {
                return (
                  <div className="col-span-full w-full">
                    <div className={`grid grid-cols-1 justify-items-center items-center ${size === 'sm' ? 'gap-4' : size === 'md' ? 'gap-5' : 'gap-6'} w-full`}>
                      {/* Einspaltiges Layout: Card mittig */}
                      <div className="flex flex-col justify-center items-center w-full">
                        <div className="mb-2 md:mb-2.5">
                          <span id={periodId} className={`${size === 'sm' ? 'h-6 md:h-7 px-1.5 text-[11.5px] md:text-[12.5px]' : size === 'md' ? 'h-7 md:h-8 px-2 text-[12px] md:text-[13px]' : 'h-8 md:h-9 px-2.5 text-[12.5px] md:text-[14px]'} inline-flex items-center rounded-full md:px-3 font-medium text-[--color-foreground] ring-1 ring-inset ring-[--color-border]/35 shadow-sm bg-[--color-surface-2] [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]`}>
                            <span className="sr-only">{t('period', { default: 'Zeitraum' })}: </span>
                            {item.period}
                          </span>
                        </div>
                        <motion.div
                          role="article"
                          tabIndex={0}
                          aria-labelledby={`${titleId} ${periodId}`}
                          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] rounded-xl w-full mx-auto min-h-[300px] md:min-h-[320px]"
                          data-cv-idx={idx}
                          variants={variantsMap.cardEnter}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.35, margin: '-10% 0px -10% 0px' }}
                          transition={defaultTransition}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); const next = document.querySelector(`[data-cv-idx='${idx + 1}']`) as HTMLElement | null; next?.focus(); }
                            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); const prev = document.querySelector(`[data-cv-idx='${idx - 1}']`) as HTMLElement | null; prev?.focus(); }
                            if (e.key === 'Home') { e.preventDefault(); const first = document.querySelector(`[data-cv-idx='0']`) as HTMLElement | null; first?.focus(); }
                            if (e.key === 'End') { e.preventDefault(); const last = document.querySelector(`[data-cv-idx='${dataFiltered.length - 1}']`) as HTMLElement | null; last?.focus(); }
                          }}
                        >
                          <TimelineEventCard
                            size={size}
                            title={item.title}
                            {...(item.subtitle ? { subtitle: item.subtitle } : {})}
                            {...(item.bullets ? { bullets: item.bullets } : {})}
                            kind={getKind(item)}
                            bulletsId={`${itemId}-bullets`}
                            headerUnderline="none"
                            rightAside={(() => {
                              const yrs = item.period.match(/\d{4}/g) || [];
                              const xLabels = yrs.length ? [yrs[0], yrs[yrs.length - 1]] as [string, string] : undefined;
                              return <TimelineSparkline active={currentIdx === idx} title={item.title} {...(item.subtitle ? { subtitle: item.subtitle } : {})} {...(xLabels ? { xLabels } : {})} />;
                            })()}
                            asidePosition={(idx % 2 === 0) ? 'right' : 'left'}
                          />
                        </motion.div>
                      </div>

                      {/* Statistikseite entfernt – Sparkline ist jetzt innerhalb der Card (rightAside) */}
                    </div>
                  </div>
                );
              })()}
              {isDeck && (
                <motion.div
                  animate={{
                    scale: currentIdx === idx ? 1.02 : 1,
                    opacity: currentIdx === idx ? 1 : 0.9,
                  }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  className={`rounded-2xl ${currentIdx === idx ? 'ring-1 ring-[--color-border]' : 'ring-0'} bg-transparent`}
                >
                  <TimelineEventCard
                    size={size}
                    title={item.title}
                    {...(item.subtitle ? { subtitle: item.subtitle } : {})}
                    {...(item.bullets ? { bullets: item.bullets } : {})}
                    kind={getKind(item)}
                    bulletsId={`${itemId}-bullets`}
                    headerUnderline="none"
                    rightAside={(() => {
                      const yrs = item.period.match(/\d{4}/g) || [];
                      const xLabels = yrs.length ? [yrs[0], yrs[yrs.length - 1]] as [string, string] : undefined;
                      return <TimelineSparkline title={item.title} {...(item.subtitle ? { subtitle: item.subtitle } : {})} {...(xLabels ? { xLabels } : {})} />;
                    })()}
                    asidePosition={(idx % 2 === 0) ? 'right' : 'left'}
                  />
                </motion.div>
              )}
            </motion.li>
          );
        })}
        {(!data || data.length === 0) && (
          <li className="md:col-span-2 list-none">
            <div className="rounded-xl bg-[--color-surface] ring-1 ring-[--color-border-subtle] p-6">
              <h2 className="text-lg font-semibold text-[--color-foreground-strong] mb-1">{t("empty.title", { default: "Keine Einträge" })}</h2>
              <p className="text-[--color-foreground] opacity-90">{t("empty.description", { default: "Es liegen keine Einträge vor." })}</p>
            </div>
          </li>
        )}
      </motion.ul>
      {/* Mobile Progress-Bar entfernt */}

      {/* Mobile: CTA „Weiter“ (zum nächsten Item springen) */}
      {!isDeck && (
        <div className="md:hidden fixed inset-x-0 bottom-3 z-30 flex justify-center print:hidden">
          {currentIdx < Math.max(0, dataFiltered.length - 1) && (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface]/70 backdrop-blur-[2px] text-[--color-foreground] shadow-sm"
              onClick={() => {
                try { (navigator as any)?.vibrate?.(10); } catch {}
                const next = sectionRef.current?.querySelector(`[data-cv-idx='${currentIdx + 1}']`) as HTMLElement | null;
                next?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              aria-label={t('more', { default: 'Nächster Eintrag' })}
            >
              <span className="text-[12px] font-medium">Weiter</span>
              <span aria-hidden>↓</span>
            </button>
          )}
        </div>
      )}
      </div>
    </section>
  );
};

export default CVTimeline;

// --- Sparkline Neben der Timeline (vereinfachte Version mit Jahreslabels) ---
type PerfItem = {
  period: string;
  company: string;
  value: number;
  growth: number;
  employees?: number;
  description: string;
  series?: number[];
  startCapital?: number;
};

const PerfArraySchema = z.array(
  z.object({
    period: z.string(),
    company: z.string(),
    value: z.number(),
    growth: z.number(),
    employees: z.number().optional(),
    description: z.string(),
    series: z.array(z.number()).optional(),
    startCapital: z.number().optional(),
  })
);

function usePerformanceFromI18n(): PerfItem[] {
  const messages = useMessages();
  return useMemo(() => {
    const root = messages as Record<string, unknown> | undefined;
    if (!root || typeof root !== 'object') return [];
    const cvRaw = 'cv' in root ? (root['cv'] as unknown) : undefined;
    if (!cvRaw || typeof cvRaw !== 'object') return [];
    const cvObj = cvRaw as Record<string, unknown>;
    const perfRaw = 'performance' in cvObj ? (cvObj['performance'] as unknown) : undefined;
    if (!perfRaw || typeof perfRaw !== 'object') return [];
    const perfObj = perfRaw as Record<string, unknown>;
    const itemsRaw = 'items' in perfObj ? (perfObj['items'] as unknown) : undefined;
    if (!itemsRaw) return [];
    const parsed = PerfArraySchema.safeParse(itemsRaw);
    const base = parsed.success ? (parsed.data as PerfItem[]) : [];
    const extras: PerfItem[] = [
      {
        period: '05/2022–02/2024',
        company: 'Cutting Edge d.o.o.',
        value: 10.5,
        growth: 202,
        description: 'Turnaround',
        series: [-10.4, -3.0, 3.5, 10.5],
      },
    ];
    const merged = [...base];
    for (const ex of extras) if (!merged.some((it) => it.company === ex.company)) merged.push(ex);
    return merged;
  }, [messages]);
}

const nfDecimalAT = new Intl.NumberFormat('de-AT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nfIntAT = new Intl.NumberFormat('de-AT', { maximumFractionDigits: 0 });

export const TimelineSparkline: React.FC<{ title: string; subtitle?: string; active?: boolean; xLabels?: [string, string] }> = ({ title, subtitle, active, xLabels }) => {
  const perf = usePerformanceFromI18n();
  const match = useMemo(() => {
    const hay = `${title} ${subtitle ?? ''}`;
    return perf.find((p) => hay.includes(p.company));
  }, [perf, title, subtitle]);
  const isMediStore = useMemo(() => {
    const hay = (match?.company ?? subtitle ?? title).toLowerCase();
    return hay.includes('medistore') || hay.includes('medstore');
  }, [match, subtitle, title]);
  const isKryptoMix = useMemo(() => {
    const hay = `${title} ${subtitle ?? ''}`.toLowerCase();
    return hay.includes('krypto') && hay.includes('mining');
  }, [title, subtitle]);
  const isMscinvest = useMemo(() => {
    const hay = (match?.company ?? subtitle ?? title).toLowerCase();
    return hay.includes('mscinvest');
  }, [match, subtitle, title]);
  const isCoin2Cash = useMemo(() => {
    const hay = (match?.company ?? subtitle ?? title).toLowerCase();
    return hay.includes('coin2cash');
  }, [match, subtitle, title]);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(wrapperRef, { once: false, margin: '-20% 0px -20% 0px' });
  // Trigger Neuzeichnen bei Größenänderung
  const [resizeTick, setResizeTick] = React.useState(0);
  React.useEffect(() => {
    const el = wrapperRef.current ?? canvasRef.current; if (!el) return;
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setResizeTick((n) => n + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const cssW = canvas.clientWidth || canvas.width;
    const cssH = canvas.clientHeight || canvas.height;
    const W = Math.max(1, Math.floor(cssW * dpr));
    const H = Math.max(1, Math.floor(cssH * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }

    const width = cssW, height = cssH;
    const padX = 10, padTop = 8, padBottom = 32;
    const series = match?.series ?? [ (match?.value ?? 5) * 0.5, (match?.value ?? 5) * 0.75, (match?.value ?? 5) * 0.9, (match?.value ?? 5) ];
    const n = series.length;
    // Referenz: erster Punkt – relative Änderung in % gegen |base|, damit negative Startwerte korrekt positiv skaliert werden
    const base = series[0] ?? 1;
    const safeBaseAbs = Math.max(1e-6, Math.abs(base));
    const rel = series.map(v => ((v - base) / safeBaseAbs) * 100); // Prozent relativ zu |base|
    // auf [0, 1000] für einheitlichen Maßstab klemmen (0% Basislinie bis 1000% Top)
    const relClamped = rel.map(p => Math.max(0, Math.min(1000, p)));
    // Falls ein expliziter growth-Wert vorhanden ist, Endpunkt daran ausrichten (0..1000)
    if (typeof match?.growth === 'number' && Number.isFinite(match.growth)) {
      relClamped[relClamped.length - 1] = Math.max(0, Math.min(1000, match.growth));
    }
    const relMin = 0;
    const usableW = width - padX * 2 - 2;
    const Hdraw = height - padTop - padBottom;
    const denom = 1000; // fester Maßstab 0..1000%

    // Zeitachsen‑Mapping: Linie soll bei tatsächlichem Periodenende enden (z. B. Feb 2024),
    // auch wenn die X‑Achse (Labels) bis 2025 erweitert ist.
    const parseMYLocal = (s?: string) => {
      if (!s) return null as null | { m: number; y: number };
      const rx = /(\d{1,2})\/(\d{4})/;
      const m = rx.exec(s);
      if (!m) return null;
      const mm = Math.max(1, Math.min(12, parseInt(m[1]!, 10)));
      const yy = parseInt(m[2]!, 10);
      return { m: mm, y: yy };
    };

    // Versuche Perioden-Parsing aus match.period (z. B. "05/2022–02/2024")
    let startMY_local: { m: number; y: number } | null = null;
    let endMY_local: { m: number; y: number } | null = null;
    if (typeof match?.period === 'string') {
      const parts = match.period.split(/\s*[–-]\s*/);
      startMY_local = parseMYLocal(parts[0]);
      endMY_local = parseMYLocal(parts[1]);
    }

    // Realer Zeitraum (Linien-Daten) und Achsen-Zeitraum (Labels, ggf. bis 2025 erweitert)
    const totalMonthsReal = (startMY_local && endMY_local)
      ? ((endMY_local.y - startMY_local.y) * 12 + (endMY_local.m - startMY_local.m))
      : null;
    const endYearFromX_forLine = (xLabels && xLabels[1]) ? parseInt(xLabels[1], 10) : NaN;
    const endMY_axis = (startMY_local && endMY_local && !Number.isNaN(endYearFromX_forLine) && Number.isFinite(endYearFromX_forLine) && endYearFromX_forLine > endMY_local.y)
      ? { m: 12, y: endYearFromX_forLine }
      : endMY_local;
    const totalMonthsAxis = (startMY_local && endMY_axis)
      ? ((endMY_axis.y - startMY_local.y) * 12 + (endMY_axis.m - startMY_local.m))
      : totalMonthsReal;

    const pts = relClamped.map((p, i) => {
      // X‑Position: wenn Start/Ende bekannt, Punkte relativ zum ACHSEN-Zeitraum platzieren
      let xRel = (i / Math.max(1, n - 1));
      if (totalMonthsReal !== null && totalMonthsReal > 0 && startMY_local && (totalMonthsAxis ?? 0) > 0) {
        const monthPos = Math.round(xRel * totalMonthsReal); // 0..totalMonthsReal (letzter Punkt = reales Ende)
        // Auf Achsen-Ende normalisieren (z. B. bis Dez 2025), damit die Linie bei Feb 2024 vor 2025 endet
        xRel = monthPos / (totalMonthsAxis as number);
      }
      const x = padX + xRel * usableW;
      const norm = (p - relMin) / denom; // 0..1 innerhalb 0..1000
      const y = padTop + (1 - norm) * Hdraw;
      return { x, y };
    });

    // Optionales Re-Positionieren des Endpunkts: Nutzerwunsch – zwischen 2024 und 2025 visualisieren
    // Nur für Cutting Edge und wenn Achsenzeitraum bis 2025 reicht.
    let desiredEndX = width - padX; // default wird später mit rightGutter zu xStop präzisiert
    let xDesiredForFirst: number | null = null;
    if (match?.company?.includes('Cutting Edge') && startMY_local && (totalMonthsAxis ?? 0) > 0 && xLabels?.[1] === '2025') {
      // Ziel: exakte Mitte zwischen 2024 und 2025 => 2024.5 ~ Juli 2024 (Monat 7)
      const desired = { m: 7, y: 2024 };
      const monthsFromStartToDesired = (desired.y - startMY_local.y) * 12 + (desired.m - startMY_local.m);
      const tDesired = Math.max(0, Math.min(1, monthsFromStartToDesired / (totalMonthsAxis as number)));
      const xDesired = padX + tDesired * usableW;
      xDesiredForFirst = xDesired;
      // Verschiebe nur die letzte Punkt-X-Position; Y bleibt durch growth bestimmt
      const lastIdx = pts.length - 1;
      if (lastIdx >= 0) {
        pts[lastIdx] = { x: xDesired, y: pts[lastIdx].y };
      }
    }

    // Dezente, einheitliche Farbwahl ohne Verlauf
    const strokeColor = (match?.growth ?? 0) >= 0 ? 'rgba(16,185,129,0.85)' : 'rgba(239,68,68,0.85)';
    const badgeFillColor = (match?.growth ?? 0) >= 0 ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)';
    const badgeStrokeColor = (match?.growth ?? 0) >= 0 ? 'rgba(16,185,129,0.45)' : 'rgba(239,68,68,0.45)';

    // Sanftere Ease-Funktion für ein dezentes Draw-On
    const easeInOutSine = (tt: number) => 0.5 * (1 - Math.cos(Math.PI * tt));
    // Kompatibilitäts-Alias für bestehende Spezialfälle
    const easeOutCubic = easeInOutSine;

    const draw = (tt: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const prog = easeInOutSine(tt);

      // Spezialfall: MediStore – runder Fortschritts‑Kreis bis 100% + Veredelungen
      if (isMediStore) {
        const cx = width / 2;
        const cy = (height - padBottom + padTop) / 2 - 6; // etwas weiter nach oben für mehr Abstand
        const r = Math.min(width, height) * 0.28;
        // Hintergrund‑Ring
        ctx.save();
        ctx.strokeStyle = 'rgba(34,197,94,0.18)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        // Fortschritt (0..100%)
        ctx.strokeStyle = '#10b981';
        ctx.lineCap = 'round';
        ctx.beginPath();
        const start = -Math.PI / 2;
        const end = start + (Math.PI * 2) * prog; // bis 100%
        ctx.arc(cx, cy, r, start, end);
        ctx.stroke();
        // Sanfter Outline‑Puls (0..1) am Rand
        const pulse = Math.pow(prog, 0.6);
        ctx.save();
        ctx.globalAlpha = 0.25 * pulse;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        // Glühender Tip
        const tipX = cx + r * Math.cos(end);
        const tipY = cy + r * Math.sin(end);
        const rad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 10);
        rad.addColorStop(0, 'rgba(255,255,255,0.95)');
        rad.addColorStop(0.35, 'rgba(16,185,129,0.85)');
        rad.addColorStop(1, 'rgba(16,185,129,0.0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 10, 0, Math.PI * 2);
        ctx.fill();
        // Text +100% in der Mitte (Count‑Up)
        const shown = Math.round(100 * prog);
        const pctText = `+${nfIntAT.format(shown)}%`;
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 16px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pctText, cx, cy);
        // Untertitel „IT‑Audit ApoSys“
        ctx.fillStyle = 'rgba(148,163,184,0.85)';
        ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText('IT‑Audit ApoSys', cx, cy + r + 22);
        // Zeitraum (exakt wie angegeben, z. B. 08/2022 – 05/2023)
        const rawPeriod = (match?.period ?? '').trim();
        const periodText = rawPeriod || '08/2022 – 05/2023';
        ctx.fillStyle = 'rgba(148,163,184,0.75)';
        ctx.font = '10.5px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText(`Zeitraum ${periodText}`, cx, cy + r + 40);
        ctx.restore();
        return; // keine Achsen/Skalen im MediStore‑Modus
      }

      // Spezialfall: Krypto & Mining – Donut „Investitionsmix“ (2,6 Mio. € = 2,0 + 0,6)
      if (isKryptoMix) {
        const cx = width / 2;
        const cy = (height - padBottom + padTop) / 2 - 6;
        const r = Math.min(width, height) * 0.28;
        const total = 2.6;
        const lulea = 2.0;
        const priboj = 0.6;
        const aStart = -Math.PI / 2;
        const fracL = lulea / total; // ~0.769
        const fracP = priboj / total; // ~0.231
        const prog = easeOutCubic(tt);
        const sweep = (Math.PI * 2) * Math.max(0.0001, Math.min(1, prog));
        // Hintergrundring
        ctx.save();
        ctx.strokeStyle = 'rgba(148,163,184,0.16)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        // Segment 1 (Luleå) – Grün
        ctx.strokeStyle = '#10b981';
        ctx.lineCap = 'round';
        ctx.beginPath();
        const endL = aStart + sweep * fracL;
        ctx.arc(cx, cy, r, aStart, endL);
        ctx.stroke();
        // Segment 2 (Priboj) – Türkisgrün
        ctx.strokeStyle = '#34d399';
        ctx.beginPath();
        const endP = endL + sweep * fracP;
        ctx.arc(cx, cy, r, endL, endP);
        ctx.stroke();
        // Zentrumstext: Gesamt
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 15px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('2,6 Mio. €', cx, cy);
        // Legende / KPI-Badges
        ctx.fillStyle = 'rgba(148,163,184,0.85)';
        ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText('Investitionsmix', cx, cy + r + 18);
        ctx.fillStyle = 'rgba(148,163,184,0.75)';
        ctx.font = '10.5px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText('Luleå 2,0 Mio. €  •  Priboj 0,6 Mio. €', cx, cy + r + 32);
        // Kleine KPI-Zeile
        ctx.fillStyle = 'rgba(148,163,184,0.70)';
        ctx.font = '10px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText('Projekte 4   •   Regionen 2   •   Rollen 3', cx, cy + r + 46);
        ctx.restore();
        return; // keine Achsen/Skalen im Krypto‑Mix‑Modus
      }

      // Spezialfall: mscinvest d.o.o. – Gewinn‑Donut
      if (isMscinvest) {
        const cx = width / 2;
        const cy = (height - padBottom + padTop) / 2 - 4;
        const r = Math.min(width, height) * 0.28;
        const prog = easeOutCubic(tt);
        // Hintergrundring
        ctx.save();
        ctx.strokeStyle = 'rgba(34,197,94,0.18)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        // Fortschrittsring (bis 100%)
        ctx.strokeStyle = '#10b981';
        ctx.lineCap = 'round';
        ctx.beginPath();
        const start = -Math.PI / 2;
        const end = start + (Math.PI * 2) * Math.max(0.0001, Math.min(1, prog));
        ctx.arc(cx, cy, r, start, end);
        ctx.stroke();
        // Zentrumstext: kompakt und auto-fit innerhalb des Kreises
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerText = '0,8 Mio. €';
        let fontSize = 16; // Startgröße
        const family = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
        const maxWidth = (r - 8) * 2; // etwas Innenabstand
        // Auto-Fit-Schleife (max. 10 Schritte)
        for (let i = 0; i < 10; i++) {
          ctx.font = `bold ${fontSize}px ${family}`;
          const w = ctx.measureText(centerText).width;
          if (w <= maxWidth) break;
          fontSize -= 1;
          if (fontSize < 10) break;
        }
        ctx.font = `bold ${fontSize}px ${family}`;
        ctx.fillText(centerText, cx, cy);
        // Untertitel & Zeitraum
        ctx.fillStyle = 'rgba(148,163,184,0.85)';
        ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText('Beratung/Compliance (keine Spekulationen)', cx, cy + r + 20);
        const period = (match?.period ?? '').trim() || '2017 – 2020';
        ctx.fillStyle = 'rgba(148,163,184,0.75)';
        ctx.font = '10.5px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText(`Zeitraum ${period}`, cx, cy + r + 34);
        ctx.restore();
        return;
      }
      
      // Spezialfall: coin2cash s.r.o. – eleganter, kompakter Kreis "Networking done"
      if (isCoin2Cash) {
        const cx = width / 2;
        const cy = (height - padBottom + padTop) / 2 - 4;
        const r = Math.min(width, height) * 0.26; // etwas kompakter
        const prog = easeOutCubic(tt);
        // Hintergrundring (dezenter, dünner)
        ctx.save();
        ctx.strokeStyle = 'rgba(148,163,184,0.16)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        // Fortschrittsring bis 100% (einheitliches Grün)
        ctx.strokeStyle = '#10b981';
        ctx.lineCap = 'round';
        ctx.lineWidth = 6;
        ctx.beginPath();
        const start = -Math.PI / 2;
        const end = start + (Math.PI * 2) * Math.max(0.0001, Math.min(1, prog));
        ctx.arc(cx, cy, r, start, end);
        ctx.stroke();
        // Subtiler Glow am Fortschrittspunkt
        const tipX = cx + r * Math.cos(end);
        const tipY = cy + r * Math.sin(end);
        const grad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 9);
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(0.35, 'rgba(16,185,129,0.85)');
        grad.addColorStop(1, 'rgba(16,185,129,0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 9, 0, Math.PI * 2);
        ctx.fill();
        // Center-Text: auto-fit, mittel-stark, sehr kompakt
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const txt = 'Networking done';
        let fs = 13; // Startgröße etwas kleiner
        const fam = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
        const maxW = (r - 10) * 2;
        for (let i = 0; i < 12; i++) {
          ctx.font = `600 ${fs}px ${fam}`; // semi-bold
          if (ctx.measureText(txt).width <= maxW) break;
          fs -= 1; if (fs < 10) break;
        }
        ctx.font = `600 ${fs}px ${fam}`;
        ctx.fillText(txt, cx, cy);
        // Untertitel & Zeitraum
        ctx.fillStyle = 'rgba(148,163,184,0.85)';
        ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText('Netzwerk/Partner aufgebaut', cx, cy + r + 20);
        const periodC2C = (match?.period ?? '').trim() || '2017 – 2019';
        ctx.fillStyle = 'rgba(148,163,184,0.75)';
        ctx.font = '10.5px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        ctx.fillText(`Zeitraum ${periodC2C}`, cx, cy + r + 34);
        ctx.restore();
        return;
      }

      // Linie – dezent, ohne Glow/Verlauf
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const totalLen = n - 1;
      const progLine = prog;
      const segF = Math.min(totalLen, progLine * totalLen);
      const segI = Math.floor(segF);
      const frac = segF - segI;

      // Reserve rechts Platz für das Prozent-Label, damit die Linie nicht in den Text läuft
      const percentVal = typeof match?.growth === 'number' ? match.growth : (relClamped[relClamped.length - 1] ?? 0);
      const pctTextTmp = `${percentVal >= 0 ? '+' : ''}${nfIntAT.format(Math.round(Math.max(0, Math.min(1000, percentVal))))}%`;
      ctx.save();
      ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      const pctWidth = ctx.measureText(pctTextTmp).width;
      ctx.restore();
      const rightGutter = Math.max(28, pctWidth + 10);
      const xStop = width - padX - rightGutter;
      // Nur für die erste Linie (Cutting Edge mit 2025 als rechtem Label) soll der End‑X von Beginn an am Wunsch‑Punkt liegen
      const endX = (xDesiredForFirst != null) ? Math.min(xStop, Math.max(padX, xDesiredForFirst)) : xStop;
      // Endpunkt-Höhe exakt aus Ziel-Prozentwert ableiten (anstatt aus Segmentinterpolation),
      // damit der grüne Punkt genau auf der erwarteten Y-Position liegt – unabhängig vom Kappen rechts.
      const normFinal = Math.max(0, Math.min(1, (percentVal - 0) / 1000));
      const yFinal = padTop + (1 - normFinal) * Hdraw;

      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i <= segI; i++) {
        const p = pts[i];
        if (p.x <= endX) ctx.lineTo(p.x, p.y);
      }
      let tip = pts[Math.min(segI, pts.length - 1)];
      if (segI < totalLen) {
        const a = pts[segI];
        const isLast = segI === pts.length - 2;
        const bx = isLast ? endX : pts[segI + 1].x;
        const by = isLast ? yFinal : pts[segI + 1].y;
        let ix = a.x + (bx - a.x) * frac;
        let iy = a.y + (by - a.y) * frac;
        if (ix > endX) { ix = endX; if (!isLast) {
          // Falls außerhalb im vorletzten Segment gekappt wird (selten),
          // Höhe linear zwischen a.y und by bestimmen
          const denomX = (bx - a.x) || 1e-6;
          const tAlong = Math.max(0, Math.min(1, (endX - a.x) / denomX));
          iy = a.y + (by - a.y) * tAlong;
        } }
        ctx.lineTo(ix, iy);
        tip = { x: ix, y: iy };
      } else {
        // letztes Segment vollständig – sanft zum Ziel (xStop, yFinal)
        const last = pts[pts.length - 1];
        if (last.x >= endX) {
          ctx.lineTo(endX, yFinal);
          tip = { x: endX, y: yFinal };
        } else {
          ctx.lineTo(last.x, last.y);
          tip = { x: last.x, y: last.y };
        }
      }
      ctx.stroke();
      // Dezenter Endpunkt ohne Glow
      ctx.save();
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // X‑Achse: Jahre + Quartals-/Monats‑Ticks
      ctx.fillStyle = 'rgba(148,163,184,0.75)';
      ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.textBaseline = 'alphabetic';
      // 1) Jahreslabels wie bisher (mit Kollision-Management)
      const placedXs: number[] = [];
      const minGap = 18; // px Mindestabstand zwischen Labels
      const tryPlaceLabel = (xIn: number, text: string, align: CanvasTextAlign) => {
        // vermeide Überdeckung mit rechter Gutter-Zone; rechter Rand darf genutzt werden, jedoch knapp vor xStop
        const rightGutter = Math.max(28, ctx.measureText(`${percent >= 0 ? '+' : ''}${nfIntAT.format(Math.round(Math.max(0, Math.min(1000, percent))))}%`).width + 10);
        const xStop = width - padX - rightGutter;
        let x = xIn;
        if (align === 'right' && x > xStop) {
          x = xStop - 1; // rechtsbündig knapp vor der Gutter-Grenze rendern
        }
        if (align !== 'right' && x > xStop - 4) return; // linke/zentrierte Labels nicht in den Prozent-Text laufen lassen
        // Kollision prüfen
        for (const px of placedXs) if (Math.abs(px - x) < minGap) return;
        ctx.textAlign = align; ctx.fillText(text, x, height - 6); placedXs.push(x);
      };
      const percent = percentVal;
      if (xLabels?.[0]) tryPlaceLabel(padX, xLabels[0], 'left');
      if (xLabels?.[1]) tryPlaceLabel(width - padX, xLabels[1], 'right');
      // 2) Quartal-/Monatsticks basierend auf match.period (z. B. "05/2022–02/2024")
      const parseMY = (s?: string) => {
        if (!s) return null as null | { m: number; y: number };
        const rx = /(\d{1,2})\/(\d{4})/;
        const m = rx.exec(s);
        if (!m) return null;
        const mm = Math.max(1, Math.min(12, parseInt(m[1]!, 10)));
        const yy = parseInt(m[2]!, 10);
        return { m: mm, y: yy };
      };
      let startMY: { m: number; y: number } | null = null;
      let endMY: { m: number; y: number } | null = null;
      if (typeof match?.period === 'string') {
        const parts = match.period.split(/\s*[–-]\s*/);
        startMY = parseMY(parts[0]);
        endMY = parseMY(parts[1]);
      }
      // Fallback: nur Jahre bekannt
      if (!startMY && xLabels?.[0]) startMY = { m: 1, y: parseInt(xLabels[0], 10) };
      if (!endMY && xLabels?.[1]) endMY = { m: 12, y: parseInt(xLabels[1], 10) };
      if (startMY && endMY && Number.isFinite(startMY.y) && Number.isFinite(endMY.y)) {
        // Endjahr ggf. bis xLabels[1] (z. B. 2025) erweitern
        const endYearFromX = xLabels?.[1] ? parseInt(xLabels[1], 10) : NaN;
        const endMYdraw = (!Number.isNaN(endYearFromX) && Number.isFinite(endYearFromX) && endYearFromX > (endMY?.y ?? endYearFromX))
          ? { m: 12, y: endYearFromX }
          : endMY;
        const totalMonthsDraw = (endMYdraw.y - startMY.y) * 12 + (endMYdraw.m - startMY.m);
        if (totalMonthsDraw > 0) {
          // Alle Jahreslabels gleichmäßig über die verfügbare Breite [padX .. xStop] verteilen
          const yearStart = startMY.y;
          const yearEnd = endMYdraw.y;
          const rightGutter = Math.max(28, ctx.measureText(`${percentVal >= 0 ? '+' : ''}${nfIntAT.format(Math.round(Math.max(0, Math.min(1000, percentVal))))}%`).width + 10);
          const xStop = width - padX - rightGutter;
          const spanYears = Math.max(1, yearEnd - yearStart);
          for (let y = yearStart; y <= yearEnd; y++) {
            const t = (y - yearStart) / spanYears; // 0..1
            const x = padX + t * (xStop - padX);
            // Äußere Labels links/rechts werden separat gesetzt – mittig keine Duplikate
            if (y !== parseInt(xLabels?.[0] ?? '', 10) && y !== parseInt(xLabels?.[1] ?? '', 10)) {
              ctx.textAlign = 'center';
              ctx.fillStyle = 'rgba(148,163,184,0.75)';
              ctx.fillText(String(y), x, height - 6);
            }
          }
        }
      }

      // Y‑Skala (0% bis 1000%) rechts exakt auf die Linienhöhen justiert
      ctx.save();
      ctx.fillStyle = 'rgba(148,163,184,0.55)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const yTop = padTop; // 1000%
      const yBottom = height - padBottom; // 0%
      ctx.fillText('1000%', width - padX, yTop);
      ctx.fillText('0%', width - padX, yBottom);
      // Dezente Gridlines bei 250/500/750%
      const gridLevels = [250, 500, 750];
      ctx.strokeStyle = 'rgba(148,163,184,0.16)';
      ctx.lineWidth = 1;
      gridLevels.forEach((lvl) => {
        const norm = (lvl - 0) / 1000; // 0..1
        const y = padTop + (1 - norm) * (height - padTop - padBottom);
        ctx.beginPath();
        ctx.moveTo(padX, y + 0.5);
        // Linie endet vor dem Prozent-Label (xStop wird weiter oben anhand Labelbreite berechnet)
        ctx.lineTo(xStop, y + 0.5);
        ctx.stroke();
        // kleine Labels rechts
        ctx.fillStyle = 'rgba(148,163,184,0.45)';
        ctx.fillText(`${lvl}%`, width - padX, y);
        ctx.fillStyle = 'rgba(148,163,184,0.55)';
      });
      ctx.restore();

      // Prozent-Badge: statischer Wert, dezentes Einblenden am Ende
      const pctText = `${percentVal >= 0 ? '+' : ''}${nfIntAT.format(Math.round(Math.max(0, Math.min(1000, percentVal))))}%`;
      const badgePadX = 6, badgePadY = 3, badgeRadius = 6;
      ctx.save();
      ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      // Badge Position rechts oberhalb des Tips
      const textW = ctx.measureText(pctText).width;
      // Position: links oberhalb des Punkts, um nichts zu verdecken
      let bx = tip.x - (textW + badgePadX * 2) - 12; // links vom Punkt
      let by = tip.y - 18; // oberhalb
      // Clamping, damit Badge im Canvas bleibt
      bx = Math.min(bx, width - padX - (textW + badgePadX * 2) - 2);
      bx = Math.max(bx, padX + 2);
      by = Math.max(by, padTop + 2);
      by = Math.min(by, height - padBottom - 14);
      const bw = textW + badgePadX * 2;
      const bh = 18;
      // Badge erst am Ende dezent einblenden
      const badgeAlpha = prog < 0.92 ? 0 : Math.min(1, (prog - 0.92) / 0.08);
      ctx.globalAlpha = badgeAlpha;
      // Badge-Hintergrund dezent
      ctx.fillStyle = badgeFillColor;
      ctx.strokeStyle = badgeStrokeColor;
      ctx.lineWidth = 1;
      const rrect = (x:number, y:number, w:number, h:number, r:number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };
      rrect(bx, by, bw, bh, badgeRadius);
      ctx.fill();
      ctx.stroke();
      // Text
      ctx.fillStyle = strokeColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(pctText, bx + badgePadX, by + bh/2);
      ctx.restore();
    };

    // Reduced‑motion respektieren
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0 : 800;
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const tt = Math.max(0, Math.min(1, elapsed / duration));
      draw(tt);
      if (tt < 1) rafRef.current = requestAnimationFrame(step);
    };
    const shouldAnimate = !prefersReducedMotion && ((active ?? false) || inView);
    if (shouldAnimate) {
      draw(0);
      rafRef.current = requestAnimationFrame(step);
    } else {
      // Bei reduced‑motion oder außerhalb des Viewports direkt Endzustand zeichnen
      draw(prefersReducedMotion ? 1 : 0);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); startRef.current = null; rafRef.current = null; };
  }, [match, title, subtitle, xLabels, active, inView, resizeTick]);

  const valueText = (() => {
    if (isKryptoMix) return 'Investitionen gesamt 2,6 Mio. €';
    if (isMscinvest) return 'Gewinn gesamt 0,8 Mio. € (Beratung/Compliance)';
    // Für coin2cash bereits zentral im Kreis dargestellt – hier keine Doppelung
    if (isCoin2Cash) return '';
    const desc = (match?.description ?? '').toLowerCase();
    const isProfit = desc.includes('gewinn') || desc.includes('profit');
    // Speziallabel für Kuhn & Mather: immer "Rendite"
    const forceRendite = (match?.company ?? '').toLowerCase().includes('kuhn') && (match?.company ?? '').toLowerCase().includes('mather');
    const isDe = true; // Default: deutsche Labels in der CV-Sektion
    const label = forceRendite
      ? (isDe ? 'Rendite' : 'Return')
      : (isProfit ? (desc.includes('gewinn') ? (isDe ? 'Gewinn' : 'Profit') : 'Profit') : (isDe ? 'Firmenwert' : 'Company value'));
    const v = match?.value !== undefined ? `${nfDecimalAT.format(match.value)} M€ ${label}` : '';
    const s = match?.startCapital !== undefined ? ` · Startkapital ${nfDecimalAT.format(match.startCapital)} M€` : '';
    return `${v}${s}`.trim();
  })();
  const growthText = match?.growth !== undefined ? `${(match.growth >= 0 ? '+' : '') + nfIntAT.format(match.growth)}%` : '';

  // A11y: sprechendes ARIA‑Label für den Canvas
  const ariaLabel = (() => {
    if (isKryptoMix) {
      return 'Investitionsmix Krypto & Mining: Gesamt 2,6 Mio. Euro; Luleå 2,0 Mio. Euro; Priboj 0,6 Mio. Euro. KPIs: Projekte 4, Regionen 2, Rollen 3.';
    }
    if (isMscinvest) {
      return 'mscinvest d.o.o.: Gewinn gesamt 0,8 Mio. Euro aus Beratung und Compliance, keine Spekulationen. Zeitraum 2017–2020.';
    }
    if (isCoin2Cash) {
      return 'coin2cash s.r.o.: Ziel erreicht – Netzwerk und Partner aufgebaut. Zeitraum 2017–2019.';
    }
    const name = match?.company ?? subtitle ?? title;
    const growth = match?.growth !== undefined ? `${(match.growth >= 0 ? '+' : '') + nfIntAT.format(match.growth)}%` : '';
    const desc = (match?.description ?? '').toLowerCase();
    const isProfit = desc.includes('gewinn') || desc.includes('profit');
    const forceRendite = (match?.company ?? '').toLowerCase().includes('kuhn') && (match?.company ?? '').toLowerCase().includes('mather');
    const isDe = true; // Default: deutsch
    const label = forceRendite
      ? (isDe ? 'Rendite' : 'Return')
      : (isProfit ? (desc.includes('gewinn') ? (isDe ? 'Gewinn' : 'Profit') : 'Profit') : (isDe ? 'Firmenwert' : 'Company value'));
    const value = match?.value !== undefined ? `${nfDecimalAT.format(match.value)} M€ ${label}` : '';
    const sc = typeof match?.startCapital === 'number' ? `Startkapital ${nfDecimalAT.format(match.startCapital)} M€` : '';
    const per = match?.period ? `Zeitraum ${match.period}` : '';
    const parts = [name, growth, value, sc, per].filter(Boolean);
    return parts.join(', ');
  })();

  return (
    <div ref={wrapperRef} className="w-full">
      <div className="flex items-center justify-between mb-1 select-none">
        <div className="text-[12px] md:text-[12.5px] font-medium text-[--color-foreground-strong] tracking-[-0.006em] [font-variant-numeric:tabular-nums]">
          {match?.company ?? subtitle ?? title}
        </div>
        {/* Prozent-Label wird im Canvas exakt auf Höhe der Spitze gezeichnet */}
        <div aria-hidden className="text-[11px] md:text-[11.5px] opacity-0 select-none">
          {growthText}
        </div>
      </div>
      <div className="h-40 bg-transparent ring-0 shadow-none w-full">
        <canvas ref={canvasRef} width={420} height={160} className="block w-full h-full" role="img" aria-label={ariaLabel} />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10.5px] md:text-[11px] text-[--color-foreground]/70">
        <span>{valueText}</span>
      </div>
      {/* Fußnote für ROI/Zeitraum (dynamisch, wenn Startkapital vorhanden) */}
      {typeof match?.startCapital === 'number' && match?.period && (
        <div className="mt-0.5 text-[10px] md:text-[10.5px] text-[--color-foreground]/60">
          {`ROI relativ zum Startkapital (${nfDecimalAT.format(match.startCapital)} M€), Zeitraum ${match.period}`}
        </div>
      )}
    </div>
  );
};
