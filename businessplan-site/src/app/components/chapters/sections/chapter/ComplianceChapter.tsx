"use client";
import Chapter from "./Chapter";
import { useTranslations } from "next-intl";

export default function ComplianceChapter({
  id,
  title,
  awsTitle,
  aws,
  privacyTitle,
  privacy,
  safetyTitle,
  safety,
  safetyStandardsTitle,
  safetyStandards,
  aiActTitle,
  aiAct,
  securityProgramTitle,
  securityProgram,
}: {
  id: string;
  title: string;
  awsTitle: string;
  aws: string[];
  privacyTitle: string;
  privacy: string[];
  safetyTitle: string;
  safety: string[];
  safetyStandardsTitle?: string;
  safetyStandards?: string[];
  aiActTitle?: string;
  aiAct?: string[];
  securityProgramTitle?: string;
  securityProgram?: string[];
}) {
  const t = useTranslations();
  return (
    <Chapter id={id} title={title} subtitle={t('chapters.compliance.subtitle')} headingAlign="center" pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      {aws?.length ? (
        <section id="compliance-aws" aria-labelledby="compliance-aws-title">
          <h3 id="compliance-aws-title" className="font-semibold">{awsTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {aws.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {privacy?.length ? (
        <section id="compliance-privacy" aria-labelledby="compliance-privacy-title" className="mt-6">
          <h3 id="compliance-privacy-title" className="font-semibold">{privacyTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {privacy.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {safety?.length ? (
        <section id="compliance-safety" aria-labelledby="compliance-safety-title" className="mt-6">
          <h3 id="compliance-safety-title" className="font-semibold">{safetyTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {safety.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {Array.isArray(safetyStandards) && safetyStandards.length > 0 ? (
        <section id="compliance-standards" aria-labelledby="compliance-standards-title" className="mt-6">
          <h3 id="compliance-standards-title" className="font-semibold">{safetyStandardsTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {safetyStandards.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {Array.isArray(aiAct) && aiAct.length > 0 ? (
        <section id="compliance-aiAct" aria-labelledby="compliance-aiAct-title" className="mt-6">
          <h3 id="compliance-aiAct-title" className="font-semibold">{aiActTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {aiAct.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {Array.isArray(securityProgram) && securityProgram.length > 0 ? (
        <section id="compliance-securityProgram" aria-labelledby="compliance-securityProgram-title" className="mt-6">
          <h3 id="compliance-securityProgram-title" className="font-semibold">{securityProgramTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {securityProgram.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </Chapter>
  );
}
