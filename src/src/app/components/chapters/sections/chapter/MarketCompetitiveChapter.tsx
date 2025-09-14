"use client";
import Chapter from "./Chapter";
import Subsection from "./Subsection";
import TableSimple from "@ui/TableSimple";
import SWOTMatrix from "../SWOTMatrix";
import dynamic from "next/dynamic";
import type { ScatterPoint } from "@charts/ScatterPlotAnimated";
import type { RadarSeries } from "@charts/RadarChartAnimated";

const ScatterPlotAnimated = dynamic(() => import("@charts/ScatterPlotAnimated"), { ssr: false });
const RadarChartAnimated = dynamic(() => import("@charts/RadarChartAnimated"), { ssr: false });

export default function MarketCompetitiveChapter({
  id,
  title,
  overview,
  segmentsTitle,
  segments,
  competitionTitle,
  competitors,
  swotTitle,
  swot,
  positioning,
  competitorsHeaders,
  competitionMatrixTitle,
  competitionMatrix,
  radarTitle,
  radarAxes,
  radarSeries,
  competitionXAxisLabel,
  competitionYAxisLabel,
}: {
  id: string;
  title: string;
  overview?: string[];
  segmentsTitle: string;
  segments?: string[];
  competitionTitle: string;
  competitors?: { name: string; focus: string; strength: string; weakness: string }[];
  swotTitle: string;
  swot?: { strengths?: string[]; weaknesses?: string[]; opportunities?: string[]; threats?: string[] };
  positioning?: string;
  competitorsHeaders: (string | number)[];
  competitionMatrixTitle?: string;
  competitionMatrix?: ScatterPoint[];
  radarTitle?: string;
  radarAxes?: string[];
  radarSeries?: RadarSeries[];
  competitionXAxisLabel?: string;
  competitionYAxisLabel?: string;
}) {
  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="slideInLeft" headingVariant="fadeInUp" contentVariant="fadeInUp" staggerChildren={0.06}>
      <Subsection id="marketCompetitive-overview" className="max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1">
        {Array.isArray(overview) && overview.length > 0 ? (
          <ol className="list-decimal pl-5">
            {overview.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
      <Subsection id="marketCompetitive-segments" className="mt-4 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1">
        <h3 className="font-semibold">{segmentsTitle}</h3>
        {Array.isArray(segments) && segments.length > 0 ? (
          <ol className="list-decimal pl-5">
            {segments.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        ) : null}
      </Subsection>
      <Subsection id="marketCompetitive-competition" className="mt-4 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1">
        <h3 className="font-semibold">{competitionTitle}</h3>
        {Array.isArray(competitors) && competitors.length > 0 ? (
          <TableSimple
            caption={competitionTitle}
            headers={competitorsHeaders}
            rows={competitors.map((c) => [c.name, c.focus, c.strength, c.weakness])}
          />
        ) : null}
      </Subsection>
      <Subsection id="marketCompetitive-swot" className="mt-4 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1">
        {swot ? <SWOTMatrix title={swotTitle} data={swot} /> : null}
      </Subsection>
      <Subsection id="marketCompetitive-matrix" className="mt-6 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1">
        {Array.isArray(competitionMatrix) && competitionMatrix.length > 0 ? (
          <>
            <h3 className="font-semibold">{competitionMatrixTitle ?? "Wettbewerbs-Matrix"}</h3>
            <div className="mt-3 overflow-x-auto">
              <ScatterPlotAnimated
                ariaLabel={competitionMatrixTitle ?? "Competition matrix"}
                data={competitionMatrix}
                width={560}
                height={560}
                xLabel={competitionXAxisLabel ?? "Innovation/Technologie"}
                yLabel={competitionYAxisLabel ?? "EU-Fokus/Datenschutz"}
                xDomain={[0, 10]}
                yDomain={[0, 10]}
                responsive
              />
            </div>
          </>
        ) : null}
      </Subsection>
      {Array.isArray(radarAxes) && radarAxes.length > 0 && Array.isArray(radarSeries) && radarSeries.length > 0 && (
        <Subsection id="marketCompetitive-radar" className="mt-6 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1">
          <h3 className="font-semibold">{radarTitle ?? "Capabilities Radar"}</h3>
          <div className="mt-3 overflow-x-auto">
            <RadarChartAnimated axes={radarAxes} series={radarSeries} width={560} height={560} responsive ariaLabel={radarTitle ?? "Capabilities Radar"} />
          </div>
        </Subsection>
      )}
      <Subsection id="marketCompetitive-positioning" className="mt-4 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1">
        {positioning ? <p className="text-sm text-[--color-foreground-muted]">{positioning}</p> : null}
      </Subsection>
    </Chapter>
  );
}
