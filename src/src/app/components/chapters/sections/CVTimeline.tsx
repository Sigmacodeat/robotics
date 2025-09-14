"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";
import { z } from "zod";
import { variantsMap, defaultTransition, defaultViewport } from "@components/animation/variants";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Briefcase, GraduationCap, Layers } from "lucide-react";

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

// Hinweis: Ehemalige Hilfsfunktion extractTags entfernt (nicht genutzt),
// um ESLint-Warnungen zu vermeiden und Bundle minimal zu halten.

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
  /** Autoplay für deckMode: langsam nach rechts scrollen, stoppt bei Hover/Focus. Default: false */
  deckAutoPlay?: boolean;
  /** Verknüpfe vertikales Page‑Scrolling mit seitlicher Slide‑Bewegung. Default: true */
  deckScrollLinked?: boolean;
  /** Scrollrichtung im Deck‑Modus: 'ltr' oder 'rtl'. Default: 'rtl' (von rechts nach links einblenden) */
  deckScrollDirection?: 'ltr' | 'rtl';
  /** Dunkle/helle Rand‑Vignetten für Tiefe im Deck‑Modus. Default: true */
  deckVignette?: boolean;
  /** Überschrift innerhalb der Komponente anzeigen. Default: true */
  showHeading?: boolean;
  /** Zeige die Segment-Filter (Alle/Beruflich/Schulisch[/Wohltätigkeit]). Default: false */
  showFilters?: boolean;
}

