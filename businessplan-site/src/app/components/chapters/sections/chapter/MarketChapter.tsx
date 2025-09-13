"use client";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import BarEuroChartClient from "./BarEuroChartClient";
import Chapter from "./Chapter";
import { useTranslations } from "next-intl";

const MarketVolumeChart = dynamic(() => import("@charts/MarketVolumeChart"), { ssr: false });

export type ChartPoint = { label: string | number; value: number };

export default function MarketChapter({
  id,
  title,
  children,
  lineChart,
  barChart,
  ariaLine,
  ariaBars,
  captionLine,
  captionBars,
  width = 520,
  heightLine = 280,
  heightBars = 240,
  locale,
}: {
  id: string;
  title: string;
  children: ReactNode;
  lineChart: ChartPoint[];
  barChart: ChartPoint[];
  ariaLine: string;
  ariaBars: string;
  captionLine?: string;
  captionBars?: string;
  width?: number;
  heightLine?: number;
  heightBars?: number;
  locale: string;
}) {
  const t = useTranslations();
  return (
    <Chapter
      id={id}
      title={title}
      subtitle={t('chapters.market.subtitle', { defaultMessage: 'Market & Competition' })}
      headingAlign="center"
      pageBreakBefore
      avoidBreakInside
      variant="scaleIn"
      headingVariant="fadeInUp"
      contentVariant="fadeInUp"
      sidebar={
        <div>
          <MarketVolumeChart
            data={lineChart}
            width={width}
            height={heightLine}
            className="rounded-xl bg-[--color-surface] p-3 shadow-sm ring-1 ring-black/5"
            ariaLabel={ariaLine}
            {...(captionLine ? { caption: captionLine } : {})}
            locale={locale}
            cagrPercent={20}
            responsive
          />
          <div className="mt-6">
            <BarEuroChartClient
              data={barChart as any}
              width={width}
              height={heightBars}
              className="rounded-xl bg-[--color-surface] p-3 shadow-sm ring-1 ring-black/5"
              ariaLabel={ariaBars}
              locale={locale}
              responsive
            />
            {captionBars && (
              <div className="mt-2 text-sm text-[--color-foreground-muted]">{captionBars}</div>
            )}
          </div>
        </div>
      }
    >
      {children}
    </Chapter>
  );
}
