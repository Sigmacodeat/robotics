"use client";

import { motion } from "framer-motion";
import React from "react";
import clsx from "clsx";

export type AnimatedBulletListProps = {
  items: Array<React.ReactNode>;
  className?: string;
  variant?: "badge" | "list";
  dense?: boolean;
};

/**
 * AnimatedBulletList
 * Sanft einblendende Bullet-Liste mit Stagger-Animation.
 */
export default function AnimatedBulletList({ items, className, variant = "list", dense }: AnimatedBulletListProps) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
      }}
      className={clsx(
        variant === "list" ? "list-none pl-0" : "flex flex-wrap gap-2",
        dense ? "space-y-1" : "space-y-1.5",
        "text-[13px] md:text-[14px] leading-relaxed text-[--color-foreground]",
        className
      )}
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          className={clsx(
            variant === "badge" &&
              "badge"
          )}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
