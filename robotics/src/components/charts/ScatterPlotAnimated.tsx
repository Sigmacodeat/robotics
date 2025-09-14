"use client";
import { motion, useInView } from "framer-motion";
import React, { useMemo, useRef } from "react";
import { z } from "zod";
import { ScatterPointSchema, validateDev } from "./schemas";
import { defaultTransition } from "@/components/animation/variants";

export type ScatterPoint = {
  x: number; // e.g. Innovation 0..10
  y: number; // e.g. EU-Fokus 0..10
  label?: string;
  color?: string;
  size?: number; // px
  emphasis?: boolean; // highlight our point
};

export interface ScatterPlotAnimatedProps {
  data: ScatterPoint[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  grid?: boolean;
  ariaLabel?: string;
  className?: string;
  responsive?: boolean;
}

export default function ScatterPlotAnimated({
  data,
  width = 520,
  height = 520,
  xLabel = "X",
  yLabel = "Y",
  xDomain = [0, 10],
  yDomain = [0, 10],
  grid = true,
  ariaLabel = "Scatter plot",
  className,
  responsive = false,
}: ScatterPlotAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const safeData = useMemo(() => validateDev<ScatterPoint[]>(z.array(ScatterPointSchema), data, "ScatterPlotAnimated.data"), [data]);

  const scale = useMemo(() => {
    const [x0, x1] = xDomain;
    const [y0, y1] = yDomain;
    const sx = (v: number) => ((v - x0) / (x1 - x0)) * (width - 48) + 36; // padding left/right
    const sy = (v: number) => height - 36 - ((v - y0) / (y1 - y0)) * (height - 60); // padding bottom/top
    return { sx, sy };
  }, [xDomain, yDomain, width, height]);

  const ticks = 5;
  const xTicks = Array.from({ length: ticks + 1 }, (_, i) => xDomain[0] + (i * (xDomain[1] - xDomain[0])) / ticks);
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => yDomain[0] + (i * (yDomain[1] - yDomain[0])) / ticks);

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
      {/* Axes */}
      <line x1={36} x2={width - 12} y1={height - 36} y2={height - 36} stroke="var(--color-border)" />
      <line x1={36} x2={36} y1={height - 36} y2={12} stroke="var(--color-border)" />

      {/* Grid and ticks */}
      {grid && xTicks.map((t, i) => (
        <g key={`gx-${i}`}>
          <line x1={scale.sx(t)} x2={scale.sx(t)} y1={height - 36} y2={12} stroke="var(--color-border)" opacity={0.25} strokeDasharray="4 4" />
          <text x={scale.sx(t)} y={height - 18} fontSize={10} textAnchor="middle" fill="var(--color-foreground-muted)">{t}</text>
        </g>
      ))}
      {grid && yTicks.map((t, i) => (
        <g key={`gy-${i}`}>
          <line x1={36} x2={width - 12} y1={scale.sy(t)} y2={scale.sy(t)} stroke="var(--color-border)" opacity={0.25} strokeDasharray="4 4" />
          <text x={16} y={scale.sy(t) + 3} fontSize={10} textAnchor="start" fill="var(--color-foreground-muted)">{t}</text>
        </g>
      ))}

      {/* Labels */}
      <text x={(width) / 2} y={height - 4} fontSize={12} textAnchor="middle" fill="var(--color-foreground-muted)">{xLabel}</text>
      <text x={-height / 2} y={14} transform={`rotate(-90)`} fontSize={12} textAnchor="middle" fill="var(--color-foreground-muted)">{yLabel}</text>

      {/* Points */}
      {safeData.map((p, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.6 }}
          transition={{ ...defaultTransition, duration: 0.4, delay: 0.05 * i }}
        >
          <circle
            cx={scale.sx(p.x)}
            cy={scale.sy(p.y)}
            r={p.size ?? (p.emphasis ? 8 : 6)}
            fill={p.color ?? (p.emphasis ? "#2563eb" : "#9ca3af")}
            stroke={p.emphasis ? "#1d4ed8" : "#6b7280"}
            strokeWidth={p.emphasis ? 2 : 1}
            tabIndex={0}
            aria-label={`${p.label ?? `Point ${i + 1}`} — ${xLabel}: ${p.x}, ${yLabel}: ${p.y}`}
          />
          <title>{`${p.label ?? `Point ${i + 1}`} • ${xLabel}: ${p.x}, ${yLabel}: ${p.y}`}</title>
          {p.label && (
            <text x={scale.sx(p.x) + 8} y={scale.sy(p.y) - 6} fontSize={11} fill="var(--color-foreground)">{p.label}</text>
          )}
        </motion.g>
      ))}
    </svg>
  );
}
