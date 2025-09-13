"use client";

import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function ChapterProgress({
  totalChapters,
  currentChapter
}: {
  totalChapters: number;
  currentChapter: number;
}) {
  const progress = Math.round((currentChapter / totalChapters) * 100);

  return (
    <div className="space-y-2" aria-label="Kapitel-Fortschritt">
      <motion.div
        key={currentChapter}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Progress value={progress} className="mt-0.5" />
      </motion.div>
      <div className="flex justify-between text-xs text-[--color-foreground-muted]">
        <span>Fördercheck: AWS & FFG</span>
        <span>Kapitel {currentChapter}/{totalChapters}</span>
      </div>
    </div>
  );
}
