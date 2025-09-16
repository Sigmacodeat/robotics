"use client";
import React from "react";
import LineChartAnimated, { type LinePoint } from "@/components/charts/LineChartAnimated";
import { formatEuroCompact } from "@/i18n/numbers";

export type LineEuroChartClientProps = {
  data: LinePoint[];
  ariaLabel?: string;
  locale?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  showArea?: boolean;
  className?: string;
};

export default function LineEuroChartClient({
  data,
  ariaLabel,
  locale = "de-DE",
  width = 560,
  height = 220,
  responsive = true,
  showArea = false,
  className,
}: LineEuroChartClientProps) {
  const fmtEuro = (v: number) => formatEuroCompact(v, locale);
  const aria = ariaLabel ?? (locale?.startsWith("de") ? "Liniendiagramm" : "Line chart");

  return (
    <LineChartAnimated
      data={data}
      ariaLabel={aria}
      width={width}
      height={height}
      locale={locale}
      {...(className ? { className } as const : {})}
      showArea={showArea}
      valueFormatter={fmtEuro}
      responsive={responsive}
    />
  );
}
