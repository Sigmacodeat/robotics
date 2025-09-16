"use client";
import { useLocale, useTranslations, useMessages } from "next-intl";
import Sparkline from "@charts/Sparkline";
import BarTrend from "@charts/BarTrend";
import type { SectionId } from "./sectionOrder";
import { numbered } from "./sectionOrder";
import CountUp from "@charts/CountUp";
import {
  ExecutiveChapter,
  MarketChapter,
  ProblemChapter,
  SolutionChapter,
  TechnologyChapter,
  ProductsChapter,
  BusinessModelChapter,
  FinanceChapter,
  RisksChapter,
  ComplianceChapter,
  CompanyChapter,
  TeamOrgChapter,
  GTMChapter,
  CostPlanChapter,
  CapTableChapter,
  DisseminationChapter,
  CTAChapter,
  ImpactChapter,
  AppendixChapter,
  Chapter,
  MarketCompetitiveChapter,
  TractionKPIsChapter,
} from "@components/chapters";
import { formatInteger } from "@/lib/format";
import LocaleLink from "@/components/navigation/LocaleLink";
import { z } from "zod";
import { TrendingUp, CalendarCheck2, Activity, Wallet, PiggyBank, PercentDiamond, Landmark, BarChart3, Users, UserRound, ShieldAlert, AlertTriangle, Footprints, Hand, Eye, Rocket, Shield, Package, ExternalLink } from "lucide-react";

