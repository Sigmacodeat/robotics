"use client";

import React from "react";
import ChapterProgress from "@/components/chapters/ChapterProgress";
import ChapterNavigation from "@/app/chapters/[chapterId]/_components/ChapterNavigation";
import { AnimatePresence, motion } from "framer-motion";

export interface ChapterShellProps {
  currentChapter: number;
  totalChapters: number;
  children: React.ReactNode;
}

/**
 * ChapterShell
 * 
 * Konsistentes Seiten-Layout für Kapitel:
 * - Oben Fortschrittsanzeige
 * - Inhalt mit optimaler Lesebreite (reading-max)
 * - Unten Kapitel-Navigation
 */
export default function ChapterShell({ currentChapter, totalChapters, children }: ChapterShellProps) {
  // Sanft nach oben scrollen beim Kapitelwechsel
  React.useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  }, [currentChapter]);

  return (
    <div className="py-7 md:py-10">
      {/* Fortschritt oben – kompakter im Dark-Mode angenehm lesbar */}
      <section aria-label="Kapitel-Fortschritt">
        <ChapterProgress totalChapters={totalChapters} currentChapter={currentChapter} />
      </section>

      {/* Hauptinhalt mit sanfter Transition */}
      <main id="chapter-content" role="main" className="mt-7 md:mt-8 mx-auto reading-max">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation unten – dichter zusammenrücken */}
      <nav aria-label="Kapitel-Navigation" className="mt-7 md:mt-10">
        <ChapterNavigation currentChapter={currentChapter} totalChapters={totalChapters} />
      </nav>
    </div>
  );
}
