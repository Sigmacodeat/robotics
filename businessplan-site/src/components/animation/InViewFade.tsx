"use client";

import React from "react";
import { useInView } from "./useInView";

export type InViewFadeProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  /** Delay in seconds (e.g. 0.1) */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Offset translateY in pixels for the slide-up effect */
  offsetY?: number;
  /** Whether to only animate once */
  once?: boolean;
  /** CSS timing function, e.g. 'cubic-bezier(...)' */
  easing?: string;
  /** IntersectionObserver threshold (0..1) */
  threshold?: number;
  /** IntersectionObserver rootMargin, e.g. '-10% 0px' */
  rootMargin?: string;
};

/**
 * Minimalist in-view fade/slide wrapper, respecting prefers-reduced-motion.
 * Adds no layout shift: element takes space from the start.
 */
export default function InViewFade(props: InViewFadeProps) {
  const {
    as,
    // benutzerdefinierte Animations-Props hier explizit destrukturieren,
    // damit sie NICHT an das DOM-Element durchgereicht werden
    delay,
    duration,
    offsetY,
    easing,
    once = true,
    threshold = 0.1,
    rootMargin = "-10% 0px",
    style,
    className,
    children,
    ...rest
  } = props;
  const { ref, inView } = useInView({ once, rootMargin, threshold });
  const Tag: React.ElementType = as ?? "div";

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Make this wrapper a visual no-op: no opacity/transform changes.
  // We still attach the ref so children can rely on layout/observer if needed.
  const initialStyle: React.CSSProperties = {};
  const visibleStyle: React.CSSProperties = {};

  // reference prefersReduced für Vollständigkeit (no-op)
  void prefersReduced;
  // ensure custom props are consumed (no-op), verhindern eslint "unused-vars"
  void delay;
  void duration;
  void offsetY;
  void easing;

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        // no willChange hints, no transitions
        ...initialStyle,
        ...(inView ? visibleStyle : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