export default function BusinessPlanSections() {
  const t = useTranslations();
  const tBp = useTranslations("bp");
  const locale = useLocale();
  // Hole die zur Laufzeit injizierten Nachrichten aus dem I18nProvider (vermeidet direkte Imports)
  const rawMessages = useMessages();
  const messages = (rawMessages as unknown) as Record<string, unknown>;
  // Einheitliche, nummerierte Kapitelüberschriften gemäß zentralem `sectionOrder`
  const titled = (id: SectionId, label: string) => numbered(id, label);
  // Executive key facts (displayed as chips) – aus i18n
  const execKeyFacts = (() => {
    try {
      return [
        tBp('execFacts.cagr') as string,
        tBp('execFacts.breakEven') as string,
        tBp('execFacts.revenue2030') as string,
        tBp('execFacts.compliance') as string,
        tBp('execFacts.model') as string,
      ].filter(Boolean) as string[];
    } catch {
      return [] as string[];
    }
  })();

  const m = (path: string, fallback?: unknown): any => {
    try {
      const parts = path.split(".");
      let acc: unknown = messages;
      for (const key of parts) {
        if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
          acc = (acc as Record<string, unknown>)[key];
        } else {
          acc = undefined;
          break;
        }
      }
      if (typeof acc === "undefined" && fallback === undefined) {
        if (path === "content" || path.startsWith("content.")) {
          return {} as const;
        }
      }
      return acc ?? fallback;
    } catch {
      return fallback;
    }
  };

  // helper to safely coerce arrays from i18n
  const safeArray = (v: unknown) => (Array.isArray(v) ? (v as { label: string | number; value: number }[]) : undefined);

  // Zod validation for marketCompetitive content (lightweight)
  const MarketCompetitiveSchema = z.object({
    overview: z.array(z.string()).optional(),
    segments: z.array(z.string()).optional(),
    competitors: z
      .array(
        z.object({
          name: z.string(),
          focus: z.string(),
          strength: z.string(),
          weakness: z.string(),
        })
      )
      .optional(),
    swot: z
      .object({
        strengths: z.array(z.string()).optional(),
        weaknesses: z.array(z.string()).optional(),
        opportunities: z.array(z.string()).optional(),
        threats: z.array(z.string()).optional(),
      })
      .optional(),
    positioning: z.string().optional(),
    competitionMatrix: z
      .array(
        z.object({
          x: z.number(),
          y: z.number(),
          label: z.string().optional(),
          color: z.string().optional(),
          size: z.number().optional(),
          emphasis: z.boolean().optional(),
        })
      )
      .optional(),
    radarAxes: z.array(z.string()).optional(),
    radarSeries: z
      .array(
        z.object({
          name: z.string(),
          color: z.string().optional(),
          values: z.array(z.number()),
        })
      )
      .optional(),
  });

  // competition matrix moved under consolidated Market chapter (to be reintroduced as subsection later)

  // break-even defaults
  const breakEvenData = (m("content").finance?.breakEven as { label: string | number; value: number }[]) ?? [
    { label: 2025, value: -240 },
    { label: 2026, value: -120 },
    { label: 2027, value: 10 },
    { label: 2028, value: 140 },
    { label: 2029, value: 320 },
  ];

  // revenue vs cost defaults (multi-line)
  const revenueVsCostMsg = m("content").finance?.revenueVsCost as { revenue?: { label: string | number; value: number }[]; costs?: { label: string | number; value: number }[] } | undefined;
  const defaultRevenue = [
    { label: 2025, value: 480 },
    { label: 2026, value: 820 },
    { label: 2027, value: 1200 },
    { label: 2028, value: 1700 },
    { label: 2029, value: 2300 },
  ];
  const defaultCosts = [
    { label: 2025, value: 720 },
    { label: 2026, value: 940 },
    { label: 2027, value: 1190 },
    { label: 2028, value: 1450 },
    { label: 2029, value: 1750 },
  ];
  const revenueVsCost = {
    revenue: Array.isArray(revenueVsCostMsg?.revenue) && (revenueVsCostMsg?.revenue?.length ?? 0) > 0 ? (revenueVsCostMsg?.revenue as { label: string | number; value: number }[]) : defaultRevenue,
    costs: Array.isArray(revenueVsCostMsg?.costs) && (revenueVsCostMsg?.costs?.length ?? 0) > 0 ? (revenueVsCostMsg?.costs as { label: string | number; value: number }[]) : defaultCosts,
  };

  // cash flow (operating/investing/financing) – supports tuple [[label,value]] or object {label,value}
  const cashFlowMsg = m("content").finance?.cashFlow as
    | {
        operating?: Array<{ label: string | number; value: number } | [string | number, number]>;
        investing?: Array<{ label: string | number; value: number } | [string | number, number]>;
        financing?: Array<{ label: string | number; value: number } | [string | number, number]>;
      }
    | undefined;
  const normSeries = (arr?: Array<{ label: string | number; value: number } | [string | number, number]>) =>
    Array.isArray(arr)
      ? (arr.map((it) =>
          Array.isArray(it)
            ? ({ label: it[0], value: it[1] } as { label: string | number; value: number })
            : ({ label: it.label, value: it.value } as { label: string | number; value: number })
        ) as { label: string | number; value: number }[])
      : undefined;
  const defaultLabelsCF = [2025, 2026, 2027, 2028, 2029];
  const cfOperating = (Array.isArray(cashFlowMsg?.operating) && (cashFlowMsg!.operating!.length ?? 0) > 0
    ? (normSeries(cashFlowMsg!.operating) as { label: string | number; value: number }[])
    : defaultLabelsCF.map((y, i) => ({ label: y, value: [ -420, -180, 140, 420, 680 ][i] }))
  ) as { label: string | number; value: number }[];
  const cfInvesting = (Array.isArray(cashFlowMsg?.investing) && (cashFlowMsg!.investing!.length ?? 0) > 0
    ? (normSeries(cashFlowMsg!.investing) as { label: string | number; value: number }[])
    : defaultLabelsCF.map((y, i) => ({ label: y, value: [ -160, -120, -90, -60, -40 ][i] }))
  ) as { label: string | number; value: number }[];
  const cfFinancing = (Array.isArray(cashFlowMsg?.financing) && (cashFlowMsg!.financing!.length ?? 0) > 0
    ? (normSeries(cashFlowMsg!.financing) as { label: string | number; value: number }[])
    : defaultLabelsCF.map((y, i) => ({ label: y, value: [ 600, 0, 0, 0, 0 ][i] }))
  ) as { label: string | number; value: number }[];

  // revenue composition (stacked) optional
  const revenueCompositionMsg = m("content").finance?.revenueComposition as
    | { labels?: Array<string | number>; series?: { name: string; color?: string; values: number[] }[] }
    | undefined;
  const revenueComposition = (() => {
    const labels = Array.isArray(revenueCompositionMsg?.labels) && (revenueCompositionMsg?.labels?.length ?? 0) > 0
      ? (revenueCompositionMsg?.labels as Array<string | number>)
      : [2025, 2026, 2027, 2028, 2029];
    const series = Array.isArray(revenueCompositionMsg?.series) && (revenueCompositionMsg?.series?.length ?? 0) > 0
      ? (revenueCompositionMsg?.series as { name: string; color?: string; values: number[] }[])
      : [
          { name: "Product A", color: "#3b82f6", values: [200, 360, 520, 720, 960] },
          { name: "Product B", color: "#f59e0b", values: [120, 220, 340, 480, 640] },
        ];
    return { labels, series };
  })();

  // profit bridge (waterfall) optional – ensure 'type' is always present
  const profitBridgeMsgSteps = m("content").finance?.profitBridgeSteps as { label: string | number; value: number; type?: string; color?: string }[] | undefined;
  const normalizeType = (t?: string): "increase" | "decrease" | "subtotal" | "total" =>
    t === "increase" || t === "decrease" || t === "subtotal" || t === "total" ? t : "increase";
  const profitBridgeSteps: { label: string | number; value: number; type: "increase" | "decrease" | "subtotal" | "total"; color?: string }[] = (
    (Array.isArray(profitBridgeMsgSteps) && profitBridgeMsgSteps.length > 0)
      ? profitBridgeMsgSteps
      : [
          { label: "Revenue", value: 2300, type: "increase", color: "#22c55e" },
          { label: "COGS", value: 700, type: "decrease", color: "#ef4444" },
          { label: "Gross Profit", value: 1600, type: "subtotal", color: "#64748b" },
          { label: "OPEX", value: 1000, type: "decrease", color: "#ef4444" },
          { label: "Other", value: 200, type: "decrease", color: "#ef4444" },
          { label: "EBITDA", value: 400, type: "total", color: "#0ea5e9" },
        ]
  ).map((s) => ({ label: s.label, value: s.value, type: normalizeType(s.type), ...(s.color ? { color: s.color } : {}) }));

  // precompute capex/opex breakdown for FinanceChapter and pass conditionally
  const capexOpexBreakdownData: Record<string, (string | number)[][]> | undefined = (() => {
    const capex = (m("content").financePlanDetailed?.capexOpex as Record<string, [number | string, number | string][]>) ??
                  (m("content").financePlanDetailed?.capexOpexBreakdown as Record<string, [number | string, number | string][]>);
    if (!capex || typeof capex !== "object") return undefined;
    const out: Record<string, (string | number)[][]> = {};
    for (const [k, arr] of Object.entries(capex)) out[k] = (arr ?? []).map((r) => [r[0], r[1]]);
    return out;
  })();

  // precompute totals and revenue tables (optional)
  const totalsRowsData: (string | number)[][] | undefined = (() => {
    const rows = m("content").financePlanDetailed?.totalsRows as [string | number, string | number][] | undefined;
    return Array.isArray(rows) ? rows.map((r) => [r[0], r[1]]) : undefined;
  })();
  const totalsTitleMsg = (m("content").financePlanDetailed?.totalsTitle as string) ?? undefined;
  const totalsHeadersMsg = (m("content").financePlanDetailed?.totalsHeaders as string[]) ?? undefined;

  const revenueRowsData: (string | number)[][] | undefined = (() => {
    const rows = m("content").financePlanDetailed?.revenueRows as [string | number, string | number][] | undefined;
    return Array.isArray(rows) ? rows.map((r) => [r[0], r[1]]) : undefined;
  })();
  const revenueTitleMsg = (m("content").financePlanDetailed?.revenueTitle as string) ?? undefined;
  const revenueHeadersMsg = (m("content").financePlanDetailed?.revenueHeaders as string[]) ?? undefined;

  // EBITDA by year (optional table)
  const ebitdaByYear = m("content").financePlanDetailed?.ebitdaByYear as { title?: string; headers?: string[]; rows?: (string | number)[][] } | undefined;
  const ebitdaTitleMsg = (ebitdaByYear?.title as string) ?? undefined;
  const ebitdaHeadersMsg = (ebitdaByYear?.headers as string[]) ?? undefined;
  const ebitdaRowsData: (string | number)[][] | undefined = Array.isArray(ebitdaByYear?.rows)
    ? (ebitdaByYear?.rows as (string | number)[][])
    : undefined;

  // finance.capexOpex (single table)
  const capexOpexSingle = m("content").finance?.capexOpex as { headers?: string[]; rows?: (string | number)[][] } | undefined;
  const capexOpexSingleHeaders = capexOpexSingle?.headers ?? undefined;
  const capexOpexSingleRows = Array.isArray(capexOpexSingle?.rows)
    ? (capexOpexSingle?.rows as (string | number)[][]).map((r) => [r[0], r[1], ...(r.slice(2) ?? [])])
    : undefined;

  // finance.projectionsScenarios
  const projScenarios = m("content").finance?.projectionsScenarios as { headers?: string[]; rows?: (string | number)[][] } | undefined;
  const projScenariosHeaders = projScenarios?.headers ?? undefined;
  const projScenariosRows = Array.isArray(projScenarios?.rows) ? (projScenarios?.rows as (string | number)[][]) : [];

  // Nummerierung kommt zentral aus sectionOrder

  // Hinweis: Animationen werden innerhalb der Kapitel-Komponenten (Section/Chapter) gehandhabt.

  return (
    <div className="">
      {/* Flat Premium Header (minimal, same reading width) */}
      <div className="container-gutter">
        <div className="reading-max py-8 md:py-10">
          {/* Breadcrumb entfernt (kein Link im Header) */}
          <h1 className="mt-2 font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-cyan-400 dark:to-sky-500">
            {t("hero.title")}
          </h1>
          <p className="mt-2 max-w-prose text-slate-700 dark:text-slate-200">{t("hero.subtitle")}</p>
          {execKeyFacts.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {execKeyFacts.map((k, i) => (
                <span key={`${i}-${k || 'fact'}`} className="badge rounded-full border-gradient chip-anim">
                  {k}
                </span>
              ))}
            </div>
          )}
          {/* KPI-Stat-Karten (dezent) – rein aus i18n */}
          <div className="not-prose mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: 'market2030',
                label: tBp('kpis.market2030') as string,
                value: tBp('kpisValues.market2030') as string,
                sub: tBp('kpisSub.market2030') as string,
                Icon: TrendingUp,
              },
              {
                id: 'breakEven',
                label: tBp('kpis.breakEven') as string,
                value: tBp('kpisValues.breakEvenYear') as string,
                sub: tBp('kpisSub.breakEven') as string,
                Icon: CalendarCheck2,
              },
              {
                id: 'cagr',
                label: tBp('kpis.cagr') as string,
                value: tBp('kpisValues.cagr') as string,
                sub: tBp('kpisSub.cagr') as string,
                Icon: Activity,
              },
              {
                id: 'revenue2030',
                label: tBp('kpis.revenue2030') as string,
                value: tBp('kpisValues.revenue2030') as string,
                sub: tBp('kpisSub.revenue2030') as string,
                Icon: Wallet,
              },
            ].map((s) => (
              <div key={s.id} className="rounded-xl p-5 md:p-6 pb-8 md:pb-9 bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm ring-1 ring-[--color-border-subtle]">
                <div className="flex items-center justify-center gap-2">
                  <s.Icon aria-hidden className="h-4 w-4 text-[--color-foreground-muted]" />
                  <div className="text-xs font-medium tracking-wide text-[--color-foreground-muted] text-center">{s.label}</div>
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-[--color-foreground] text-center">{s.value}</div>
                <div className="mt-1 text-xs text-[--color-foreground-muted] text-center">{s.sub}</div>
              </div>
            ))}
          </div>
          {/* Entfernt: optionaler CTA-Button (Investor Deck öffnen) */}
        </div>
      </div>
      {/* Floating Print/PDF Button removed; printing is centralized via PrintButton in chapters layout */}
      {/* Entfernt: äußerer motion.div-Wrapper (verursachte doppelte Effekte) */}
      <ExecutiveChapter
        id="executive"
        title={titled("executive", tBp("sections.executive"))}
        paragraphs={(() => {
          try {
            const chap = (m("chapters").executiveSummary as Record<string, unknown>) ?? {};
            const paras = chap?.paragraphs as unknown;
            if (Array.isArray(paras) && paras.length > 0) return paras as string[];
            type ExecSections = {
              problem?: { content?: string };
              solution?: {
                platform?: { content?: string };
                technology?: { content?: string };
              };
              market?: { content?: string };
            };
            const sections = chap?.sections as ExecSections | undefined;
            const prob = sections?.problem?.content;
            const plat = sections?.solution?.platform?.content;
            const tech = sections?.solution?.technology?.content;
            const market = sections?.market?.content;
            const combined = [prob, plat, tech, market].filter(Boolean) as string[];
            if (combined.length > 0) return combined;
          } catch {}
          return [] as string[];
        })()}
        />

      {/* Traction & KPIs wird weiter unten nach GTM gerendert */}

      {/* Executive USPs highlight (optional) */}
      {(() => {
        try {
          const usps = (m("chapters").executiveSummary?.sections as Record<string, unknown>)?.usps as
            | { title?: unknown; items?: unknown }
            | undefined;
          const items = Array.isArray(usps?.items) ? (usps?.items as string[]) : [];
          if (!items.length) return null;
          const title = typeof usps?.title === "string" && usps.title ? (usps.title as string) : undefined;
          return (
            <div className="container-gutter mt-4">
              <div className="reading-max">
                <div className="rounded-xl bg-[--color-surface] p-4 shadow-sm ring-1 ring-black/5">
                  {title ? <h3 className="font-semibold mb-2">{title}</h3> : null}
                  <ul className="list-none pl-0 space-y-1">
                    {items.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                  <div className="mt-3 text-sm text-[--color-foreground-muted]">
                    <a href="#finance" className="underline underline-offset-2">
                      {tBp("headings.fundraising")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        } catch {
          return null;
        }
      })()}


      {/* Entfernt: äußerer motion.div-Wrapper (verursachte doppelte Effekte) */}
      <CompanyChapter
        id="company"
        title={titled("company", tBp("sections.company"))}
        items={[t("content.company.name") as string, t("content.company.location") as string, t("content.company.industry") as string, t("content.company.team") as string, t("content.company.vision") as string, t("content.company.mission") as string]}
        {...(() => {
          try {
            const legal = (m("content").company?.legal as { entity?: unknown; hq?: unknown; founding?: unknown }) ?? undefined;
            const milestones = (m("content").company?.milestones as unknown) ?? undefined;
            const ent = legal && typeof legal === "object" ? (legal.entity as unknown) : undefined;
            const hq = legal && typeof legal === "object" ? (legal.hq as unknown) : undefined;
            const founding = legal && typeof legal === "object" ? (legal.founding as unknown) : undefined;
            const legalObj = ((): { entity?: string | number; hq?: string | number; founding?: string | number } | undefined => {
              const out: { entity?: string | number; hq?: string | number; founding?: string | number } = {};
              if (typeof ent === "string" || typeof ent === "number") out.entity = ent;
              if (typeof hq === "string" || typeof hq === "number") out.hq = hq;
              if (typeof founding === "string" || typeof founding === "number") out.founding = founding;
              return Object.keys(out).length > 0 ? out : undefined;
            })();
            const milestonesArr = Array.isArray(milestones) ? (milestones as string[]) : undefined;
            const out: Record<string, unknown> = {};
            if (legalObj && (legalObj.entity || legalObj.hq || typeof legalObj.founding !== "undefined")) {
              out.legal = legalObj;
              out.legalTitle = (tBp("headings.legal") as string) ?? undefined;
            }
            if (milestonesArr && milestonesArr.length > 0) {
              out.milestones = milestonesArr;
              // Fallback: nutze Timeline-Überschrift, falls kein spezieller Key vorhanden ist
              out.milestonesTitle = (tBp("headings.timeline") as string) ?? undefined;
            }
            return out;
          } catch {
            return {} as const;
          }
        })()}
      />
      
      {/* Team/Org: kompakter Stat-Strip vor dem Kapitel */}
      <div className="container-gutter">
        <div className="reading-max">
          {(() => {
            try {
              const years = (m("content").teamOrg?.years as { year: string | number; size: number | string }[]) ?? [];
              const founders = (m("content").teamOrg?.founders as string[]) ?? [];
              const headcount = years.length > 0 ? years[years.length - 1]?.size : undefined;
              const nextYear = years.length > 0 ? years[0]?.year : undefined;
              const ftePlan = (m("content").teamOrg?.ftePlan as { year: string | number; teamSize: number | string }[] | undefined) ?? undefined;
              const planned = Array.isArray(ftePlan) && ftePlan.length > 0 ? ftePlan[0]?.teamSize : undefined;
              const items = [
                { label: locale.startsWith('de') ? 'Headcount' : 'Headcount', value: (headcount ?? 6) + '', sub: locale.startsWith('de') ? 'aktuell' : 'current', Icon: Users },
                { label: tBp("headings.founders") as string, value: (founders.length || 2) + '', sub: locale.startsWith('de') ? 'Kernteam' : 'core team', Icon: UserRound },
                { label: tBp("headings.teamPlan") as string, value: (planned ?? 10) + '', sub: `${locale.startsWith('de') ? 'Jahr' : 'Year'} ${nextYear ?? 'Y1'}`, Icon: Users },
                { label: locale.startsWith('de') ? 'Hiring-Fokus' : 'Hiring focus', value: locale.startsWith('de') ? 'AI/Robotics' : 'AI/Robotics', sub: locale.startsWith('de') ? 'nächste 12M' : 'next 12m', Icon: TrendingUp },
              ];
              return (
                <div className="not-prose mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((s, i) => (
                    <div key={`${String(s.label)}-${i}`} className="rounded-lg p-3 pb-4 md:pb-5 bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm ring-1 ring-[--color-border-subtle]">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium tracking-wide text-[--color-foreground-muted]">{s.label}</div>
                        <s.Icon aria-hidden className="h-4 w-4 text-[--color-foreground-muted]" />
                      </div>
                      <div className="mt-0.5 text-2xl font-semibold tracking-tight text-[--color-foreground] text-center">{s.value}</div>
                      <div className="text-xs text-[--color-foreground-muted] text-center">{s.sub}</div>
                    </div>
                  ))}
                </div>
              );
            } catch {
              return null;
            }
          })()}
        </div>
      </div>

      <TeamOrgChapter
        id="teamOrg"
        title={titled("teamOrg", tBp("sections.teamOrg"))}
        years={(m("content").teamOrg?.years as { year: string | number; size: number | string; focus?: string[]; roles?: string[] }[]) ?? []}
        {
          ...(() => {
            const f = m("content").teamOrg?.ftePlan as { year: string | number; teamSize: number | string; focus?: string | string[]; roles?: string[] }[] | undefined;
            return Array.isArray(f) ? { ftePlan: f } : {};
          })()
        }
        {
          ...(() => {
            const founders = m("content").teamOrg?.founders as string[] | undefined;
            return Array.isArray(founders) ? { founders } : {};
          })()
        }
        {
          ...(() => {
            const summary = m("content").teamOrg?.summary as string | undefined;
            return typeof summary === 'string' ? { summary } : {};
          })()
        }
        headers={[
          tBp("tables.headers.year") as string,
          tBp("tables.headers.teamSize") as string,
          tBp("tables.headers.focus") as string,
          tBp("tables.headers.roles") as string,
        ]}
      />

      {/* Link zum vollständigen Lebenslauf von Ismet Mešić */}
      <div className="container-gutter">
        <div className="reading-max mt-2">
          <LocaleLink
            href="/lebenslauf"
            className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:no-underline"
            aria-label={t("cv.viewFull")}
          >
            <span>{t("cv.viewFull")}</span>
          </LocaleLink>
        </div>
      </div>

      {/* Entfernt: äußerer motion.div-Wrapper */}
      <ProblemChapter
        id="problem"
        title={titled("problem", tBp("sections.problem"))}
        items={(() => {
          try {
            const p1 = (m("content").problem?.p1 as string) ?? undefined;
            const p2 = (m("content").problem?.p2 as string) ?? undefined;
            const p3 = (m("content").problem?.p3 as string) ?? undefined;
            const p4 = (m("content").problem?.p4 as string) ?? undefined;
            return [p1, p2, p3, p4].filter(Boolean) as string[];
          } catch {
            return [] as string[];
          }
        })()}
        />
      {/* Entfernt: äußerer motion.div-Wrapper */}
      <SolutionChapter
        id="solution"
        title={titled("solution", tBp("sections.solution"))}
        items={[t("content.solution.rass") as string, t("content.solution.appstore") as string, t("content.solution.agents") as string, t("content.solution.integration") as string, `${t("content.solution.usp") as string}`]}
        paragraphs={(m("content").solution?.paragraphs as string[]) ?? []}
        baseChapterIndex={1}
        parentSectionNumber={2}
        {
          ...(() => {
            try {
              type ExecSections = {
                solution?: {
                  platform?: { content?: string };
                  technology?: { content?: string };
                };
              };
              const exec = (m("chapters").executiveSummary as Record<string, unknown>) ?? {};
              const sol = (exec?.sections as ExecSections | undefined)?.solution ?? {};
              const platformTitle = t("chapters.executiveSummary.sections.solution.platform.title") as string;
              const techTitle = t("chapters.executiveSummary.sections.solution.technology.title") as string;
              const platformContent = (sol?.platform?.content as string) ?? (t("chapters.executiveSummary.sections.solution.platform.content") as string);
              const techContent = (sol?.technology?.content as string) ?? (t("chapters.executiveSummary.sections.solution.technology.content") as string);
              const subs = [
                { title: platformTitle, content: platformContent },
                { title: techTitle, content: techContent },
              ].filter((s) => typeof s.content === 'string' && s.content.length > 0);
              return subs.length > 0 ? { subSections: subs } : {};
            } catch {
              return {} as const;
            }
          })()
        }
        />

      {/* Entfernt: äußerer motion.div-Wrapper */}
      <ProductsChapter
        id="products"
        title={titled("products", tBp("sections.products"))}
        stages={(m("content").products?.stages as string[]) ?? []}
        paragraphs={(m("content").products?.paragraphs as string[]) ?? []}
        />

      {/* Business Model – neu explizit im Print-Flow (zwischen Products und Market) */}
      {(() => {
        try {
          const bm = (m("content").businessModel as Record<string, unknown>) ?? {};
          // Legacy Felder (frühere Struktur)
          // Revenue Streams können entweder als string[] (legacy) oder als detaillierte Objekte
          // { type, description } geliefert werden. Verhindere, dass Objekt-Arrays fälschlich
          // als React-Child gerendert werden, indem wir sie dem richtigen Prop zuordnen.
          const revenueStreamsRaw = (bm?.revenueStreams as unknown) ?? [];
          const streams = Array.isArray(revenueStreamsRaw) && revenueStreamsRaw.every((x) => typeof x === 'string')
            ? (revenueStreamsRaw as string[])
            : [];
          const pricing = (bm?.pricing as string[]) ?? [];
          const pricingTiers = (bm?.pricingTiers as string[]) ?? [];
          const scaling = (bm?.scaling as string[]) ?? [];
          const projections = (bm?.projections as (number | string)[][]) ?? [];
          const projectionsHeaders = (bm?.projectionsHeaders as string[]) ?? [];
          const successFactors = (bm?.successFactors as string[]) ?? [];

          // Neue, detaillierte Struktur (bereits in i18n de/bp.ts vorhanden)
          const description = (bm?.description as string[]) ?? [];
          type RevenueStreamDetailed = { type: string; description: string };
          type PricingModelItem = { model: string; description: string };
          type CostStructureItem = { category: string; items: string[] };
          type KeyMetricItem = { metric: string; target: string };
          type BmDetailed = Partial<{
            revenueStreamsDetailed: RevenueStreamDetailed[];
            pricingModel: PricingModelItem[];
            costStructure: CostStructureItem[];
            keyMetrics: KeyMetricItem[];
            competitiveAdvantage: string[];
            gtmPoints: string[];
            grantFitPoints: string[];
            moatPoints: string[];
          }>;
          const bmDetailed = bm as BmDetailed;
          let revenueStreamsDetailed = bmDetailed?.revenueStreamsDetailed;
          // Fallback: Wenn revenueStreamsDetailed fehlt, aber revenueStreams Objekte trägt, nutze diese
          if (!Array.isArray(revenueStreamsDetailed) || revenueStreamsDetailed.length === 0) {
            if (
              Array.isArray(revenueStreamsRaw) &&
              revenueStreamsRaw.every((x: unknown) => {
                const o = x as Record<string, unknown>;
                return o && typeof o === 'object' && 'type' in o && 'description' in o;
              })
            ) {
              revenueStreamsDetailed = revenueStreamsRaw as RevenueStreamDetailed[];
            }
          }
          const pricingModel = bmDetailed?.pricingModel as PricingModelItem[] | undefined;
          const costStructure = bmDetailed?.costStructure as CostStructureItem[] | undefined;
          const keyMetrics = bmDetailed?.keyMetrics as KeyMetricItem[] | undefined;
          const competitiveAdvantage = bmDetailed?.competitiveAdvantage as string[] | undefined;
          const gtmPoints = bmDetailed?.gtmPoints as string[] | undefined;
          const grantFitPoints = bmDetailed?.grantFitPoints as string[] | undefined;
          const moatPoints = bmDetailed?.moatPoints as string[] | undefined;

          // Render auslösen, wenn entweder alte oder neue Struktur befüllt ist
          const hasAny =
            streams.length > 0 ||
            pricing.length > 0 ||
            pricingTiers.length > 0 ||
            scaling.length > 0 ||
            projections.length > 0 ||
            successFactors.length > 0 ||
            description.length > 0 ||
            (Array.isArray(revenueStreamsDetailed) && revenueStreamsDetailed.length > 0) ||
            (Array.isArray(pricingModel) && pricingModel.length > 0) ||
            (Array.isArray(costStructure) && costStructure.length > 0) ||
            (Array.isArray(keyMetrics) && keyMetrics.length > 0) ||
            (Array.isArray(competitiveAdvantage) && competitiveAdvantage.length > 0) ||
            (Array.isArray(gtmPoints) && gtmPoints.length > 0) ||
            (Array.isArray(grantFitPoints) && grantFitPoints.length > 0) ||
            (Array.isArray(moatPoints) && moatPoints.length > 0);
          if (!hasAny) return null;
          return (
              <BusinessModelChapter
              id="businessModel"
              title={titled("businessModel", tBp("sections.businessModel") as string)}
              streams={streams}
              pricing={pricing}
              pricingTiers={pricingTiers}
              scaling={scaling}
              projections={projections}
              projectionsHeaders={projectionsHeaders}
              successFactors={successFactors}
              description={description}
              revenueStreams={Array.isArray(revenueStreamsDetailed) ? revenueStreamsDetailed : []}
              pricingModel={Array.isArray(pricingModel) ? pricingModel : []}
              costStructure={Array.isArray(costStructure) ? costStructure : []}
              keyMetrics={Array.isArray(keyMetrics) ? keyMetrics : []}
              competitiveAdvantage={Array.isArray(competitiveAdvantage) ? competitiveAdvantage : []}
              gtmPoints={Array.isArray(gtmPoints) ? gtmPoints : []}
              grantFitPoints={Array.isArray(grantFitPoints) ? grantFitPoints : []}
              moatPoints={Array.isArray(moatPoints) ? moatPoints : []}
              kpisTitle={tBp("headings.businessModelKPIs") as string}
              streamsTitle={tBp("headings.revenueStreams") as string}
              pricingTitle={tBp("headings.pricing") as string}
              pricingTiersTitle={tBp("headings.pricing") as string}
              scalingTitle={tBp("headings.roadmap") as string}
              projectionsTitle={tBp("headings.projections") as string}
              successFactorsTitle={tBp("headings.successFactors") as string}
              />
          );
        } catch {
          return null;
        }
      })()}

      {/* Entfernt: äußerer motion.div-Wrapper */}
      <MarketChapter
        id="market"
        title={titled(
          "market",
          `${tBp("sections.market")} & ${tBp("headings.competition")}` as string
        )}
        lineChart={
          safeArray(m("content").market?.lineChart) ?? [
            { label: 2025, value: 5.0 },
            { label: 2026, value: 6.0 },
            { label: 2027, value: 7.2 },
            { label: 2028, value: 8.6 },
            { label: 2029, value: 10.3 },
            { label: 2030, value: 12.4 },
          ]
        }
        barChart={
          safeArray(m("content").market?.barChart) ?? [
            { label: "Q1", value: 14 },
            { label: "Q2", value: 18 },
            { label: "Q3", value: 22 },
            { label: "Q4", value: 28 },
          ]
        }
        ariaLine={tBp("figures.marketVolumeAlt") as string}
        ariaBars={tBp("figures.revenueBarsAlt") as string}
        captionLine={tBp("figures.marketVolumeCaption") as string}
        captionBars={tBp("figures.revenueBarsCaption") as string}
        locale={locale}
      >
        <section id="market-overview" aria-labelledby="market-overview-title">
          <h3 id="market-overview-title" className="sr-only">{tBp("headings.overview")}</h3>
          <p><strong>TAM:</strong> {t("content.market.tam")}</p>
          <p><strong>SAM:</strong> {t("content.market.sam")}</p>
          <p><strong>SOM:</strong> {t("content.market.som")}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg p-3 bg-[--color-muted]/30 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[--color-foreground-muted]">{tBp("kpis.market2030")}</div>
                <BarChart3 aria-hidden className="h-4 w-4 text-[--color-foreground-muted]" />
              </div>
              <div className="text-2xl font-semibold">
                <CountUp to={12.4} decimals={1} suffix=" Mrd €" locale={locale} />
              </div>
            </div>
            <div className="rounded-lg p-3 bg-[--color-muted]/30 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[--color-foreground-muted]">CAGR 2025–2030</div>
                <Activity aria-hidden className="h-4 w-4 text-[--color-foreground-muted]" />
              </div>
              <div className="text-2xl font-semibold">~20%</div>
            </div>
          </div>
        </section>
        <section id="market-competition" aria-labelledby="market-competition-title" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 id="market-competition-title" className="font-semibold">{tBp("headings.competition")}</h3>
              <ol className="list-decimal pl-5">
                {(m("content").market?.competition ?? []).map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold">{tBp("headings.traction")}</h3>
              <ol className="list-decimal pl-5">
                {(m("content").market?.traction ?? []).map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ol>
              <div className="mt-4 flex items-end gap-6">
                <div>
                  <div className="text-sm text-[--color-foreground-muted] mb-1">Monthly Signups</div>
                  <Sparkline data={[8,12,11,14,18,17,22,24,23,26,29,34]} width={220} height={56} fill="currentColor" responsive />
                </div>
                <div>
                  <div className="text-sm text-[--color-foreground-muted] mb-1">MRR (k€)</div>
                  <BarTrend data={[
                    {label:"M1", value: 4}, {label:"M2", value: 6}, {label:"M3", value: 7},
                    {label:"M4", value: 9}, {label:"M5", value: 11}, {label:"M6", value: 14}
                  ]} width={220} height={100} />
                </div>
              </div>
            </div>
          </div>
        </section>
        {Array.isArray(m("content").market?.partners) && m("content").market.partners.length > 0 && (
          <section id="market-segments" aria-labelledby="market-segments-title" className="mt-6">
            <h3 id="market-segments-title" className="font-semibold">{tBp("headings.partnerships")}</h3>
            <ol className="list-decimal pl-5">
              {(m("content").market.partners as string[]).map((p: string, i: number) => (
                <li key={i}>{p}</li>
              ))}
            </ol>
          </section>
        )}
        </MarketChapter>

      {/* MarketCompetitive: rendere nur wenn Inhalte vorhanden sind (dezent, ohne hartes Flag) */}
      {(() => {
        const mcRaw = (m("content").marketCompetitive as unknown) ?? {};
        const parsed = MarketCompetitiveSchema.safeParse(mcRaw);
        const mc = (parsed.success ? parsed.data : {}) as z.infer<typeof MarketCompetitiveSchema>;
        const overview = (mc?.overview as string[]) ?? [];
        const segments = (mc?.segments as string[]) ?? [];
        const competitors = (mc?.competitors as { name: string; focus: string; strength: string; weakness: string }[]) ?? [];
        const swot = mc?.swot as { strengths?: string[]; weaknesses?: string[]; opportunities?: string[]; threats?: string[] } | undefined;
        const hasAny = overview.length || segments.length || competitors.length || (swot && (swot.strengths?.length || swot.weaknesses?.length || swot.opportunities?.length || swot.threats?.length));
        if (!hasAny) return null;
        return (
            <MarketCompetitiveChapter
            id="market-details"
            title={tBp("sections.marketCompetitive")}
            overview={overview}
            segmentsTitle={tBp("headings.segments")}
            segments={segments}
            competitionTitle={tBp("headings.competition")}
            competitors={competitors}
            swotTitle={tBp("headings.swot")}
            {...(swot ? { swot } : {})}
            {...(mc?.positioning ? { positioning: mc.positioning as string } : {})}
            competitorsHeaders={[
              tBp("tables.headers.name"),
              tBp("tables.headers.focus"),
              tBp("tables.headers.strengths"),
              tBp("tables.headers.weaknesses"),
            ]}
            competitionMatrixTitle={tBp("headings.competitionMatrix")}
            competitionMatrix={(mc?.competitionMatrix as { x: number; y: number; label?: string; color?: string; size?: number; emphasis?: boolean }[]) ?? []}
            radarTitle={tBp("headings.capabilitiesRadar")}
            radarAxes={(() => {
              const axes = (mc as Record<string, unknown>)?.radarAxes as string[] | undefined;
              return Array.isArray(axes) && axes.length > 0 ? axes : ["Innovation","EU Focus","Ecosystem","Safety","Scalability","Cost"];
            })()}
            radarSeries={(() => {
              const series = (mc as Record<string, unknown>)?.radarSeries as { name: string; color?: string; values: number[] }[] | undefined;
              return Array.isArray(series) && series.length > 0
                ? series
                : [
                  { name: "SigmaCode AI", color: "#ef4444", values: [9,9,8,8,8,7] },
                  { name: "Competitor A", color: "#3b82f6", values: [8,6,6,6,7,7] },
                ];
            })()}
            competitionXAxisLabel={tBp("labels.innovationTech")}
            competitionYAxisLabel={tBp("labels.euFocusPrivacy")}
            />
        );
      })()}

      {/* Entfernt: äußerer motion.div-Wrapper */}
      <TechnologyChapter
        id="technology"
        title={titled("technology", tBp("sections.technology"))}
        stack={(m("content").technology?.stack as string[]) ?? []}
        roadmap={(m("content").technology?.roadmap as string[]) ?? []}
        timelinePhases={Array.isArray(m("content").technology?.timelinePhases)
          ? (m("content").technology?.timelinePhases as { period: string; items: string[] }[])
          : []}
        workPackages={Array.isArray(m("content").technology?.workPackages)
          ? (m("content").technology?.workPackages as { id?: string; name: string; timeline: string; deliverables?: string[] }[])
          : []}
        headings={{
          stack: tBp("headings.stack"),
          roadmap: tBp("headings.roadmap"),
          timeline: tBp("headings.timeline"),
          workPackages: tBp("headings.workPackages"),
        }}
        safetyCompliancePoints={(() => {
          const pts = (m("content").technology?.safetyCompliancePoints as string[] | undefined);
          return Array.isArray(pts) ? pts : [];
        })()}
        standardsList={(() => {
          const lst = (m("content").technology?.standardsList as string[] | undefined);
          return Array.isArray(lst) ? lst : [];
        })()}
      />


      {/* State of the Art – Unterabschnitt von Technologie */}
      {Array.isArray(m("content").stateOfTheArt?.points) && (m("content").stateOfTheArt?.points as string[]).length > 0 && (
        <Chapter
          id="stateOfTheArt"
          title={titled("stateOfTheArt", tBp("sections.stateOfTheArt"))}
          avoidBreakInside
          variant="scaleIn"
          headingVariant="fadeInUp"
          contentVariant="fadeIn"
        >
          {/* Kernpunkte des SoA */}
          <ul className="list-none pl-0">
            {(m("content").stateOfTheArt?.points as string[]).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>

          {/* TRL & Vergleich */}
          {(() => {
            const soa = m("content").stateOfTheArt ?? {};
            const trl = (soa?.trl as { today?: string | number; target?: string | number }) ?? undefined;
            const todayVal = (trl?.today ?? 3) as string | number;
            const targetVal = (trl?.target ?? "7–8") as string | number;
            const compare = (soa?.compare as [string, string, string][]) ?? [];
            const hasCompare = Array.isArray(compare) && compare.length > 0;
            return (
              <div className="mt-8 md:mt-10 grid gap-6 md:grid-cols-2 place-items-center text-center pb-8 md:pb-10">
                {/* TRL Karte */}
                <div className="rounded-2xl bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur p-6 shadow-sm ring-1 ring-[--color-border-subtle]">
                  <div className="text-xs text-[--color-foreground-muted]">{tBp("headings.trl") as string}</div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[--color-muted]/30 p-4 ring-1 ring-[--color-border-subtle]">
                      <div className="text-xs text-[--color-foreground-muted]">{tBp("labels.today") as string}</div>
                      <div className="text-2xl font-semibold">{todayVal}</div>
                    </div>
                    <div className="rounded-xl bg-[--color-muted]/30 p-4 ring-1 ring-[--color-border-subtle]">
                      <div className="text-xs text-[--color-foreground-muted]">{tBp("labels.target") as string}</div>
                      <div className="text-2xl font-semibold">{targetVal}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-[--color-foreground-muted]">{tBp("notes.trlNote") as string}</p>
                </div>

                {/* Vergleich SoA vs. Unser Ansatz */}
                {hasCompare && (
                  <div className="overflow-auto rounded-2xl bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur p-5 md:p-6 shadow-sm ring-1 ring-[--color-border-subtle] max-w-3xl w-full mx-auto">
                    <div className="text-sm font-semibold mb-3 text-center">{tBp("headings.soaVsUs") as string}</div>
                    <table className="w-full text-sm text-left">
                      <thead className="bg-[--color-muted]/40">
                        <tr>
                          <th className="px-3 py-2 text-left">{tBp("tables.headers.name") as string}</th>
                          <th className="px-3 py-2 text-left">{tBp("labels.soa") as string}</th>
                          <th className="px-3 py-2 text-left">{tBp("labels.ours") as string}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compare.map((row, i) => {
                          const label = String(row[0] ?? "");
                          const key = label.toLowerCase();
                          const Icon = (() => {
                            if (key.startsWith("locomotion")) return Footprints;
                            if (key.startsWith("manipulation")) return Hand;
                            if (key.startsWith("perzeption") || key.startsWith("perception")) return Eye;
                            if (key.startsWith("deployment")) return Rocket;
                            if (key.startsWith("safety") || key.includes("hri")) return Shield;
                            if (key.startsWith("plattform") || key.startsWith("platform")) return Package;
                            return Activity;
                          })();
                          const badgeColor = (() => {
                            if (Icon === Footprints) return "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20";
                            if (Icon === Hand) return "bg-amber-500/15 text-amber-600 ring-amber-500/20";
                            if (Icon === Eye) return "bg-sky-500/15 text-sky-600 ring-sky-500/20";
                            if (Icon === Rocket) return "bg-fuchsia-500/15 text-fuchsia-600 ring-fuchsia-500/20";
                            if (Icon === Shield) return "bg-teal-500/15 text-teal-600 ring-teal-500/20";
                            if (Icon === Package) return "bg-indigo-500/15 text-indigo-600 ring-indigo-500/20";
                            return "bg-slate-500/15 text-slate-600 ring-slate-500/20";
                          })();
                          return (
                            <tr key={i} className="odd:bg-[--color-surface] even:bg-[--color-muted]/20">
                              <td className="px-3 py-2">
                                <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badgeColor}`}>
                                  <Icon aria-hidden className="h-3.5 w-3.5" />
                                  <span className="truncate max-w-[12rem]" title={label}>{label}</span>
                                </span>
                              </td>
                              <td className="px-3 py-2">{row[1]}</td>
                              <td className="px-3 py-2">{row[2]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Referenzen */}
          {(() => {
            const refs = (m("content").stateOfTheArt?.references as string[]) ?? (m("content").appendix?.references as string[]) ?? [];
            if (!Array.isArray(refs) || refs.length === 0) return null;
            return (
              <div className="mt-8 md:mt-10 max-w-3xl mx-auto rounded-2xl bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur p-5 md:p-6 shadow-sm ring-1 ring-[--color-border-subtle]">
                <h3 className="font-semibold text-center">{tBp("headings.references") as string}</h3>
                <ol className="mt-3 list-decimal pl-6 space-y-1 text-sm">
                  {refs.map((r, i) => {
                    const urlMatch = typeof r === 'string' ? r.match(/https?:\/\/[^\s)]+/i) : null;
                    const url = urlMatch ? urlMatch[0] : undefined;
                    return (
                      <li key={i} className="break-words">
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" title={String(r)} className="inline-flex items-start gap-1 underline underline-offset-4">
                            <ExternalLink aria-hidden className="h-3.5 w-3.5 mt-0.5" />
                            <span>{r}</span>
                          </a>
                        ) : (
                          <span title={String(r)}>{r}</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })()}
        </Chapter>
      )}

      {/* Innovation – Unterabschnitt von Technologie */}
      {(() => {
        const inv = m("content").innovation ?? {};
        const goals = (inv?.goals as string[]) ?? [];
        const methods = (inv?.methods as string[]) ?? [];
        if (!goals.length && !methods.length) return null;
        return (
          <Chapter
            id="innovation"
            title={titled("innovation", tBp("sections.innovation"))}
            avoidBreakInside
            variant="fadeInUp"
            headingVariant="fadeInUp"
            contentVariant="fadeIn"
          >
            {goals.length > 0 && (
              <div>
                <h3 className="font-semibold">{tBp("headings.goals") as string}</h3>
                <ul className="list-none pl-0">{goals.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
            {methods.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">{tBp("headings.methods") as string}</h3>
                <ul className="list-none pl-0">{methods.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
          </Chapter>
        );
      })()}

      {/* IP & Moat – Unterabschnitt von Technologie */}
      {Array.isArray(m("content").ipMoat?.items) && (m("content").ipMoat?.items as string[]).length > 0 && (
        <Chapter
          id="ipMoat"
          title={titled("ipMoat", tBp("sections.ipMoat"))}
          avoidBreakInside
          variant="fadeInUp"
          headingVariant="fadeInUp"
          contentVariant="fadeIn"
        >
          <ul className="list-none pl-0">
            {(m("content").ipMoat?.items as string[]).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Chapter>
      )}

      

      <GTMChapter
        id="gtm"
        title={titled("gtm", tBp("sections.gtm"))}
        phasesTitle={tBp("headings.phases") as string}
        phases={(m("content").gtm?.phases as { name: string; items?: string[] }[]) ?? []}
        tacticsTitle={tBp("headings.tactics") as string}
        tactics={(m("content").gtm?.tactics as string[]) ?? []}
        kpisTitle={tBp("headings.kpis") as string}
        kpis={(m("content").gtm?.kpis as string[]) ?? []}
        funnelTitle={tBp("headings.funnel") as string}
        funnelStages={(() => {
          const stages = (m("content").gtm?.funnel as { label: string; value: number; color?: string }[]) ?? [
            { label: "Visitors", value: 10000 },
            { label: "Leads", value: 1800 },
            { label: "SQLs", value: 600 },
            { label: "Customers", value: 120 },
          ];
          return stages;
        })()}
        funnelValueFormatter={formatInteger(locale)}
        channelMixTitle={tBp("headings.channelMix") as string}
        channelMix={(() => {
          // Hole die Channel Mix Daten aus gtm.ts
          const channelData = m("content").gtm?.channelMix as Array<{ channel: string; share: number; metrics?: string[]; notes?: string }> | undefined;
          
          if (!Array.isArray(channelData) || channelData.length === 0) {
            return undefined; // Keine Daten verfügbar
          }

          // Erstelle Labels für 6 Monate
          const labels = ["M1", "M2", "M3", "M4", "M5", "M6"];
          
          // Farbpalette für die Kanäle
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#06b6d4"];
          
          // Transformiere die Channel-Daten zu Zeitreihen
          const series = channelData.map((channel, index) => {
            const baseShare = channel.share;
            // Simuliere realistische Wachstumskurven für jeden Kanal
            const growthPattern = (() => {
              switch (channel.channel) {
                case "Allianzen (OEM/Integrator)":
                case "Alliances (OEM/integrator)":
                  // Langsamer Start, dann starkes Wachstum
                  return [0.3, 0.5, 0.7, 0.85, 0.95, 1.0];
                case "Design‑Partner/Direct":
                case "Design partners/direct":
                  // Früher Start, dann Stabilisierung
                  return [0.8, 0.9, 0.95, 1.0, 1.0, 0.95];
                case "Developer/Marketplace":
                case "Developer/marketplace":
                  // Exponentielles Wachstum
                  return [0.1, 0.2, 0.4, 0.6, 0.8, 1.0];
                case "Events & Demos":
                  // Saisonale Schwankungen
                  return [0.6, 0.8, 1.0, 0.7, 0.9, 1.0];
                case "Content/SEO/Community":
                  // Lineares Wachstum
                  return [0.4, 0.5, 0.6, 0.7, 0.8, 1.0];
                default:
                  // Standard lineares Wachstum
                  return [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
              }
            })();
            
            const values = growthPattern.map(factor => Math.round(baseShare * factor * 10) / 10);
            
            return {
              name: channel.channel.replace(/‑/g, '-'), // Normalisiere Bindestriche
              color: colors[index % colors.length],
              values: values
            };
          });

          return { labels, series };
        })()}
      />

      {(() => {
        // Traction & KPIs (Kapitel 14) – direkt nach GTM platzieren
        try {
          const bm = (m("content").businessModel ?? {}) as Record<string, unknown>;
          const kpis = (bm?.kpis as { labels?: Record<string, string>; values?: Record<string, number>; deltas?: Record<string, number>; units?: Record<string, string> } | undefined) ?? undefined;
          const labels = (kpis?.labels as Record<string, string> | undefined) ?? {};
          const values = (kpis?.values as Record<string, number> | undefined) ?? {};
          const deltas = (kpis?.deltas as Record<string, number> | undefined) ?? {};
          const units = (kpis?.units as Record<string, string> | undefined) ?? {};
          const makeItem = (
            key: string,
            fallbackLabel: string,
            fallbackValue: number,
            fallbackUnit?: string,
            fallbackDelta?: number
          ) => {
            const label = labels?.[key] ?? fallbackLabel;
            const value = typeof values?.[key] === "number" ? (values![key] as number) : fallbackValue;
            const unitVal = (units?.[key] as string | undefined) ?? fallbackUnit;
            const deltaVal = typeof deltas?.[key] === "number" ? (deltas![key] as number) : fallbackDelta;
            return {
              label,
              value,
              ...(unitVal !== undefined ? { unit: unitVal } : {}),
              ...(deltaVal !== undefined ? { delta: deltaVal } : {}),
            } as { label: string; value: number; unit?: string; delta?: number };
          };
          const items = [
            makeItem("arpa", "ARPA", 1200, locale.startsWith("de") ? " €" : "€"),
            makeItem("expansion", locale.startsWith("de") ? "Expansion" : "Expansion", 18, "%", 2.5),
            makeItem("nrr", "NRR", 112, "%", 1.8),
          ];

          // Optionaler Trend (Sparkline) und mehrere Trend-Serien
          const trendsRoot = (bm?.trends as Record<string, unknown> | undefined) ?? undefined;
          const trendArpa = Array.isArray((trendsRoot as Record<string, unknown>)?.arpa)
            ? (((trendsRoot as Record<string, unknown>)?.arpa as unknown[]) as number[])
            : undefined;
          const seriesCandidates: { key: string; label: string; color?: string }[] = [
            { key: 'arpa', label: 'ARPA' },
            { key: 'activation30', label: locale.startsWith('de') ? 'Activation 30T' : 'Activation 30d' },
            { key: 'activation60', label: locale.startsWith('de') ? 'Activation 60T' : 'Activation 60d' },
            { key: 'activation90', label: locale.startsWith('de') ? 'Activation 90T' : 'Activation 90d' },
            { key: 'retention90', label: locale.startsWith('de') ? 'Retention 90T' : 'Retention 90d' },
          ];
          const trendsSeries = seriesCandidates
            .map((c) => {
              const arr = Array.isArray((trendsRoot as Record<string, unknown>)?.[c.key])
                ? ((((trendsRoot as Record<string, unknown>)?.[c.key] as unknown[]) as number[]))
                : undefined;
              return Array.isArray(arr) && arr.length > 0 ? { name: c.label, data: arr, ...(c.color ? { color: c.color } : {}) } : undefined;
            })
            .filter(Boolean) as { name: string; data: number[]; color?: string }[];

          // Narrative Inhalte für Kapitel 9
          const tk = (m("content").tractionKpis as Record<string, unknown> | undefined) ?? undefined;
          const highlights = Array.isArray((tk as any)?.highlights) ? ((tk as any).highlights as string[]) : undefined;
          const kpisExplain = Array.isArray((tk as any)?.kpisExplain) ? ((tk as any).kpisExplain as string[]) : undefined;
          const methodology = Array.isArray((tk as any)?.methodology) ? ((tk as any).methodology as string[]) : undefined;
          const evidence = Array.isArray((tk as any)?.evidence) ? ((tk as any).evidence as string[]) : undefined;
          const deliverables = Array.isArray((tk as any)?.deliverables) ? ((tk as any).deliverables as string[]) : undefined;

          // Benchmarks (SoA vs. Unser Ansatz) aus StateOfTheArt übernehmen
          const soa = (m('content').stateOfTheArt as Record<string, unknown> | undefined) ?? undefined;
          const compareRows = Array.isArray((soa as any)?.compare)
            ? (((soa as any).compare as (string | number)[][]))
            : undefined;
          const benchmarks = compareRows && compareRows.length > 0
            ? {
                title: locale.startsWith('de') ? 'Benchmarks (SoA vs. Unser Ansatz)' : 'Benchmarks (SoA vs. Our Approach)',
                headers: locale.startsWith('de')
                  ? ['Metrik', 'SoA', 'Unser Ansatz', 'Ziel']
                  : ['Metric', 'SoA', 'Our Approach', 'Target'],
                rows: compareRows,
              }
            : undefined;

          return (
            <TractionKPIsChapter
              id="tractionKpis"
              title={titled("tractionKpis", tBp("sections.tractionKpis"))}
              kpis={items}
              {...(trendsSeries && trendsSeries.length > 0 ? { trendsSeries } : (trendArpa && trendArpa.length > 0 ? { trends: trendArpa } : {}))}
              {...(highlights ? { highlights } : {})}
              {...(kpisExplain ? { kpisExplain } : {})}
              {...(methodology ? { methodology } : {})}
              {...(evidence ? { evidence } : {})}
              {...(deliverables ? { deliverables } : {})}
              {...(benchmarks ? { benchmarks } : {})}
              captions={{
                kpis: locale.startsWith("de")
                  ? "Kernmetriken für Traktion und Monetarisierung (ARPA, Expansion, NRR)."
                  : "Core traction and monetization metrics (ARPA, Expansion, NRR).",
                trends: locale.startsWith("de")
                  ? "Trends: ARPA sowie Aktivierung/Retention je Kohorte als schnelle visuelle Indikatoren."
                  : "Trends: ARPA plus activation/retention cohorts as quick visual indicators.",
              }}
            />
          );
        } catch {
          return null;
        }
      })()}

      {(() => {
        const descScenarios = tBp("figures.scenariosDescription") as string;
        const descRunway = tBp("figures.runwayDescription") as string;
        const descCapexOpex = tBp("figures.capexOpexDescription") as string;
        const descTotals = tBp("figures.totalsDescription") as string;
        const descRevenue = tBp("figures.revenueDescription") as string;
        const descEbitda = tBp("figures.ebitdaDescription") as string;
        const descBreakEven = tBp("figures.breakEvenDescription") as string;
        const descRevVsCost = tBp("figures.revenueVsCostDescription") as string;
        const descRevComp = tBp("figures.revenueCompositionDescription") as string;
        const descProfitBridge = tBp("figures.profitBridgeDescription") as string;
        const descCashFlow = tBp("figures.cashFlowDescription") as string;
        return (
      <>
      {/* Finance: kompakter Stat-Strip vor dem Kapitel */}
      <div className="container-gutter">
        <div className="reading-max">
          <div className="not-prose mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: locale.startsWith('de') ? 'Runway' : 'Runway',
                value: locale.startsWith('de') ? '18–24 Monate' : '18–24 months',
                sub: locale.startsWith('de') ? 'bei Base‑Szenario' : 'at base scenario',
                Icon: PiggyBank,
              },
              {
                label: locale.startsWith('de') ? 'Break‑even' : 'Break‑even',
                value: '2028',
                sub: locale.startsWith('de') ? 'Plan' : 'plan',
                Icon: CalendarCheck2,
              },
              {
                label: 'EBITDA',
                value: locale.startsWith('de') ? '~€0.4 Mio.' : '~€0.4M',
                sub: locale.startsWith('de') ? 'Ziel 2029' : 'target 2029',
                Icon: PercentDiamond,
              },
              {
                label: tBp('headings.financing', { defaultMessage: 'Financing' }) as string,
                value: locale.startsWith('de') ? 'Seed/FFG' : 'Seed/Grants',
                sub: locale.startsWith('de') ? 'Mischfinanzierung' : 'hybrid financing',
                Icon: Landmark,
              },
            ].map((s, i) => (
              <div key={`${String(s.label)}-${i}`} className="rounded-lg p-3 pb-4 md:pb-5 bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm ring-1 ring-[--color-border-subtle]">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium tracking-wide text-[--color-foreground-muted]">{s.label}</div>
                  <s.Icon aria-hidden className="h-4 w-4 text-[--color-foreground-muted]" />
                </div>
                <div className="mt-0.5 text-2xl font-semibold tracking-tight text-[--color-foreground] text-center">{s.value}</div>
                <div className="text-xs text-[--color-foreground-muted] text-center">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FinanceChapter
        id="finance"
        title={titled("finance", tBp("sections.finance", { defaultMessage: "Finance" }))}
        summary={(m("content").finance?.summary as string[]) ?? []}
        unitEconomicsTitle={tBp("headings.unitEconomics", { defaultMessage: "Unit Economics" }) as string}
        useOfFundsTitle={tBp("headings.useOfFunds", { defaultMessage: "Use of Funds" }) as string}
        useOfFundsCaption={tBp("tables.captions.useOfFundsY1", { defaultMessage: "Use of Funds Year 1" }) as string}
        useOfFundsHeaders={[tBp("tables.headers.category", { defaultMessage: "Category" }) as string, tBp("tables.headers.amount", { defaultMessage: "Amount" }) as string, tBp("tables.headers.share", { defaultMessage: "Share" }) as string]}
        useOfFundsRows={[
          ["R&D", 420000, "42%"],
          ["Go-To-Market", 260000, "26%"],
          ["Hardware", 160000, "16%"],
          ["Operations", 110000, "11%"],
          ["Compliance", 50000, "5%"],
        ]}
        fundingStrategyTitle={tBp("headings.fundingStrategy", { defaultMessage: "Funding Strategy" }) as string}
        fundingStrategy={(m("content").finance?.fundingStrategy as string[]) ?? []}
        scenariosTitle={tBp("headings.projections", { defaultMessage: "Projections" }) as string}
        {...(descScenarios ? { scenariosDescription: descScenarios } : {})}
        scenariosHeaders={projScenariosHeaders ?? [tBp("tables.headers.year", { defaultMessage: "Year" }) as string, "Base", "Bull", "Bear"]}
        scenariosRows={projScenariosRows}
        runwayTitle={tBp("headings.runway", { defaultMessage: "Runway" }) as string}
        {...(descRunway ? { runwayDescription: descRunway } : {})}
        runwayHeaders={[tBp("tables.headers.name", { defaultMessage: "Name" }) as string, tBp("tables.headers.amount", { defaultMessage: "Amount" }) as string]}
        runwayRows={((m("content").finance?.runway as [string, number][]) ?? []).map((r) => [r[0], r[1]])}
        plOverviewTitle={tBp("headings.plOverview", { defaultMessage: "P&L Overview" }) as string}
        plHeaders={[tBp("tables.headers.quarter", { defaultMessage: "Quarter" }) as string, tBp("tables.headers.revenue", { defaultMessage: "Revenue" }) as string, tBp("tables.headers.cogs", { defaultMessage: "COGS" }) as string, tBp("tables.headers.grossProfit", { defaultMessage: "Gross Profit" }) as string, tBp("tables.headers.opex", { defaultMessage: "OPEX" }) as string, tBp("tables.headers.ebitda", { defaultMessage: "EBITDA" }) as string]}
        plRows={[["Q1", "€120k", "€30k", "€90k", "€70k", "€20k"],["Q2", "€180k", "€45k", "€135k", "€90k", "€45k"],["Q3", "€250k", "€62k", "€188k", "€110k", "€78k"],["Q4", "€340k", "€85k", "€255k", "€145k", "€110k"]]}
        detailedPersonnelHeaders={[tBp("tables.headers.year", { defaultMessage: "Year" }) as string, tBp("tables.headers.amount", { defaultMessage: "Amount" }) as string]}
        detailedPersonnelRows={((m("content").financePlanDetailed?.personnel as [number | string, number | string][]) ?? []).map((r) => [r[0], r[1]])}
        capexOpexHeaders={capexOpexSingleHeaders ?? [tBp("tables.headers.year", { defaultMessage: "Year" }) as string, tBp("tables.headers.amount", { defaultMessage: "Amount" }) as string]}
        {...(capexOpexBreakdownData ? { capexOpexBreakdown: capexOpexBreakdownData } : {})}
        {...(capexOpexBreakdownData && descCapexOpex ? { capexOpexDescription: descCapexOpex } : {})}
        {...(capexOpexSingleRows ? { capexOpexRows: capexOpexSingleRows } : {})}
        {...(capexOpexSingleRows ? { capexOpexSingleTitle: tBp("headings.capexOpex", { defaultMessage: "CAPEX/OPEX" }) as string } : {})}
        {...(totalsRowsData ? { totalsRows: totalsRowsData } : {})}
        {...(totalsTitleMsg ? { totalsTitle: totalsTitleMsg } : {})}
        {...(totalsHeadersMsg ? { totalsHeaders: totalsHeadersMsg } : {})}
        {...(totalsRowsData && descTotals ? { totalsDescription: descTotals } : {})}
        {...(revenueRowsData ? { revenueRows: revenueRowsData } : {})}
        {...(revenueTitleMsg ? { revenueTitle: revenueTitleMsg } : {})}
        {...(revenueHeadersMsg ? { revenueHeaders: revenueHeadersMsg } : {})}
        {...(revenueRowsData && descRevenue ? { revenueDescription: descRevenue } : {})}
        {...(ebitdaRowsData ? { ebitdaRows: ebitdaRowsData } : {})}
        {...(ebitdaTitleMsg ? { ebitdaTitle: ebitdaTitleMsg } : {})}
        {...(ebitdaHeadersMsg ? { ebitdaHeaders: ebitdaHeadersMsg } : {})}
        {...(ebitdaRowsData && descEbitda ? { ebitdaDescription: descEbitda } : {})}
        breakEvenTitle={(tBp("headings.breakEven", { defaultMessage: "Break-even" }) as string) || "Break-even"}
        breakEvenData={breakEvenData}
        {...(descBreakEven ? { breakEvenDescription: descBreakEven } : {})}
        revenueVsCostTitle={(tBp("headings.revenueVsCost", { defaultMessage: "Revenue vs. Cost" }) as string) || "Revenue vs. Cost"}
        revenueVsCost={revenueVsCost}
        {...(descRevVsCost ? { revenueVsCostDescription: descRevVsCost } : {})}
        revenueCompositionTitle={(tBp("headings.revenueComposition", { defaultMessage: "Revenue Composition" }) as string) || "Revenue Composition"}
        revenueComposition={revenueComposition}
        {...(descRevComp ? { revenueCompositionDescription: descRevComp } : {})}
        profitBridgeTitle={(tBp("headings.profitBridge", { defaultMessage: "Profit Bridge" }) as string) || "Profit Bridge"}
        profitBridgeSteps={profitBridgeSteps}
        {...(descProfitBridge ? { profitBridgeDescription: descProfitBridge } : {})}
        cashFlowTitle={(tBp("headings.cashFlow", { defaultMessage: "Cash Flow" }) as string) || "Cash Flow"}
        cashFlowSeries={{ operating: cfOperating, investing: cfInvesting, financing: cfFinancing }}
        cashFlowLabels={{
          operating: (tBp("labels.operating", { defaultMessage: "Operating" }) as string) || "Operating",
          investing: (tBp("labels.investing", { defaultMessage: "Investing" }) as string) || "Investing",
          financing: (tBp("labels.financing", { defaultMessage: "Financing" }) as string) || "Financing",
        }}
        {...(descCashFlow ? { cashFlowDescription: descCashFlow } : {})}
      />
      </>
        );
      })()}

      {(() => {
        const byYear = m("content").costPlan?.budgetByYear as { title?: string; headers?: (string | number)[]; rows?: (string | number)[][] } | undefined;
        const byYearTitle = (byYear?.title as string) ?? undefined;
        const byYearHeaders = (byYear?.headers as (string | number)[]) ?? undefined;
        const byYearRows = Array.isArray(byYear?.rows) ? (byYear?.rows as (string | number)[][]) : undefined;
        const simpleRows = ((m("content").costPlan?.budgetRows as [string | number, string | number, string | number][]) ?? []).map((r) => [r[0], r[1], r[2]]);
        const capexOpex = m("content").costPlan?.capexOpex as { title?: string; headers?: (string | number)[]; rows?: (string | number)[][] } | undefined;
        const capexOpexTitle = (capexOpex?.title as string) ?? undefined;
        const capexOpexHeaders = (capexOpex?.headers as (string | number)[]) ?? undefined;
        const capexOpexRows = Array.isArray(capexOpex?.rows) ? (capexOpex?.rows as (string | number)[][]) : undefined;
        return (
          <CostPlanChapter
            id="costPlan"
            title={titled("costPlan", tBp("sections.costPlan", { defaultMessage: "Cost Plan" }))}
            headers={[tBp("tables.headers.category", { defaultMessage: "Category" }) as string, tBp("tables.headers.amount", { defaultMessage: "Amount" }) as string, tBp("tables.headers.share", { defaultMessage: "Share" }) as string]}
            rows={simpleRows}
            {...(byYearTitle ? { byYearTitle } : {})}
            {...(byYearHeaders ? { byYearHeaders } : {})}
            {...(byYearRows ? { byYearRows } : {})}
            {...(capexOpexTitle ? { capexOpexTitle } : {})}
            {...(capexOpexHeaders ? { capexOpexHeaders } : {})}
            {...(capexOpexRows ? { capexOpexRows } : {})}
          />
        );
      })()}

      <CapTableChapter
        id="capTable"
        title={titled("capTable", tBp("sections.capTable", { defaultMessage: "Cap Table" }))}
        currentTitle={tBp("headings.capTableCurrent", { defaultMessage: "Current ownership" }) as string}
        current={(m("content").capTable?.current as [string, string][]) ?? []}
        postTitle={tBp("headings.capTablePostRound", { defaultMessage: "Post-round ownership" }) as string}
        post={(m("content").capTable?.postRound as [string, string][]) ?? []}
        headers={[tBp("tables.headers.name", { defaultMessage: "Name" }) as string, tBp("tables.headers.share", { defaultMessage: "Share" }) as string]}
      />

      

      {/* Risks: kompakter Stat-Strip über dem Kapitel */}
      <div className="container-gutter">
        <div className="reading-max">
          {(() => {
            try {
              const risks = (m("content").risks?.list as string[]) ?? [];
              const mitigation = (m("content").risks?.mitigation as string[]) ?? [];
              const exposure = locale.startsWith('de') ? 'mittel' : 'medium';
              const coverage = Math.min(100, Math.round((mitigation.length / Math.max(1, risks.length)) * 100));
              const items = [
                { label: tBp('sections.risks', { defaultMessage: 'Risks' }) as string, value: (risks.length || 6) + '', sub: locale.startsWith('de') ? 'gesamt' : 'total', Icon: AlertTriangle },
                { label: tBp('headings.mitigation', { defaultMessage: 'Mitigation' }) as string, value: (mitigation.length || 5) + '', sub: locale.startsWith('de') ? 'Maßnahmen' : 'actions', Icon: ShieldAlert },
                { label: tBp('labels.exposure', { defaultMessage: 'Exposure' }) as string, value: exposure, sub: locale.startsWith('de') ? 'aggregiert' : 'aggregate', Icon: Activity },
                { label: tBp('labels.coverage', { defaultMessage: 'Coverage' }) as string, value: `${coverage}%`, sub: locale.startsWith('de') ? 'Risiko‑Abdeckung' : 'risk coverage', Icon: TrendingUp },
              ];
              return (
                <div className="not-prose mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((s, i) => (
                    <div key={`${String(s.label)}-${i}`} className="rounded-lg p-3 pb-4 md:pb-5 bg-[--color-surface]/70 supports-[backdrop-filter]:backdrop-blur-sm shadow-sm ring-1 ring-[--color-border-subtle] transition-all duration-200 hover:-translate-y-0.5 hover:ring-[--color-border] hover:bg-[--color-surface]/80">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium tracking-wide text-[--color-foreground-muted]">{s.label}</div>
                        <s.Icon aria-hidden className="h-4 w-4 text-[--color-foreground-muted]" />
                      </div>
                      <div className="mt-0.5 text-2xl font-semibold tracking-tight text-[--color-foreground] text-center">{s.value}</div>
                      <div className="text-xs text-[--color-foreground-muted] text-center">{s.sub}</div>
                    </div>
                  ))}
                </div>
              );
            } catch {
              return null;
            }
          })()}
        </div>
      </div>

      <RisksChapter
        id="risks"
        title={titled("risks", tBp("sections.risks", { defaultMessage: "Risks" }))}
        risksTitle={tBp("headings.risks", { defaultMessage: "Risks" }) as string}
        risks={(m("content").risks?.list as string[]) ?? []}
        mitigationTitle={tBp("headings.mitigation", { defaultMessage: "Mitigation" }) as string}
        mitigation={(m("content").risks?.mitigation as string[]) ?? []}
        matrixTitle={tBp("headings.riskMatrix", { defaultMessage: "Risk matrix" }) as string}
        {
          ...(() => {
            const add = (m("content").risks?.additional as Record<string, string> | undefined) ?? undefined;
            return add ? { additional: add } : {};
          })()
        }
      />

      <DisseminationChapter
        id="dissemination"
        title={titled("dissemination", tBp("sections.dissemination", { defaultMessage: "Dissemination" }))}
        items={(m("content").dissemination?.items as string[]) ?? []}
      />

      <ImpactChapter
        id="impact"
        title={titled("impact", tBp("sections.impact", { defaultMessage: "Impact & Sustainability" }))}
        intro={(m("content").impact?.intro as string[]) ?? []}
        headings={{
          societal: tBp("impactHeadings.societal", { defaultMessage: "Societal" }) as string,
          economic: tBp("impactHeadings.economic", { defaultMessage: "Economic" }) as string,
          environmental: tBp("impactHeadings.environmental", { defaultMessage: "Environmental" }) as string,
          policy: tBp("impactHeadings.policy", { defaultMessage: "Policy" }) as string,
          sustainability: tBp("impactHeadings.sustainability", { defaultMessage: "Sustainability" }) as string,
        }}
        societal={(m("content").impact?.societal as string[]) ?? []}
        economic={(m("content").impact?.economic as string[]) ?? []}
        environmental={(m("content").impact?.environmental as string[]) ?? []}
        policy={(m("content").impact?.policy as string[]) ?? []}
        sustainability={(m("content").impact?.sustainability as string[]) ?? []}
      />

      <ComplianceChapter
        id="compliance"
        title={titled("compliance", tBp("sections.compliance", { defaultMessage: "Compliance" }))}
        awsTitle={tBp("headings.aws", { defaultMessage: "AWS" }) as string}
        aws={(m("content").compliance?.aws as string[]) ?? []}
        privacyTitle={tBp("headings.privacy", { defaultMessage: "Privacy" }) as string}
        privacy={(m("content").compliance?.privacy as string[]) ?? []}
        safetyTitle={tBp("headings.safety", { defaultMessage: "Safety" }) as string}
        safety={(m("content").compliance?.safety as string[]) ?? []}
        safetyStandardsTitle={tBp("headings.safetyStandards", { defaultMessage: "Safety Standards" }) as string}
        safetyStandards={(m("content").compliance?.safetyStandards as string[]) ?? []}
        aiActTitle={tBp("headings.aiAct", { defaultMessage: "AI Act" }) as string}
        aiAct={(m("content").compliance?.aiAct as string[]) ?? []}
        securityProgramTitle={tBp("headings.securityProgram", { defaultMessage: "Security Program" }) as string}
        securityProgram={(m("content").compliance?.securityProgram as string[]) ?? []}
      />

      {/* Responsible AI – als Unterabschnitt von Compliance */}
      {(() => {
        const rai = m("content").responsibleAI ?? {};
        const evals = (rai?.evals as string[]) ?? [];
        const redTeam = (rai?.redTeam as string[]) ?? [];
        const provenance = (rai?.provenance as string[]) ?? [];
        if (!evals.length && !redTeam.length && !provenance.length) return null;
        return (
          <Chapter
            id="responsibleAI"
            title={`${tBp("sections.compliance", { defaultMessage: "Compliance" }) as string}: ${tBp("sections.responsibleAI", { defaultMessage: "Responsible AI" }) as string}`}
            avoidBreakInside
            variant="fadeInUp"
            headingVariant="fadeInUp"
            contentVariant="fadeIn"
          >
            {evals.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">{tBp("headings.evaluations", { defaultMessage: "Evaluations" }) as string}</h3>
                <ul className="list-none pl-0">{evals.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
            {redTeam.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">{tBp("headings.redTeam", { defaultMessage: "Red Team" }) as string}</h3>
                <ul className="list-none pl-0">{redTeam.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
            {provenance.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">{tBp("headings.provenance", { defaultMessage: "Provenance" }) as string}</h3>
                <ul className="list-none pl-0">{provenance.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
          </Chapter>
        );
      })()}

      {/* MLOps & Operations zusammengeführt */}
      {(() => {
        const ml = m("content").mlops ?? {};
        const ops = m("content").operations ?? {};
        const stack = (ml?.stack as string[]) ?? [];
        const practices = (ml?.practices as string[]) ?? [];
        const slas = (ops?.slas as string[]) ?? [];
        if (!stack.length && !practices.length && !slas.length) return null;
        return (
          <Chapter
            id="operations"
            title={titled("operations", tBp("sections.operations", { defaultMessage: "Operations" }))}
            avoidBreakInside
            variant="fadeInUp"
            headingVariant="fadeInUp"
            contentVariant="fadeIn"
          >
            {stack.length > 0 && (
              <div id="operations-stack">
                <h3 className="font-semibold">{tBp("headings.stack", { defaultMessage: "Tech Stack" }) as string}</h3>
                <ul className="list-none pl-0">{stack.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
            {practices.length > 0 && (
              <div id="operations-practices" className="mt-4">
                <h3 className="font-semibold">{tBp("headings.practices", { defaultMessage: "Practices" }) as string}</h3>
                <ul className="list-none pl-0">{practices.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
            {slas.length > 0 && (
              <div id="operations-slas" className="mt-4">
                <h3 className="font-semibold">{tBp("headings.slas", { defaultMessage: "SLAs" }) as string}</h3>
                <ul className="list-none pl-0">{slas.map((x, i) => (<li key={i}>{x}</li>))}</ul>
              </div>
            )}
          </Chapter>
        );
      })()}

      <CTAChapter
        id="cta"
        title={titled("cta", tBp("sections.cta", { defaultMessage: "Next steps" }))}
        lines={(m("content").cta?.lines as string[]) ?? []}
      />

      <AppendixChapter
        id="appendix"
        title={titled("appendix", tBp("sections.appendix", { defaultMessage: "Appendix" }))}
        supportingTitle={tBp("headings.supportingDocs", { defaultMessage: "Supporting Documents" }) as string}
        supporting={(m("content").appendix?.supporting as string[]) ?? []}
        referencesTitle={tBp("headings.references", { defaultMessage: "References" }) as string}
        references={(m("content").appendix?.references as string[]) ?? []}
        legalTitle={tBp("headings.legal", { defaultMessage: "Legal" }) as string}
        legal={(m("content").appendix?.legal as string[]) ?? []}
        technicalTitle={tBp("headings.technical", { defaultMessage: "Technical" }) as string}
        technical={(m("content").appendix?.technical as string[]) ?? []}
      />
    </div>
  );
}
