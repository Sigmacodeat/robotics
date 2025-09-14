"use client";

import Link from "next/link";
import { chapters } from "@/app/chapters/chapters.config";
import clsx from "clsx";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import React from "react";
import { buildLocalePath } from "@/i18n/path";

type Orientation = "horizontal" | "vertical";

export default function CompactChapterNav({ currentChapter, orientation = "horizontal" }: { currentChapter?: number; orientation?: Orientation }) {
  const isHorizontal = orientation === "horizontal";
  const pathname = usePathname();
  const tCover = useTranslations("chapters.cover");
  const tBp = useTranslations("bp");
  const locale = useLocale();
  const isCoverActive = pathname?.endsWith("/chapters/cover");
  const coverLabel = tCover("title");
  const withLocalePrefix = (path: string) => buildLocalePath(locale, path);
  const chapterWord = locale?.startsWith("de") ? "Kapitel" : "Chapter";

  // Robust: Kapitel aus der URL ableiten (Layout liefert nicht zuverlässig chapterId)
  const derivedId = React.useMemo(() => {
    if (!pathname) return undefined;
    const m = pathname.match(/\/chapters\/(\d+)(?:$|\/?)/);
    return m ? Number(m[1]) : undefined;
  }, [pathname]);
  // Wenn wir auf dem Deckblatt sind, soll ausschließlich das Deckblatt markiert sein
  // (übergebene Props wie currentChapter werden dann ignoriert)
  const activeChapter = React.useMemo(() => {
    if (isCoverActive) return undefined;
    if (typeof derivedId === 'number' && !Number.isNaN(derivedId)) return derivedId;
    return currentChapter;
  }, [isCoverActive, derivedId, currentChapter]);

  // Klassen konsolidieren (vermeidet Redundanzen)
  // Größere Touch-Targets für mobile Geräte
  const linkBase = "relative inline-flex items-center rounded-xl transition-all duration-300 focus:outline-none focus-visible:outline-none hover:shadow-sm";
  // Größere Abstände und bessere Lesbarkeit auf mobilen Geräten
  const linkHoriz = "gap-2 px-3 py-2.5 text-[14px] sm:text-[13.5px] md:text-[14.5px] leading-5 font-medium";
  const linkVert = (active: boolean) => clsx(
    "gap-2 px-3 py-2.5 text-[15px] sm:text-[14px] md:text-[15px] leading-[1.25] w-full font-medium",
    "sm:py-1.5", // Kleinere Abstände auf größeren Bildschirmen
    active ? "sm:py-2" : "sm:py-1"
  );
  const linkActive = "text-[--color-foreground] bg-[--muted]/20 border-gradient";
  const linkInactive = "text-[--color-foreground-muted] hover:text-[--color-foreground] hover:bg-[--muted]/15 border border-transparent";
  // Größere Kapitel-Nummern für bessere Bedienbarkeit
  const chipClass = "inline-flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-[--muted]/15 ring-1 ring-[--color-border-subtle] text-[12px] sm:text-[11px] font-semibold tabular-nums shadow-[0_1px_0_rgba(0,0,0,0.04)] relative -translate-y-[1px] flex-shrink-0";

  const ActiveOutline = () => (
    <motion.span
      layoutId="chapterNavActive"
      className="absolute inset-0 rounded-xl"
      style={{ boxShadow: "inset 0 0 0 1px var(--color-border-subtle)" }}
      transition={{ type: "spring", stiffness: 180, damping: 34, mass: 0.85 }}
      aria-hidden
    />
  );

  // Scroll-Spy Logik entfernt (activeHash wurde nicht genutzt); kann bei Bedarf wieder aktiviert werden.
  return (
    <nav
      aria-label="Kapitel-Navigation kompakt"
      className={clsx(
        "print:hidden z-10",
        isHorizontal ? "sticky top-16 mb-3" : "sticky top-24"
      )}
    >
      <div
        className={clsx(
          "rounded-2xl bg-[--color-surface]/80 supports-[backdrop-filter]:backdrop-blur-xl",
          isHorizontal ? "overflow-x-auto no-scrollbar" : "w-full sm:w-64"
        )}
      >
        {/* Sidebar-Titel nur im vertikalen Modus */}
        {!isHorizontal && (
          <div className="px-4 pt-3 pb-2 text-xs font-medium uppercase tracking-wide text-[--color-foreground-muted] sm:px-3 sm:pt-2 sm:pb-1">
            {chapterWord}
          </div>
        )}
        <motion.ul
          initial={{ opacity: 0, y: isHorizontal ? 4 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          layout
          className={clsx(
            isHorizontal
              ? "flex items-center gap-1 px-1.5 py-1 min-w-full"
              : "flex flex-col items-stretch gap-1 p-1.5 w-full"
          )}
        >
          {/* Deckblatt als eigenständiges Kapitel 0 */}
          <motion.li className="py-0" key="cover" layout>
            <Link
              href={withLocalePrefix("/chapters/cover")}
              onMouseDown={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
              className={clsx(
                linkBase,
                isHorizontal ? linkHoriz : linkVert(!!isCoverActive),
                isCoverActive ? linkActive : linkInactive
              )}
              aria-current={isCoverActive ? "page" : undefined}
              title={coverLabel}
            >
              {isCoverActive && <ActiveOutline />}
              <span className={chipClass}>
                0
              </span>
              <span className={clsx("truncate", isHorizontal ? "whitespace-nowrap max-w-[20ch] sm:max-w-[22ch] leading-tight" : "flex-1 text-left leading-tight")}>
                {coverLabel}
              </span>
            </Link>
          </motion.li>
          {!isHorizontal && (
            <li aria-hidden className="px-1.5">
              <div className="mt-0.5 mb-0.5 h-px w-full bg-[--color-border-subtle]/60" />
            </li>
          )}
          {chapters.map((c) => {
            const isActive = typeof activeChapter === 'number' && activeChapter > 0 && c.id === activeChapter;
            // i18n-Label für Kapitel (bp.sections.<titleKey>) mit Fallback auf statischen Titel
            let chapterLabel: string = c.title;
            try {
              const key = `sections.${c.titleKey}` as any;
              const translated = tBp(key);
              if (translated && typeof translated === 'string') chapterLabel = translated as string;
            } catch {}
            return (
              <motion.li key={c.id} className="py-0" layout>
                <Link
                  href={withLocalePrefix(`/chapters/${c.id}`)}
                  onMouseDown={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
                  className={clsx(
                    linkBase,
                    isHorizontal ? linkHoriz : linkVert(isActive),
                    isActive ? linkActive : linkInactive
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={`${chapterWord} ${c.id}: ${chapterLabel}`}
                >
                  {isActive && <ActiveOutline />}
                  <span className={chipClass}>
                    {c.id}
                  </span>
                  <span className={clsx("truncate", isHorizontal ? "whitespace-nowrap max-w-[20ch] sm:max-w-[22ch] leading-tight" : "flex-1 text-left leading-tight")}>
                    {c.id === 12 ? (isHorizontal ? 'Arbeitspakete' : chapterLabel) : chapterLabel}
                  </span>
                </Link>
                {/* Unterkapitel entfernt: Es werden nur Hauptkapitel angezeigt */}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </nav>
  );
}
