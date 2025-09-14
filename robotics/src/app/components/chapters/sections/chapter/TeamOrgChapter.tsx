"use client";
import Chapter from "./Chapter";
import TableSimple from "@ui/TableSimple";
import { useTranslations } from "next-intl";

export default function TeamOrgChapter({
  id,
  title,
  years,
  ftePlan,
  founders,
  summary,
  headers,
}: {
  id: string;
  title: string;
  years: { year: string | number; size: number | string; focus?: string[]; roles?: string[] }[];
  ftePlan?: { year: string | number; teamSize: number | string; focus?: string | string[]; roles?: string[] }[];
  founders?: string[];
  summary?: string;
  headers: (string | number)[];
}) {
  const t = useTranslations();
  // Fallback: Wenn kein years vorhanden ist, aus ftePlan ein kompatibles Array bilden
  const yearsDerived = Array.isArray(years) && years.length > 0
    ? years
    : Array.isArray(ftePlan)
      ? ftePlan.map((f) => ({
          year: f.year,
          size: (f as { teamSize?: number | string }).teamSize ?? (f as { size?: number | string }).size ?? "",
          focus: Array.isArray(f.focus) ? f.focus : typeof f.focus === "string" ? [f.focus] : undefined,
          roles: f.roles,
        }))
      : [];

  if (!Array.isArray(yearsDerived) || yearsDerived.length === 0) return null;
  return (
    <Chapter id={id} title={title} subtitle={t('chapters.team.subtitle')} headingAlign="center" pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp" staggerChildren={0.06}>
      {Array.isArray(founders) && founders.length > 0 && (
        <section id="team-founders" aria-labelledby="team-founders-title" className="mb-4">
          <h3 id="team-founders-title" className="sr-only">Founders</h3>
          <ul className="list-none pl-0">
            {founders.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}
      <section id="team-fte-plan" aria-labelledby="team-fte-plan-title">
        <h3 id="team-fte-plan-title" className="sr-only">FTE Plan</h3>
        <TableSimple
          headers={headers}
          rows={yearsDerived.map((y) => [y.year, y.size, Array.isArray(y.focus) ? y.focus.join(", ") : "", Array.isArray(y.roles) ? y.roles.join(", ") : ""])}
          animateRows
          rowVariant="fadeInUp"
          stagger={0.05}
        />
      </section>
      {summary && (
        <section id="team-summary" aria-labelledby="team-summary-title">
          <h3 id="team-summary-title" className="sr-only">Summary</h3>
          <p className="mt-4 text-sm text-[--color-foreground-muted]">{summary}</p>
        </section>
      )}
    </Chapter>
  );
}

