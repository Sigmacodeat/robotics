"use client";
import React from "react";
import StackedBarAnimated, { type StackedSeries } from "@/components/charts/StackedBarAnimated";
import { formatEuroCompact } from "@/i18n/numbers";

export type StackedBarEuroChartClientProps = {
  labels: Array<string | number>;
  series: StackedSeries[];
  ariaLabel?: string;
  locale?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  yTicksCount?: number;
  className?: string;
};

export default function StackedBarEuroChartClient({
  labels,
  series,
  ariaLabel,
  locale = "de-DE",
  width = 560,
  height = 260,
  responsive = true,
  yTicksCount = 5,
  className,
}: StackedBarEuroChartClientProps) {
  const fmtEuro = (v: number) => formatEuroCompact(v, locale);
  const tooltip = (label: string | number, name: string, value: number, total?: number) => {
    const base = `${String(label)} • ${name}: ${fmtEuro(value)}`;
    if (typeof total === 'number' && total > 0) {
      const pct = Math.round((value / total) * 100);
      return `${base} • ${pct}%`;
    }
    return base;
  };
  const aria = ariaLabel ?? (locale?.startsWith("de") ? "Gestapeltes Balkendiagramm" : "Stacked bar chart");

  return (
    <StackedBarAnimated
      labels={labels}
      series={series}
      ariaLabel={aria}
      width={width}
      height={height}
      locale={locale}
      {...(className ? { className } as const : {})}
      valueFormatter={fmtEuro}
      tooltipFormatter={tooltip}
      responsive={responsive}
      yTicksCount={yTicksCount}
    />
  );
}
