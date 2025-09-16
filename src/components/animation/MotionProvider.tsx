"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

/**
 * MotionProvider
 * Globaler Wrapper für framer-motion, respektiert automatisch die System-Einstellung
 * "Bewegung reduzieren" (prefers-reduced-motion). Nutzt ansonsten unsere zentralen
 * Transition-Defaults pro Komponente.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}

export default MotionProvider;
