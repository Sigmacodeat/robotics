"use client";
import React, { useEffect, useMemo, useState } from "react";

// A4: 297mm height, margins set in globals.css to 18mm top/bottom
// px per mm (CSS): 96px / 25.4mm ≈ 3.779527559
const PX_PER_MM = 96 / 25.4;
const PAGE_HEIGHT_MM = 297 - 18 - 18; // printable height per @page margin
const PAGE_HEIGHT_PX = PAGE_HEIGHT_MM * PX_PER_MM; // ≈ 985px

export type PageCounterProps = {
  // CSS selector to measure content height (defaults to main#content)
  targetSelector?: string;
  // Optional custom render of label, receives rounded page count
  renderLabel?: (pages: number) => React.ReactNode;
  // Optional className override
  className?: string;
};

export default function PageCounter({
  targetSelector = "main#content",
  renderLabel,
  className,
}: PageCounterProps) {
  const [pages, setPages] = useState<number>(0);

  const compute = useMemo(() => {
    return () => {
      const el = document.querySelector(targetSelector) as HTMLElement | null;
      if (!el) {
        setPages(0);
        return;
      }
      // Measure full scroll height of the printable container
      const totalHeight = el.scrollHeight; // includes overflowing content
      const pageCount = Math.max(1, Math.ceil(totalHeight / PAGE_HEIGHT_PX));
      setPages(pageCount);
    };
  }, [targetSelector]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial compute after paint
    const id = window.requestAnimationFrame(compute);

    // Recompute on resize
    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    // Observe DOM mutations inside the target to update count when content changes
    const target = document.querySelector(targetSelector) as HTMLElement | null;
    const observer = target
      ? new MutationObserver(() => {
          // throttle a bit via rAF to batch mutations
          window.requestAnimationFrame(compute);
        })
      : null;
    if (observer && target) observer.observe(target, { subtree: true, childList: true, characterData: true, attributes: true });

    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [compute, targetSelector]);

  const label = renderLabel
    ? renderLabel(pages)
    : (
        <span>
          ≈ {pages} A4-Seiten
        </span>
      );

  return (
    <div
      aria-live="polite"
      aria-label={`estimated A4 pages: ${pages}`}
      className={
        className ??
        "fixed right-4 top-20 z-40 select-none rounded-full bg-[--color-surface] supports-[backdrop-filter]:backdrop-blur px-3 py-1.5 text-sm text-[--color-foreground] shadow-sm ring-1 ring-black/5 print:hidden"
      }
      title="Estimated number of A4 pages based on current content and print margins"
    >
      {label}
    </div>
  );
}
