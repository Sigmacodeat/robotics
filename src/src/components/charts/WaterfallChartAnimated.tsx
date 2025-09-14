"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";
import { z } from "zod";

const StepSchema = z.object({
  label: z.union([z.string(), z.number()]),
  value: z.number(),
  type: z.enum(["increase", "decrease", "subtotal", "total"]).default("increase"),
  color: z.string().optional(),
});

export type WaterfallStep = z.infer<typeof StepSchema>;

export type WaterfallChartAnimatedProps = {
  steps: WaterfallStep[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
  locale?: string;
  responsive?: boolean;
  valueFormatter?: (v: number) => string;
  yTicksCount?: number; // default 5
};

export default function WaterfallChartAnimated({
  steps,
  width = 560,
  height = 280,
  ariaLabel = "Waterfall chart",
  className,
  locale = "de-DE",
  responsive = false,
  valueFormatter,
  yTicksCount = 5,
}: WaterfallChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  const safeSteps = useMemo(() => {
    try {
      return z.array(StepSchema).parse(steps);
    } catch {
      return [] as WaterfallStep[];
    }
  }, [steps]);

  const { bars, minY, maxY, dx } = useMemo(() => {
    let running = 0;
    const bars: { x: number; y: number; h: number; color: string; label: string | number; value: number }[] = [];
    const colors = {
      increase: "#16a34a",
      decrease: "#ef4444",
      subtotal: "#64748b",
      total: "#0ea5e9",
    } as const;
    const n = Math.max(1, safeSteps.length);
    const dx = width / n;
    let minY = 0;
    let maxY = 0;
    safeSteps.forEach((s, i) => {
      const start = running;
      if (s.type === "increase") running += s.value;
      else if (s.type === "decrease") running -= s.value;
      else if (s.type === "subtotal" || s.type === "total") running = s.value; // explicit
      const end = running;
      const y0 = Math.min(start, end);
      const y1 = Math.max(start, end);
      minY = Math.min(minY, y0);
      maxY = Math.max(maxY, y1);
      const range = Math.max(1, maxY - minY);
      const h = ((y1 - y0) / range) * (height - 40);
      const y = height - 20 - ((y0 - minY) / range) * (height - 40) - h;
      const x = i * dx + 8;
      const color = s.color ?? colors[s.type];
      bars.push({ x, y, h, color, label: s.label, value: s.value });
    });
    return { bars, minY, maxY, dx };
  }, [safeSteps, width, height]);

  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const fmt = useMemo(() => valueFormatter ?? ((v: number) => nf.format(v)), [valueFormatter, nf]);

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      width={responsive ? undefined : width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={responsive ? { width: "100%", height } : undefined}
    >
      {/* baseline */}
      <line x1={0} x2={width} y1={height - 20} y2={height - 20} stroke="var(--color-border)" />

      {/* bars */}
      {bars.map((b, i) => (
        reduceMotion ? (
          <g key={i}>
            <rect x={b.x} y={b.y} width={Math.max(8, dx - 16)} height={b.h} fill={b.color} rx={4} />
            <title>{`${String(b.label)}: ${fmt(b.value)}`}</title>
          </g>
        ) : (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 8 }} transition={{ ...defaultTransition, duration: 0.9, delay: 0.06 * i }}>
            <rect x={b.x} y={b.y} width={Math.max(8, dx - 16)} height={b.h} fill={b.color} rx={4} />
            <title>{`${String(b.label)}: ${fmt(b.value)}`}</title>
          </motion.g>
        )
      ))}

      {/* y ticks simple */}
      {(() => {
        const ticks = typeof yTicksCount === 'number' && yTicksCount > 0 ? yTicksCount : 5;
        const out: React.ReactElement[] = [];
        for (let i = 0; i <= ticks; i++) {
          const t = i / ticks;
          const v = minY + (maxY - minY) * t;
          const y = height - 20 - (t * (height - 40));
          out.push(
            <g key={`yt-${i}`}>
              <line x1={0} x2={width} y1={y} y2={y} stroke="var(--color-border)" opacity={0.25} strokeDasharray="4 4" />
              <text x={0} y={Math.min(height - 2, Math.max(12, y - 2))} fontSize={10} fill="var(--color-foreground-muted)">{fmt(v)}</text>
            </g>
          );
        }
        return out;
      })()}
    </svg>
  );
}
