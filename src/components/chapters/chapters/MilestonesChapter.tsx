"use client";
import Chapter from "./Chapter";
import TableSimple from "@ui/TableSimple";

export default function MilestonesChapter({
  id,
  title,
  headers,
  rows,
}: {
  id: string;
  title: string;
  headers: (string | number)[];
  rows: (string | number)[][];
}) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      <TableSimple
        headers={headers as (string | number | null)[]}
        rows={rows}
        animateRows
        rowVariant="fadeInUp"
        stagger={0.06}
      />
    </Chapter>
  );
}
