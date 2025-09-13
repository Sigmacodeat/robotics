"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";

export type FunnelStage = { label: string; value: number; color?: string };

export type FunnelChartAnimatedProps = {
  stages: FunnelStage[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
  responsive?: boolean;
  valueFormatter?: (n: number) => string;
  valueSuffix?: string; // appended to formatted value when no formatter provided
  round?: boolean; // if true and no formatter provided, round values
  showLabels?: boolean; // draw labels inside chart
  labelFormatter?: (s: FunnelStage) => string; // custom label text
};

export default function FunnelChartAnimated({
  stages,
  width = 560,
  height = 260,
  ariaLabel = "Funnel chart",
  className,
  responsive = false,
  valueFormatter,
  valueSuffix,
  round = false,
  showLabels = false,
  labelFormatter,
}: FunnelChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  const { shapes } = useMemo(() => {
    // Defensiv: Maße und Daten bereinigen
    const safeWidth = Number.isFinite(width) && width > 0 ? width : 560;
    const safeHeight = Number.isFinite(height) && height > 0 ? height : 260;
    const safeStages = (Array.isArray(stages) ? stages : []).map((s) => ({
      label: String(s?.label ?? ""),
      value: Number.isFinite(s?.value) ? Math.max(0, s.value) : 0,
      color: s?.color,
    }));
    const values = safeStages.map((s) => s.value);
    const max = Math.max(1, ...values);
    const stepH = (safeHeight - 28) / Math.max(1, safeStages.length);
    const palette = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#14b8a6"];
    const shapes = safeStages.map((s, i) => {
      const t = s.value / max;
      const wTop = Math.max(40, safeWidth * (0.25 + 0.75 * t));
      const nextVal = i < safeStages.length - 1 ? safeStages[i + 1].value : s.value * 0.95;
      const wBottom = Math.max(40, safeWidth * (0.25 + 0.75 * (nextVal / max)));
      const xTop = (safeWidth - wTop) / 2;
      const xBottom = (safeWidth - wBottom) / 2;
      const yTop = 12 + i * stepH;
      const yBottom = yTop + stepH - 10;
      const d = `M ${xTop} ${yTop} L ${xTop + wTop} ${yTop} L ${xBottom + wBottom} ${yBottom} L ${xBottom} ${yBottom} Z`;
      const color = s.color ?? palette[i % palette.length];
      const yCenter = (yTop + yBottom) / 2;
      return { d, color, label: s.label, value: s.value, yCenter, xCenter: safeWidth / 2 };
    });
    return { shapes };
  }, [stages, width, height]);

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      width={responsive ? undefined : (Number.isFinite(width) && width > 0 ? width : 560)}
      height={Number.isFinite(height) && height > 0 ? height : 260}
      viewBox={`0 0 ${Number.isFinite(width) && width > 0 ? width : 560} ${Number.isFinite(height) && height > 0 ? height : 260}`}
      className={className}
      style={responsive ? { width: "100%", height } : undefined}
    >
      {shapes.map((s, i) => (
        reduceMotion ? (
          <g key={i}>
            <path d={s.d} fill={s.color} opacity={0.9} />
            <title>{`${s.label}: ${valueFormatter ? valueFormatter(s.value) : `${round ? Math.round(s.value) : s.value}${valueSuffix ?? ''}`}`}</title>
            {showLabels && (() => {
              const parts = String(labelFormatter ? labelFormatter({ label: s.label, value: s.value, color: s.color }) : s.label).split(' — ');
              const left = parts[0] ?? '';
              const right = parts.slice(1).join(' — ');
              return (
                <text
                  x={s.xCenter}
                  y={s.yCenter}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="var(--color-foreground)"
                >
                  <tspan fontWeight={600} fill="var(--color-foreground-strong)">{left}</tspan>
                  {right ? (
                    <tspan dx={6} fill="var(--color-foreground-muted)" fontWeight={500}>— {right}</tspan>
                  ) : null}
                </text>
              );
            })()}
          </g>
        ) : (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 8 }} transition={{ ...defaultTransition, duration: 0.5, delay: 0.06 * i }}>
            <path d={s.d} fill={s.color} opacity={0.95} />
            <title>{`${s.label}: ${valueFormatter ? valueFormatter(s.value) : `${round ? Math.round(s.value) : s.value}${valueSuffix ?? ''}`}`}</title>
            {showLabels && (() => {
              const parts = String(labelFormatter ? labelFormatter({ label: s.label, value: s.value, color: s.color }) : s.label).split(' — ');
              const left = parts[0] ?? '';
              const right = parts.slice(1).join(' — ');
              return (
                <motion.text
                  x={s.xCenter}
                  y={s.yCenter}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="var(--color-foreground)"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 8 }}
                  transition={{ ...defaultTransition, duration: 0.45, delay: 0.06 * i + 0.05 }}
                >
                  <tspan fontWeight={600} fill="var(--color-foreground-strong)">{left}</tspan>
                  {right ? (
                    <tspan dx={6} fill="var(--color-foreground-muted)" fontWeight={500}>— {right}</tspan>
                  ) : null}
                </motion.text>
              );
            })()}
          </motion.g>
        )
      ))}
    </svg>
  );
}
