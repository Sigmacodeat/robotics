"use client";
import Chapter from "./Chapter";
import ChapterGrid from "../shared/ChapterGrid";
import ChapterCard from "../shared/ChapterCard";
import { useTranslations } from "next-intl";

export type ImpactHeadings = {
  societal: string;
  economic: string;
  environmental: string;
  policy: string;
  sustainability: string;
};

export default function ImpactChapter({
  id,
  title,
  intro,
  headings,
  societal,
  economic,
  environmental,
  policy,
  sustainability,
}: {
  id: string;
  title: string;
  intro?: string[];
  headings: ImpactHeadings;
  societal?: string[];
  economic?: string[];
  environmental?: string[];
  policy?: string[];
  sustainability?: string[];
}) {
  const t = useTranslations();
  return (
    <Chapter id={id} title={title} subtitle={t('chapters.impact.subtitle')} headingAlign="center" pageBreakBefore avoidBreakInside variant="scaleIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      {Array.isArray(intro) && intro.length > 0 ? (
        <div className="space-y-2">
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}

      {Array.isArray(societal) && societal.length > 0 ? (
        <div className="mt-6">
          <h3 className="font-semibold">{headings.societal}</h3>
          <ChapterGrid className="mt-2">
            {societal.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </div>
      ) : null}

      {Array.isArray(economic) && economic.length > 0 ? (
        <div className="mt-6">
          <h3 className="font-semibold">{headings.economic}</h3>
          <ChapterGrid className="mt-2">
            {economic.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </div>
      ) : null}

      {Array.isArray(environmental) && environmental.length > 0 ? (
        <div className="mt-6">
          <h3 className="font-semibold">{headings.environmental}</h3>
          <ChapterGrid className="mt-2">
            {environmental.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </div>
      ) : null}

      {Array.isArray(policy) && policy.length > 0 ? (
        <div className="mt-6">
          <h3 className="font-semibold">{headings.policy}</h3>
          <ChapterGrid className="mt-2">
            {policy.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </div>
      ) : null}

      {Array.isArray(sustainability) && sustainability.length > 0 ? (
        <div className="mt-6">
          <h3 className="font-semibold">{headings.sustainability}</h3>
          <ChapterGrid className="mt-2">
            {sustainability.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </div>
      ) : null}
    </Chapter>
  );
}
