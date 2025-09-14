"use client";
import { ReactNode } from "react";

export default function Subsection({ id, children, className, compact = false, snap = true }: { id: string; children: ReactNode; className?: string; compact?: boolean; snap?: boolean }) {
  const base = compact
    ? "scroll-mt-12 md:scroll-mt-16 flex flex-col justify-start"
    : "min-h-[100dvh] scroll-mt-16 md:scroll-mt-20 flex flex-col justify-start";
  const snapCls = compact ? "" : (snap ? "snap-start" : "");
  return (
    <div id={id} className={`${snapCls} ${base} ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
