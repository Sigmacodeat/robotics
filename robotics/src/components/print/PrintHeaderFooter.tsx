"use client";
import React from "react";

/**
 * PrintHeaderFooter
 * Fixed Kopf-/Fußzeile nur im Druck sichtbar. Zeigt links den aktuellen Abschnittstitel (per CSS target) und rechts die Seitenzahl.
 * Hinweis: Die Seitennummern werden von der Druckengine gerendert (CSS counters). Wir zeigen zusätzlich ein dezentes Branding.
 */
export default function PrintHeaderFooter() {
  return (
    <div aria-hidden className="print:show hidden">
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 h-10 px-8 text-xs text-[--color-foreground-muted] flex items-center justify-between"
        style={{
          // leichte Linie
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span>SIGMACODE AI – Businessplan</span>
        <span className="opacity-70">Confidential</span>
      </div>

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 h-10 px-8 text-xs text-[--color-foreground-muted] flex items-center justify-between"
        style={{
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <span className="opacity-70">© {new Date().getFullYear()} SIGMACODE AI</span>
        {/* Seitenzahl wird im Browser-Druck automatisch angezeigt; wir lassen rechts Platz */}
      </div>
    </div>
  );
}
