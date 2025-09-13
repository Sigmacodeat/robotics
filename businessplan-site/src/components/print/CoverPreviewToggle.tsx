"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CoverPage from "@/components/document/CoverPage";

function useToggleParam(param: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const enabled = (searchParams?.get(param) ?? null) === "1";

  const setEnabled = (next: boolean) => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    if (next) {
      sp.set(param, "1");
    } else {
      sp.delete(param);
    }
    const base = pathname ?? "";
    const qs = sp.toString();
    router.replace(qs ? `${base}?${qs}` : base);
  };

  return { enabled, setEnabled } as const;
}

export default function CoverPreviewToggle() {
  const { enabled, setEnabled } = useToggleParam("cover");

  return (
    <div className="print:hidden">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors shadow-sm hover:bg-accent ${
            enabled ? "bg-accent/40" : "bg-background"
          }`}
          aria-pressed={enabled}
          aria-label={enabled ? "Deckblatt-Vorschau ausblenden" : "Deckblatt-Vorschau anzeigen"}
        >
          {enabled ? "Deckblatt ausblenden" : "Deckblatt anzeigen"}
        </button>
      </div>

      {enabled && (
        <div className="mt-4 rounded-xl border bg-background/50 p-2 sm:p-3">
          <CoverPage preview />
        </div>
      )}
    </div>
  );
}
