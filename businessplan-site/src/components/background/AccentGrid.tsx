"use client";

import { motion, useReducedMotion, type MotionStyle } from "framer-motion";

/**
 * AccentGrid – dezente, sporadische Akzent-Flecken im Hintergrund.
 * - Sehr niedrige Opazität
 * - Respektiert prefers-reduced-motion
 * - Keine Interaktion (pointer-events-none)
 */
export default function AccentGrid() {
  const reduce = useReducedMotion();

  // Positionen in Prozent (viewport relativ); wenige, weit auseinander
  const palette = [
    { rgba: "rgba(16,185,129,ALPHA)" },   // emerald-500
    { rgba: "rgba(6,182,212,ALPHA)" },   // cyan-500
    { rgba: "rgba(14,165,233,ALPHA)" },  // sky-500
  ];

  const spots = [
    { top: "10%", left: "14%", size: 340, primary: 0, secondary: 1 },
    { top: "26%", left: "78%", size: 380, primary: 2, secondary: 0 },
    { top: "66%", left: "20%", size: 400, primary: 1, secondary: 2 },
    { top: "84%", left: "74%", size: 360, primary: 0, secondary: 2 },
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {spots.map((s, i) => {
        const primaryColor = palette[s.primary].rgba.replace("ALPHA", reduce ? "0.10" : "0.0");
        const secondaryColor = palette[s.secondary].rgba.replace("ALPHA", reduce ? "0.08" : "0.0");

        const base: MotionStyle = {
          position: "absolute",
          top: s.top,
          left: s.left,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "9999px",
          filter: "blur(10px)",
        };

        // Primary Layer (größer)
        const stylePrimary: MotionStyle = {
          ...base,
          width: s.size,
          height: s.size,
          background: `radial-gradient(circle, ${primaryColor} 0%, rgba(0,0,0,0) 72%)`,
          opacity: reduce ? 0.09 : 0,
        };
        // Secondary Layer (leicht kleiner/versetzt)
        const styleSecondary: MotionStyle = {
          ...base,
          width: s.size * 0.8,
          height: s.size * 0.8,
          background: `radial-gradient(circle, ${secondaryColor} 0%, rgba(0,0,0,0) 70%)`,
          opacity: reduce ? 0.07 : 0,
        };

        if (reduce) {
          return (
            <span key={i}>
              <span style={stylePrimary as unknown as React.CSSProperties} />
              <span style={styleSecondary as unknown as React.CSSProperties} />
            </span>
          );
        }

        const delay = 0.6 + i * 0.9;
        const duration = 9 + i * 1.2;

        return (
          <span key={i}>
            <motion.span
              style={stylePrimary}
              initial={{ opacity: 0.0 }}
              animate={{ opacity: [0.0, 0.14, 0.05, 0.12, 0.0] }}
              transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              style={styleSecondary}
              initial={{ opacity: 0.0 }}
              animate={{ opacity: [0.0, 0.12, 0.04, 0.10, 0.0] }}
              transition={{ duration: duration * 0.9, delay: delay + 0.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        );
      })}
    </div>
  );
}
