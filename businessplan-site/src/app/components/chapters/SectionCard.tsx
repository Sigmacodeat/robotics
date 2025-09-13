"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SectionCardProps = {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  id?: string;
};

/**
 * Einheitlicher, edler Karten-Wrapper für Kapitel-Sektionen.
 * - Ruhige Border/Fläche
 * - Konsistente Typografie für Titel
 */
export default function SectionCard({
  title,
  children,
  className,
  headerClassName,
  contentClassName,
  id,
}: SectionCardProps) {
  const headerId = id ? `${id}-title` : undefined;
  return (
    <Card
      id={id}
      aria-labelledby={headerId}
      tabIndex={-1}
      className={[
        "SectionCard rounded-2xl bg-[--color-surface]/70 shadow-sm ring-1 ring-[--color-border-subtle]/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[--color-primary]",
        "scroll-mt-24 mb-5 md:mb-7",
        className || "",
      ].join(" ")}
    > 
      {title !== undefined ? (
        <CardHeader className={["p-4 md:p-5", headerClassName || ""].join(" ")}> 
          <CardTitle
            id={headerId}
            className="not-prose text-[13px] md:text-[14px] leading-snug md:leading-normal font-semibold tracking-tight text-[--color-foreground]"
          > 
            {title}
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={["p-4 md:p-5 pt-0", contentClassName || ""].join(" ")}> 
        {children}
      </CardContent>
    </Card>
  );
}
