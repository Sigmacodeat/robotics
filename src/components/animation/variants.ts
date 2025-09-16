import type { Variants, Transition } from "framer-motion";

export type VariantName = keyof typeof variantsMap;

export const defaultTransition: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const defaultViewport = {
  once: true,
  amount: 0.05,
  margin: "-5% 0% -5% 0%",
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

export const variantsMap = {
  fadeInUp,
  fadeIn,
  fadeInDown,
  scaleIn,
  slideInLeft,
  slideInRight,
};
