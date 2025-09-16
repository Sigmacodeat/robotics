"use client";
import Chapter from "./Chapter";
import Subsection from "./Subsection";
import { NumberedList, NumberedItem } from "@components/chapters/NumberedList";
import CountUp from "@charts/CountUp";
import Sparkline from "@charts/Sparkline";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import ErrorMessage from "@/components/ui/error-message";

interface KPIItem {
  label: string;
  value: number;
  unit?: string; // e.g. %, €, mo
  delta?: number; // change vs. previous period
}

export default function TractionKPIsChapter({
  id,
  title,
  kpis,
  trends,
  trendsSeries,
  highlights,
  kpisExplain,
  methodology,
  evidence,
  deliverables,
  benchmarks,
  captions,
}: {
  id: string;
  title: string;
  kpis: KPIItem[];
  trends?: number[];
  trendsSeries?: { name: string; data: number[]; color?: string }[];
  highlights?: string[];
  kpisExplain?: string[];
  methodology?: string[];
  evidence?: string[];
  deliverables?: string[];
  benchmarks?: { title?: string; headers?: string[]; rows: (string | number)[][] };
  captions?: {
    kpis?: string;
    trends?: string;
  };
}) {
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  // Heuristik: Wähle ein Icon pro KPI (kann später über Props überschrieben werden)
  const iconFor = (label: string) => {
    const l = String(label).toLowerCase();
    if (/(growth|wachstum|roi|arpu|ltv|conversion|profit|gewinn|umsatz|revenue)/.test(l)) return TrendingUp;
    if (/(churn|verlust|decline|rückgang)/.test(l)) return TrendingDown;
    return BarChart3;
  };
  // Abschnitts-Präfix aus dem Titel extrahieren, z. B. "9.1" aus "9.1 – Traction & KPIs"
  const sectionPrefix = (() => {
    const m = /^\s*(\d+\.\d+)/.exec(String(title));
    return m ? m[1] : "";
  })();
  // Nummerierung pro Unterabschnitt stets ab 1
  const numFor = (i: number) => (sectionPrefix ? `${sectionPrefix}.${i + 1}` : `${i + 1}.`);
  return (
    <Chapter id={id} title={title} avoidBreakInside variant="fadeInUp" headingVariant="fadeInUp" contentVariant="fadeIn" dense>
      {/* Highlights */}
      {Array.isArray(highlights) && highlights.length > 0 ? (
        <Subsection id="traction-kpis-highlights" compact className="mb-2">
          <h3 className="not-prose text-[13px] md:text-[13.5px] font-medium mb-1 text-[--color-foreground]">{locale.startsWith('de') ? 'Highlights' : 'Highlights'}</h3>
          <NumberedList>
            {highlights.map((x, i) => (
              <NumberedItem key={i} num={numFor(i)}>{x}</NumberedItem>
            ))}
          </NumberedList>
        </Subsection>
      ) : null}
      <Subsection id="traction-kpis-cards" compact>
        {captions?.kpis ? (
          <p className="text-[12px] text-[--color-foreground-muted] mb-2 text-center">{captions.kpis}</p>
        ) : null}
        {(!Array.isArray(kpis) || kpis.length === 0) ? (
          <div className="flex justify-center">
            <ErrorMessage
              className="max-w-md"
              title={locale.startsWith('de') ? 'Keine Daten' : 'No data'}
              message={locale.startsWith('de') ? 'Derzeit sind keine KPIs verfügbar.' : 'No KPIs available at the moment.'}
            />
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {kpis.map((k, i) => (
            <motion.div
              key={i}
              className="group w-full rounded-2xl p-5 md:p-7 ring-1 ring-[var(--color-border)] bg-[var(--color-surface)] dark:bg-[var(--color-surface)]/60 supports-[backdrop-filter]:backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:shadow-md hover:-translate-y-0.5 hover:bg-[var(--color-surface)]/95 text-center"
              {...(!reduceMotion ? {
                initial: { opacity: 0, y: 8 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-100px" },
                transition: { duration: 0.4, ease: "easeOut", delay: i * 0.03 },
              } : {})}
            >
              {/* Icon – ohne Rahmen/Background, etwas größer, markenfarbig, scharf */}
              {(() => {
                const Icon = iconFor(k.label);
                return (
                  <div className="mx-auto mb-2 flex items-center justify-center h-8 w-8 shrink-0">
                    <Icon className="h-6 w-6 shrink-0 icon-accent-glow" strokeWidth={2} aria-hidden />
                  </div>
                );
              })()}
              <div className="text-[11px] tracking-wide uppercase text-[--color-foreground-muted] mb-1">{k.label}</div>
              <div className="text-2xl md:text-3xl font-semibold leading-tight text-[--color-foreground-strong]">
                <CountUp to={k.value} suffix={k.unit ?? ""} locale={locale} />
              </div>
              {/* Quality chip for NRR/Churn */}
              {(() => {
                const label = String(k.label).toLowerCase();
                if (label.includes('nrr')) {
                  const good = k.value >= 105;
                  return (
                    <div className="mt-1 flex justify-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] rounded-full ring-1 ${good ? 'ring-emerald-500/25 text-emerald-600' : 'ring-amber-500/25 text-amber-600'}`}>
                        {good ? (locale.startsWith('de') ? 'Gut (≥105%)' : 'Good (≥105%)') : (locale.startsWith('de') ? 'Beobachten' : 'Watch')}
                      </span>
                    </div>
                  );
                }
                if (label.includes('churn')) {
                  const good = k.value < 8;
                  return (
                    <div className="mt-1 flex justify-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] rounded-full ring-1 ${good ? 'ring-emerald-500/25 text-emerald-600' : 'ring-rose-500/25 text-rose-600'}`}>
                        {good ? (locale.startsWith('de') ? 'Gut (<8%)' : 'Good (<8%)') : (locale.startsWith('de') ? 'Senken' : 'Reduce')}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
              <div className="mx-auto mt-2 h-px w-8/12 bg-[--color-border-subtle]/20" aria-hidden />
              {typeof k.delta === "number" ? (
                <div className="mt-2 flex items-center justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] rounded-full ring-1 ${
                      k.delta >= 0
                        ? "ring-emerald-500/30 text-emerald-600 bg-transparent"
                        : "ring-rose-500/30 text-rose-600 bg-transparent"
                    }`}
                    aria-label={k.delta >= 0 ? "positive delta" : "negative delta"}
                  >
                    {k.delta >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {k.delta >= 0 ? "+" : ""}{k.delta}%
                  </span>
                </div>
              ) : null}
            </motion.div>
            ))}
          </div>
        )}
        <div aria-hidden className="h-8 md:h-12" />
      </Subsection>
      {/* KPIs Erklärung */}
      {Array.isArray(kpisExplain) && kpisExplain.length > 0 ? (
        <Subsection id="traction-kpis-explain" compact className="mt-2">
          <h3 className="not-prose text-[13px] md:text-[13.5px] font-medium mb-1 text-[--color-foreground]">{locale.startsWith('de') ? 'KPIs – Erklärung' : 'KPIs – Explanation'}</h3>
          <NumberedList>
            {kpisExplain.map((x, i) => (
              <NumberedItem key={i} num={numFor(i)}>{x}</NumberedItem>
            ))}
          </NumberedList>
        </Subsection>
      ) : null}
      {/* Mehrere Trend-Serien bevorzugt, ansonsten Single-Serie */}
      {Array.isArray(trendsSeries) && trendsSeries.length > 0 ? (
        <Subsection id="traction-kpis-trends-multi" compact className="mt-3">
          {captions?.trends ? (
            <p className="text-[12px] text-[--color-foreground-muted] mb-1.5">{captions.trends}</p>
          ) : null}
          {/* Subtile Legende */}
          <div className="mb-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[--color-foreground-muted]">
            {trendsSeries.map((s, i) => (
              <span key={`legend-${i}`} className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color ?? 'currentColor' }} aria-hidden />
                <span>{s.name}</span>
              </span>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {trendsSeries.map((s, idx) => (
              <div key={idx} className="rounded-2xl ring-1 ring-[--color-border] bg-[--color-surface] dark:bg-[--color-surface]/60 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-[11px] text-[--color-foreground-muted] mb-1">{s.name}</div>
                <div className="overflow-x-auto">
                  <Sparkline data={s.data} width={560} height={56} fill={s.color ?? "currentColor"} responsive ariaLabel={`${title} – ${s.name}`} />
                </div>
              </div>
            ))}
          </div>
        </Subsection>
      ) : Array.isArray(trends) && trends.length > 0 ? (
        <Subsection id="traction-kpis-trend" compact className="mt-3">
          {captions?.trends ? (
            <p className="text-[12px] text-[--color-foreground-muted] mb-1.5">{captions.trends}</p>
          ) : null}
          <div className="overflow-x-auto">
            <Sparkline data={trends} width={560} height={56} fill="currentColor" responsive ariaLabel={title} />
          </div>
        </Subsection>
      ) : null}
      {/* Methodik, Evidenzen, Deliverables */}
      {Array.isArray(methodology) && methodology.length > 0 ? (
        <Subsection id="traction-kpis-methodology" compact className="mt-3">
          <h3 className="not-prose text-[13px] md:text-[13.5px] font-medium mb-1 text-[--color-foreground]">{locale.startsWith('de') ? 'Methodik' : 'Methodology'}</h3>
          <NumberedList>
            {methodology.map((x, i) => (
              <NumberedItem key={i} num={numFor(i)}>{x}</NumberedItem>
            ))}
          </NumberedList>
        </Subsection>
      ) : null}
      {Array.isArray(evidence) && evidence.length > 0 ? (
        <Subsection id="traction-kpis-evidence" compact className="mt-2">
          <h3 className="not-prose text-[13px] md:text-[13.5px] font-medium mb-1 text-[--color-foreground]">{locale.startsWith('de') ? 'Evidenzen' : 'Evidence'}</h3>
          <NumberedList>
            {evidence.map((x, i) => (
              <NumberedItem key={i} num={numFor(i)}>{x}</NumberedItem>
            ))}
          </NumberedList>
        </Subsection>
      ) : null}
      {Array.isArray(deliverables) && deliverables.length > 0 ? (
        <Subsection id="traction-kpis-deliverables" compact className="mt-2">
          <h3 className="not-prose text-[13px] md:text-[13.5px] font-medium mb-1 text-[--color-foreground]">{locale.startsWith('de') ? 'Deliverables bis Q4' : 'Deliverables by Q4'}</h3>
          <NumberedList>
            {deliverables.map((x, i) => (
              <NumberedItem key={i} num={numFor(i)}>{x}</NumberedItem>
            ))}
          </NumberedList>
        </Subsection>
      ) : null}
      {/* Benchmarks (SoA vs. Unser Ansatz) */}
      {benchmarks && Array.isArray(benchmarks.rows) && benchmarks.rows.length > 0 ? (
        <Subsection id="traction-kpis-benchmarks" compact className="mt-3">
          <h3 className="not-prose text-[13px] md:text-[13.5px] font-medium mb-1 text-[--color-foreground]">{benchmarks.title ?? (locale.startsWith('de') ? 'Benchmarks (SoA vs. Unser Ansatz)' : 'Benchmarks (SoA vs. Our Approach)')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-[13px]">
              {Array.isArray(benchmarks.headers) && benchmarks.headers.length > 0 ? (
                <thead>
                  <tr>
                    {benchmarks.headers.map((h, i) => (
                      <th key={i} className="text-left font-medium text-[--color-foreground-muted] py-1 pr-3">{h}</th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {benchmarks.rows.map((r, i) => (
                  <tr key={i} className="border-t border-[--color-border-subtle]">
                    {r.map((c, j) => (
                      <td key={j} className="py-1 pr-3">{String(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Subsection>
      ) : null}
    </Chapter>
  );
}
