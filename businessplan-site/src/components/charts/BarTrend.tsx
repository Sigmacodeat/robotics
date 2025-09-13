"use client";
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";

export type BarDatum = { label: string; value: number };
export type BarTrendProps = {
  data: BarDatum[];
  width?: number;
  height?: number;
  color?: string;
  ariaLabel?: string;
  /**
   * Wenn true, rendert die Grafik responsive (width: 100%).
   * Die Skalierung erfolgt über das viewBox-Attribut.
   */
  responsive?: boolean;
};

export default function BarTrend({
  data,
  width = 320,
  height = 120,
  color = "currentColor",
  ariaLabel = "Bar chart",
  responsive = false,
}: BarTrendProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = width / (data.length || 1);
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const widthAttr: number | string = responsive ? "100%" : width;
  const heightAttr: number | string = responsive ? "100%" : height;
  return (
    <svg
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      width={widthAttr}
      height={heightAttr}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="text-[--color-accent]"
    >
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 16);
        const x = i * barW + 2;
        const y = height - h - 8;
        return reduceMotion ? (
          <rect key={i} x={x} y={y} width={barW - 4} height={h} rx={4} fill={color} opacity={0.9} />
        ) : (
          <motion.rect
            key={i}
            x={x}
            width={barW - 4}
            rx={4}
            fill={color}
            initial={{ height: 0, y: height - 8, opacity: 0 }}
            animate={{ height: inView ? h : 0, y: inView ? y : height - 8, opacity: inView ? 0.9 : 0 }}
            transition={{ ...defaultTransition, duration: 0.8, delay: 0.06 * i }}
          />
        );
      })}
    </svg>
  );
}
