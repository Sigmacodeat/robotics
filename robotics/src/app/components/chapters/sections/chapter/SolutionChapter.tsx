"use client";
import Chapter from "./Chapter";
import ChapterGrid from "../../shared/ChapterGrid";
import ChapterCard from "../../shared/ChapterCard";

export default function SolutionChapter({
  id,
  title,
  items,
  paragraphs,
  baseChapterIndex,
  parentSectionNumber,
  subSections,
}: {
  id: string;
  title: string;
  items: string[];
  paragraphs?: string[];
  // Optional: Für dynamische Unterpunkt-Nummerierung (z. B. 1.2.1 / 1.2.2)
  baseChapterIndex?: number;
  parentSectionNumber?: number;
  subSections?: { title?: string; content?: string }[];
}) {
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside headingAlign="center">
      {Array.isArray(paragraphs) && paragraphs.length > 0 && (
        <div className="space-y-3 mb-3">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {Array.isArray(subSections) && subSections.length > 0 ? (
        <div className="space-y-3 mb-4">
          {subSections.map((s, i) => {
            const hasNumber = typeof baseChapterIndex === 'number' && typeof parentSectionNumber === 'number';
            const numbering = hasNumber ? `${baseChapterIndex}.${parentSectionNumber}.${i + 1}` : undefined;
            const titleText = [numbering, s?.title].filter(Boolean).join(' ');
            return (
              <div key={`${i}-${s?.title || 'sub'}`}>
                {s?.title ? (
                  <h4 className="text-[13px] md:text-[14px] font-medium mb-1 text-[--color-foreground]">{titleText}</h4>
                ) : null}
                {s?.content ? (
                  <p className="text-[13px] md:text-[14px] text-[--color-foreground] opacity-90 leading-relaxed">{s.content}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
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
