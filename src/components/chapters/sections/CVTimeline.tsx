"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";
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

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(wrapperRef, { once: false, margin: '-20% 0px -20% 0px' });

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
    const pts = relClamped.map((p, i) => {
      const x = padX + (i / Math.max(1, n - 1)) * usableW;
      const norm = (p - relMin) / denom; // 0..1 innerhalb [-1000,1000] Fenster
      const y = padTop + (1 - norm) * Hdraw;
      return { x, y };
    });

    const grad = ctx.createLinearGradient(padX, 0, width - padX, 0);
    if ((match?.growth ?? 0) >= 0) { grad.addColorStop(0, '#10b981'); grad.addColorStop(1, '#059669'); }
    else { grad.addColorStop(0, '#ef4444'); grad.addColorStop(1, '#b91c1c'); }

    const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);

    const draw = (tt: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Linie
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const totalLen = n - 1;
      const prog = easeOutCubic(tt);
      const segF = Math.min(totalLen, prog * totalLen);
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

      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i <= segI; i++) {
        const p = pts[i];
        if (p.x <= xStop) ctx.lineTo(p.x, p.y);
      }
      let tip = pts[Math.min(segI, pts.length - 1)];
      if (segI < totalLen) {
        const a = pts[segI], b = pts[segI + 1];
        let ix = a.x + (b.x - a.x) * frac;
        let iy = a.y + (b.y - a.y) * frac;
        if (ix > xStop) {
          const denomX = (b.x - a.x) || 1e-6;
          const tAlong = Math.max(0, Math.min(1, (xStop - a.x) / denomX));
          ix = xStop;
          iy = a.y + (b.y - a.y) * tAlong;
        }
        ctx.lineTo(ix, iy);
        tip = { x: ix, y: iy };
      } else {
        // letztes Segment erreicht – ggf. bis xStop kappen
        const last = pts[pts.length - 1];
        const prev = pts[Math.max(0, pts.length - 2)];
        if (last.x > xStop) {
          const denomX = (last.x - prev.x) || 1e-6;
          const tAlong = Math.max(0, Math.min(1, (xStop - prev.x) / denomX));
          const ix = xStop;
          const iy = prev.y + (last.y - prev.y) * tAlong;
          ctx.lineTo(ix, iy);
          tip = { x: ix, y: iy };
        } else {
          ctx.lineTo(last.x, last.y);
          tip = { x: last.x, y: last.y };
        }
      }
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = 'rgba(16,185,129,0.70)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const rad = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 8);
      rad.addColorStop(0, 'rgba(255,255,255,0.95)');
      rad.addColorStop(0.35, 'rgba(16,185,129,0.85)');
      rad.addColorStop(1, 'rgba(16,185,129,0.0)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // X‑Achse: Jahre + Quartals-/Monats‑Ticks
      ctx.fillStyle = 'rgba(148,163,184,0.75)';
      ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.textBaseline = 'alphabetic';
      // 1) Jahreslabels wie bisher (mit Kollision-Management)
      const placedXs: number[] = [];
      const minGap = 18; // px Mindestabstand zwischen Labels
      const tryPlaceLabel = (x: number, text: string, align: CanvasTextAlign) => {
        // vermeide Überdeckung mit rechter Gutter-Zone
        const rightGutter = Math.max(28, ctx.measureText(`${percent >= 0 ? '+' : ''}${nfIntAT.format(Math.round(Math.max(0, Math.min(1000, percent))))}%`).width + 10);
        const xStop = width - padX - rightGutter;
        if (x > xStop - 4) return; // nicht in den Prozent-Text laufen
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
        const totalMonths = (endMY.y - startMY.y) * 12 + (endMY.m - startMY.m);
        if (totalMonths > 0) {
          // kleine Monatsticks, größere Quartalsticks, Jahreslabel an Monat=1
          const baseY0 = height - padBottom + 2.5;
          const baseY1 = height - padBottom + 6.5;
          const qY1 = height - padBottom + 9; // längerer Tick für Quartal
          ctx.strokeStyle = 'rgba(148,163,184,0.22)';
          ctx.lineWidth = 1;
          for (let k = 0; k <= totalMonths; k++) {
            const curMonth = ((startMY.m - 1 + k) % 12) + 1; // 1..12
            const curYear = startMY.y + Math.floor((startMY.m - 1 + k) / 12);
            const p = k / totalMonths;
            const x = padX + p * (width - padX * 2 - 2);
            // nicht in den reservierten Prozentbereich zeichnen
            const rightGutter = Math.max(28, ctx.measureText(`${percentVal >= 0 ? '+' : ''}${nfIntAT.format(Math.round(Math.max(0, Math.min(1000, percentVal))))}%`).width + 10);
            const xStop = width - padX - rightGutter;
            if (x > xStop - 2) continue;
            // Monatstck
            ctx.beginPath();
            ctx.moveTo(x, baseY0);
            ctx.lineTo(x, baseY1);
            ctx.stroke();
            // Quartalstarts: 1,4,7,10
            if (curMonth === 1 || curMonth === 4 || curMonth === 7 || curMonth === 10) {
              ctx.beginPath();
              ctx.moveTo(x, baseY0);
              ctx.lineTo(x, qY1);
              ctx.stroke();
              // Label Q1..Q4 klein
              const qIdx = Math.floor((curMonth - 1) / 3) + 1;
              // Quartalslabel nur setzen, wenn genug Abstand zu bereits platzierten Labels
              if (!placedXs.some(px => Math.abs(px - x) < minGap)) {
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(148,163,184,0.6)';
                ctx.fillText(`Q${qIdx}`, x, height - 10);
                placedXs.push(x);
              }
              ctx.fillStyle = 'rgba(148,163,184,0.75)';
            }
            // Jahreslabel an Monat 1 (aber die großen Year-Labels stehen schon ganz links/rechts) –
            // optional mittig anzeigen, wenn nicht am Rand
            if (curMonth === 1 && curYear !== parseInt(xLabels?.[0] ?? '', 10) && curYear !== parseInt(xLabels?.[1] ?? '', 10)) {
              if (!placedXs.some(px => Math.abs(px - x) < minGap)) {
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(148,163,184,0.75)';
                ctx.fillText(String(curYear), x, height - 6);
                placedXs.push(x);
              }
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

      // Prozent-Label (+XYZ%) auf Höhe der Linien-Spitze rendern
      const pctText = `${percentVal >= 0 ? '+' : ''}${nfIntAT.format(Math.round(Math.max(0, Math.min(1000, percentVal))))}%`;
      ctx.save();
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.fillStyle = (match?.growth ?? 0) >= 0 ? '#10b981' : '#ef4444';
      ctx.fillText(pctText, width - padX, tip.y);
      ctx.restore();
    };

    const duration = 1100;
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const tt = Math.max(0, Math.min(1, elapsed / duration));
      draw(tt);
      if (tt < 1) rafRef.current = requestAnimationFrame(step);
    };
    const shouldAnimate = (active ?? false) || inView;
    if (shouldAnimate) {
      draw(0);
      rafRef.current = requestAnimationFrame(step);
    } else {
      // außerhalb des Viewports vorerst nichts zeichnen, damit der Effekt erst sichtbar startet
      draw(0);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); startRef.current = null; rafRef.current = null; };
  }, [match, title, subtitle, xLabels, active, inView]);

  const valueText = match?.value !== undefined ? `${nfDecimalAT.format(match.value)} M€ Firmenwert` : '';
  const growthText = match?.growth !== undefined ? `${(match.growth >= 0 ? '+' : '') + nfIntAT.format(match.growth)}%` : '';

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
        <canvas ref={canvasRef} width={420} height={160} className="block w-full h-full" />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10.5px] md:text-[11px] text-[--color-foreground]/70">
        <span>{valueText}</span>
        {typeof match?.employees === 'number' && <span>{nfIntAT.format(match.employees)} MA</span>}
      </div>
    </div>
  );
};
