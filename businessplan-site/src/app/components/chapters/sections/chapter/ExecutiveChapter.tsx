"use client";
import Chapter from "./Chapter";
import { useTranslations } from "next-intl";
import ChapterGrid from "../../shared/ChapterGrid";
import ChapterCard from "../../shared/ChapterCard";

export default function ExecutiveChapter({
  id,
  title,
  paragraphs,
  checklistTitle,
  checklistItems,
  keyFacts,
}: {
  id: string;
  title: string;
  paragraphs?: string[];
  checklistTitle?: string;
  // supports either array of strings or objects with id/label/required from i18n
  checklistItems?: Array<string | { id?: string; label: string; required?: boolean }>;
  // optional highlight facts to show as compact chips
  keyFacts?: string[];
}) {
  const t = useTranslations();
  const subtitle = t("chapters.executive.subtitle");
  return (
    <Chapter id={id} title={title} subtitle={subtitle} headingAlign="center" avoidBreakInside variant="fadeInUp" headingVariant="fadeInUp" contentVariant="fadeInUp" staggerChildren={0.06} snap={false}>
      {Array.isArray(keyFacts) && keyFacts.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {keyFacts.map((k, i) => (
            <span key={`${i}-${k}`} className="badge border-gradient chip-anim">{k}</span>
          ))}
        </div>
      ) : null}
      {Array.isArray(paragraphs) && paragraphs.length > 0 ? (
        paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
      ) : null}

      {Array.isArray(checklistItems) && checklistItems.length > 0 ? (
        <section className="mt-6" aria-labelledby={`${id}-exec-checklist-title`}>
          {checklistTitle ? (
            <h3 id={`${id}-exec-checklist-title`} className="font-semibold mb-2">
              {checklistTitle}
            </h3>
          ) : null}
          <ChapterGrid>
            {checklistItems.map((item, idx) => {
              const key = typeof item === "string" ? `${idx}-${item}` : item.id ?? `${idx}-${item.label}`;
              const label = typeof item === "string" ? item : item.label;
              const required = typeof item === "string" ? false : Boolean(item.required);
              return (
                <ChapterCard key={key}>
                  <div className="flex items-start justify-center gap-2">
                    <span className={`mt-0.5 inline-flex h-5 min-w-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${required ? "bg-emerald-600 text-white" : "bg-[--color-muted] text-[--color-foreground-muted]"}`} aria-hidden>
                      {required ? "✓" : "•"}
                    </span>
                    <span className="text-sm leading-snug">{label}</span>
                  </div>
                </ChapterCard>
              );
            })}
          </ChapterGrid>
        </section>
      ) : null}
    </Chapter>
  );
}
