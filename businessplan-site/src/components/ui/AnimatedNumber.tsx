"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type AnimatedNumberProps = {
  value: number;
  duration?: number; // in seconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  className?: string;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedNumber({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale,
  className,
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const startTs = useRef<number | null>(null);
  const isServer = typeof window === 'undefined';
  // Auf dem Server direkt den Zielwert rendern, damit SSR/CSR identisch sind.
  const [display, setDisplay] = useState<number>(reduce || isServer ? value : 0);
  const frame = useRef<number | null>(null);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale ?? undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [locale, decimals]);

  useEffect(() => {
    if (reduce) { setDisplay(value); return; }
    if (duration <= 0) { setDisplay(value); return; }

    startTs.current = null;
    if (frame.current) cancelAnimationFrame(frame.current);

    const animate = (ts: number) => {
      if (!startTs.current) startTs.current = ts;
      const elapsed = (ts - startTs.current) / 1000; // seconds
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      setDisplay(0 + (value - 0) * eased);
      if (t < 1) {
        frame.current = requestAnimationFrame(animate);
      }
    };

    frame.current = requestAnimationFrame(animate);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [value, duration, reduce]);

  return (
    <span className={className}>
      {prefix}
      {formatter.format(display)}
      {suffix}
    </span>
  );
}
