"use client";
import Chapter from "./Chapter";
import ChapterGrid from "../shared/ChapterGrid";
import ChapterCard from "../shared/ChapterCard";

export default function DisseminationChapter({ id, title, items }: { id: string; title: string; items: string[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeInUp" headingVariant="fadeInUp" contentVariant="fadeInUp">
      <ChapterGrid>
        {items.map((s, i) => (
          <ChapterCard key={i}>
            <p className="text-center">{s}</p>
          </ChapterCard>
        ))}
      </ChapterGrid>
    </Chapter>
  );
}
