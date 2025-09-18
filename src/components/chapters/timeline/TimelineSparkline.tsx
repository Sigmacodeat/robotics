"use client";

import React from "react";
import { useMessages } from "next-intl";
import { z } from "zod";
import SparklineCanvas from "@/components/chapters/timeline/SparklineCanvas";

// Hinweis: Keine globale Balkenfarb-Konstante nötig – AnimatedBar wurde entfernt

// Hinweis: Früher gab es hier eine Card-Hülle; entfernt für eine cleanere Timeline ohne Card-Optik.

// Vereinfachte generische Fallback-Komponente ohne Hooks im Parent
const GenericSparklineBasic: React.FC<{
  headerLabel: string;
  period?: string | null | undefined;
  growthPct?: number | undefined;
  xLabels?: [string, string] | undefined;
}> = ({ headerLabel, period, growthPct, xLabels }) => {
  const pct = typeof growthPct === 'number' && Number.isFinite(growthPct) ? Math.max(0, Math.min(1000, growthPct)) : undefined;
  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-0.5 md:mb-1">
        <div className="text-[12px] md:text-[12.5px] font-medium text-[--color-foreground-strong] tracking-[-0.006em] [font-variant-numeric:tabular-nums]">
          {headerLabel}
        </div>
        <div className="text-[11px] md:text-[11.5px]" title={period ?? undefined}>
          <PeriodBadges period={period ?? null} />
        </div>
      </div>
      <div className="w-full h-[88px] md:h-[128px] overflow-hidden" aria-label={`${headerLabel}: Entwicklung${period ? `, Zeitraum ${period}` : ''}`} role="img">
        <SparklineCanvas
          percent={pct}
          xLabels={xLabels}
          ariaLabel={`${headerLabel}: Entwicklung${period ? `, Zeitraum ${period}` : ''}`}
        />
      </div>
    </div>
  );
};

// (entfernt: YouTube Inline-Icon – unbenutzt)

// (entfernt: AnimatedBar – unbenutzt)

// Zeitleisten-Badges für Perioden wie "05/2022 – 02/2024" oder "seit 2020"
const PeriodBadges: React.FC<{ period?: string | null }> = ({ period }) => {
  const fmt = React.useMemo(() => {
    if (!period || typeof period !== 'string') return null as { start?: string; end?: string } | null;
    const raw = period.trim();
    const lower = raw.toLowerCase();
    const pad = (n: number) => String(n).padStart(2, '0');
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
    const parseMY = (s: string) => {
      const sNorm = normalize(s);
      // Recognize textual open end markers
      if (/^(heute|now|present|ongoing)$/i.test(sNorm)) return 'heute';
      const m1 = /^(\d{1,2})\/(\d{4})$/.exec(sNorm);
      if (m1) return `${pad(parseInt(m1[1]!, 10))}/${m1[2]}`;
      const m2 = /^(\d{4})$/.exec(sNorm);
      if (m2) return m2[1]!;
      return sNorm;
    };
    // seit X → open range
    if (/^seit\s+/i.test(lower)) {
      const after = normalize(raw.replace(/^seit\s*/i, ''));
      return { start: parseMY(after), end: 'heute' };
    }
    // ab/from X → open range
    if (/^(ab|from)\b/i.test(lower)) {
      const after = normalize(raw.replace(/^(ab|from)\s*/i, ''));
      return { start: parseMY(after), end: 'heute' };
    }
    const parts = raw.split(/\s*[–-]\s*/);
    if (parts.length === 2) {
      const start = parseMY(parts[0] ?? '');
      const endRaw = parts[1] ?? '';
      const endParsed = parseMY(endRaw);
      const end = endParsed || 'heute';
      return { start, end };
    }
    // Fallback: Einzelwert als Start und "heute"
    return { start: parseMY(raw), end: 'heute' };
  }, [period]);

  // Dauer berechnen (Jahre/Monate) und Laufindikator bestimmen
  const meta = React.useMemo(() => {
    if (!fmt) return null as null | { ongoing: boolean; duration?: { years: number; months: number } };
    const toDate = (token?: string, isEnd?: boolean): Date | null => {
      if (!token) return null;
      if (token === 'heute') return new Date();
      const mmYYYY = /^(\d{2})\/(\d{4})$/;
      const YYYY = /^(\d{4})$/;
      if (mmYYYY.test(token)) {
        const m = mmYYYY.exec(token)!;
        const monthIdx = Math.max(1, Math.min(12, parseInt(m[1]!, 10))) - 1;
        const year = parseInt(m[2]!, 10);
        return new Date(year, monthIdx, isEnd ? 28 : 1);
      }
      if (YYYY.test(token)) {
        const year = parseInt(token, 10);
        return new Date(year, isEnd ? 11 : 0, isEnd ? 31 : 1);
      }
      return null;
    };
    const startD = toDate(fmt.start, false);
    const endD = toDate(fmt.end, true);
    const ongoing = (fmt.end === 'heute');
    if (!startD || !endD) return { ongoing };
    const totalMonths = (endD.getFullYear() - startD.getFullYear()) * 12 + (endD.getMonth() - startD.getMonth());
    const years = Math.max(0, Math.floor(totalMonths / 12));
    const months = Math.max(0, totalMonths % 12);
    return { ongoing, duration: { years, months } };
  }, [fmt]);

  if (!fmt) return null;
  // Sprache erkennen (de/en) für Einheiten
  const isEN = (() => {
    if (typeof document !== 'undefined') {
      const lang = document.documentElement.lang || '';
      if (/^en/i.test(lang)) return true;
    }
    const raw = (period ?? '').toLowerCase();
    return /(present|ongoing|from)/.test(raw);
  })();
  const unitY = isEN ? 'Y' : 'J';
  const unitM = 'M';
  const label = `Zeitraum: ${fmt.start ?? ''} → ${fmt.end ?? ''}` + (meta?.duration ? ` • Dauer: ${meta.duration.years}${unitY} ${meta.duration.months}${unitM}` : '');
  const isActive = fmt.end === 'heute';
  return (
    <div className="flex items-center gap-1.5 text-[10px] md:text-[10.5px]" aria-label={label} title={label}>
      {fmt.start && (
        <span className="px-2 py-[2px] rounded-full whitespace-nowrap ring-1 ring-[rgba(148,163,184,0.30)] bg-[rgba(148,163,184,0.08)] text-[--color-foreground]">
          {fmt.start}
        </span>
      )}
      <span aria-hidden className="h-px w-7 md:w-9 bg-[rgba(148,163,184,0.28)] rounded-full mx-0.5" />
      {fmt.end && (
        isActive ? (
          <span className="px-2 py-[2px] rounded-full whitespace-nowrap flex items-center gap-1 ring-1 ring-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.10)] text-[--color-foreground-strong]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[rgba(16,185,129,0.9)] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" aria-hidden />
            <span className="uppercase tracking-[0.04em] text-[9px] opacity-75" aria-hidden>live</span>
            {fmt.end}
          </span>
        ) : (
          <span className="px-2 py-[2px] rounded-full whitespace-nowrap ring-1 ring-[rgba(148,163,184,0.30)] bg-[rgba(148,163,184,0.08)] text-[--color-foreground]">
            {fmt.end}
          </span>
        )
      )}
    </div>
  );
};

