"use client";

import React from "react";

type TOCItem = { id: string; title: string };

export default function PrintTOC({ title = "Inhalt", items }: { title?: string; items: TOCItem[] }) {
  return (
    <div className="hidden print:block rounded-2xl ring-1 ring-[--color-border-subtle] bg-[--color-surface] shadow-sm p-8 md:p-10 max-w-[210mm] mx-auto">
      <h2 className="text-xl font-semibold tracking-tight text-[--color-foreground-strong] mb-3">{title}</h2>
      <ul className="m-0 p-0 list-none">
        {items.map((it) => (
          <li key={it.id} className="toc-print-item">
            <span className="toc-print-title">{it.title}</span>
            {/* Page numbers for anchors are not reliably available in browsers; we keep a clean leader without number. */}
          </li>
        ))}
      </ul>
      <div className="page-break-after" />
    </div>
  );
}
