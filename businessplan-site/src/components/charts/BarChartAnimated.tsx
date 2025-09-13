"use client";
import { motion, useInView } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";

export type BarPoint = { label: string | number; value: number };

export interface BarChartAnimatedProps {
  data: BarPoint[];
  width?: number;
  height?: number;
  color?: string; // css color
  barWidth?: number; // if not provided, computed
  gap?: number; // px gap between bars
  ariaLabel?: string;
  className?: string;
  valueFormatter?: (v: number) => string;
  locale?: string; // explicit locale for deterministic SSR/CSR
  responsive?: boolean; // if true, width attribute is fluid via CSS
  tooltipFormatter?: (label: string | number, value: number) => string;
  yTicksCount?: number; // default 4
  valueSuffix?: string; // appended in default formatting when no formatter is provided
  showValueLabels?: boolean; // draw labels above bars
  valueLabelFontSize?: number; // px, default 10
  showXAxisLabels?: boolean; // show/hide x-axis category labels
}

export default function BarChartAnimated({
  data,
  width = 520,
  height = 280,
  color = "var(--color-accent-5)",
  barWidth,
  gap = 12,
  ariaLabel = "Bar chart",
  className,
  valueFormatter,
  locale = "de-DE",
  responsive = false,
  tooltipFormatter,
  yTicksCount = 4,
  valueSuffix,
  showValueLabels = false,
  valueLabelFontSize = 10,
  showXAxisLabels = true,
}: BarChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { bars, max, computedBarW } = useMemo(() => {
    if (!data.length)
      return { bars: [] as { x: number; y: number; h: number; v: number }[], max: 0, computedBarW: Math.max(8, (width - gap * (1)) / Math.max(1, data.length)) };
    const values = data.map((d) => d.value);
    const max = Math.max(...values, 1);
    const bw = barWidth ?? Math.max(8, (width - gap * (data.length + 1)) / data.length);
    const bars = data.map((d, i) => {
      const x = gap + i * (bw + gap);
      const h = (d.value / max) * (height - 24); // leave space for x labels
      const y = height - 18 - h; // leave baseline and labels
      return { x, y, h, v: d.value };
    });
    return { bars, max, computedBarW: bw };
  }, [data, width, height, gap, barWidth]);

  const fmt = useMemo(() => {
    if (valueFormatter) return valueFormatter;
    const nf = new Intl.NumberFormat(locale);
    return (v: number) => `${nf.format(v)}${valueSuffix ?? ''}`;
  }, [valueFormatter, locale, valueSuffix]);

  const yTicks = useMemo(() => {
    const ticks = Math.max(1, yTicksCount);
    const arr: { y: number; v: number }[] = [];
    const rangeMax = max || 1;
    for (let i = 0; i <= ticks; i++) {
      const ratio = i / ticks;
      const v = rangeMax * (1 - ratio);
      const y = (height - 18) * ratio; // from top to baseline
      arr.push({ y, v });
    }
    return arr;
  }, [max, height, yTicksCount]);

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
      onMouseLeave={() => setHoverIdx(null)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!data.length) return;
        if (e.key === "ArrowLeft") {
          setHoverIdx((prev) => (prev === null ? data.length - 1 : Math.max(0, prev - 1)));
        } else if (e.key === "ArrowRight") {
          setHoverIdx((prev) => (prev === null ? 0 : Math.min(data.length - 1, prev + 1)));
        }
      }}
    >
      {/* y-axis ticks and labels */}
      {yTicks.map((t, i) => (
        <g key={`y-${i}`}>
          <line x1={0} x2={width} y1={t.y} y2={t.y} stroke="var(--color-border)" opacity={0.6} strokeDasharray="4 4" />
          <text x={0} y={Math.min(height - 20, Math.max(10, t.y - 4))} fontSize={10} fill="var(--color-foreground-muted)">
            {fmt(t.v)}
          </text>
        </g>
      ))}

      {/* baseline */}
      <line x1={0} x2={width} y1={height - 18} y2={height - 18} stroke="var(--color-border)" />

      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={height - 18}
          width={computedBarW}
          height={0}
          fill={color}
          initial={{ height: 0, y: height - 18, opacity: 0 }}
          animate={{ height: inView ? b.h : 0, y: inView ? b.y : height - 18, opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.06 * i }}
        />
      ))}

      {/* value labels above bars */}
      {showValueLabels && bars.map((b, i) => (
        <motion.text
          key={`val-${i}`}
          x={gap + i * (computedBarW + gap) + computedBarW / 2}
          y={Math.max(10, b.y - 8)}
          fontSize={valueLabelFontSize}
          textAnchor="middle"
          fill="var(--color-foreground)"
          style={{ paintOrder: 'stroke fill', stroke: 'rgba(0,0,0,0.25)', strokeWidth: 2 }}
          initial={{ opacity: 0, y: (height - 18) - 8 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? Math.max(10, b.y - 8) : (height - 18) - 8 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 * i + 0.1 }}
        >
          {fmt(b.v)}
        </motion.text>
      ))}

      {/* x-axis labels */}
      {showXAxisLabels && data.map((d, i) => (
        <text key={`x-${i}`} x={gap + i * (computedBarW + gap) + computedBarW / 2} y={height - 4} fontSize={10} textAnchor="middle" fill="var(--color-foreground-muted)">
          {d.label}
        </text>
      ))}

      {/* hover overlay */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        onMouseMove={(e) => {
          const bbox = (e.currentTarget as SVGRectElement).getBoundingClientRect();
          const x = e.clientX - bbox.left;
          // determine index by stepping across bar+gap widths
          const step = computedBarW + gap;
          const idx = Math.floor((x - gap) / step);
          if (idx < 0 || idx >= data.length) {
            setHoverIdx(null);
          } else {
            setHoverIdx(idx);
          }
        }}
      />

      {hoverIdx !== null && data[hoverIdx] && bars[hoverIdx] && (
        <g pointerEvents="none">
          <line x1={bars[hoverIdx].x + computedBarW / 2} x2={bars[hoverIdx].x + computedBarW / 2} y1={0} y2={height} stroke={color} opacity={0.25} />
          <rect x={Math.min(bars[hoverIdx].x + computedBarW + 8, width - 160)} y={Math.max(8, bars[hoverIdx].y - 24)} width={152} height={32} rx={6} ry={6} fill="var(--color-card)" stroke="var(--color-border)" />
          <text x={Math.min(bars[hoverIdx].x + computedBarW + 16, width - 152)} y={Math.max(28, bars[hoverIdx].y + 2)} fontSize={11} fill="var(--color-foreground)">
            {tooltipFormatter ? tooltipFormatter(String(data[hoverIdx].label), bars[hoverIdx].v) : `${String(data[hoverIdx].label)} • ${fmt(bars[hoverIdx].v)}`}
          </text>
        </g>
      )}
    </svg>
  );
}
