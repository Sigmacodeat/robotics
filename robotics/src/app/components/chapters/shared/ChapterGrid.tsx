"use client";
import React from "react";

export interface ChapterGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  as?: React.ElementType;
}

/**
 * Einheitliches Grid für Kapitel-Karten
 * - Standard: 2 Spalten ab "sm", identisch zu existierendem Pattern
 */
export default function ChapterGrid({ columns = 2, as, className, children, ...rest }: ChapterGridProps) {
  const Tag: React.ElementType = as ?? "div";
  const base = "grid gap-4";
  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };
  return (
    <Tag className={[base, colMap[columns] ?? colMap[2], className ?? ""].join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
