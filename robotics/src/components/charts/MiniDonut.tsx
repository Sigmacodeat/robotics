"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export type MiniDonutProps = {
  value: number; // 0..1
  size?: number; // px
  strokeWidth?: number; // px
  color?: string; // defaults to var(--color-accent) fallback
  bg?: string; // defaults to faint version of color
  delay?: number;
  duration?: number; // total seconds
  className?: string;
  rounded?: boolean; // rounded line caps
  title?: string; // optional <title> for a11y tooltips
  ariaLabel?: string; // aria-label for screen readers
  ariaLabelledBy?: string; // id of external label element
};

export default function MiniDonut({
  value,
  size = 18,
  strokeWidth = 3,
  color = "var(--color-accent-3)",
  bg = "color-mix(in oklab, var(--color-accent-3) 18%, transparent)",
  delay = 0,
  duration = 2.2,
  className,
  rounded = true,
  title,
  ariaLabel,
  ariaLabelledBy,
}: MiniDonutProps) {
  const prefersReduced = useReducedMotion();
  // Guard against invalid inputs
  const safeSize = Number.isFinite(size) && size > 0 ? size : 18;
  const safeStroke = Number.isFinite(strokeWidth) && strokeWidth > 0 ? strokeWidth : 3;
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

  const { radius, circ } = React.useMemo(() => {
    const r = Math.max(0, (safeSize - safeStroke) / 2);
    return { radius: r, circ: 2 * Math.PI * r };
  }, [safeSize, safeStroke]);
  const cap = rounded ? "round" : "butt";
  // Value-adaptive duration: larger values breathe minimal longer
  const animDuration = prefersReduced ? 0 : Math.max(0.25, duration * (0.7 + 0.3 * clamped));
  const animDelay = prefersReduced ? 0 : delay;
  return (
    <svg
      width={safeSize}
      height={safeSize}
      viewBox={`0 0 ${safeSize} ${safeSize}`}
      className={className}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {title ? <title>{title}</title> : null}
      <circle
        cx={safeSize / 2}
        cy={safeSize / 2}
        r={radius}
        stroke={bg}
        strokeWidth={safeStroke}
        fill="none"
      />
      <motion.circle
        cx={safeSize / 2}
        cy={safeSize / 2}
        r={radius}
        stroke={color}
        strokeWidth={safeStroke}
        fill="none"
        strokeLinecap={cap}
        transform={`rotate(-90 ${safeSize / 2} ${safeSize / 2})`}
        style={{ strokeDasharray: circ }}
        initial={prefersReduced ? false : { strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - clamped) }}
        transition={{ duration: animDuration, delay: animDelay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
