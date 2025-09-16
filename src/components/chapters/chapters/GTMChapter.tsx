"use client";
import Chapter from "./Chapter";
import FunnelChartAnimated, { type FunnelStage } from "@charts/FunnelChartAnimated";
import StackedAreaAnimated, { type AreaSeries } from "@charts/StackedAreaAnimated";
import ChapterGrid from "../shared/ChapterGrid";
import ChapterCard from "../shared/ChapterCard";

export default function GTMChapter({
  id,
  title,
  phasesTitle,
  phases,
  tacticsTitle,
  tactics,
  kpisTitle,
  kpis,
  funnelTitle,
  funnelStages,
  channelMixTitle,
  channelMix,
  funnelValueFormatter,
}: {
  id: string;
  title: string;
  phasesTitle: string;
  phases: { name: string; items?: string[] }[];
  tacticsTitle: string;
  tactics: string[];
  kpisTitle: string;
  kpis: string[];
  funnelTitle?: string;
  funnelStages?: FunnelStage[];
  channelMixTitle?: string;
  channelMix?: { labels: Array<string | number>; series: AreaSeries[] } | undefined;
  funnelValueFormatter?: (n: number) => string;
}) {
  if (!Array.isArray(phases) && !Array.isArray(tactics) && !Array.isArray(kpis)) return null;
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="slideInLeft" headingVariant="fadeInUp" contentVariant="fadeInUp" staggerChildren={0.08}>
      {Array.isArray(phases) && phases.length > 0 && (
        <section id="gtm-phases" aria-labelledby="gtm-phases-title">
          <h3 id="gtm-phases-title" className="font-semibold">{phasesTitle}</h3>
          <ChapterGrid className="mt-2">
            {phases.map((p, i) => (
              <ChapterCard key={i}>
                <div className="text-center font-medium">{p.name}</div>
                {Array.isArray(p.items) && p.items.length > 0 && (
                  <ul className="mt-2 list-none pl-0 text-sm text-left">
                    {p.items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                )}
              </ChapterCard>
            ))}
          </ChapterGrid>
        </section>
      )}
      {Array.isArray(tactics) && tactics.length > 0 && (
        <section id="gtm-tactics" aria-labelledby="gtm-tactics-title" className="mt-6">
          <h3 id="gtm-tactics-title" className="font-semibold">{tacticsTitle}</h3>
          <ChapterGrid className="mt-2">
            {tactics.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </section>
      )}
      {Array.isArray(kpis) && kpis.length > 0 && (
        <section id="gtm-kpis" aria-labelledby="gtm-kpis-title" className="mt-6">
          <h3 id="gtm-kpis-title" className="font-semibold">{kpisTitle}</h3>
          <ChapterGrid className="mt-2">
            {kpis.map((s, i) => (
              <ChapterCard key={i}>
                <p className="text-center">{s}</p>
              </ChapterCard>
            ))}
          </ChapterGrid>
        </section>
      )}

      {/* Funnel */}
      {Array.isArray(funnelStages) && funnelStages.length > 0 && (
        <div className="mt-6 avoid-break-inside">
          <h3 className="font-semibold">{funnelTitle ?? "Funnel"}</h3>
          <div className="mt-3 overflow-x-auto rounded-xl bg-[--color-surface] p-3 shadow-sm ring-1 ring-black/5">
            <FunnelChartAnimated
              stages={funnelStages}
              width={560}
              height={260}
              responsive
              ariaLabel={funnelTitle ?? "Funnel"}
              {...(funnelValueFormatter ? { valueFormatter: funnelValueFormatter } : {})}
            />
          </div>
        </div>
      )}

      {/* Channel Mix */}
      {channelMix && channelMix.labels?.length > 0 && channelMix.series?.length > 0 && (
        <section id="gtm-channelMix" aria-labelledby="gtm-channelMix-title" className="mt-6 avoid-break-inside">
          <h3 id="gtm-channelMix-title" className="font-semibold">{channelMixTitle ?? "Channel Mix"}</h3>
          <div className="mt-3 overflow-x-auto rounded-xl bg-[--color-surface] p-3 shadow-sm ring-1 ring-black/5">
            <StackedAreaAnimated labels={channelMix.labels} series={channelMix.series} width={560} height={260} responsive ariaLabel={channelMixTitle ?? "Channel Mix"} />
          </div>
        </section>
      )}
    </Chapter>
  );
}
