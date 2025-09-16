"use client";
import Chapter from "./Chapter";
import TableSimple from "@ui/TableSimple";

type Props = {
  id: string;
  title: string;
  // simple two/three-column variant
  headers?: (string | number)[];
  rows?: (string | number)[][];
  // optional multi-year variant (years as columns)
  byYearTitle?: string;
  byYearHeaders?: (string | number)[];
  byYearRows?: (string | number)[][];
  // optional aggregate CAPEX/OPEX table
  capexOpexTitle?: string;
  capexOpexHeaders?: (string | number)[];
  capexOpexRows?: (string | number)[][];
};

export default function CostPlanChapter({ id, title, headers, rows, byYearTitle, byYearHeaders, byYearRows, capexOpexTitle, capexOpexHeaders, capexOpexRows }: Props) {
  const hasSimple = Array.isArray(rows) && rows.length > 0;
  const hasByYear = Array.isArray(byYearRows) && byYearRows.length > 0;
  const hasCapexOpex = Array.isArray(capexOpexRows) && capexOpexRows.length > 0;
  if (!hasSimple && !hasByYear && !hasCapexOpex) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      {hasByYear && (
        <div className="avoid-break-inside">
          {byYearTitle && <h3 className="font-semibold">{byYearTitle}</h3>}
          <TableSimple
            {...(byYearHeaders ? { headers: byYearHeaders as (string | number | null)[] } : {})}
            rows={byYearRows!}
            animateRows
            rowVariant="fadeInUp"
            stagger={0.05}
          />
        </div>
      )}
      {hasSimple && (
        <div className="mt-6 avoid-break-inside">
          <TableSimple
            {...(headers ? { headers: headers as (string | number | null)[] } : {})}
            rows={rows!}
            animateRows
            rowVariant="fadeInUp"
            stagger={0.05}
          />
        </div>
      )}
      {hasCapexOpex && (
        <div className="mt-6 avoid-break-inside">
          {capexOpexTitle && <h3 className="font-semibold">{capexOpexTitle}</h3>}
          <TableSimple
            {...(capexOpexHeaders ? { headers: capexOpexHeaders as (string | number | null)[] } : {})}
            rows={capexOpexRows!}
            animateRows
            rowVariant="fadeInUp"
            stagger={0.05}
          />
        </div>
      )}
    </Chapter>
  );
}
