"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";

export type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  rounded?: boolean;
  ariaLabel?: string;
  responsive?: boolean; // if true, width=100% and viewBox controls sizing
  locale?: string;
  valueFormatter?: (v: number) => string;
};

export default function Sparkline({
  data,
  width = 240,
  height = 56,
  stroke = "currentColor",
  strokeWidth = 2,
  fill,
  rounded = true,
  ariaLabel = "Sparkline chart",
  responsive = false,
  locale = "de-DE",
  valueFormatter,
}: SparklineProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const uid = useMemo(() => `sparkline-${data.length}-${width}-${height}`, [data.length, width, height]);
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const formattedLatest = useMemo(() => {
    if (!data.length) return "";
    const v = data[data.length - 1];
    return valueFormatter ? valueFormatter(v) : new Intl.NumberFormat(locale).format(v);
  }, [data, valueFormatter, locale]);
  const path = useMemo(() => {
    if (!data.length) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const dx = width / (data.length - 1 || 1);
    const norm = (v: number) => (max === min ? 0.5 : (v - min) / (max - min));
    return data
      .map((v, i) => {
        const x = i * dx;
        const y = height - norm(v) * height;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!fill || !data.length) return undefined;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const dx = width / (data.length - 1 || 1);
    const norm = (v: number) => (max === min ? 0.5 : (v - min) / (max - min));
    const lines = data.map((v, i) => {
      const x = i * dx;
      const y = height - norm(v) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    });
    return `${lines.join(" ")} L${width},${height} L0,${height} Z`;
  }, [data, width, height, fill]);

  return (
    <svg
      ref={ref}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      width={responsive ? undefined : width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="text-[--color-accent-3]"
      style={responsive ? { width: "100%", height } : undefined}
    >
      <title id={titleId}>{ariaLabel}</title>
      <desc id={descId}>{`Sparkline with ${data.length} values. Latest: ${formattedLatest}`}</desc>
      {areaPath && (
        reduceMotion ? (
          <path d={areaPath} fill={fill} opacity={0.15} />
        ) : (
          <motion.path
            d={areaPath}
            fill={fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 0.15 : 0 }}
            transition={{ ...defaultTransition, duration: 0.9 }}
          />
        )
      )}
      {reduceMotion ? (
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeLinejoin={rounded ? "round" : "miter"}
        />
      ) : (
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeLinejoin={rounded ? "round" : "miter"}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
          transition={{ ...defaultTransition, duration: 1.4 }}
        />
      )}
    </svg>
  );
}