// --- Types & Schema ---
export type PerfItem = {
  period: string;
  company: string;
  value: number;
  growth: number;
  employees?: number;
  description: string;
  series?: number[];
  startCapital?: number;
};

const PerfArraySchema = z.array(
  z.object({
    period: z.string(),
    company: z.string(),
    value: z.number(),
    growth: z.number(),
    employees: z.number().optional(),
    description: z.string(),
    series: z.array(z.number()).optional(),
    startCapital: z.number().optional(),
  })
);

function usePerformanceFromI18n(): PerfItem[] {
  const messages = useMessages();
  return React.useMemo(() => {
    const root = messages as Record<string, unknown> | undefined;
    if (!root || typeof root !== 'object') return [];
    const cvRaw = 'cv' in root ? (root['cv'] as unknown) : undefined;
    if (!cvRaw || typeof cvRaw !== 'object') return [];
    const cvObj = cvRaw as Record<string, unknown>;
    const perfRaw = 'performance' in cvObj ? (cvObj['performance'] as unknown) : undefined;
    if (!perfRaw || typeof perfRaw !== 'object') return [];
    const perfObj = perfRaw as Record<string, unknown>;
    const itemsRaw = 'items' in perfObj ? (perfObj['items'] as unknown) : undefined;
    if (!itemsRaw) return [];
    const parsed = PerfArraySchema.safeParse(itemsRaw);
    return parsed.success ? (parsed.data as PerfItem[]) : [];
  }, [messages]);
}

type TimelineSparklineProps = { title: string; subtitle?: string; xLabels?: [string, string] };

export function TimelineSparkline({ title, subtitle, xLabels }: TimelineSparklineProps): React.ReactElement | null {
  const perf = usePerformanceFromI18n();
  const match = React.useMemo(() => {
    const hay = `${title} ${subtitle ?? ''}`.toLowerCase();
    if (subtitle) {
      const sub = subtitle.toLowerCase();
      const direct = perf.find((p) => {
        const pc = p.company.toLowerCase();
        return pc === sub || pc.includes(sub) || sub.includes(pc);
      });
      if (direct) return direct;
    }
    return perf.find((p) => hay.includes(p.company.toLowerCase()));
  }, [perf, title, subtitle]);

  const headerLabel = match?.company ?? subtitle ?? title;
  const growth = typeof match?.growth === 'number' ? match.growth : undefined;
  const period = match?.period ?? null;

  const autoXLabels = React.useMemo(() => {
    const p = match?.period?.trim();
    if (!p) return undefined;
    const norm = p.replace(/\s+/g, ' ').trim();
    const parts = norm.split(/\s*[–-]\s*/);
    const toLabel = (token: string) => {
      const m1 = /^(\d{1,2})\/(\d{4})$/.exec(token);
      if (m1) return m1[2]!; // Jahr
      if (/^(heute|now|present|ongoing)$/i.test(token)) return 'heute';
      if (/^(\d{4})$/.test(token)) return token;
      return token;
    };
    if (parts.length === 2) {
      return [toLabel(parts[0] ?? ''), toLabel(parts[1] ?? '')] as [string, string];
    }
    // Einzelwert → von Startjahr bis heute
    return [toLabel(norm), 'heute'] as [string, string];
  }, [match]);

  return (
    <GenericSparklineBasic headerLabel={headerLabel} period={period} growthPct={growth} xLabels={xLabels ?? autoXLabels} />
  );
}

export default TimelineSparkline;
