"use client";
import {useMessages, useTranslations} from "next-intl";
import CountUp from "@/components/charts/CountUp";
import {motion} from "framer-motion";

type FinanceKpiGroup = {
  labels?: Record<string, string>;
  values?: Record<string, number>;
  deltas?: Record<string, number>;
  units?: Record<string, string>;
};

export default function FinanceKPIs() {
  const t = useTranslations();
  const messages = useMessages() as Record<string, unknown>;

  const kpis = ((messages as any)?.content?.finance?.kpis ?? {}) as FinanceKpiGroup;
  const labels = kpis.labels ?? {};
  const values = kpis.values ?? {};
  const deltas = kpis.deltas ?? {};
  const units = kpis.units ?? {};

  const items: Array<{ key: string; label: string; value: number; delta?: number; unit?: string; }>= [
    { key: "cac", label: labels.cac ?? "CAC", value: values.cac ?? 0, delta: deltas.cac, unit: units.cac },
    { key: "ltv", label: labels.ltv ?? "LTV", value: values.ltv ?? 0, delta: deltas.ltv, unit: units.ltv },
    { key: "payback", label: labels.payback ?? t("content.finance.kpis.labels.payback", { defaultMessage: "Payback" }), value: values.payback ?? 0, delta: deltas.payback, unit: units.payback },
    { key: "grossMargin", label: labels.grossMargin ?? t("content.finance.kpis.labels.grossMargin", { defaultMessage: "Gross Margin" }), value: values.grossMargin ?? 0, delta: deltas.grossMargin, unit: units.grossMargin },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
      {items.map((it) => {
        const isPositive = (it.delta ?? 0) >= 0;
        return (
          <motion.div
            key={it.key}
            className="rounded-md border border-[--color-border] p-3 md:p-4 bg-[--color-bg-elevated]"
            initial={{opacity: 0, y: 6}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            transition={{duration: 0.35, ease: "easeOut"}}
          >
            <div className="text-xs md:text-sm text-[--color-foreground-muted]">{it.label}</div>
            <div className="mt-1 text-2xl md:text-3xl font-semibold tabular-nums">
              {it.unit === "€" ? (
                <span>
                  <CountUp to={it.value} prefix="€ " durationMs={1100} />
                </span>
              ) : it.unit === "%" ? (
                <span>
                  <CountUp to={it.value} suffix="%" durationMs={1100} decimals={0} />
                </span>
              ) : it.unit === "mo" ? (
                <span>
                  <CountUp to={it.value} suffix=" mo" durationMs={1100} />
                </span>
              ) : (
                <span>
                  <CountUp to={it.value} durationMs={1100} />
                </span>
              )}
            </div>
            {typeof it.delta === "number" && (
              <div className={`mt-1 text-xs md:text-sm tabular-nums ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                {isPositive ? "▲" : "▼"} {Math.abs(it.delta)}% vs. last qtr
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
