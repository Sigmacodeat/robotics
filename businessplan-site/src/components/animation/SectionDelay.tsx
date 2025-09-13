"use client";

import React from "react";
import { useInView } from "./useInView";

export type SectionDelayProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Start children only after this delay (ms) once in view */
  delayMs?: number;
  /** IntersectionObserver threshold (0..1) */
  threshold?: number;
  /** IntersectionObserver rootMargin, e.g. '-10% 0px' */
  rootMargin?: string;
  /** Only trigger once */
  once?: boolean;
};

/**
 * SectionDelay: rendert Children erst nach In-View + Delay.
 * Keine Opacity/Transform-Effekte, nur zeitversetztes Mounten.
 */
export default function SectionDelay({
  delayMs = 300,
  threshold = 0.1,
  rootMargin = "-10% 0px",
  once = true,
  style,
  className,
  children,
  ...rest
}: SectionDelayProps) {
  const isTestOrSSR =
    typeof window === 'undefined' ||
    typeof (globalThis as any).IntersectionObserver === 'undefined' ||
    process.env.NODE_ENV === 'test';

  const { ref, inView } = useInView({ once, rootMargin, threshold });
  const [ready, setReady] = React.useState<boolean>(isTestOrSSR);

  // Filtere potenzielle Animations-Props, die versehentlich übergeben werden könnten
  // (z. B. aus Copy/Paste von InViewFade), damit sie nicht ans DOM gelangen
  const {
    offsetY: _offsetY,
    delay: _delay,
    duration: _duration,
    easing: _easing,
    ...safeRest
  } = (rest as any) || {};
  void _offsetY; void _delay; void _duration; void _easing;

  React.useEffect(() => {
    if (isTestOrSSR) return; // sofort gerendert
    if (!inView || ready) return;
    let t: number | undefined;
    if (delayMs > 0) {
      t = window.setTimeout(() => setReady(true), delayMs);
    } else {
      setReady(true);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [inView, delayMs, ready, isTestOrSSR]);

  return (
    <div ref={ref as any} className={className} style={style} {...safeRest}>
      {ready ? children : null}
    </div>
  );
}
