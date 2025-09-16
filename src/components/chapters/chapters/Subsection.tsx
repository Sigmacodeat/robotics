"use client";
import { ReactNode, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Subsection({ id, children, className, compact = false, snap = true }: { id: string; children: ReactNode; className?: string; compact?: boolean; snap?: boolean }) {
  const base = compact
    ? "scroll-mt-12 md:scroll-mt-16 flex flex-col justify-start"
    : "min-h-[100dvh] scroll-mt-16 md:scroll-mt-20 flex flex-col justify-start";
  const snapCls = compact ? "" : (snap ? "snap-start" : "");

  // Ref für Export/Print des Abschnitts
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({ contentRef: sectionRef, documentTitle: id });
  http://localhost:3000/lebenslauf
  return (
    <div id={id} ref={sectionRef} className={`${snapCls} ${base} avoid-break-inside ${className ?? ""}`.trim()}>
      {/* Export-Button: dezent, nur auf Screen sichtbar */}
      <div className="self-end mb-2 print:hidden">
        <button
          type="button"
          aria-label="Abschnitt exportieren/printen"
          onClick={handlePrint}
          className="inline-flex items-center gap-1 rounded-md border border-[--color-border-subtle] px-2 py-1 text-[11px] leading-none text-[--color-foreground-muted] hover:bg-[--muted]"
        >
          {/* einfache Icon-Darstellung per Emoji, um keine zusätzlichen Abhängigkeiten zu ziehen */}
          <span aria-hidden>🖨️</span>
          <span>Export</span>
        </button>
      </div>
      {children}
    </div>
  );
}
