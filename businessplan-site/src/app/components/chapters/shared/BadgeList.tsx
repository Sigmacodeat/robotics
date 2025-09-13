"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeListProps = {
  items: Array<string | React.ReactNode>;
  title?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  variant?: "badge" | "card" | "bullets"; // badge = Chips, card = kompakte Karten, bullets = Aufzählung
  dense?: boolean; // dichteres Layout
  color?: string; // dezente Rahmenfarbe (CSS-Farbe, z. B. #3b82f6 oder hsl(...))
  emphasizePrefix?: boolean; // nur für bullets: Teil vor ':' fett darstellen
  separators?: boolean; // nur für bullets: subtile Trenner zwischen Punkten
  numbered?: boolean; // nur für bullets: nummerierte Präfixe anzeigen (z. B. 2.3.1)
  prefix?: string; // nur für bullets+numbered: Präfix für die Nummerierung (z. B. '2.3')
};

export default function BadgeList({ items, title, className, itemClassName, variant = "badge", dense, color, emphasizePrefix = true, separators, numbered, prefix }: BadgeListProps) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className={cn("not-prose", className)}>
      {title ? (
        <div className="mb-2 text-[12px] md:text-[13px] font-medium text-[--color-foreground]">{title}</div>
      ) : null}
      {variant === "bullets" ? (
        <ul
          className={cn(
            // Luftige, gut lesbare Aufzählung; zentriert begrenzt für bessere Zeilenlänge
            // Marker dezent eingefärbt und typografisch etwas ruhiger
            "mx-auto max-w-4xl text-[13px] md:text-[14px] leading-relaxed tracking-[0.005em] text-pretty pb-2 md:pb-3 text-[--color-foreground]",
            // Bullets vs nummeriert: bei Nummern kein list-style (wir rendern manuell die Nummer-Spalte)
            numbered && prefix ? "list-none pl-0" : "list-none pl-0",
            // spacing: entweder via space-y oder via Gradient-Divider, nicht beides
            separators ? "list-separators-gradient [&>li]:py-2 md:[&>li]:py-2.5" : "space-y-2 md:space-y-2.5",
            dense && "space-y-1.5 md:space-y-2 pb-1.5 md:pb-2"
          )}
          style={{
            ["--bullet-color" as any]: color || "var(--color-accent, var(--color-foreground))",
            ["--divider-color" as any]: color || "var(--color-border-subtle)",
          }}
        >
          {items.map((item, idx) => (
            <li key={idx} className={cn("[&>strong]:text-[--color-foreground-strong]", itemClassName)}>
              {numbered && prefix ? (
                <div className="flex items-start gap-2">
                  <span className="text-[--color-foreground] font-medium text-xs md:text-[13px] whitespace-nowrap">{`${prefix}.${idx + 1}`}</span>
                  <span>
                    {typeof item === "string"
                      ? (() => {
                          if (!emphasizePrefix) return item;
                          const i = item.indexOf(":");
                          if (i <= 0) return item;
                          const head = item.slice(0, i);
                          const tail = item.slice(i + 1);
                          return (
                            <>
                              <strong>{head}:</strong>
                              {tail}
                            </>
                          );
                        })()
                      : item}
                  </span>
                </div>
              ) : (
                <>
                  {typeof item === "string"
                    ? (() => {
                        if (!emphasizePrefix) return item;
                        const i = item.indexOf(":");
                        if (i <= 0) return item;
                        const head = item.slice(0, i);
                        const tail = item.slice(i + 1);
                        return (
                          <>
                            <strong>{head}:</strong>
                            {tail}
                          </>
                        );
                      })()
                    : item}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className={cn(
            // Zentriert, luftiger und mit etwas mehr Unterluft für eleganteren Look
            "flex flex-wrap justify-center gap-2 md:gap-2.5 pb-2 md:pb-3",
            dense && "gap-1.5 md:gap-2 pb-1.5 md:pb-2"
          )}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                variant === "badge"
                  ? "badge border-gradient chip-anim" // Edlere Badges: Basisklasse + Gradient-Rand + sanfte Chip-Animation
                  : "px-3 py-2 rounded-md text-[12px] md:text-[13px] bg-[--color-muted]/8 border text-[--color-foreground] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
                itemClassName
              )}
              style={
                variant === "badge"
                  ? {
                      // Setzt die Ring-/Border-Farbe der globalen .badge über CSS-Variable
                      // (Fallback: systemische subtile Border-Farbe)
                      ["--color-border-subtle" as any]: color || undefined,
                    }
                  : {
                      // Für card-Variante weiterhin klassische borderColor-Steuerung
                      borderColor: color || 'var(--color-border-subtle)',
                    }
              }
            >
              {typeof item === "string" ? item : item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
