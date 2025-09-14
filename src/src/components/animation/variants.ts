"use client";
import { Variants } from "framer-motion";

export type VariantName =
  | "fadeInUp"
  | "fadeIn"
  | "slideInLeft"
  | "slideInRight"
  | "scaleIn"
  | "none";

export const variantsMap: Record<VariantName, Variants> = {
  none: {},
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
};

// Einheitliches, sanftes Easing für Business-UI Interaktionen (Apple/Notion-like)
export const defaultEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Globaler Transition-Standard: leicht kürzer für snappier Feel, aber nicht hektisch
export const defaultTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
} as const;

// Einheitlicher Viewport-Trigger für on-scroll-Reveals
export const defaultViewport = { once: true, margin: "-12% 0px -8% 0px" } as const;
