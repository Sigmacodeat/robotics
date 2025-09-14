"use client";
import React from "react";

export interface ChapterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  as?: React.ElementType;
  mutedTitle?: boolean;
}

/**
 * Einheitliche Card für Kapitel-Inhalte
 * - Verwendet die gleiche Optik wie in Kapitel 1 & 2 (rounded, subtle ring, glassy surface)
 * - Optionaler Titel/Untertitel
 * - Zentrierte Ausrichtung standardmäßig
 */
export default function ChapterCard({
  title,
  subtitle,
  align = "center",
  as,
  className,
  children,
  mutedTitle = false,
  ...rest
}: ChapterCardProps) {
  const Tag: React.ElementType = as ?? "div";
  return (
    <Tag
      className={[
        "rounded-lg p-4 pb-6 md:pb-7",
        "bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm",
        "shadow-sm",
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {title ? (
        <div className={[
          "font-medium",
          mutedTitle ? "text-[--color-foreground-muted]" : "",
          "leading-tight",
        ].join(" ")}>{title}</div>
      ) : null}
      {subtitle ? (
        <div className="text-xs text-[--color-foreground-muted] mt-1">{subtitle}</div>
      ) : null}
      {children}
    </Tag>
  );
}
