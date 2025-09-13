"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type KpiItem = {
  id?: string;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
};

export type KpiStatRowProps = {
  items: KpiItem[];
  className?: string;
  itemClassName?: string;
};

/**
 * Edle, ruhige KPI-Zeile für Kapitel-Header-Bereiche.
 * - Luftige, mittig zentrierte Gestaltung (Mobile zentriert, ab md balanced)
 * - Dezente Flächen & Border, perfekt für Druck und Screen
 */
export default function KpiStatRow({ items, className, itemClassName }: KpiStatRowProps) {
  return (
    <div className={cn("not-prose mt-3 grid grid-cols-2 md:grid-cols-4 gap-2", className)}>
      {items.map((s, i) => (
        <div
          key={s.id ?? `${String(s.label)}-${i}`}
          className={cn(
            "flex items-center justify-center md:justify-between rounded-md ring-1 ring-[--color-border-subtle] bg-[--color-muted]/15 px-3 py-3",
            itemClassName
          )}
        >
          <span className="text-[11px] md:text-[12px] text-[--color-foreground-muted] truncate">{s.label}</span>
          <span className="ml-2 text-[12px] md:text-[13px] font-medium text-[--color-foreground] [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]">
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}
