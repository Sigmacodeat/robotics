"use client";
import Chapter from "./Chapter";
import ChapterGrid from "../shared/ChapterGrid";
import ChapterCard from "../shared/ChapterCard";

type LegalInfo = { entity?: string | number; hq?: string | number; founding?: string | number };

export default function CompanyChapter({
  id,
  title,
  items,
  legal,
  milestones,
  legalTitle,
  milestonesTitle,
}: {
  id: string;
  title: string;
  items?: string[];
  legal?: LegalInfo;
  milestones?: string[];
  legalTitle?: string;
  milestonesTitle?: string;
}) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasLegal = !!legal && (legal.entity || legal.hq || typeof legal.founding !== "undefined");
  const hasMilestones = Array.isArray(milestones) && milestones.length > 0;
  if (!hasItems && !hasLegal && !hasMilestones) return null;

  return (
    <Chapter id={id} title={title} headingAlign="center" pageBreakBefore avoidBreakInside>
      {hasItems ? (
        <section id="company-overview" aria-labelledby="company-overview-title">
          <h3 id="company-overview-title" className="sr-only">Overview</h3>
          <ChapterGrid>
            {items!.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </section>
      ) : null}

      {hasLegal ? (
        <section id="company-legal" aria-labelledby="company-legal-title" className="mt-6 rounded-xl bg-[--color-surface]/95 supports-[backdrop-filter]:backdrop-blur-sm p-4 shadow-sm ring-1 ring-[--color-border-subtle]">
          {legalTitle ? <h3 id="company-legal-title" className="mb-2 font-semibold">{legalTitle}</h3> : null}
          <dl className="grid gap-2 sm:grid-cols-3">
            {legal?.entity ? (
              <div>
                <dt className="text-xs text-[--color-foreground-muted]">Entity</dt>
                <dd className="font-medium">{String(legal.entity)}</dd>
              </div>
            ) : null}
            {legal?.hq ? (
              <div>
                <dt className="text-xs text-[--color-foreground-muted]">HQ</dt>
                <dd className="font-medium">{String(legal.hq)}</dd>
              </div>
            ) : null}
            {typeof legal?.founding !== "undefined" ? (
              <div>
                <dt className="text-xs text-[--color-foreground-muted]">Founding</dt>
                <dd className="font-medium">{String(legal?.founding)}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {hasMilestones ? (
        <section id="company-timeline" aria-labelledby="company-timeline-title" className="mt-6">
          {milestonesTitle ? <h3 id="company-timeline-title" className="mb-2 font-semibold">{milestonesTitle}</h3> : null}
          <ChapterGrid>
            {milestones!.map((m, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{m}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </section>
      ) : null}
    </Chapter>
  );
}
