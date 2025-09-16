"use client";

import React, { type ElementType } from "react";
import { motion, type Transition, type VariantLabels, type MotionProps } from "framer-motion";

export type IconBadgeProps = {
  icon: ElementType;
  sizePx?: number;              // äußerer Badge-Durchmesser
  iconSizePx?: number;          // Icon-Größe
  rounded?: "full" | "md" | "lg"; // Badge-Form
  className?: string;           // zusätzliche Klassen für den äußeren Container
  ringClassName?: string;       // Ring-Styling des äußeren Containers
  inlayClassName?: string;      // Zusätzliche Klassen für das weiße Inlay
  iconClassName?: string;       // Zusätzliche Klassen für das Icon (Farbe etc.)
  noInlay?: boolean;            // Inlay komplett deaktivieren
  // Eintrittsanimation für den Container
  initial?: MotionProps["initial"];
  whileInView?: MotionProps["whileInView"];
  transition?: Transition;
  viewport?: MotionProps["viewport"];
  // Keyframes/Bewegung für das Icon selbst
  animateKeyframes?: { animate?: VariantLabels | any; transition?: Transition };
};

export default function IconBadge({
  icon: Icon,
  sizePx = 32,
  iconSizePx = 18,
  rounded = "full",
  className = "",
  ringClassName = "ring-1 ring-[--color-border-subtle]",
  inlayClassName = "",
  iconClassName = "text-[--color-accent-2]",
  noInlay = false,
  initial,
  whileInView,
  transition,
  viewport = { once: true, margin: "-30% 0px -55% 0px" },
  animateKeyframes,
}: IconBadgeProps) {
  const radiusClass = rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-lg" : "rounded-md";
  const inlayRadiusClass = rounded === "full" ? "rounded-full" : "rounded-[7px]";

  return (
    (() => {
      const containerProps: any = {
        className: `relative inline-flex items-center justify-center overflow-hidden select-none pointer-events-none isolate flex-shrink-0 ${radiusClass} ${ringClassName} ${className}`,
        style: { width: sizePx, height: sizePx },
        viewport,
      };
      if (initial !== undefined) containerProps.initial = initial;
      if (whileInView !== undefined) containerProps.whileInView = whileInView;
      if (transition !== undefined) containerProps.transition = transition;
      return (
        <motion.span {...containerProps}>
          {/* Inlay optional vollständig deaktivierbar */}
          {noInlay ? null : (
            <span
              aria-hidden
              className={`absolute inset-0 m-[3px] bg-[--color-surface] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-border)_55%,transparent),0_1.5px_3px_color-mix(in_oklab,black_14%,transparent)] ${inlayRadiusClass} ${inlayClassName}`}
            />
          )}
          {/* Bewegungs-Keyframes für das Icon selbst */}
          {(() => {
            const iconProps: any = {
              'aria-hidden': true,
              className: `inline-flex relative z-10 ${iconClassName}`,
              initial: false,
              viewport,
              style: { width: iconSizePx, height: iconSizePx },
            };
            if (animateKeyframes?.animate !== undefined) iconProps.whileInView = animateKeyframes.animate;
            if (animateKeyframes?.transition !== undefined) iconProps.transition = animateKeyframes.transition as Transition;
            return (
              <motion.i {...iconProps}>
                <Icon
                  className="w-full h-full"
                  strokeWidth={2.1}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ shapeRendering: "geometricPrecision" }}
                />
              </motion.i>
            );
          })()}
        </motion.span>
      );
    })()
  );
}
