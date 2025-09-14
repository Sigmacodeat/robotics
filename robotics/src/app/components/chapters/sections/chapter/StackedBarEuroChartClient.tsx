"use client";
import React from "react";
import StackedBarAnimated, { type StackedSeries } from "@/components/charts/StackedBarAnimated";

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
  const nf = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0, notation: "compact" });
  const fmtEuro = (v: number) => nf.format(v);
  const tooltip = (label: string | number, name: string, value: number) => `${String(label)} • ${name}: ${fmtEuro(value)}`;
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
