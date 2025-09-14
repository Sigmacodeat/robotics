"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface ScrollFigureProps {
  src: string; // e.g. "/market-volume.png"
  alt: string;
  caption?: string;
  className?: string;
}

/**
 * Sticky Figure with subtle parallax/opacity tied to scroll.
 * Place it inside a grid next to textual content.
 */
export default function ScrollFigure({ src, alt, caption, className }: ScrollFigureProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={`md:sticky md:top-24 ${className ?? ""}`}>
      <motion.figure style={{ y, scale, opacity }} className="rounded-xl border border-[--color-border] bg-[--color-card] p-3 shadow-sm">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
          <Image src={src} alt={alt} fill priority sizes="(min-width: 768px) 520px, 100vw" className="object-contain" />
        </div>
        {caption && <figcaption className="mt-2 text-sm text-[--color-foreground-muted]">{caption}</figcaption>}
      </motion.figure>
    </div>
  );
}
