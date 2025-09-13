"use client";

import { useEffect, useRef, useState } from "react";

export type UseInViewOptions = {
  /** Trigger only once when the element enters the viewport */
  once?: boolean;
  /** IntersectionObserver root margin, e.g. "-10% 0px" */
  rootMargin?: string;
  /** Intersection thresholds */
  threshold?: number | number[];
};

export function useInView<T extends HTMLElement = HTMLElement>(options: UseInViewOptions = {}) {
  const { once = true, rootMargin = "-10% 0px", threshold = 0.1 } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If user prefers reduced motion, consider element immediately "in view" to avoid attention-grabbing motion
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { root: null, rootMargin, threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView } as const;
}
