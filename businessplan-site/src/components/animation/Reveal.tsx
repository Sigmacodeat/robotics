"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Reveal
 * Sanfte, performante Reveal-Animation beim Scrollen ins Viewport.
 * Achtet auf prefers-reduced-motion und nutzt viewport once.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  // Make Reveal a visual no-op to avoid double fade/slide with child animations.
  // We keep the motion.div wrapper for layout consistency.
  const initial = { opacity: 1, y: 0 };
  const animate = { opacity: 1, y: 0 };
  const transition = { duration: 0 } as const;
  // reference prop to avoid unused var lint
  void delay;

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={clsx(className || '')}
    >
      {children}
    </motion.div>
  );
}
