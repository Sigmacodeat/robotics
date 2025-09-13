"use client";
import {useMessages} from "next-intl";

// Simple 5x5 heatmap using monochrome cells to remain print-friendly
export default function RiskMatrix() {
  const messages = useMessages() as Record<string, unknown>;
  type MatrixItem = { name: string; prob: number; impact: number };
  type Matrix = {
    labels?: { prob?: string; impact?: string };
    scale?: number[];
    items?: MatrixItem[];
  };
  const matrix = ((messages as any)?.content?.risks?.matrix ?? {}) as Matrix;
  const labels = matrix.labels ?? { prob: "Probability", impact: "Impact" };
  const scale: number[] = Array.isArray(matrix.scale) ? matrix.scale : [1,2,3,4,5];
  const items: Array<{ name: string; prob: number; impact: number }> = matrix.items ?? [];

  // Build quick lookup for occupied cells (prob,impact)
  const cellMap = new Map<string, string[]>();
  for (const it of items) {
    const key = `${it.prob}-${it.impact}`;
    const arr = cellMap.get(key) ?? [];
    arr.push(it.name);
    cellMap.set(key, arr);
  }

  // Helper for intensity (higher risk -> darker)
  const maxScore = Math.max(...scale) * Math.max(...scale);
  const intensity = (p: number, i: number) => Math.min(1, (p * i) / maxScore);

  return (
    <div className="print:avoid-break-inside">
      <div className="flex items-end gap-4">
        <div className="grid" style={{gridTemplateColumns: `repeat(${scale.length}, minmax(28px, 1fr))`}}>
          {/* Column headers (probability) */}
          <div className="col-span-full mb-2 text-xs text-[--color-foreground-muted]">
            {labels.prob}
          </div>
          {/* Heatmap rows (impact as Y-axis from high to low) */}
          {scale.slice().reverse().map((impactValue) => (
            <div key={impactValue} className="contents">
              {scale.map((probValue) => {
                const score = intensity(probValue, impactValue);
                const key = `${probValue}-${impactValue}`;
                const names = cellMap.get(key) ?? [];
                return (
                  <div
                    key={key}
                    className="relative h-10 w-10 bg-[--color-surface] ring-1 ring-black/5"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,${0.08 + score * 0.28}), rgba(0,0,0,${0.08 + score * 0.28}))`,
                    }}
                    aria-label={`${labels.prob} ${probValue}, ${labels.impact} ${impactValue}${names.length ? ": " + names.join(", ") : ""}`}
                    title={`${labels.prob} ${probValue}, ${labels.impact} ${impactValue}${names.length ? ": " + names.join(", ") : ""}`}
                  >
                    {names.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-medium">{names.length}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {/* Y-axis label */}
        <div className="rotate-180 [writing-mode:vertical-rl] text-xs text-[--color-foreground-muted]">
          {labels.impact}
        </div>
      </div>

      {/* Legend of items */}
      {items.length > 0 && (
        <div className="mt-3 grid gap-1 text-sm">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="inline-flex h-3 w-3 ring-1 ring-black/5" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,${0.08 + intensity(it.prob, it.impact) * 0.28}), rgba(0,0,0,${0.08 + intensity(it.prob, it.impact) * 0.28}))`,
              }} />
              <span className="text-[--color-foreground-muted]">{it.name}</span>
              <span className="ml-auto tabular-nums text-xs">{labels.prob}: {it.prob} · {labels.impact}: {it.impact}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
