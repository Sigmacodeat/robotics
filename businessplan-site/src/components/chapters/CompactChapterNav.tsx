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
  const linkBase = "relative inline-flex items-center rounded-xl transition-all duration-300 focus:outline-none focus-visible:outline-none hover:shadow-sm";
  // Etwas größer und mit klarerer Hierarchie für bessere Lesbarkeit
  const linkHoriz = "gap-1.5 px-2 py-0.5 text-[13.5px] md:text-[14.5px] leading-5 font-medium";
  const linkVert = (active: boolean) => clsx("gap-1 px-2 text-[14px] md:text-[15px] leading-[1.25] w-full font-medium", active ? "py-1" : "py-0.5");
  const linkActive = "text-[--color-foreground] bg-[--muted]/20 border-gradient";
  const linkInactive = "text-[--color-foreground-muted] hover:text-[--color-foreground] hover:bg-[--muted]/15 border border-transparent";
  // Kapitel-Nummern etwas prominenter
  const chipClass = "inline-flex h-5 w-6 items-center justify-center rounded-lg bg-[--muted]/15 ring-1 ring-[--color-border-subtle] text-[11px] font-semibold tabular-nums shadow-[0_1px_0_rgba(0,0,0,0.04)] relative -translate-y-[1px]";

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
          "rounded-2xl bg-[--color-surface]/60 supports-[backdrop-filter]:backdrop-blur-xl",
          isHorizontal ? "overflow-x-auto no-scrollbar" : ""
        )}
      >
        {/* Sidebar-Titel nur im vertikalen Modus */}
        {!isHorizontal && (
          <div className="px-3 pt-2 pb-1 text-xs font-medium uppercase tracking-wide text-[--color-foreground-muted]">
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
              ? "flex items-center gap-1 px-1.5 py-0 min-w-full"
              : "flex flex-col items-stretch gap-0.5 p-1 w-56"
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
              <span className={clsx("truncate", isHorizontal ? "whitespace-nowrap max-w-[22ch] leading-tight" : "flex-1 text-left leading-tight")}>
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
                  title={`${chapterWord} ${c.id}: ${c.title}`}
                >
                  {isActive && <ActiveOutline />}
                  <span className={chipClass}>
                    {c.id}
                  </span>
                  <span className={clsx("truncate", isHorizontal ? "whitespace-nowrap max-w-[22ch] leading-tight" : "flex-1 text-left leading-tight")}>
                    {c.title}
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
