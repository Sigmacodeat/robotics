"use client";
import Chapter from "./Chapter";
import ChapterGrid from "../../shared/ChapterGrid";
import ChapterCard from "../../shared/ChapterCard";
import { useTranslations } from "next-intl";

export default function ProductsChapter({
  id,
  title,
  stages,
  timeline,
  features,
  timelinePhases,
  workPackages,
  paragraphs,
}: {
  id: string;
  title: string;
  stages: string[];
  timeline?: { start: string; end: string }[];
  features?: { phase: string; items: string[] }[];
  timelinePhases?: any[];
  workPackages?: any[];
  paragraphs?: string[];
}) {
  const t = useTranslations();
  // derzeit ungenutzte optionale Props markieren, damit ESLint nicht fehlschlägt
  void timeline; void features; void timelinePhases; void workPackages;
  return (
    <Chapter
      id={id}
      title={title}
      subtitle={t('chapters.products.subtitle')}
      headingAlign="center"
      pageBreakBefore
      avoidBreakInside
    >
      {Array.isArray(paragraphs) && paragraphs.length > 0 && (
        <div className="space-y-3 mb-3">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {Array.isArray(stages) && stages.length > 0 ? (
        <ChapterGrid>
          {stages.map((item, idx) => (
            <ChapterCard key={idx}>
              <p className="text-center">{item}</p>
            </ChapterCard>
          ))}
        </ChapterGrid>
      ) : null}
    </Chapter>
  );
}
