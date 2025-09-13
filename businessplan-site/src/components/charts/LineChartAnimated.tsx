"use client";
import { motion, useInView } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { LinePointSchema, validateDev } from "./schemas";
import { defaultTransition } from "@/components/animation/variants";

export type LinePoint = { label: string | number; value: number };

export interface LineChartAnimatedProps {
  data: LinePoint[];
  width?: number;
  height?: number;
  color?: string; // css color
  strokeWidth?: number;
  showPoints?: boolean;
  showArea?: boolean;
  ariaLabel?: string;
  className?: string;
  valueFormatter?: (v: number) => string;
  locale?: string; // explicit locale for deterministic SSR/CSR
  // new options
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
  yTicksCount?: number; // default 4
  showGrid?: boolean; // default true
  smooth?: boolean; // use Catmull-Rom -> Bezier smoothing
  minY?: number; // force min
  maxY?: number; // force max
  gradientArea?: boolean; // use gradient fill for area
  idSuffix?: string; // stable suffix for gradient/ids when multiple charts on page
  tooltipFormatter?: (label: string | number, value: number) => string; // custom tooltip text
  responsive?: boolean; // width=100% via CSS when true
}

export default function LineChartAnimated({
  data,
  width = 520,
  height = 280,
  color = "var(--color-accent-3)",
  strokeWidth = 3,
  showPoints = true,
  showArea = true,
  ariaLabel = "Line chart",
  className,
  valueFormatter,
  locale = "de-DE",
  padding = { top: 12, right: 12, bottom: 20, left: 28 },
  yTicksCount = 4,
  showGrid = true,
  smooth = true,
  minY,
  maxY,
  gradientArea = true,
  idSuffix,
  tooltipFormatter,
  responsive = false,
}: LineChartAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Runtime validation in dev to catch malformed props
  const safeData = useMemo(() => validateDev<LinePoint[]>(z.array(LinePointSchema), data, "LineChartAnimated.data"), [data]);

  // unique ids for gradients and a11y
  const uid = useMemo(() => {
    const base = String(ariaLabel || "line").replace(/\s+/g, "-").toLowerCase();
    const suffix = idSuffix ?? `${safeData.length}-${width}-${height}`;
    return `${base}-${suffix}`;
  }, [ariaLabel, idSuffix, safeData.length, width, height]);

  const { path, areaPath, points, min, max, dx, iw, ih, ox, oy } = useMemo(() => {
    const iw = Math.max(0, width - (padding.left ?? 0) - (padding.right ?? 0));
    const ih = Math.max(0, height - (padding.top ?? 0) - (padding.bottom ?? 0));
    const ox = padding.left ?? 0;
    const oy = padding.top ?? 0;
    if (!safeData.length) {
      return {
        path: "",
        areaPath: undefined as string | undefined,
        points: [] as { x: number; y: number; v: number }[],
        min: 0,
        max: 0,
        dx: Math.max(1, iw - 1),
        iw,
        ih,
        ox,
        oy,
      };
    }
    const values = safeData.map((d) => d.value);
    const vmax = maxY !== undefined ? maxY : Math.max(...values);
    const vmin = minY !== undefined ? minY : Math.min(...values);
    const dx = iw / Math.max(1, safeData.length - 1);
    const norm = (v: number) => (vmax === vmin ? 0.5 : (v - vmin) / (vmax - vmin));
    const pts = safeData.map((d, i) => ({ x: ox + i * dx, y: oy + (ih - norm(d.value) * ih), v: d.value }));

    // smoothing via Catmull-Rom to Bezier
    const toPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return "";
      if (!smooth || pts.length < 3) {
        return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
      }
      const d: string[] = [];
      d.push(`M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d.push(`C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`);
      }
      return d.join(" ");
    };

    const p = toPath(pts);
    const a = `${p} L${ox + iw},${oy + ih} L${ox},${oy + ih} Z`;
    return { path: p, areaPath: a, points: pts, min: vmin, max: vmax, dx, iw, ih, ox, oy };
  }, [safeData, width, height, padding.left, padding.right, padding.top, padding.bottom, minY, maxY, smooth]);

  const fmt = useMemo(() => {
    if (valueFormatter) return valueFormatter;
    const nf = new Intl.NumberFormat(locale);
    return (v: number) => nf.format(v);
  }, [valueFormatter, locale]);

  const yTicks = useMemo(() => {
    const ticks = Math.max(1, yTicksCount);
    const arr: { y: number; v: number }[] = [];
    const range = max - min || 1;
    for (let i = 0; i <= ticks; i++) {
      const ratio = i / ticks;
      const v = min + range * (1 - ratio);
      const y = oy + ih * ratio;
      arr.push({ y, v });
    }
    return arr;
  }, [min, max, ih, oy, yTicksCount]);


  // a11y: title/desc association
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  return (
    <svg
      ref={ref}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
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
      <title id={titleId}>{ariaLabel}</title>
      <desc id={descId}>{`Line chart with ${safeData.length} data points`}</desc>

      {/* defs: gradient for area fill */}
      {gradientArea && (
        <defs>
          <linearGradient id={`${uid}-grad`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
      )}
      {/* y-axis ticks and labels */}
      {yTicks.map((t, i) => (
        <g key={`y-${i}`}>
          {showGrid && (
            <line x1={ox} x2={ox + iw} y1={t.y} y2={t.y} stroke="var(--color-border)" opacity={0.6} strokeDasharray="4 4" />
          )}
          <text x={Math.max(0, ox - 4)} y={Math.min(height - 2, Math.max(10, t.y - 4))} fontSize={10} textAnchor="end" fill="var(--color-foreground-muted)">
            {fmt(t.v)}
          </text>
        </g>
      ))}

      {showArea && areaPath && (
        <motion.path
          d={areaPath}
          fill={gradientArea ? `url(#${uid}-grad)` : color}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 0.12 : 0 }}
          transition={{ ...defaultTransition, duration: 1.1, delay: 0.12 }}
        />
      )}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ ...defaultTransition, duration: 1.8 }}
      />
      {showPoints && points.map((p, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
          transition={{ ...defaultTransition, duration: 0.45, delay: 0.18 + i * 0.06 }}
       >
          <circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill={color}
            tabIndex={0}
            aria-label={`${String(safeData[i]?.label)}: ${fmt(p.v)}`}
            onFocus={() => setHoverIdx(i)}
          >
            <title>{`${String(safeData[i]?.label)} • ${fmt(p.v)}`}</title>
          </circle>
          {/* invisible larger hit-area for easier mouse hover */}
          <circle cx={p.x} cy={p.y} r={12} fill="transparent" onMouseEnter={() => setHoverIdx(i)} />
        </motion.g>
      ))}

      {/* x-axis labels */}
      {safeData.map((d, i) => (
        <text key={`x-${i}`} x={ox + i * dx} y={height - Math.max(4, (padding.bottom ?? 0) / 2)} fontSize={10} textAnchor={i === 0 ? "start" : i === safeData.length - 1 ? "end" : "middle"} fill="var(--color-foreground-muted)">
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
          const idx = Math.max(0, Math.min(safeData.length - 1, Math.round((x - (ox)) / dx)));
          setHoverIdx(idx);
        }}
      />

      {hoverIdx !== null && points[hoverIdx] && (
        <g pointerEvents="none">
          <line x1={points[hoverIdx].x} x2={points[hoverIdx].x} y1={0} y2={height} stroke={color} opacity={0.25} />
          <circle cx={points[hoverIdx].x} cy={points[hoverIdx].y} r={5} fill={color} />
          <rect x={Math.min(points[hoverIdx].x + 8, width - 184)} y={Math.max(8, points[hoverIdx].y - 28)} width={176} height={36} rx={6} ry={6} fill="var(--color-surface)" stroke="var(--color-border)" />
          <text x={Math.min(points[hoverIdx].x + 16, width - 176)} y={Math.max(30, points[hoverIdx].y + 2)} fontSize={11} fill="var(--color-foreground)">
            {tooltipFormatter ? tooltipFormatter(safeData[hoverIdx].label, points[hoverIdx].v) : `${String(safeData[hoverIdx].label)} • ${fmt(points[hoverIdx].v)}`}
          </text>
        </g>
      )}
    </svg>
  );
}
