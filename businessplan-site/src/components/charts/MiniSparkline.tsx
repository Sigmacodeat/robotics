"use client";

import * as React from "react";
import { motion } from "framer-motion";

export type MiniSparklineProps = {
  data: number[];
  width?: number; // viewBox width
  height?: number; // viewBox height
  colorStart?: string; // start color
  colorEnd?: string; // end color
  strokeWidth?: number;
  delay?: number; // seconds
  duration?: number; // seconds
  className?: string;
  showArea?: boolean;
  showDot?: boolean;
  variant?: "smooth" | "sharp"; // curve style; default smooth
  lineCap?: "round" | "butt" | "square"; // stroke-linecap
};

function toPoints(data: number[], w: number, h: number) {
  const safeW = Number.isFinite(w) && w > 0 ? w : 100;
  const safeH = Number.isFinite(h) && h > 0 ? h : 24;
  const cleaned = (Array.isArray(data) ? data : [])
    .map((v) => (Number.isFinite(v) ? (v as number) : NaN))
    .filter((v) => Number.isFinite(v)) as number[];
  if (!cleaned.length) return [] as ReadonlyArray<readonly [number, number]>;
  const min = Math.min(...cleaned);
  const max = Math.max(...cleaned);
  const range = max - min || 1;
  const stepX = safeW / Math.max(1, cleaned.length - 1);
  return cleaned.map((v, i) => {
    const x = i * stepX;
    const y = safeH - ((v - min) / range) * safeH; // invert y
    return [x, y] as const;
  });
}

// Smooth quadratic path through points using midpoint technique
function smoothQPath(points: ReadonlyArray<readonly [number, number]>) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) {
    const [x, y] = points[0];
    return `M ${x} ${y}`;
  }
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    d += ` Q ${x1.toFixed(2)} ${y1.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  d += ` Q ${prev[0].toFixed(2)} ${prev[1].toFixed(2)} ${last[0].toFixed(2)} ${last[1].toFixed(2)}`;
  return d;
}

export default function MiniSparkline({
  data,
  width = 100,
  height = 24,
  colorStart = "#22c55e",
  colorEnd = "#3b82f6",
  strokeWidth = 2,
  delay = 0,
  duration = 0.9,
  className,
  showArea = true,
  showDot = true,
  variant = "smooth",
  lineCap = "round",
}: MiniSparklineProps) {
  const id = React.useId();
  // Defensiv: width/height/stroke validieren
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 100;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 24;
  const safeStroke = Number.isFinite(strokeWidth) && strokeWidth > 0 ? strokeWidth : 2;
  const innerH = Math.max(1, safeHeight - safeStroke); // keep a touch of top/bottom padding
  const points = React.useMemo(() => toPoints(data, safeWidth, innerH), [data, safeWidth, innerH]);
  const pathD = React.useMemo(() => {
    if (!points || points.length === 0) return "";
    if (variant === "sharp") {
      let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
      for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
      }
      return d;
    }
    return smoothQPath(points);
  }, [points, variant]);
  const [pathLength, setPathLength] = React.useState(0);
  const ref = React.useRef<SVGPathElement | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      try {
        const len = ref.current.getTotalLength();
        setPathLength(len);
      } catch {}
    }
  }, [pathD]);

  const lastPoint = points.length ? points[points.length - 1] : undefined;
  const areaPath = React.useMemo(() => {
    if (!points.length || points.length < 2) return ""; // keine Fläche bei <2 Punkten
    const baseY = innerH + safeStroke / 2; // bottom baseline
    const start = `M ${points[0][0].toFixed(2)} ${baseY.toFixed(2)}`;
    const line = variant === "sharp"
      ? (() => {
          let d = `L ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
          for (let i = 1; i < points.length; i++) d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
          return d;
        })()
      : smoothQPath(points);
    const end = ` L ${points[points.length - 1][0].toFixed(2)} ${baseY.toFixed(2)} Z`;
    // Sicher: Wenn die Linie leer ist, keinen Replace ausführen
    const safeLine = line
      ? line.replace(/^M[^Q]+/, () => `L ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`)
      : `L ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    return start + " " + safeLine + end;
  }, [points, innerH, safeStroke, variant]);

  return (
    <svg
      className={className}
      width="100%"
      height={safeHeight}
      viewBox={`0 0 ${safeWidth} ${safeHeight}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`sparkGradient-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colorStart} />
          <stop offset="100%" stopColor={colorEnd} />
        </linearGradient>
        <linearGradient id={`sparkArea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorEnd} stopOpacity="0.25" />
          <stop offset="100%" stopColor={colorEnd} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea && (
        <motion.path
          d={areaPath}
          fill={`url(#sparkArea-${id})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: Math.max(0.2, duration * 0.5), delay: Math.max(0, delay - 0.1), ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <motion.path
        ref={ref}
        d={pathD}
        fill="none"
        stroke={`url(#sparkGradient-${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap={lineCap}
        initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
        animate={{ strokeDasharray: pathLength, strokeDashoffset: 0 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
      />
      {showDot && lastPoint && (
        <motion.circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r={strokeWidth}
          fill={colorEnd}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: Math.min(0.4, duration * 0.25), delay: delay + Math.max(0.2, duration * 0.6), ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </svg>
  );
}
