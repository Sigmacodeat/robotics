"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";

export type DonutSlice = { label: string; value: number; color?: string };

export type DonutChartAnimatedProps = {
  data: DonutSlice[];
  width?: number;
  height?: number;
  thickness?: number; // ring thickness
  ariaLabel?: string;
  className?: string;
  responsive?: boolean;
  showLabels?: boolean; // draw labels near slice mid-angle
  labelFormatter?: (s: DonutSlice) => string; // custom label text
  maxLabelCount?: number; // show at most N labels (largest slices)
  minLabelPercent?: number; // hide labels below this percent (0..100)
  abbreviateLabels?: boolean; // shorten long labels
  labelFontSize?: number; // px, default 10
  labelOutside?: boolean; // position labels outside the ring
  labelOffset?: number; // extra radial offset for outside labels
};

export default function DonutChartAnimated({
  data,
  width = 240,
  height = 240,
  thickness = 22,
  ariaLabel = "Donut chart",
  className,
  responsive = false,
  showLabels = false,
  labelFormatter,
  maxLabelCount,
  minLabelPercent,
  abbreviateLabels,
  labelFontSize = 10,
  labelOutside = false,
  labelOffset = 8,
}: DonutChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  const { slices, cx, cy, r } = useMemo(() => {
    const total = Math.max(1e-6, data.reduce((a, b) => a + Math.max(0, b.value), 0));
    const cx = width / 2;
    const cy = height / 2;
    // leave more margin when labels are placed outside
    const baseMargin = labelOutside ? 16 : 6;
    const r = Math.min(width, height) / 2 - baseMargin;
    let acc = 0;
    const palette = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#14b8a6", "#eab308", "#06b6d4"];
    const slices = data.map((d, i) => {
      const v = Math.max(0, d.value);
      const start = acc / total;
      acc += v;
      const end = acc / total;
      const color = d.color ?? palette[i % palette.length];
      return { label: d.label, start, end, color };
    });
    return { slices, cx, cy, r };
  }, [data, width, height, labelOutside]);

  // reference optional props that are currently not used in rendering
  void maxLabelCount; void minLabelPercent; void abbreviateLabels; void labelFontSize;

  const arc = (start: number, end: number) => {
    const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
    const a0 = start * 2 * Math.PI - Math.PI / 2;
    const a1 = end * 2 * Math.PI - Math.PI / 2;
    const x0 = round(cx + r * Math.cos(a0));
    const y0 = round(cy + r * Math.sin(a0));
    const x1 = round(cx + r * Math.cos(a1));
    const y1 = round(cy + r * Math.sin(a1));
    const large = end - start > 0.5 ? 1 : 0;
    // outer arc then inner arc back
    const ri = round(r - thickness);
    const xi1 = round(cx + ri * Math.cos(a1));
    const yi1 = round(cy + ri * Math.sin(a1));
    const xi0 = round(cx + ri * Math.cos(a0));
    const yi0 = round(cy + ri * Math.sin(a0));
    const R = round(r);
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${ri} ${ri} 0 ${large} 0 ${xi0} ${yi0} Z`;
  };

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
      {/* background ring */}
      <circle cx={cx} cy={cy} r={r - thickness / 2} stroke="var(--color-border)" strokeWidth={thickness} fill="none" opacity={0.3} />

      {slices.map((s, i) => {
        const d = arc(s.start, s.end);
        return reduceMotion ? (
          <g key={i}>
            <path d={d} fill={s.color}>
              <title>{`${s.label}`}</title>
            </path>
            {showLabels && (() => {
              const mid = (s.start + s.end) / 2;
              const angle = mid * 2 * Math.PI - Math.PI / 2;
              const rr = labelOutside ? (r + labelOffset) : (r - thickness / 2);
              const x = cx + rr * Math.cos(angle);
              const y = cy + rr * Math.sin(angle);
              const anchor: 'start' | 'end' | 'middle' = labelOutside ? (Math.cos(angle) >= 0 ? 'start' : 'end') : 'middle';
              const dx = labelOutside ? (Math.cos(angle) >= 0 ? 6 : -6) : 0;
              return (
                <text x={x} y={y} dx={dx} fontSize={11} textAnchor={anchor} dominantBaseline="middle" fill={labelOutside ? 'var(--color-foreground-muted)' : 'var(--color-foreground)'}>
                  {labelFormatter ? labelFormatter({ label: s.label, value: 0, color: s.color }) : s.label}
                </text>
              );
            })()}
          </g>
        ) : (
          <motion.path
            key={i}
            d={d}
            fill={s.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ ...defaultTransition, duration: 0.9, delay: 0.08 * i }}
          >
            <title>{`${s.label}`}</title>
          </motion.path>
        );
      })}

      {/* labels animation layer */}
      {!reduceMotion && showLabels && slices.map((s, i) => {
        const mid = (s.start + s.end) / 2;
        const angle = mid * 2 * Math.PI - Math.PI / 2;
        const rr = labelOutside ? (r + labelOffset) : (r - thickness / 2);
        const x = cx + rr * Math.cos(angle);
        const y = cy + rr * Math.sin(angle);
        const anchor: 'start' | 'end' | 'middle' = labelOutside ? (Math.cos(angle) >= 0 ? 'start' : 'end') : 'middle';
        const dx = labelOutside ? (Math.cos(angle) >= 0 ? 6 : -6) : 0;
        return (
          <motion.text
            key={`lbl-${i}`}
            x={x}
            y={y}
            dx={dx}
            fontSize={11}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill={labelOutside ? 'var(--color-foreground-muted)' : 'var(--color-foreground)'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 6 }}
            transition={{ ...defaultTransition, duration: 0.7, delay: 0.08 * i + 0.06 }}
          >
            {labelFormatter ? labelFormatter({ label: s.label, value: 0, color: s.color }) : s.label}
          </motion.text>
        );
      })}
    </svg>
  );
}
