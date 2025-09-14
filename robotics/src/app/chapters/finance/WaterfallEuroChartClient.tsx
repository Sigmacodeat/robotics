"use client";
import React, { useMemo } from "react";
import WaterfallChartAnimated, { type WaterfallStep } from "@/components/charts/WaterfallChartAnimated";

export type WaterfallEuroChartClientProps = {
  steps: WaterfallStep[];
  ariaLabel?: string;
  locale?: string;
  height?: number;
  responsive?: boolean;
  yTicksCount?: number;
  className?: string;
};

export default function WaterfallEuroChartClient({
  steps,
  ariaLabel,
  locale = "de-DE",
  height = 280,
  responsive = true,
  yTicksCount,
  className,
}: WaterfallEuroChartClientProps) {
  const nfEuro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    notation: "compact",
  });
  const fmtEuro = (v: number) => nfEuro.format(v);

  const aria = ariaLabel ?? (locale?.startsWith("de") ? "Wasserfall-Diagramm" : "Waterfall chart");

  // Auto yTicks based on cumulative range when not provided
  const autoTicks = useMemo(() => {
    try {
      let running = 0;
      let minY = 0;
      let maxY = 0;
      for (const s of steps) {
        const type = (s as any)?.type as string | undefined;
        if (type === "decrease") running -= (s.value ?? 0);
        else if (type === "subtotal" || type === "total") running = (s.value ?? running);
        else running += (s.value ?? 0); // default increase
        minY = Math.min(minY, running);
        maxY = Math.max(maxY, running);
      }
      const range = Math.abs(maxY - minY) || Math.abs(maxY) || 1;
      if (range >= 50_000_000) return 6;
      if (range >= 5_000_000) return 5;
      if (range >= 500_000) return 5;
      if (range >= 50_000) return 4;
      return 3;
    } catch { return 4; }
  }, [steps]);

  return (
    <WaterfallChartAnimated
      steps={steps}
      ariaLabel={aria}
      responsive={responsive}
      height={height}
      locale={locale}
      {...(className ? { className } as const : {})}
      valueFormatter={fmtEuro}
      yTicksCount={yTicksCount ?? autoTicks}
    />
  );
}
