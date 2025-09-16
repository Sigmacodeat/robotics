"use client";
import Chapter from "./Chapter";
import ChapterGrid from "../shared/ChapterGrid";
import ChapterCard from "../shared/ChapterCard";

export default function CTAChapter({ id, title, lines }: { id: string; title: string; lines: string[] }) {
  if (!Array.isArray(lines) || lines.length === 0) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="scaleIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      <section aria-label="Call to Action">
        <ChapterGrid columns={3}>
          {lines.map((s, i) => (
            <ChapterCard key={i}>
              <p className="text-center font-medium">{s}</p>
            </ChapterCard>
          ))}
        </ChapterGrid>
      </section>
    </Chapter>
  );
}
