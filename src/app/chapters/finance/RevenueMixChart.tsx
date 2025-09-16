"use client";

import React, { useMemo } from "react";
import { type StackedSeries } from "@charts/StackedBarAnimated";
import { StackedBarEuroChartClient, LineEuroChartClient } from "@components/chapters";
import { defaultPalette as themePalette } from "@/components/charts/theme";

export default function RevenueMixChart({
  labels,
  series,
  total,
  titleBar,
  titleLine,
  locale,
  palette,
}: {
  labels: Array<string | number>;
  series: StackedSeries[];
  total: number[];
  titleBar?: string;
  titleLine?: string;
  locale?: string;
  palette?: string[];
}) {
  const coloredSeries = useMemo(() => (
    (series ?? []).map((s, i) => ({ ...s, color: s.color ?? (palette?.[i % (palette?.length ?? 1)] ?? themePalette[i % themePalette.length]) }))
  ), [series, palette]);
  const ariaBar = titleBar ?? (locale?.startsWith("de") ? "Umsatz nach Stream" : "Revenue by Stream");
  const ariaLine = titleLine ?? (locale?.startsWith("de") ? "Gesamtumsatz" : "Total Revenue");
  return (
    <div className="space-y-4">
      <div className="mt-3 overflow-x-auto">
        <StackedBarEuroChartClient
          labels={labels}
          series={coloredSeries}
          width={560}
          height={240}
          locale={locale ?? "de-DE"}
          yTicksCount={5}
          responsive
          ariaLabel={ariaBar}
        />
      </div>
      <div className="mt-3 overflow-x-auto">
        <LineEuroChartClient
          ariaLabel={ariaLine}
          data={labels.map((label, idx) => ({ label: String(label), value: Number(total[idx] ?? 0) }))}
          width={560}
          height={220}
          showArea
          locale={locale ?? "de-DE"}
          responsive
        />
      </div>
    </div>
  );
}
