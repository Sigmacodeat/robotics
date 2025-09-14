"use client";
import Chapter from "./Chapter";
import TableSimple from "@ui/TableSimple";

export default function WorkPackagesBudgetChapter({
  id,
  title,
  rows,
  headers,
}: {
  id: string;
  title: string;
  headers: (string | number)[];
  rows: { id: string; name: string; timeline: string; deliverables?: string[]; budget: string | number }[];
}) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      <TableSimple
        headers={headers}
        rows={rows.map((wp) => [wp.id, wp.name, wp.timeline, Array.isArray(wp.deliverables) ? wp.deliverables.join(", ") : "", wp.budget])}
        animateRows
        rowVariant="fadeInUp"
        stagger={0.06}
      />
    </Chapter>
  );
}
