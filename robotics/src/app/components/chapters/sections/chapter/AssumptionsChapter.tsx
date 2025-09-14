"use client";
import Chapter from "./Chapter";
import TableSimple from "@ui/TableSimple";

export default function AssumptionsChapter({
  id,
  title,
  assumptions,
  sources,
  tableTitle,
  headers,
  rows,
}: {
  id: string;
  title: string;
  assumptions?: string[];
  sources?: string[];
  tableTitle?: string;
  headers?: (string | number)[];
  rows?: (string | number)[][];
}) {
  const hasAssumptions = Array.isArray(assumptions) && assumptions.length > 0;
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const hasTable = Array.isArray(rows) && rows.length > 0;
  if (!hasAssumptions && !hasSources && !hasTable) return null;

  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      <div className="grid gap-4 md:grid-cols-2">
        {hasAssumptions && (
          <section>
            <h3 className="text-sm font-medium mb-1">Annahmen</h3>
            <ul className="list-disc pl-5 space-y-0.5">
              {assumptions!.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </section>
        )}
        {hasSources && (
          <section>
            <h3 className="text-sm font-medium mb-1">Quellen</h3>
            <ul className="list-disc pl-5 space-y-0.5">
              {sources!.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {hasTable && (
        <section className="mt-4">
          {tableTitle ? <div className="text-sm font-medium mb-1">{tableTitle}</div> : null}
          <TableSimple
            headers={(headers ?? ["Parameter", "Wert", "Quelle"]) as (string | number | null)[]}
            rows={rows!}
            animateRows
            rowVariant="fadeInUp"
            stagger={0.05}
          />
        </section>
      )}
    </Chapter>
  );
}
