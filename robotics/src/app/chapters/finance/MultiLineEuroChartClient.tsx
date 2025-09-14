"use client";
import React, { useMemo } from "react";
import MultiLineChartAnimated, { type Series } from "@/components/charts/MultiLineChartAnimated";

export type MultiLineEuroChartClientProps = {
  series: Series[];
  ariaLabel?: string;
  locale?: string;
  height?: number;
  responsive?: boolean;
  showArea?: boolean;
  yTicksCount?: number;
  className?: string;
};

export default function MultiLineEuroChartClient({
  series,
  ariaLabel,
  locale = "de-DE",
  height = 260,
  responsive = true,
  showArea = false,
  yTicksCount,
  className,
}: MultiLineEuroChartClientProps) {
  const nfEuro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    notation: "compact",
  });
  const fmtEuro = (v: number) => nfEuro.format(v);
  const tooltip = (label: string | number, name: string, value: number) => `${name} • ${String(label)}: ${fmtEuro(value)}`;

  const aria = ariaLabel ?? (locale?.startsWith("de") ? "Mehrlinien-Diagramm" : "Multi line chart");

  // Auto yTicks based on data range when not provided
  const autoTicks = useMemo(() => {
    try {
      const values: number[] = [];
      series.forEach((s) => s.points.forEach((p) => values.push(Number(p.value) || 0)));
      if (!values.length) return 4;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = Math.abs(max - min) || Math.abs(max) || 1;
      if (range >= 50_000_000) return 6;
      if (range >= 5_000_000) return 5;
      if (range >= 500_000) return 5;
      if (range >= 50_000) return 4;
      return 3;
    } catch { return 4; }
  }, [series]);

  return (
    <MultiLineChartAnimated
      series={series}
      ariaLabel={aria}
      responsive={responsive}
      height={height}
      locale={locale}
      {...(className ? { className } as const : {})}
      showArea={showArea}
      valueFormatter={fmtEuro}
      tooltipFormatter={tooltip}
      yTicksCount={yTicksCount ?? autoTicks}
    />
  );
}
