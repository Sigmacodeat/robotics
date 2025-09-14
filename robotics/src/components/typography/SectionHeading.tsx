"use client";

import React, { JSX } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  id?: string;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
  noUnderline?: boolean;
}

/**
 * Einheitliche Abschnittsüberschrift mit modernem Stil.
 * - Nutzt Gradient-Underline über Utility-Klassen
 * - Optional mit `id` für Anker/TOC
 * - `as` überschreibt das Heading-Tag (default h2)
 */
export default function SectionHeading({ id, as = "h2", children, className, subtitle, noUnderline = true }: SectionHeadingProps) {
  const Tag = as as any;
  return (
    <div className={cn("not-prose space-y-1", className)}>
      <Tag id={id} className={cn(
        "text-xl md:text-2xl font-semibold tracking-tight leading-[1.15]",
        !noUnderline && "underline-gradient"
      )}>
        {children}
      </Tag>
      {subtitle ? (
        <p className="text-sm text-[--color-foreground-muted]">{subtitle}</p>
      ) : null}
    </div>
  );
}
