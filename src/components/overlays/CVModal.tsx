"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import CVTimeline from "@components/chapters/sections/CVTimeline";

export default function CVModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tCv = useTranslations("cv");
  const tCommon = useTranslations();
  const locale = useLocale();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
      // Focus first focusable in panel
      const panel = panelRef.current;
      if (panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        focusables[0]?.focus();
      }
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="cv-modal-title"
          id="cv-modal"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

          {/* Panel */}
          <motion.div
            className="absolute inset-x-3 md:inset-x-auto md:right-8 top-10 bottom-10 md:w-[min(920px,90vw)] rounded-2xl bg-[--color-surface]/95 supports-[backdrop-filter]:backdrop-blur-md shadow-2xl ring-1 ring-[--color-border] flex flex-col"
            initial={{ y: prefersReducedMotion ? 0 : 24, opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: prefersReducedMotion ? 0 : 24, opacity: prefersReducedMotion ? 1 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
            ref={panelRef}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[--color-border-subtle]">
              <div className="min-w-0">
                <h2 id="cv-modal-title" className="text-base font-semibold truncate">
                  {tCv("pageTitle", { default: "Lebenslauf Ismet Mesic" })}
                </h2>
                <p className="text-sm text-[--color-foreground-muted] truncate">
                  {tCv("pageSubtitle", {
                    default:
                      "Berufserfahrung, Projekte und Engagements – klar strukturiert mit interaktiver Timeline.",
                  })}
                </p>
                {/* CTA: Vollansicht öffnen */}
                <div className="mt-1.5">
                  <Link
                    href={`/${locale}/lebenslauf`}
                    className="inline-flex items-center gap-1 text-[12px] px-2 py-1 rounded-md ring-1 ring-[--color-border-subtle] text-[--color-foreground] hover:bg-[--muted]/40 transition-colors"
                  >
                    <span>{tCv("openFullView", { default: "Vollansicht öffnen" })}</span>
                    <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-md hover:bg-[--muted]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface]"
                aria-label={tCommon("common.close", { default: "Schließen" })}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {/* Inhalt der Lebenslauf-Timeline */}
              <div className="max-w-3xl mx-auto">
                <CVTimeline />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
