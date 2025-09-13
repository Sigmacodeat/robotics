"use client";

import React from "react";

export interface SectionNoteProps {
  de: React.ReactNode;
  en: React.ReactNode;
  useDe: boolean;
  className?: string;
  size?: "xxs" | "xs" | "sm"; // Typo-Größe (xxs < xs < sm)
}

/**
 * SectionNote – dezente, wiederverwendbare Fußnote/Quellenzeile für Kapitel.
 * - Einheitliche Typografie und Abstände
 * - Sprachumschaltung via locale.startsWith('de') an Aufruferstelle
 */
export default function SectionNote({ de, en, useDe, className = "", size = "xs" }: SectionNoteProps) {
  // Größe steuern – xs etwas kleiner/enger, sm etwas größer/entspannter
  const sizeClasses = size === "xxs"
    ? "mt-1 text-[5px] md:text-[6px] leading-[1.2]"
    : size === "xs"
    ? "mt-1.5 text-[6px] md:text-[7px] leading-[1.25]"
    : "mt-3 text-[10px] md:text-[11px]";

  // Erzwinge minimale Schriftgröße/Zeilenhöhe unabhängig von vererbten Stilen
  const inlineStyle = size === "xxs"
    ? ({ fontSize: '6px', lineHeight: 1.2 } as React.CSSProperties)
    : size === "xs"
    ? ({ fontSize: '7px', lineHeight: 1.25 } as React.CSSProperties)
    : undefined;

  return (
    <div
      className={`not-prose ${sizeClasses} text-slate-500/80 dark:text-slate-400/80 italic ${className}`.trim()}
      style={inlineStyle}
    >
      <span className="text-[inherit] leading-[inherit]">{useDe ? de : en}</span>
    </div>
  );
}
