"use client";
import React from "react";
import { useTranslations } from "next-intl";

export type TimelinePhase = {
  period: string; // e.g., "2025 H2" or "Q1 2026"
  items?: string[];
};

interface TechnologyTimelineProps {
  title?: string;
  phases: TimelinePhase[];
}

/**
 * Simple vertical technology roadmap timeline with accessible list semantics.
 */
export default function TechnologyTimeline({ title, phases }: TechnologyTimelineProps) {
  const t = useTranslations();
  if (!Array.isArray(phases) || phases.length === 0) return null;

  return (
    <div className="mt-6">
      {title ? <h3 className="font-semibold">{title}</h3> : null}
      <ol className="relative border-s border-[--color-border] pl-6 space-y-4">
        {phases.map((p, idx) => (
          <li key={idx} className="ms-4">
            <div className="absolute w-3 h-3 bg-[--color-accent] rounded-full -start-1.5 mt-1.5" aria-hidden />
            <div className="font-medium">{p.period}</div>
            {Array.isArray(p.items) && p.items.length > 0 ? (
              <ul className="list-none pl-0 mt-1">
                {p.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[--color-foreground-muted] mt-1">{t("common.none")}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
