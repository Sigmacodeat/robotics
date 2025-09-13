"use client";
import React, { useMemo } from "react";
import BarChartAnimated, { type BarPoint } from "@/components/charts/BarChartAnimated";

export type BarEuroChartClientProps = {
  data: BarPoint[];
  ariaLabel?: string;
  locale?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  className?: string;
  yTicksCount?: number;
};

export default function BarEuroChartClient({
  data,
  ariaLabel,
  locale = "de-DE",
  width = 560,
  height = 240,
  responsive = true,
  className,
  yTicksCount,
}: BarEuroChartClientProps) {
  const nfEuro = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, notation: 'compact' });
  const fmtEuro = (v: number) => nfEuro.format(v);
  const tooltip = (label: string | number, value: number) => `${String(label)} • ${fmtEuro(value)}`;
  const aria = ariaLabel ?? (locale?.startsWith("de") ? "Balkendiagramm" : "Bar chart");

  // Auto yTicks based on data max when not provided
  const autoTicks = useMemo(() => {
    try {
      const values = (data ?? []).map((d) => Number(d.value) || 0);
      if (!values.length) return 4;
      const max = Math.max(...values);
      if (max >= 50_000_000) return 6;
      if (max >= 5_000_000) return 5;
      if (max >= 500_000) return 5;
      if (max >= 50_000) return 4;
      return 3;
    } catch { return 4; }
  }, [data]);

  return (
    <BarChartAnimated
      data={data}
      ariaLabel={aria}
      width={width}
      height={height}
      locale={locale}
      {...(className ? { className } as const : {})}
      valueFormatter={fmtEuro}
      tooltipFormatter={tooltip}
      yTicksCount={typeof yTicksCount === 'number' ? yTicksCount : autoTicks}
      responsive={responsive}
    />
  );
}
