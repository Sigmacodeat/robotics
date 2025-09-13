'use client';

import { Printer, ExternalLink } from 'lucide-react';

export default function CVActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4" role="group" aria-label="CV Aktionen">
      <a
        href="/lebenslauf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md ring-1 ring-[--color-border-subtle] bg-[--color-surface] text-[--color-foreground] hover:bg-[--color-surface-2] hover:ring-[--color-border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] transition-colors"
        aria-label="Vollständigen CV in neuem Tab öffnen"
        title="Vollständigen CV öffnen (neuer Tab)"
      >
        <ExternalLink className="h-4 w-4" aria-hidden />
        <span>Vollständiger CV</span>
      </a>

      <button
        type="button"
        onClick={() => window.print()}
        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md bg-[--color-primary]/10 text-[--color-foreground] ring-1 ring-[--color-border-subtle] hover:bg-[--color-primary]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] transition-colors"
        aria-label="CV drucken"
        title="CV drucken"
      >
        <Printer className="h-4 w-4" aria-hidden />
        <span>Drucken</span>
      </button>
    </div>
  );
}

