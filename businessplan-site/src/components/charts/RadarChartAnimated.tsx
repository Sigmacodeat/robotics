"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type RadarSeries = { name: string; color?: string; values: number[] };

export type RadarChartAnimatedProps = {
  axes: string[]; // axis labels in order
  series: RadarSeries[];
  width?: number;
  height?: number;
  maxValue?: number; // normalization max
  ariaLabel?: string;
  className?: string;
  responsive?: boolean;
};

export default function RadarChartAnimated({
  axes,
  series,
  width = 520,
  height = 520,
  maxValue = 10,
  ariaLabel = "Radar chart",
  className,
  responsive = false,
}: RadarChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  const { cx, cy, r, angle, polys, grid } = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - 40;
    const n = Math.max(1, axes.length);
    const angle = (2 * Math.PI) / n;
    // grid rings (5)
    const grid = Array.from({ length: 5 }, (_, gi) => {
      const rr = r * ((gi + 1) / 5);
      const pts = axes.map((_, i) => {
        const a = -Math.PI / 2 + i * angle;
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
      });
      return pts;
    });
    const polys = series.map((s) => {
      const pts = axes.map((_, i) => {
        const v = Math.max(0, Math.min(maxValue, s.values[i] ?? 0));
        const rr = (v / maxValue) * r;
        const a = -Math.PI / 2 + i * angle;
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
      });
      return { name: s.name, color: s.color ?? "#3b82f6", pts };
    });
    return { cx, cy, r, angle, polys, grid };
  }, [axes, series, width, height, maxValue]);

  const pathFrom = (pts: number[][]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z";

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
      {/* grid rings */}
      {grid.map((ring, i) => (
        <path key={`g-${i}`} d={pathFrom(ring)} fill="none" stroke="var(--color-border)" opacity={0.5} />
      ))}
      {/* axes lines and labels */}
      {axes.map((lab, i) => {
        const a = -Math.PI / 2 + i * angle;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        const lx = cx + (r + 14) * Math.cos(a);
        const ly = cy + (r + 14) * Math.sin(a);
        return (
          <g key={`ax-${i}`}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-border)" opacity={0.6} />
            <text x={lx} y={ly} fontSize={11} textAnchor="middle" fill="var(--color-foreground-muted)">{lab}</text>
          </g>
        );
      })}

      {/* series polygons */}
      {polys.map((p, i) => (
        reduceMotion ? (
          <path key={i} d={pathFrom(p.pts)} fill={p.color} opacity={0.25} stroke={p.color} />
        ) : (
          <motion.path key={i} d={pathFrom(p.pts)} fill={p.color} stroke={p.color} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 0.35 : 0 }} transition={{ duration: 1.6, ease: "easeOut", delay: 0.06 * i }} />
        )
      ))}

      {/* legend */}
      <g>
        {series.map((s, i) => (
          <g key={`leg-${i}`} transform={`translate(${8 + i * 140}, 10)`}>
            <rect width={12} height={12} rx={2} fill={s.color ?? "#3b82f6"} />
            <text x={16} y={11} fontSize={11} fill="var(--color-foreground)">{s.name}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
