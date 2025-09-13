"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";
import { z } from "zod";

const SeriesSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
  values: z.array(z.number()),
});

export type StackedSeries = z.infer<typeof SeriesSchema>;

export type StackedBarAnimatedProps = {
  labels: Array<string | number>;
  series: StackedSeries[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
  locale?: string;
  responsive?: boolean;
  valueFormatter?: (v: number) => string;
  tooltipFormatter?: (label: string | number, name: string, value: number) => string;
  yTicksCount?: number; // default 4
};

export default function StackedBarAnimated({
  labels,
  series,
  width = 560,
  height = 260,
  ariaLabel = "Stacked bar chart",
  className,
  locale = "de-DE",
  responsive = false,
  valueFormatter,
  tooltipFormatter,
  yTicksCount = 4,
}: StackedBarAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  const safeSeries = useMemo(() => {
    try {
      return z.array(SeriesSchema).parse(series);
    } catch {
      return [] as StackedSeries[];
    }
  }, [series]);

  const { stacks, maxSum, barW } = useMemo(() => {
    const n = Math.max(1, labels.length);
    const barW = width / n;
    const sums: number[] = Array.from({ length: n }, () => 0);
    for (const s of safeSeries) {
      for (let i = 0; i < n; i++) sums[i] += s.values[i] ?? 0;
    }
    const maxSum = Math.max(...sums, 1);
    const stacks = labels.map((_, i) => {
      let cum = 0;
      const layers = safeSeries.map((s) => {
        const v = s.values[i] ?? 0;
        const y0 = cum;
        const y1 = cum + v;
        cum = y1;
        return { name: s.name, color: s.color ?? "#3b82f6", v, y0, y1 };
      });
      return layers;
    });
    return { stacks, maxSum, barW };
  }, [labels, safeSeries, width]);

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
      {stacks.map((layers, i) => {
        const x = i * barW + 6;
        return (
          <g key={i}>
            {layers.map((l, li) => {
              const h = ((l.y1 - l.y0) / maxSum) * (height - 40);
              const y = height - 20 - ((l.y0) / maxSum) * (height - 40) - h;
              return reduceMotion ? (
                <rect key={li} x={x} y={y} width={Math.max(10, barW - 12)} height={h} rx={3} fill={l.color}>
                  <title>{tooltipFormatter ? tooltipFormatter(labels[i], l.name, l.v) : `${String(labels[i])} • ${l.name}: ${fmt(l.v)}`}</title>
                </rect>
              ) : (
                <motion.rect
                  key={li}
                  x={x}
                  width={Math.max(10, barW - 12)}
                  rx={3}
                  fill={l.color}
                  initial={{ height: 0, y: height - 20, opacity: 0 }}
                  animate={{ height: inView ? h : 0, y: inView ? y : height - 20, opacity: inView ? 1 : 0 }}
                  transition={{ ...defaultTransition, duration: 0.9, delay: 0.06 * i + 0.04 * li }}
                >
                  <title>{tooltipFormatter ? tooltipFormatter(labels[i], l.name, l.v) : `${String(labels[i])} • ${l.name}: ${fmt(l.v)}`}</title>
                </motion.rect>
              );
            })}
          </g>
        );
      })}

      {/* y-grid */}
      {[...Array(Math.max(1, yTicksCount) + 1)].map((_, i) => {
        const ratio = i / Math.max(1, yTicksCount);
        const y = height - 20 - (ratio * (height - 40));
        const v = (1 - ratio) * maxSum;
        return (
          <g key={`g-${i}`}>
            <line x1={0} x2={width} y1={y} y2={y} stroke="var(--color-border)" opacity={0.25} strokeDasharray="4 4" />
            <text x={0} y={Math.min(height - 2, Math.max(10, y - 4))} fontSize={10} textAnchor="start" fill="var(--color-foreground-muted)">
              {fmt(v)}
            </text>
          </g>
        );
      })}

      {/* x-labels */}
      {labels.map((lab, i) => (
        <text key={`xl-${i}`} x={i * barW + barW / 2} y={height - 6} fontSize={10} textAnchor="middle" fill="var(--color-foreground-muted)">{String(lab)}</text>
      ))}

      {/* legend */}
      <g>
        {safeSeries.map((s, i) => (
          <g key={`leg-${i}`} transform={`translate(${8 + i * 120}, 10)`}>
            <rect width={12} height={12} rx={2} fill={s.color ?? "#3b82f6"} />
            <text x={16} y={11} fontSize={11} fill="var(--color-foreground)">{s.name}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
