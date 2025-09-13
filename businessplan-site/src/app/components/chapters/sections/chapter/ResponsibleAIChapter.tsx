"use client";
import Chapter from "./Chapter";

export default function ResponsibleAIChapter({
  id,
  title,
  evalsTitle,
  evals,
  redTeamTitle,
  redTeam,
  provenanceTitle,
  provenance,
}: {
  id: string;
  title: string;
  evalsTitle: string;
  evals: string[];
  redTeamTitle: string;
  redTeam: string[];
  provenanceTitle: string;
  provenance: string[];
}) {
  if (!Array.isArray(evals) && !Array.isArray(redTeam) && !Array.isArray(provenance)) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeInUp" headingVariant="fadeInUp" contentVariant="fadeInUp" staggerChildren={0.06}>
      {Array.isArray(evals) && evals.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold">{evalsTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {evals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {Array.isArray(redTeam) && redTeam.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">{redTeamTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {redTeam.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {Array.isArray(provenance) && provenance.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">{provenanceTitle}</h3>
          <ul className="mt-2 list-none pl-0 space-y-1 md:space-y-1.5">
            {provenance.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </Chapter>
  );
}
