"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters } from "@/chapters/chapters.config";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { subsectionOrder, type SubsectionItem, numberedSub } from "@/components/chapters/sections/subsectionOrder";
import { sectionOrder, type SectionId } from "@/components/chapters/sections/sectionOrder";
import { buildLocalePath } from "@/i18n/path";
import { useReducedMotion } from "framer-motion";

/**
 * ChaptersTOC
 * Schlanke, feste Sidebar als Inhaltsverzeichnis (Desktop)
 * - Sticky, eigener Scrollbereich
 * - Kapitel + Unterkapitel (Unterkapitel immer sichtbar für das aktive Kapitel)
 * - Keine überflüssigen Toggles/Animationen
 */
// helper: map a chapter slug (kebab-case) to SectionId
function slugToSectionId(slug?: string): SectionId | undefined {
  if (!slug) return undefined;
  const explicit: Partial<Record<string, SectionId>> = {
    "traction-kpis": "tractionKpis",
    "business-model": "businessModel",
    "team": "teamOrg",
  };
  if (slug in explicit) return explicit[slug as keyof typeof explicit];
  const camel = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as SectionId;
  return camel in sectionOrder ? (camel as SectionId) : undefined;
}

export default function ChaptersTOC({ currentChapter }: { currentChapter?: number }) {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  type ChapterItem = (typeof chapters)[number] & { slug: string; titleKey?: string; requiredFields?: string[] };
  const items: ChapterItem[] = useMemo(() => chapters as ChapterItem[], []);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  // Scroll-Container Referenz (auf <nav>) für Tastaturfokus & zentriertes Scrollen
  const scrollRef = useRef<HTMLElement | null>(null);
  const scrollContainerId = "chapters-toc-scroll";

  // Aktiven Kapitel-Link in Sicht bringen (in der Mitte für flüssigeren Ablauf)
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "center", behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  }, [pathname, currentChapter, prefersReducedMotion]);

  // Scrollspy: beobachte Unterkapitel-Sections des aktiven Kapitels
  useEffect(() => {
    const idx = typeof currentChapter === "number" && currentChapter > 0 ? currentChapter - 1 : 0;
    const activeChapter = items[idx];
    const sectionId = slugToSectionId(activeChapter?.slug);
    const subs = sectionId ? (subsectionOrder[sectionId] ?? []) : [];
    const subIds = subs.map((s) => s.id);
    if (!subIds.length) {
      setActiveSubId(null);
      return;
    }

    const opts: IntersectionObserverInit = {
      // rootMargin für Mitte-Aktivierung: Marker in der Mitte des Scrollbereichs halten
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };
    const observer = new IntersectionObserver((entries) => {
      // Wähle den Eintrag mit größter Intersection Ratio, der sichtbar ist
      let topMost: IntersectionObserverEntry | null = null;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (!topMost || e.intersectionRatio > topMost.intersectionRatio) {
          topMost = e;
        }
      }
      if (topMost?.target?.id) {
        setActiveSubId(topMost.target.id);
      }
    }, opts);

    const targets: Element[] = [];
    for (const id of subIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        targets.push(el);
      }
    }

    // Fallback: wenn nichts beobachtet wird, aktives Sub zurücksetzen
    if (targets.length === 0) setActiveSubId(null);

    return () => {
      for (const el of targets) observer.unobserve(el);
      observer.disconnect();
    };
  }, [items, pathname, currentChapter]);

  // Aktiven Unterkapitel-Link in der Mitte halten
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !activeSubId) return;
    // Robust: Fallback, falls CSS.escape nicht verfügbar ist (sehr alte Browser)
    const escapeCss = (str: string) => (typeof CSS !== "undefined" && typeof CSS.escape === "function")
      ? CSS.escape(str)
      : str.replace(/([#.&,:;!>+~*=\[\]\(\)\{\}\|\^$?\\])/g, "\\$1");
    const link = container.querySelector<HTMLAnchorElement>(`a[href*="#${escapeCss(activeSubId)}"]`);
    if (link) link.scrollIntoView({ block: "center", behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [activeSubId, prefersReducedMotion]);

  // Scroll-Step Steuerung (ein Bildschirmhöhe-Abschnitt)
  const handleStep = useCallback((direction: "up" | "down") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(120, Math.floor(el.clientHeight * 0.9));
    el.scrollBy({ top: direction === "up" ? -step : step, behavior: "smooth" });
  }, []);

  // Tastatursteuerung am Scroll-Container: PageUp/PageDown/Home/End/Space
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PageDown") {
        e.preventDefault();
        handleStep("down");
      } else if (e.key === "PageUp") {
        e.preventDefault();
        handleStep("up");
      } else if (e.key === " ") {
        // Space scrollt nach unten, Shift+Space nach oben (wie Browser-Default), aber smooth und im Container
        e.preventDefault();
        if (e.shiftKey) handleStep("up");
        else handleStep("down");
      } else if (e.key === "Home") {
        e.preventDefault();
        el.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [handleStep]);

  return (
    <aside
      className={clsx(
        "print:hidden w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-20 max-h-[calc(100dvh-6rem)] overflow-auto rounded-2xl bg-[--color-surface]/90 supports-[backdrop-filter]:backdrop-blur-md shadow-md shadow-black/5 ring-1 ring-[--color-border] p-4 pr-3 toc-scroll"
      )}
      aria-label={t("toc.title", { default: "Inhaltsverzeichnis" })}
      ref={scrollRef}
      id={scrollContainerId}
      tabIndex={0}
    >
      <div className="px-1 py-1">
        <div className="sticky top-0 z-10 opacity-90 bg-[--color-surface]/85 supports-[backdrop-filter]:backdrop-blur-md py-1">
          <div className="relative pl-1.5 pr-2">
            <div className="flex items-center justify-between gap-2">
              <div className="group flex items-center gap-2.5 px-3 py-2.5 text-[13px] leading-5">
                <span className="inline-flex h-5 w-6 shrink-0 items-center justify-center rounded-md bg-transparent ring-0" aria-hidden="true" />
                <span className="toc-title whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
                  {t("toc.title", { default: "Inhaltsverzeichnis" })}
                </span>
              </div>
              <div className="toc-controls inline-flex items-center gap-1.5" aria-label={t("toc.controls", { default: "Navigation im Inhaltsverzeichnis" })}>
                <button
                  type="button"
                  className="toc-btn"
                  aria-controls={scrollContainerId}
                  aria-label={t("toc.scrollUp", { default: "Eine Seite nach oben scrollen" })}
                  onClick={() => handleStep("up")}
                  title={t("toc.scrollUp", { default: "Eine Seite nach oben scrollen" })}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="toc-btn"
                  aria-controls={scrollContainerId}
                  aria-label={t("toc.scrollDown", { default: "Eine Seite nach unten scrollen" })}
                  onClick={() => handleStep("down")}
                  title={t("toc.scrollDown", { default: "Eine Seite nach unten scrollen" })}
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </div>

        <nav
          aria-label={t("toc.title", { default: "Inhaltsverzeichnis" })}
          role="navigation"
          className="max-h-full"
        >
          <div className="toc-fade-out">
            <ul className="space-y-1.5" role="list">
              {items.map((ch, idx) => {
                const baseHref = buildLocalePath(locale, `/chapters/${idx + 1}`);
                const isActive = typeof currentChapter === "number" ? currentChapter === idx + 1 : pathname?.startsWith(baseHref);
                const title = ch.titleKey ? t(`bp.sections.${ch.titleKey}`, { default: ch.title }) : ch.title;
                const sectionId = slugToSectionId(ch.slug);
                const subs: SubsectionItem[] = sectionId ? (subsectionOrder[sectionId] ?? []) : [];
                const hasSubs = subs.length > 0;

                return (
                  <li key={`${idx}-${ch.slug}`} role="listitem">
                    <div className="relative pl-1.5">
                      {/* Linker Akzentbalken für aktives Kapitel */}
                      {isActive && (
                        <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[--color-primary]/70" />
                      )}

                      <Link
                        href={baseHref}
                        className={clsx(
                          "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface]",
                          isActive
                            ? "text-[--color-foreground] font-semibold"
                            : "text-[--color-foreground-muted] hover:text-[--color-foreground]"
                        )}
                        aria-current={isActive ? "page" : undefined}
                        ref={isActive ? activeRef : undefined}
                        title={title}
                      >
                        <span
                          className={clsx(
                            "inline-flex h-5 w-6 shrink-0 items-center justify-center rounded-md bg-[--muted]/30 ring-1 ring-[--color-border-subtle] text-[11px] font-medium tabular-nums"
                          )}
                        >
                          {idx + 1}
                        </span>
                        <span className={clsx("whitespace-normal break-words leading-tight", isActive ? "font-semibold" : "font-medium")}>{title}</span>
                      </Link>


                      {/* Unterkapitel: für aktives Kapitel sichtbar */}
                      {hasSubs && isActive && (
                        <div className="ml-8 mr-2 mt-1 rounded-lg border border-[--color-border-subtle]/60 bg-[--muted]/20 p-2">
                          <div className="toc-separator mb-2" />
                          <ul className="space-y-1 text-[12px] leading-5 text-[--color-foreground-muted]">
                            {subs.map((sub, subIndex) => (
                              <li key={sub.id}>
                                <Link
                                  href={`${baseHref}#${sub.id}`}
                                  className={clsx(
                                    "flex items-start gap-2 rounded-md px-2 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface]",
                                    activeSubId === sub.id
                                      ? "text-[--color-foreground] font-medium"
                                      : "text-[--color-foreground-muted] hover:text-[--color-foreground]"
                                  )}
                                  aria-current={activeSubId === sub.id ? "location" : undefined}
                                >
                                  {/* Punkt-Indikator */}
                                  <span aria-hidden className={clsx(
                                    "mt-1 inline-block h-1.5 w-1.5 rounded-full",
                                    activeSubId === sub.id ? "bg-[--color-primary]" : "bg-[--color-border-subtle]"
                                  )} />
                                  {/* Unterkapitel-Nummerierung (z. B. 3.1) */}
                                  {sectionId && (
                                    <span className="inline-flex min-w-[2.25rem] pr-1 tabular-nums text-[11px] text-[--color-foreground-muted]">
                                      {numberedSub(sectionId, subIndex + 1)}
                                    </span>
                                  )}
                                  <span className="truncate">{t(sub.labelKey)}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
