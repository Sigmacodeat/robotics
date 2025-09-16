"use client";
import Chapter from "./Chapter";
import ChapterGrid from "../shared/ChapterGrid";
import ChapterCard from "../shared/ChapterCard";

export default function ProblemChapter({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      <section id="problem-overview" aria-labelledby="problem-overview-title">
        <h3 id="problem-overview-title" className="sr-only">Overview</h3>
        <ChapterGrid>
          {items.map((s, i) => (
            <ChapterCard key={i}>
              <p className="text-center">{s}</p>
            </ChapterCard>
          ))}
        </ChapterGrid>
      </section>
    </Chapter>
  );
}
