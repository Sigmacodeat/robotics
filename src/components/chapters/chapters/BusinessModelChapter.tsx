"use client";
import Chapter from "./Chapter";
import Subsection from "./Subsection";
import BusinessModelKPIs from "../sections/BusinessModelKPIs";
import { useLocale, useTranslations } from "next-intl";

export default function BusinessModelChapter({
  id,
  title,
  description,
  revenueStreams,
  streams,
  pricingModel,
  pricing,
  costStructure,
  keyMetrics,
  competitiveAdvantage,
  projections,
  projectionsHeaders,
  successFactors,
  kpisTitle,
  streamsTitle,
  pricingTitle,
  pricingTiersTitle,
  scalingTitle,
  projectionsTitle,
  successFactorsTitle,
  pricingTiers,
  scaling,
  // neue optionale Inhalte
  gtmPoints,
  grantFitPoints,
  moatPoints,
}: {
  id: string;
  title: string;
  description?: string[];
  revenueStreams?: { type: string; description: string }[];
  streams?: string[];
  pricingModel?: { model: string; description: string }[];
  pricing?: string[];
  costStructure?: { category: string; items: string[] }[];
  keyMetrics?: { metric: string; target: string }[];
  competitiveAdvantage?: string[];
  projections?: (number | string)[][];
  projectionsHeaders?: string[];
  successFactors?: string[];
  kpisTitle: string;
  streamsTitle: string;
  pricingTitle: string;
  pricingTiersTitle?: string;
  scalingTitle?: string;
  projectionsTitle?: string;
  successFactorsTitle?: string;
  pricingTiers?: string[];
  scaling?: string[];
  // neue optionale Inhalte
  gtmPoints?: string[];
  grantFitPoints?: string[];
  moatPoints?: string[];
}) {
  const currentLocale = useLocale();
  const t = useTranslations();
  // mark optional, derzeit ungenutzte Props als verwendet, damit ESLint nicht fehlschlägt
  void costStructure; void keyMetrics; void competitiveAdvantage;
  return (
    <Chapter
      id={id}
      title={title}
      subtitle={t("chapters.businessModel.subtitle", { defaultMessage: "Business Model" })}
      headingAlign="center"
      pageBreakBefore
      avoidBreakInside
      variant="fadeIn"
      headingVariant="fadeInUp"
      contentVariant="fadeInUp"
    >
      <Subsection id="businessModel-kpis">
        <h3 className="font-semibold">{kpisTitle}</h3>
        <BusinessModelKPIs />
      </Subsection>

      {/* GTM & Pilots */}
      <Subsection id="businessModel-gtm" className="mt-6">
        <h3 className="font-semibold">{t('chapters.businessModel.gtmTitle', { defaultMessage: 'Go-To-Market & Pilots' })}</h3>
        {Array.isArray(gtmPoints) && gtmPoints.length > 0 ? (
          <ul className="list-none pl-0">
            {gtmPoints.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : null}
      </Subsection>

      {/* Grant Fit (AWS/FFG) */}
      <Subsection id="businessModel-grantFit" className="mt-6">
        <h3 className="font-semibold">{t('chapters.businessModel.grantFitTitle', { defaultMessage: 'Grant Fit (AWS / FFG)' })}</h3>
        {Array.isArray(grantFitPoints) && grantFitPoints.length > 0 ? (
          <ul className="list-none pl-0">
            {grantFitPoints.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : null}
      </Subsection>

      {/* IP & Technical Moat */}
      <Subsection id="businessModel-moat" className="mt-6">
        <h3 className="font-semibold">{t('chapters.businessModel.moatTitle', { defaultMessage: 'IP & Technical Moat' })}</h3>
        {Array.isArray(moatPoints) && moatPoints.length > 0 ? (
          <ul className="list-none pl-0">
            {moatPoints.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : null}
      </Subsection>
      {/* Overview / Narrative */}
      <Subsection id="businessModel-overview" className="mt-6">
        <h3 className="font-semibold">{t('chapters.businessModel.overviewTitle', { defaultMessage: 'Overview' })}</h3>
        {Array.isArray(description) && description.length > 0 ? (
          <div className="space-y-2">
            {description.map((p, i) => (
              <p key={i} className="text-sm text-[--color-foreground] opacity-90">{p}</p>
            ))}
          </div>
        ) : null}
      </Subsection>
      <Subsection id="businessModel-streams" className="mt-6">
        <h3 className="font-semibold">{streamsTitle}</h3>
        {Array.isArray(revenueStreams) && revenueStreams.length > 0 ? (
          <ol className="list-decimal pl-5">
            {revenueStreams.map((s, i) => (
              <li key={i}>
                <span className="font-medium">{s.type}</span>: {s.description}
              </li>
            ))}
          </ol>
        ) : Array.isArray(streams) && streams.length > 0 ? (
          <ol className="list-decimal pl-5">
            {streams.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
      <Subsection id="businessModel-pricing" className="mt-6">
        <h3 className="font-semibold">{pricingTitle}</h3>
        {Array.isArray(pricingModel) && pricingModel.length > 0 ? (
          <ol className="list-decimal pl-5">
            {pricingModel.map((p, i) => (
              <li key={i}>
                <span className="font-medium">{p.model}</span>: {p.description}
              </li>
            ))}
          </ol>
        ) : Array.isArray(pricing) && pricing.length > 0 ? (
          <ol className="list-decimal pl-5">
            {pricing.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
      <Subsection id="businessModel-pricingTiers" className="mt-6">
        <h3 className="font-semibold">{pricingTiersTitle ?? pricingTitle}</h3>
        {Array.isArray(pricingTiers) && pricingTiers.length > 0 ? (
          <ol className="list-decimal pl-5">
            {pricingTiers.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
      <Subsection id="businessModel-scaling" className="mt-6">
        <h3 className="font-semibold">{scalingTitle ?? "Scaling"}</h3>
        {Array.isArray(scaling) && scaling.length > 0 ? (
          <ol className="list-decimal pl-5">
            {scaling.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
      <Subsection id="businessModel-projections" className="mt-6 overflow-x-auto max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1 scrollbar-hide">
        {projections && projections.length ? (
          <>
            {projectionsTitle ? <h3 className="font-semibold">{projectionsTitle}</h3> : null}
            <table className="min-w-full text-sm border border-[--color-border]">
              {projectionsHeaders && projectionsHeaders.length ? (
                <thead>
                  <tr className="bg-[--color-muted]">
                    {projectionsHeaders.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-left border-b border-[--color-border]">{h}</th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {projections.map((row, rIdx) => (
                  <tr key={rIdx} className="odd:bg-[--color-background] even:bg-[--color-elevated]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 border-b border-[--color-border]">{typeof cell === "number" ? cell.toLocaleString(currentLocale) : cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
      </Subsection>
      <Subsection id="businessModel-successFactors" className="mt-6 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1 scrollbar-hide">
        <h3 className="font-semibold">{successFactorsTitle ?? "Success factors"}</h3>
        {successFactors && successFactors.length ? (
          <ol className="list-decimal pl-5">
            {successFactors.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
    </Chapter>
  );
}
