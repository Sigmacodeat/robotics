"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ChapterError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Optional: Log to an error reporting service
    // console.error("Chapter render error:", error);
  }, [error]);

  return (
    <div role="alert" className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-[--color-background]/60 supports-[backdrop-filter]:bg-background/50 backdrop-blur ring-1 ring-red-200/50 text-red-800">
        <AlertCircle className="h-4 w-4" />
        <span>Beim Laden dieses Kapitels ist ein Fehler aufgetreten.</span>
      </div>

      <p className="text-sm text-[--color-foreground-muted]">
        Du kannst es erneut versuchen. Falls das Problem bestehen bleibt, prüfe deine Eingaben oder lade die Seite neu.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-[--color-primary]/10 text-[--color-primary] hover:bg-[--color-primary]/15 ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-background]"
        >
          <RotateCcw className="h-4 w-4" />
          Erneut versuchen
        </button>

        {error?.digest ? (
          <code className="text-xs text-[--color-foreground-muted]">Fehler-ID: {error.digest}</code>
        ) : null}
      </div>
    </div>
  );
}
