"use client";
import Chapter from "./Chapter";
import RiskMatrix from "../sections/RiskMatrix";
import { useTranslations } from "next-intl";

export default function RisksChapter({
  id,
  title,
  risksTitle,
  risks,
  mitigationTitle,
  mitigation,
  matrixTitle,
  additional,
}: {
  id: string;
  title: string;
  risksTitle: string;
  risks: string[];
  mitigationTitle: string;
  mitigation: string[];
  matrixTitle: string;
  additional?: Record<string, string>;
}) {
  const t = useTranslations();
  return (
    <Chapter id={id} title={title} subtitle={t('chapters.risks.subtitle')} headingAlign="center" pageBreakBefore avoidBreakInside variant="slideInRight" headingVariant="fadeInUp" contentVariant="fadeInUp">
      {risks?.length ? (
        <section id="risks-list" aria-labelledby="risks-list-title">
          <h3 id="risks-list-title" className="font-semibold">{risksTitle}</h3>
          <ol className="mt-2 list-decimal pl-5 space-y-1 md:space-y-1.5">
            {risks.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
      ) : null}
      {mitigation?.length ? (
        <section id="risks-mitigation" aria-labelledby="risks-mitigation-title" className="mt-6">
          <h3 id="risks-mitigation-title" className="font-semibold">{mitigationTitle}</h3>
          <ol className="mt-2 list-decimal pl-5 space-y-1 md:space-y-1.5">
            {mitigation.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
      ) : null}
      <section id="risks-matrix" aria-labelledby="risks-matrix-title" className="mt-6 avoid-break-inside">
        <h3 id="risks-matrix-title" className="font-semibold">{matrixTitle}</h3>
        <RiskMatrix />
      </section>
      {additional && Object.keys(additional).length > 0 && (
        <section id="risks-additional" aria-labelledby="risks-additional-title" className="mt-6">
          <h3 id="risks-additional-title" className="font-semibold">Weitere Details</h3>
          <ul className="list-none pl-0">
            {Object.entries(additional).map(([k, v]) => (
              <li key={k}>
                <strong className="text-[--color-foreground-muted] mr-1">{k}:</strong> {v}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Chapter>
  );
}

