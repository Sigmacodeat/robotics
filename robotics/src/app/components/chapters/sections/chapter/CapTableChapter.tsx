"use client";
import Chapter from "./Chapter";
import TableSimple from "@ui/TableSimple";
import DonutChartAnimated, { type DonutSlice } from "@charts/DonutChartAnimated";

export default function CapTableChapter({
  id,
  title,
  currentTitle,
  current,
  postTitle,
  post,
  headers,
}: {
  id: string;
  title: string;
  currentTitle: string;
  current: [string, string][];
  postTitle: string;
  post: [string, string][];
  headers: (string | number)[];
}) {
  if ((!Array.isArray(current) || current.length === 0) && (!Array.isArray(post) || post.length === 0)) return null;
  const parseShare = (v: string) => {
    const m = v.match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? parseFloat(m[1]) : 0;
  };
  const toSlices = (rows: [string, string][]): DonutSlice[] =>
    rows.map(([label, share]) => ({ label, value: parseShare(share) }));
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      {Array.isArray(current) && current.length > 0 && (
        <div>
          <h3 className="font-semibold">{currentTitle}</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <TableSimple headers={headers} rows={current} animateRows rowVariant="fadeInUp" stagger={0.05} />
            <div className="rounded-xl bg-[--color-surface] p-3 shadow-sm ring-1 ring-black/5">
              <DonutChartAnimated data={toSlices(current)} width={260} height={220} responsive ariaLabel={currentTitle} />
            </div>
          </div>
        </div>
      )}
      {Array.isArray(post) && post.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">{postTitle}</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <TableSimple headers={headers} rows={post} animateRows rowVariant="fadeInUp" stagger={0.05} />
            <div className="rounded-xl bg-[--color-surface] p-3 shadow-sm ring-1 ring-black/5">
              <DonutChartAnimated data={toSlices(post)} width={260} height={220} responsive ariaLabel={postTitle} />
            </div>
          </div>
        </div>
      )}
    </Chapter>
  );
}

