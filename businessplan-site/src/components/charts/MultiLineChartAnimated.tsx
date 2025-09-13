"use client";
import { motion, useInView } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { SeriesSchema, validateDev } from "./schemas";
import { defaultTransition } from "@/components/animation/variants";

export type SeriesPoint = { label: string | number; value: number };
export type Series = { name: string; color?: string; points: SeriesPoint[] };

export interface MultiLineChartAnimatedProps {
  series: Series[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  showArea?: boolean;
  ariaLabel?: string | undefined;
  className?: string;
  locale?: string;
  responsive?: boolean;
  valueFormatter?: (v: number) => string;
  tooltipFormatter?: (label: string | number, seriesName: string, value: number) => string;
  yTicksCount?: number; // default 4
}

export default function MultiLineChartAnimated({
  series,
  width = 560,
  height = 260,
  strokeWidth = 3,
  showArea = false,
  ariaLabel = "Multi line chart",
  className,
  locale = "de-DE",
  responsive = false,
  valueFormatter,
  tooltipFormatter,
  yTicksCount = 4,
}: MultiLineChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const safeSeries = useMemo(() => validateDev<Series[]>(z.array(SeriesSchema), series, "MultiLineChartAnimated.series"), [series]);

  const labels = useMemo(() => {
    const s = safeSeries[0]?.points ?? [];
    return s.map((p) => p.label);
  }, [safeSeries]);

  const { min, max, dx, lines } = useMemo(() => {
    const values: number[] = [];
    const length = Math.max(...safeSeries.map((s) => s.points.length), 0);
    safeSeries.forEach((s) => s.points.forEach((p) => values.push(p.value)));
    const max = values.length ? Math.max(...values) : 1;
    const min = values.length ? Math.min(...values) : 0;
    const dx = width / Math.max(1, length - 1);
    const normY = (v: number) => height - ((v - min) / (max - min || 1)) * height;
    const toPath = (pts: SeriesPoint[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i * dx).toFixed(2)},${normY(p.value).toFixed(2)}`).join(" ");
    const toArea = (pts: SeriesPoint[]) => `${toPath(pts)} L${width},${height} L0,${height} Z`;
    const lines = safeSeries.map((s) => ({
      name: s.name,
      color: s.color ?? "var(--color-accent-3)",
      path: toPath(s.points),
      area: showArea ? toArea(s.points) : undefined,
      points: s.points.map((p, i) => ({ x: i * dx, y: normY(p.value), v: p.value })),
    }));
    return { min, max, dx, lines };
  }, [safeSeries, width, height, showArea]);

  const yTicks = useMemo(() => {
    const ticks = typeof yTicksCount === 'number' && yTicksCount > 0 ? yTicksCount : 4;
    const arr: { y: number; v: number }[] = [];
    const range = max - min || 1;
    for (let i = 0; i <= ticks; i++) {
      const ratio = i / ticks;
      const v = min + range * (1 - ratio);
      const y = height * ratio;
      arr.push({ y, v });
    }
    return arr;
  }, [min, max, height, yTicksCount]);

  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const fmt = (v: number) => (typeof valueFormatter === 'function' ? valueFormatter(v) : nf.format(v));

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
      tabIndex={0}
      onKeyDown={(e) => {
        const length = labels.length;
        if (!length) return;
        if (e.key === "ArrowLeft") {
          setHoverIdx((prev) => (prev === null ? length - 1 : Math.max(0, prev - 1)));
        } else if (e.key === "ArrowRight") {
          setHoverIdx((prev) => (prev === null ? 0 : Math.min(length - 1, prev + 1)));
        }
      }}
      onMouseLeave={() => setHoverIdx(null)}
    >
      {yTicks.map((t, i) => (
        <g key={`y-${i}`}>
          <line x1={0} x2={width} y1={t.y} y2={t.y} stroke="var(--color-border)" opacity={0.6} strokeDasharray="4 4" />
          <text x={0} y={Math.min(height - 2, Math.max(10, t.y - 4))} fontSize={10} fill="var(--color-foreground-muted)">
            {fmt(t.v)}
          </text>
        </g>
      ))}

      {lines.map((l, li) => (
        <g key={li}>
          {showArea && l.area && (
            <motion.path d={l.area} fill={l.color} initial={{ opacity: 0 }} animate={{ opacity: inView ? 0.12 : 0 }} transition={{ ...defaultTransition, duration: 1.1, delay: 0.06 * li }} />
          )}
          <motion.path d={l.path} fill="none" stroke={l.color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ ...defaultTransition, duration: 1.8, delay: 0.06 * li }} />
          {l.points.map((p, pi) => (
            <motion.g key={pi} initial={{ scale: 0, opacity: 0 }} animate={{ scale: inView ? 1 : 0, opacity: inView ? 1 : 0 }} transition={{ ...defaultTransition, duration: 0.45, delay: 0.12 + pi * 0.06 + li * 0.03 }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill={l.color}
                tabIndex={0}
                aria-label={tooltipFormatter ? tooltipFormatter(String(labels[pi]), l.name, p.v) : `${l.name} – ${String(labels[pi])}: ${fmt(p.v)}`}
              >
                <title>{tooltipFormatter ? tooltipFormatter(labels[pi], l.name, p.v) : `${l.name} • ${String(labels[pi])} • ${fmt(p.v)}`}</title>
              </circle>
            </motion.g>
          ))}
        </g>
      ))}

      {labels.map((lab, i) => (
        <text key={`x-${i}`} x={(dx * i)} y={height - 4} fontSize={10} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} fill="var(--color-foreground-muted)">
          {lab}
        </text>
      ))}

      {/* Legend */}
      <g>
        {safeSeries.map((s, i) => (
          <g key={`leg-${i}`} transform={`translate(${8 + i * 120}, 10)`}>
            <rect width={12} height={12} rx={2} fill={s.color ?? "var(--color-accent-3)"} />
            <text x={16} y={11} fontSize={11} fill="var(--color-foreground)">{s.name}</text>
          </g>
        ))}
      </g>

      {/* Hover overlay to compute index */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        onMouseMove={(e) => {
          const bbox = (e.currentTarget as SVGRectElement).getBoundingClientRect();
          const x = e.clientX - bbox.left;
          const idx = Math.max(0, Math.min(labels.length - 1, Math.round(x / dx)));
          setHoverIdx(idx);
        }}
      />

      {hoverIdx !== null && labels[hoverIdx] !== undefined && (
        <g pointerEvents="none">
          {/* vertical guide line */}
          <line x1={dx * hoverIdx} x2={dx * hoverIdx} y1={0} y2={height} stroke="var(--color-accent-7)" opacity={0.25} />
          {/* tooltip box */}
          {(() => {
            const x = Math.min(dx * hoverIdx + 8, width - 200);
            const y = 18;
            const boxH = 18 + safeSeries.length * 16 + 8;
            return (
              <g>
                <rect x={x} y={y} width={192} height={boxH} rx={8} ry={8} fill="var(--color-surface)" stroke="var(--color-border)" />
                <text x={x + 10} y={y + 16} fontSize={11} fill="var(--color-foreground-muted)">{String(labels[hoverIdx])}</text>
                {safeSeries.map((s, i) => (
                  <g key={`tip-${i}`}>
                    <rect x={x + 10} y={y + 20 + i * 16 - 8} width={8} height={8} rx={2} fill={s.color ?? "var(--color-accent-3)"} />
                    <text x={x + 24} y={y + 20 + i * 16} fontSize={11} fill="var(--color-foreground)">
                      {tooltipFormatter ? tooltipFormatter(labels[hoverIdx], s.name, s.points?.[hoverIdx]?.value ?? 0) : `${s.name}: ${fmt(s.points?.[hoverIdx]?.value ?? 0)}`}
                    </text>
                  </g>
                ))}
              </g>
            );
          })()}
        </g>
      )}
    </svg>
  );
}
