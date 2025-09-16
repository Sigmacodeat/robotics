"use client";

import React from "react";

type ROIInlineSimulatorProps = {
  initialMultiple?: number; // EV/EBITDA multiple
  initialEbitda?: number;   // EBITDA (m€)
};

export default function ROIInlineSimulator({ initialMultiple = 6, initialEbitda = 5 }: ROIInlineSimulatorProps) {
  const [multiple, setMultiple] = React.useState<number>(initialMultiple);
  const [ebitda, setEbitda] = React.useState<number>(initialEbitda);
  const ev = multiple * ebitda;

  return (
    <div className="not-prose w-full rounded-lg bg-[--color-muted]/60 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-[12px] text-[--color-foreground-muted] mb-1">Multiple (EV/EBITDA)</label>
          <input
            type="range"
            min={3}
            max={12}
            step={0.5}
            value={multiple}
            onChange={(e) => setMultiple(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Multiple"
          />
          <div className="text-[13px] mt-1"><strong>{multiple.toFixed(1)}x</strong></div>
        </div>
        <div>
          <label className="block text-[12px] text-[--color-foreground-muted] mb-1">EBITDA (m€)</label>
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={ebitda}
            onChange={(e) => setEbitda(parseFloat(e.target.value))}
            className="w-full"
            aria-label="EBITDA"
          />
          <div className="text-[13px] mt-1"><strong>€{ebitda.toFixed(1)}m</strong></div>
        </div>
        <div className="rounded-md bg-[--color-surface] p-3 text-center shadow-sm ring-1 ring-black/5">
          <div className="text-[12px] text-[--color-foreground-muted]">Enterprise Value</div>
          <div className="text-[18px] font-semibold leading-tight">€{ev.toFixed(1)}m</div>
          <div className="text-[11px] text-[--color-foreground-muted]">EV = Multiple × EBITDA</div>
        </div>
      </div>
    </div>
  );
}
