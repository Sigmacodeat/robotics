"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";
import LineChartAnimated from "./LineChartAnimated";

export type ChartPoint = { label: string | number; value: number };

export type MarketVolumeChartProps = {
  data: ChartPoint[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel: string;
  caption?: string;
  locale: string;
  /** Optional CAGR display (e.g., 20 means 20%) */
  cagrPercent?: number;
  responsive?: boolean;
};

/**
 * MarketVolumeChart
 * Thin wrapper around LineChartAnimated with a subtle CAGR badge and caption for market volume visualization.
 * Accessible (role="img") through underlying LineChartAnimated. Adds animated CAGR chip in the corner.
 */
function MarketVolumeChartComponent({
  data,
  width = 520,
  height = 280,
  className,
  ariaLabel,
  caption,
  locale,
  cagrPercent,
  responsive = false,
}: MarketVolumeChartProps) {
  return (
    <figure className={className} aria-label={ariaLabel}>
      <div className="relative">
        <LineChartAnimated
          data={data}
          width={width}
          height={height}
          className="rounded-xl bg-[--color-surface] p-3 shadow-sm ring-1 ring-black/5"
          ariaLabel={ariaLabel}
          locale={locale}
          responsive={responsive}
        />
        {typeof cagrPercent === "number" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ ...defaultTransition, duration: 0.5 }}
            className="pointer-events-none absolute right-3 top-3 select-none rounded-md bg-[--color-muted]/60 px-2 py-1 text-xs text-[--color-foreground-muted] ring-1 ring-black/5 backdrop-blur-sm"
            aria-hidden
          >
            CAGR ~{cagrPercent}%
          </motion.div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-[--color-foreground-muted]">{caption}</figcaption>
      )}
    </figure>
  );
}

const MarketVolumeChart = memo(MarketVolumeChartComponent);
export default MarketVolumeChart;