export const CVTimeline: React.FC<CVTimelineProps> = ({ items, compact, compactLevel, techPriority = true, deckMode = false, deckAutoPlay = false, deckScrollLinked = false, deckScrollDirection = 'rtl', deckVignette = true, showHeading = true, showFilters = false }) => {
  const t = useTranslations("cv");
  const messages = useMessages() as Record<string, unknown> | undefined;
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(deckAutoPlay && !reduceMotion);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  // Segment-Filter: 'all' | 'work' | 'education' | 'charity'
  const [segment, setSegment] = useState<'all' | 'work' | 'education' | 'charity'>('all');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Deck nur ab md-Viewport aktiv (mobile vertikal)
  const [isDeck, setIsDeck] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);
  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)') : null;
    const update = () => setIsDeck(Boolean(deckMode && mq?.matches));
    update();
    mq?.addEventListener('change', update);
    return () => mq?.removeEventListener('change', update);
  }, [deckMode]);

  // Segment initial aus URL (?seg) oder localStorage lesen – nur wenn Filter sichtbar
  useEffect(() => {
    if (!showFilters) return;
    try {
      const fromUrl = (searchParams?.get('seg') ?? '').toLowerCase();
      const isValid = fromUrl === 'all' || fromUrl === 'work' || fromUrl === 'education' || fromUrl === 'charity';
      if (isValid) {
        setSegment(fromUrl as 'all' | 'work' | 'education' | 'charity');
        return;
      }
      const ls = typeof window !== 'undefined' ? window.localStorage.getItem('cvSegment') : null;
      if (ls === 'all' || ls === 'work' || ls === 'education' || ls === 'charity') setSegment(ls as any);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilters]);

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
    // abhängig von Scrollrichtung startgerecht positionieren
    el.scrollLeft = deckScrollDirection === 'rtl' ? max : 0;
  }, [segment, isDeck, deckScrollDirection]);
  // Determine size from compactLevel or legacy compact flag
  const size: 'sm' | 'md' | 'lg' = compactLevel ?? (compact ? 'sm' : 'lg');

  // Runtime type guards could be re-added if needed for loose input validation.

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
  const baseMotion = reduceMotion
    ? { initial: false as const }
    : { initial: "hidden" as const, whileInView: "visible" as const, viewport: defaultViewport, transition: defaultTransition };

  // Deck‑Autoplay (nur wenn deckMode aktiv ist)
  const deckRef = useRef<HTMLUListElement>(null);
  // Bei RTL initial ans Ende scrollen, damit von rechts gestartet wird
  useEffect(() => {
    if (!isDeck) return;
    const el = deckRef.current; if (!el) return;
    if (deckScrollDirection === 'rtl') {
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      el.scrollLeft = max;
    }
  }, [isDeck, deckScrollDirection]);
  useEffect(() => {
    if (!isDeck || !deckAutoPlay || reduceMotion || !isPlaying || !isInView) return;
    const el = deckRef.current;
    if (!el) return;
    // Autoplay nur, wenn horizontaler Overflow vorhanden ist
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    if (max <= 8) return;
    let raf = 0; let running = true;
    let last = 0;
    const speed = deckScrollDirection === 'rtl' ? -0.3 : 0.3; // px/frame – dezenteres Autoplay
    const onFrame = (t: number) => {
      if (!running) return;
      if (!last) last = t;
      // Stop bei Hover/Focus
      const hovered = el.matches(':hover');
      const active = document.activeElement && el.contains(document.activeElement);
      if (!hovered && !active) {
        el.scrollLeft += speed;
        // Loop (Endlos‑Carousel)
        if (deckScrollDirection === 'rtl') {
          if (el.scrollLeft <= 0) el.scrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
        } else {
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(onFrame);
    };
    raf = requestAnimationFrame(onFrame);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, [isDeck, deckAutoPlay, reduceMotion, isPlaying, deckScrollDirection, isInView]);

  // Scroll‑Verknüpfung: vertikaler Fortschritt -> horizontaler Scroll
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!isDeck || !deckScrollLinked || reduceMotion) return;
    const el = deckRef.current; if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const pos = v * max;
    el.scrollLeft = deckScrollDirection === 'rtl' ? (max - pos) : pos;
  });
  // In-View Überwachung für Autoplay
  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Aktuelle Slide via IntersectionObserver ermitteln (nur deckMode)
  useEffect(() => {
    if (!deckMode) return;
    const root = deckRef.current; if (!root) return;
    const items = Array.from(root.querySelectorAll('[data-cv-idx]')) as HTMLElement[];
    if (items.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const idxAttr = (visible.target as HTMLElement).getAttribute('data-cv-idx');
        const idxNum = idxAttr ? parseInt(idxAttr, 10) : 0;
        if (!Number.isNaN(idxNum)) setCurrentIdx(idxNum);
      }
    }, { root, threshold: [0.5, 0.75, 0.9] });
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [deckMode, data.length]);

  return (
    <section ref={sectionRef} className={`container-gutter relative ${size === 'sm' ? 'py-10 md:py-12' : size === 'md' ? 'py-12 md:py-14' : 'py-14 md:py-18'} scroll-mt-20`} role="region" aria-labelledby={headingId}>
      {showHeading && (
        <motion.h2
          id={headingId}
          className={`${size === 'sm' ? 'text-xl md:text-2xl mb-5 md:mb-7' : size === 'md' ? 'text-2xl md:text-3xl mb-6 md:mb-8' : 'text-3xl md:text-4xl mb-8 md:mb-10'} font-semibold tracking-tight leading-[1.1] text-[--color-foreground-strong]`}
          {...baseMotion}
          {...(!reduceMotion ? { variants: variantsMap.fadeInUp } : {})}
        >
          {t("title")}
        </motion.h2>
      )}

      {showFilters && (
        <div className="mb-4 md:mb-5 grid grid-cols-3 gap-1.5 p-1 rounded-full ring-1 ring-[--color-border-subtle] bg-[color-mix(in_oklab,var(--color-surface)_92%,transparent)] print:hidden" role="tablist" aria-label={t('filter.title', { default: 'Filter' })}>
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
                    ? 'bg-[--color-surface] text-[--color-foreground] ring-[--color-border]'
                    : 'bg-[--color-surface]/60 text-[--color-foreground] ring-[--color-border-subtle] hover:bg-[--color-surface]'}
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
                className={`h-1.5 w-4 rounded-full transition-colors ${currentIdx === i ? 'bg-[--color-foreground-strong]' : 'bg-[--color-border-subtle]'}`}
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
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs ring-1 ring-[--color-border-subtle] bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm hover:bg-[--color-surface] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]"
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
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs ring-1 ring-[--color-border-subtle] bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm hover:bg-[--color-surface] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]"
            onClick={() => {
              const el = deckRef.current; if (!el) return; el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
            }}
            aria-label={t('more', { default: 'Nächster Slide' })}
          >
            →
            <span className="sr-only">{t('more', { default: 'Nächster Slide' })}</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs ring-1 ring-[--color-border-subtle] bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm hover:bg-[--color-surface] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]"
            onClick={() => setIsPlaying(p => !p)}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? t('pauseAutoplay', { default: 'Autoplay pausieren' }) : t('startAutoplay', { default: 'Autoplay starten' })}
          >
            {isPlaying ? t('pause', { default: 'Pause' }) : t('play', { default: 'Play' })}
          </button>
        </div>
      )}

      <div className={isDeck ? 'relative' : undefined}>
      {isDeck && deckVignette && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-14 bg-gradient-to-r from-[--color-background] via-[--color-background]/40 to-transparent/0" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-14 bg-gradient-to-l from-[--color-background] via-[--color-background]/40 to-transparent/0" />
        </>
      )}
      <ul
        ref={deckRef}
        className={isDeck
          ? `relative flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`
          : `relative grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] ${size === 'sm' ? 'gap-4 md:gap-6' : size === 'md' ? 'gap-5 md:gap-6' : 'gap-5 md:gap-7'}`}
        aria-label={t("title")}
        {...(isDeck ? { 'aria-roledescription': 'carousel' } : {})}
        role="list"
      >
        {/* Timeline line (nur im klassischen Modus) */}
        {!isDeck && (
          <>
            <span aria-hidden className="pointer-events-none absolute left-0 md:left-[200px] lg:left-[240px] md:-translate-x-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-px bg-[--color-border]/50" />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-0 md:left-[200px] lg:left-[240px] md:-translate-x-1/2 lg:-translate-x-1/2 top-0 w-px bg-[--color-border-strong] origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ height: "100%" }}
            />
          </>
        )}

        {dataFiltered.map((item, idx) => {
          const itemId = `cv-item-${idx}`;
          const titleId = `${itemId}-title`;
          const periodId = `${itemId}-period`;
          return (
          <motion.li
            key={`${item.period}-${idx}`}
            className={isDeck ? 'list-none shrink-0 snap-start w-[85%] md:w-[65%] lg:w-[55%] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] rounded-xl' : 'contents list-none'}
            {...(isDeck ? { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${idx + 1} / ${dataFiltered.length}`, 'aria-setsize': dataFiltered.length, 'aria-posinset': idx + 1 } : { role: 'listitem' })}
            id={`cv-slide-${idx}`}
            {...(reduceMotion
              ? {}
              : {
                  initial: "hidden" as const,
                  whileInView: "visible" as const,
                  viewport: defaultViewport,
                  variants: variantsMap.fadeInUp,
                  transition: { ...defaultTransition, delay: idx * 0.05 },
                })}
          >
            {!isDeck && (
              <div className="md:col-start-1 md:col-end-2 flex items-start md:justify-end pr-3 md:pr-5 lg:pr-7">
                <span id={periodId} className={`${size === 'sm' ? 'h-7 md:h-8 px-2 text-[12.5px] md:text-[13.5px]' : size === 'md' ? 'h-8 md:h-9 px-2.5 text-[13px] md:text-[14px]' : 'h-9 md:h-10 px-3 text-sm md:text-[15px]'} inline-flex items-center rounded-full bg-[--color-surface-2] md:px-3.5 font-medium text-[--color-foreground] ring-1 ring-inset ring-[--color-border]/35 shadow-sm text-center md:text-right md:sticky md:top-24 print:bg-transparent print:ring-0 print:shadow-none`}>
                  <span className="sr-only">{t('period', { default: 'Zeitraum' })}: </span>
                  {item.period}
                </span>
              </div>
            )}
            <div className={isDeck ? 'relative' : 'md:col-start-2 md:col-end-3 relative'}>
              <motion.span aria-hidden className="absolute -left-2 md:-left-[9px] top-3 h-2 w-2 rounded-full bg-[--color-border] ring-1 ring-[--color-surface] shadow-sm"
                initial={{ scale: 0.8, opacity: 0.7 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={defaultViewport}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              />
              <div 
                role="article" 
                tabIndex={0} 
                aria-labelledby={`${titleId} ${periodId}`} 
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] rounded-xl"
                data-cv-idx={idx}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Could expand/collapse or show more details here
                  }
                  // Pfeilnavigation zwischen Items
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const next = document.querySelector(`[data-cv-idx='${idx + 1}']`) as HTMLElement | null;
                    next?.focus();
                  }
                  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = document.querySelector(`[data-cv-idx='${idx - 1}']`) as HTMLElement | null;
                    prev?.focus();
                  }
                  if (e.key === 'Home') {
                    e.preventDefault();
                    const first = document.querySelector(`[data-cv-idx='0']`) as HTMLElement | null;
                    first?.focus();
                  }
                  if (e.key === 'End') {
                    e.preventDefault();
                    const last = document.querySelector(`[data-cv-idx='${data.length - 1}']`) as HTMLElement | null;
                    last?.focus();
                  }
                }}
              >
                <Card className="relative bg-[--color-surface]/45 supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-[--color-border-subtle]/50 shadow-sm print:bg-transparent print:ring-0 print:shadow-none transition-all motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5">
                  <CardHeader className={`${size === 'sm' ? 'pt-3 pb-2' : size === 'md' ? 'pt-3.5 pb-2.5' : 'pt-4 md:pt-5 pb-3 md:pb-4'}` }>
                    <CardTitle id={titleId} className={`${size === 'sm' ? 'text-[17px] md:text-[19px] lg:text-[21px]' : size === 'md' ? 'text-[18px] md:text-[20px] lg:text-[22px]' : 'text-[20px] md:text-[22px] lg:text-[26px]'} leading-tight text-[--color-foreground-strong]`}>
                      {item.title}
                    </CardTitle>
                    {item.subtitle ? (
                      <p className={`${size === 'sm' ? 'text-[12px] md:text-[13px]' : size === 'md' ? 'text-[12.5px] md:text-[13.5px]' : 'text-[13px] md:text-[14.5px]'} text-[--color-foreground-muted] mt-1 md:mt-1.5 font-medium`}>{item.subtitle}</p>
                    ) : null}
                    {/* Elegante Metrik‑Chips */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {/* Perioden-Chip nur im Deck‑Modus, um Doppelung mit linker Sticky‑Badge zu vermeiden */}
                      {isDeck && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface] text-[--color-foreground]">
                          <span aria-hidden>⏱</span>{item.period}
                        </span>
                      )}
                      {/* Hinweis: Punktanzahl und Tag‑Zähler wurden entfernt */}
                    </div>
                  </CardHeader>
                  <CardContent className={`${size === 'sm' ? 'pt-0 pb-4' : size === 'md' ? 'pt-0 pb-5' : 'pt-0 pb-5 md:pb-6'}`}>
                    <div className={`grid grid-cols-1 lg:grid-cols-[1fr_220px] ${size === 'sm' ? 'gap-3 lg:gap-3.5' : size === 'md' ? 'gap-3.5 lg:gap-4.5' : 'gap-4 lg:gap-6'} items-start`}>
                      <div>
                        {item.bullets && item.bullets.length > 0 ? (
                          <>
                            <ul className={`${size === 'sm' ? 'space-y-1.5 md:space-y-1.5' : size === 'md' ? 'space-y-1.5 md:space-y-2' : 'space-y-2 md:space-y-3'} list-none pl-0`} role="list" aria-label={t('details', { default: 'Details' })}>
                              {(expanded[idx] ? item.bullets : item.bullets.slice(0, size === 'sm' ? 2 : 3)).map((b, bi) => (
                                <motion.li
                                  key={bi}
                                  role="listitem"
                                  className={`text-[--color-foreground] ${size === 'sm' ? 'text-[12.5px] md:text-[13.5px]' : size === 'md' ? 'text-[13px] md:text-[14px]' : 'text-[13.5px] md:text-[15px]'} leading-relaxed`}
                                  initial={{ opacity: 0, y: 6 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={defaultViewport}
                                  transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1], delay: Math.min(bi * 0.03, 0.18) }}
                                >
                                  {b}
                                </motion.li>
                              ))}
                            </ul>
                            {(item.bullets.length > (size === 'sm' ? 2 : 3)) && (
                              <button
                                type="button"
                                className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] ring-1 ring-[--color-border-subtle] text-[--color-foreground] hover:bg-[--color-surface] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] print:hidden"
                                aria-expanded={!!expanded[idx]}
                                aria-controls={`${itemId}-bullets`}
                                onClick={() => setExpanded((s) => ({ ...s, [idx]: !s[idx] }))}
                              >
                                {expanded[idx] ? t("less", { default: "Weniger zeigen" }) : t("more", { default: "Mehr anzeigen" })}
                                <span aria-hidden>{expanded[idx] ? "↑" : "↓"}</span>
                              </button>
                            )}
                            {/* Tag‑Liste am Ende entfernt */}
                          </>
                        ) : (
                          <p className="text-[--color-foreground] opacity-90 text-[13px] md:text-[15px] leading-relaxed">{t("noDetails")}</p>
                        )}
                      </div>
                      <TimelineSparkline title={item.title} {...(item.subtitle ? { subtitle: item.subtitle } : {})} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.li>
        );})}
        {(!data || data.length === 0) && (
          <li className="md:col-span-2 list-none">
            <div className="rounded-xl bg-[--color-surface] ring-1 ring-[--color-border-subtle] p-6">
              <h2 className="text-lg font-semibold text-[--color-foreground-strong] mb-1">{t("empty.title", { default: "Keine Einträge" })}</h2>
              <p className="text-[--color-foreground] opacity-90">{t("empty.description", { default: "Es liegen keine Einträge vor." })}</p>
            </div>
          </li>
        )}
      </ul>
      </div>
    </section>
  );
};

export default CVTimeline;

// --- Sparkline Neben der Timeline ---
type PerfItem = {
  period: string;
  company: string;
  value: number;
  growth: number;
  employees?: number;
  description: string;
};

const PerfArraySchema = z.array(
  z.object({
    period: z.string(),
    company: z.string(),
    value: z.number(),
    growth: z.number(),
    employees: z.number().optional(),
    description: z.string(),
  })
);

function usePerformanceFromI18n(): PerfItem[] {
  const messages = useMessages();
  return useMemo(() => {
    const root = messages as Record<string, unknown> | undefined;
    if (!root || typeof root !== "object") return [];
    const cvRaw = "cv" in root ? (root["cv"] as unknown) : undefined;
    if (!cvRaw || typeof cvRaw !== "object") return [];
    const cvObj = cvRaw as Record<string, unknown>;
    const perfRaw = "performance" in cvObj ? (cvObj["performance"] as unknown) : undefined;
    if (!perfRaw || typeof perfRaw !== "object") return [];
    const perfObj = perfRaw as Record<string, unknown>;
    const itemsRaw = "items" in perfObj ? (perfObj["items"] as unknown) : undefined;
    if (!itemsRaw) return [];
    const parsed = PerfArraySchema.safeParse(itemsRaw);
    return parsed.success ? (parsed.data as PerfItem[]) : [];
  }, [messages]);
}

const TimelineSparkline: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const perf = usePerformanceFromI18n();
  const match = useMemo(() => {
    const hay = `${title} ${subtitle ?? ""}`;
    return perf.find(p => hay.includes(p.company));
  }, [perf, title, subtitle]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);
  const growthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      if (!mounted || !match) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const pad = 4;
      ctx.clearRect(0, 0, w, h);
      const series = [match.value * 0.3, match.value * 0.55, match.value * 0.75, match.value];
      const maxV = Math.max(...series);
      const minV = Math.min(...series);
      const rng = maxV - minV || 1;
      const pts = series.map((v, i) => ({
        x: pad + (i / (series.length - 1)) * (w - 2 * pad),
        y: h - pad - ((v - minV) / rng) * (h - 2 * pad),
      }));
      // Farbe aus CSS-Variablen beziehen (Dark/Light konsistent)
      const rootStyles = getComputedStyle(document.documentElement);
      const tokenPrimary = rootStyles.getPropertyValue('--kpi-blue') || rootStyles.getPropertyValue('--color-primary');
      const color = (tokenPrimary && tokenPrimary.trim()) ? tokenPrimary.trim() : "#3b82f6";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      const prevAlpha = ctx.globalAlpha;
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, h - pad);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, h - pad);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = prevAlpha;
    } catch {
      // fail silently to avoid breaking render
    }
  }, [mounted, match]);

  if (!match) return (
    <div className="hidden lg:block" aria-hidden />
  );

  return (
    <div className="hidden lg:flex flex-col gap-2 p-3 rounded-lg ring-1 ring-[--color-border-subtle]/15 bg-[--color-surface]/50">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[--color-foreground-muted] truncate">{match.company}</span>
        <span ref={growthRef} className={`text-xs font-medium ${match.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {match.growth >= 0 ? '+' : ''}{match.growth}%
        </span>
      </div>
      <div className="h-14">
        <canvas ref={canvasRef} width={220} height={56} className="w-full h-full" />
      </div>
      <div className="text-sm">
        <span ref={valueRef} className="font-semibold text-[--color-foreground-strong]">{match.value.toFixed(1)}M€</span>
        <span className="text-xs text-[--color-foreground-muted] ml-1">Firmenwert</span>
      </div>
    </div>
  );
};
