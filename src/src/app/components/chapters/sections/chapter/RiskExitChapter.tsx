"use client";
import Chapter from "./Chapter";

export default function RiskExitChapter({ id, title, exitTitle, items }: { id: string; title: string; exitTitle: string; items: string[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="slideInRight" headingVariant="fadeInUp" contentVariant="fadeInUp" staggerChildren={0.08}>
      <div>
        <h3 className="font-semibold">{exitTitle}</h3>
        <ol className="list-decimal pl-5">
          {items.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
