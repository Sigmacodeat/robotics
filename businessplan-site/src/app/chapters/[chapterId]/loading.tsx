export default function LoadingChapter() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-6">
      <div className="h-7 w-56 rounded-md bg-[--color-muted]/50 animate-pulse" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-[--color-muted]/40 animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 w-[92%] rounded bg-[--color-muted]/40 animate-pulse" />
        ))}
      </div>
      <div
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs text-[--color-foreground-muted] ring-1 ring-black/5 bg-[--color-background]/60 supports-[backdrop-filter]:bg-background/50 backdrop-blur animate-pulse"
      >
        Lädt Kapitel…
      </div>
    </div>
  );
}
