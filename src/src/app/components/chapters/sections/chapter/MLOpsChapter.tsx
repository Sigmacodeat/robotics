"use client";
import Chapter from "./Chapter";

export default function MLOpsChapter({ id, title, stackTitle, stack, practicesTitle, practices }: { id: string; title: string; stackTitle: string; stack: string[]; practicesTitle: string; practices: string[] }) {
  if (!Array.isArray(stack) && !Array.isArray(practices)) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeInUp" headingVariant="fadeInUp" contentVariant="fadeInUp">
      {Array.isArray(stack) && stack.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold">{stackTitle}</h3>
          <ol className="list-decimal pl-5">
            {stack.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
      {Array.isArray(practices) && practices.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">{practicesTitle}</h3>
          <ol className="list-decimal pl-5">
            {practices.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </Chapter>
  );
}
