"use client";
import Chapter from "./Chapter";
import Subsection from "./Subsection";
import TechnologyTimeline from "../TechnologyTimeline";
import TechWorkPackages from "../TechWorkPackages";
import { useTranslations } from "next-intl";

export type TimelinePhase = { period: string; items?: string[] };
export type WorkPackage = { id?: string; name: string; timeline: string; deliverables?: string[] };

export default function TechnologyChapter({
  id,
  title,
  stack,
  roadmap,
  timelinePhases,
  workPackages,
  headings,
  safetyCompliancePoints,
  standardsList,
}: {
  id: string;
  title: string;
  stack?: string[];
  roadmap?: string[];
  timelinePhases?: TimelinePhase[];
  workPackages?: WorkPackage[];
  headings: {
    stack: string;
    roadmap: string;
    timeline: string;
    workPackages: string;
    safetyCompliance?: string;
    standards?: string;
  };
  safetyCompliancePoints?: string[];
  standardsList?: string[];
}) {
  const t = useTranslations();
  return (
    <Chapter id={id} title={title} subtitle={t('chapters.technology.subtitle', { defaultMessage: 'Technology' })} headingAlign="center" pageBreakBefore avoidBreakInside variant="scaleIn" headingVariant="fadeInUp" contentVariant="fadeInUp" viewportMargin="-10% 0px -10% 0px">
      <Subsection id="technology-stack" className="mt-2">
        <h3 className="font-semibold">{headings.stack}</h3>
        {Array.isArray(stack) && stack.length > 0 ? (
          <ol className="list-decimal pl-5">
            {stack.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>

      <Subsection id="technology-roadmap" className="mt-6">
        <h3 className="font-semibold">{headings.roadmap}</h3>
        {Array.isArray(roadmap) && roadmap.length > 0 ? (
          <ol className="list-decimal pl-5">
            {roadmap.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>

      <Subsection id="technology-timeline">
        {Array.isArray(timelinePhases) && timelinePhases.length > 0 ? (
          <TechnologyTimeline title={headings.timeline} phases={timelinePhases} />
        ) : null}
      </Subsection>

      <Subsection id="technology-workPackages">
        {Array.isArray(workPackages) && workPackages.length > 0 ? (
          <TechWorkPackages
            title={headings.workPackages}
            packages={workPackages.map((wp, idx) => ({
              id: wp.id ?? `WP${idx + 1}`,
              name: wp.name,
              timeline: wp.timeline,
              ...(wp.deliverables !== undefined ? { deliverables: wp.deliverables } : {}),
            }))}
          />
        ) : null}
      </Subsection>

      {/* Safety & Compliance (optional) */}
      <Subsection id="technology-safety" className="mt-6">
        <h3 className="font-semibold">{headings.safetyCompliance ?? 'Safety & Compliance'}</h3>
        {Array.isArray(safetyCompliancePoints) && safetyCompliancePoints.length > 0 ? (
          <ul className="list-none pl-0">
            {safetyCompliancePoints.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : null}
      </Subsection>

      {/* Standards & Certifications (optional) */}
      <Subsection id="technology-standards" className="mt-6">
        <h3 className="font-semibold">{headings.standards ?? 'Standards & Certifications'}</h3>
        {Array.isArray(standardsList) && standardsList.length > 0 ? (
          <ol className="list-decimal pl-5">
            {standardsList.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
    </Chapter>
  );
}
