"use client";
import { motion, useInView } from "framer-motion";
import React, { useMemo, useRef } from "react";
import { z } from "zod";
import { LinePointSchema, validateDev } from "./schemas";
import { defaultTransition } from "@/components/animation/variants";

export type BEPoint = { label: string | number; value: number };

export interface BreakEvenChartAnimatedProps {
  data: BEPoint[]; // Gewinn/Verlust je Jahr
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  ariaLabel?: string;
  className?: string;
  locale?: string;
  responsive?: boolean;
}

export default function BreakEvenChartAnimated({
  data,
  width = 560,
  height = 260,
  color = "#16a34a",
  strokeWidth = 3,
  ariaLabel = "Break-even chart",
  className,
  locale = "de-DE",
  responsive = false,
}: BreakEvenChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const safeData = useMemo(() => validateDev<BEPoint[]>(z.array(LinePointSchema), data, "BreakEvenChartAnimated.data"), [data]);

  const { min, max, dx, path, points } = useMemo(() => {
    const values = safeData.map((d) => d.value);
    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);
    const length = Math.max(1, safeData.length);
    const dx = width / Math.max(1, length - 1);
    const normY = (v: number) => height - ((v - min) / (max - min || 1)) * height;
    const pts = safeData.map((p, i) => ({ x: i * dx, y: normY(p.value), v: p.value }));
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    return { min, max, dx, path, points: pts };
  }, [safeData, width, height]);

  const nf = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);

  const yZero = useMemo(() => {
    // y-position of zero line
    const rng = max - min || 1;
    return height - ((0 - min) / rng) * height;
  }, [min, max, height]);

  const yTicks = useMemo(() => {
    const ticks = 4;
    const arr: { y: number; v: number }[] = [];
    const range = max - min || 1;
    for (let i = 0; i <= ticks; i++) {
      const ratio = i / ticks;
      const v = min + range * (1 - ratio);
      const y = height * ratio;
      arr.push({ y, v });
    }
    return arr;
  }, [min, max, height]);

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
      {/* Zero line */}
      <motion.line x1={0} x2={width} y1={yZero} y2={yZero} stroke="#ef4444" strokeDasharray="6 4" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 1 : 0 }} transition={{ ...defaultTransition, duration: 1.0 }} />

      {/* y-axis grid */}
      {yTicks.map((t, i) => (
        <g key={`y-${i}`}>
          <line x1={0} x2={width} y1={t.y} y2={t.y} stroke="var(--color-border)" opacity={0.5} strokeDasharray="4 4" />
          <text x={0} y={Math.min(height - 2, Math.max(10, t.y - 4))} fontSize={10} fill="var(--color-foreground-muted)">{nf.format(t.v)}</text>
        </g>
      ))}

      {/* line */}
      <motion.path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ ...defaultTransition, duration: 1.8 }} />

      {/* points */}
      {points.map((p, i) => (
        <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: inView ? 1 : 0, opacity: inView ? 1 : 0 }} transition={{ ...defaultTransition, duration: 0.45, delay: 0.12 + i * 0.06 }}>
          <circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill={color}
            tabIndex={0}
            aria-label={`${String(safeData[i]?.label)}: ${nf.format(p.v)}`}
          >
            <title>{`${String(safeData[i]?.label)} • ${nf.format(p.v)}`}</title>
          </circle>
        </motion.g>
      ))}

      {/* x labels */}
      {safeData.map((d, i) => (
        <text key={`x-${i}`} x={(dx * i)} y={height - 4} fontSize={10} textAnchor={i === 0 ? "start" : i === safeData.length - 1 ? "end" : "middle"} fill="var(--color-foreground-muted)">{d.label}</text>
      ))}
    </svg>
  );
}
