"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export type MiniBarProps = {
  data: number[]; // values 0..100 suggested
  barCount?: number; // normalize or slice
  height?: number; // px
  color?: string; // defaults to var(--color-success) fallback
  bg?: string; // defaults to a faint version of color
  delay?: number;
  duration?: number; // total seconds baseline for the whole strip
  className?: string;
  rounded?: number; // border radius in px
  title?: string; // optional <title>
  ariaLabel?: string; // aria-label for screen readers
  ariaLabelledBy?: string; // id of external label element
  centered?: boolean; // horizontally center bars (default true)
  bottomGap?: number; // extra bottom padding in px (default 8)
};

export default function MiniBar({
  data,
  barCount = Math.min(8, data.length),
  height = 18,
  color = "var(--color-success)",
  bg = "color-mix(in oklab, var(--color-success) 18%, transparent)",
  delay = 0,
  duration = 2.2,
  className,
  rounded = 2,
  title,
  ariaLabel,
  ariaLabelledBy,
  centered = true,
  bottomGap = 8,
}: MiniBarProps) {
  const prefersReduced = useReducedMotion();
  const values = React.useMemo(() => {
    const src = Array.isArray(data) ? data : [];
    const count = Number.isFinite(barCount) && barCount! > 0 ? Math.floor(barCount!) : Math.min(8, src.length);
    const arr = src.slice(-Math.max(1, count));
    const max = Math.max(1, ...arr.map((v) => (Number.isFinite(v) ? (v as number) : 0)));
    return arr.map((v) => Math.max(0, Number.isFinite(v) ? (v as number) : 0) / max);
  }, [data, barCount]);

  const n = Math.max(1, values.length);
  const barWidth = `${Math.floor(100 / n)}%`;

  return (
    <div
      className={className}
      style={{ height, paddingBottom: bottomGap, display: "flex", alignItems: "flex-end", justifyContent: centered ? "center" : "flex-start" }}
      role="img"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {title ? <span className="sr-only">{title}</span> : null}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: "100%", width: "84%", margin: "0 auto" }}>
        {values.map((v, i) => {
          // Value-adaptive timing: higher bars animate minimal longer and start a touch later
          const perBarDur = prefersReduced ? 0 : Math.max(0.18, (duration * (0.5 + 0.5 * v)) / (n + 0.5));
          const perBarDelay = prefersReduced ? 0 : delay + duration * (i / (n * 2));
          return (
            <div key={i} style={{ width: barWidth, height: "100%", background: "transparent" }}>
              <div style={{ width: "100%", height: "100%", background: bg, borderRadius: rounded, overflow: "hidden" }}>
                <motion.div
                  initial={prefersReduced ? false : { height: 0 }}
                  animate={{ height: `${Math.round(v * 100)}%` }}
                  transition={prefersReduced ? { duration: 0 } : { duration: perBarDur, delay: perBarDelay, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: "100%", background: color, borderRadius: rounded, willChange: "height" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
