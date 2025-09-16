"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export interface CountUpProps {
  from?: number;
  to: number;
  durationMs?: number;
  // optional delay before starting animation (in ms) after element is in view
  delayMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  locale?: string; // explicit locale for deterministic SSR/CSR
  useGrouping?: boolean; // control thousands separators; default true
}

export default function CountUp({ from = 0, to, durationMs = 1600, delayMs = 0, decimals = 0, prefix = "", suffix = "", className, locale = "de-DE", useGrouping = true }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const [val, setVal] = useState(from);

  // Schrittberechnung entfernt, da nicht verwendet
  useEffect(() => {
    if (!inView) return;
    let current = from;
    let raf = 0;
    let timeoutId: number | undefined;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPrint = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('print').matches;

    // If user prefers reduced motion or printing, jump to final value
    if (prefersReduced || isPrint) {
      setVal(to);
      return;
    }
    const startAnim = () => {
      const start = performance.now();
      const tick = (t: number) => {
        const elapsed = t - start;
        const progress = Math.min(1, elapsed / durationMs);
        // ease-out cubic for smoother finish
        const eased = 1 - Math.pow(1 - progress, 3);
        current = from + (to - from) * eased;
        setVal(current);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (delayMs && delayMs > 0) {
      timeoutId = window.setTimeout(startAnim, delayMs);
    } else {
      startAnim();
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [inView, from, to, durationMs, delayMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping }).format(val)}
      {suffix}
    </span>
  );
}
