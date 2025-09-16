"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import React from "react";

export type SplitSectionProps = {
  id?: string;
  title?: React.ReactNode;
  reverse?: boolean;
  className?: string;
  left: React.ReactNode;
  right?: React.ReactNode;
};

/**
 * SplitSection
 * Zweispaltiges, edles Layout mit sanfter Animation.
 * Links typischerweise Text/Listen, rechts Grafik/Diagramm.
 */
export default function SplitSection({ id, title, reverse, className, left, right }: SplitSectionProps) {
  return (
    <section id={id} className={clsx("not-prose my-5 md:my-6", className)}>
      {/* Oberer Trenner über dem Kapitel-Titel */}
      {title ? (
        <div className="px-3 md:px-4">
          <span
            aria-hidden
            role="separator"
            className="block h-px w-full mb-2 md:mb-3 bg-gradient-to-r from-transparent via-[--color-border-strong]/40 to-transparent"
          />
          <h3 className="not-prose text-[14px] md:text-[15px] leading-snug md:leading-normal font-semibold tracking-tight mb-1.5 text-[--color-foreground]">
            {title}
          </h3>
        </div>
      ) : null}
      <div
        className={clsx(
          "grid items-stretch gap-3 md:gap-4",
          right ? "md:grid-cols-2" : "md:grid-cols-1",
          reverse && "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl p-3 md:p-4 ring-1 ring-[--color-border-subtle]/50 bg-[--color-surface]/60 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm"
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
          {left}
        </motion.div>
        {right ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl p-3 md:p-4 ring-1 ring-[--color-border-subtle]/50 bg-[--color-surface]/60 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm"
          >
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
            {right}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
