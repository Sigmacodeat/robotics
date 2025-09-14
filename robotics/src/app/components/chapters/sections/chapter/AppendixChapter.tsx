"use client";

import Chapter from "./Chapter";

export default function AppendixChapter({
  id,
  title,
  supportingTitle,
  supporting,
  referencesTitle,
  references,
  legalTitle,
  legal,
  technicalTitle,
  technical,
}: {
  id: string;
  title: string;
  supportingTitle?: string | undefined;
  supporting?: string[] | undefined;
  referencesTitle?: string | undefined;
  references?: string[] | undefined;
  legalTitle?: string | undefined;
  legal?: string[] | undefined;
  technicalTitle?: string | undefined;
  technical?: string[] | undefined;
}) {
  const SectionList = ({ heading, items }: { heading?: string | undefined; items?: string[] | undefined }) =>
    Array.isArray(items) && items.length > 0 ? (
      <div className="mt-6">
        {heading ? <h3 className="font-semibold">{heading}</h3> : null}
        <ul className="list-none pl-0">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <Chapter
      id={id}
      title={title}
      pageBreakBefore
      avoidBreakInside
      variant="fadeIn"
      headingVariant="fadeInUp"
      contentVariant="fadeInUp"
      staggerChildren={0.06}
    >
      <SectionList heading={supportingTitle} items={supporting} />
      <SectionList heading={referencesTitle} items={references} />
      <SectionList heading={legalTitle} items={legal} />
      <SectionList heading={technicalTitle} items={technical} />
    </Chapter>
  );
}
