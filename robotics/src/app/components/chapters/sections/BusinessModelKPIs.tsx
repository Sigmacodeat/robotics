"use client";
import {useMessages} from "next-intl";
import CountUp from "react-countup";
import {motion} from "framer-motion";
import Sparkline from "@charts/Sparkline";

export default function BusinessModelKPIs() {
  const messages = useMessages() as Record<string, unknown>;
  type KPIGroup = {
    labels?: Record<string, string>;
    values?: Record<string, number>;
    deltas?: Record<string, number>;
    units?: Record<string, string>;
  };
  const k = ((messages as any)?.content?.businessModel?.kpis ?? {}) as KPIGroup;
  const trends = ((messages as any)?.content?.businessModel?.trends ?? {}) as Record<string, number[]>;

  const items: Array<{ key: string; label: string; value: number; unit?: string; delta?: number; trend?: number[] }> = [
    {
      key: "arpa",
      label: k.labels?.arpa ?? "ARPA",
      value: k.values?.arpa ?? 0,
      ...(k.units?.arpa !== undefined ? { unit: k.units.arpa } : {}),
      ...(k.deltas?.arpa !== undefined ? { delta: k.deltas.arpa } : {}),
      ...(trends?.arpa !== undefined ? { trend: trends.arpa } : {}),
    },
    {
      key: "expansion",
      label: k.labels?.expansion ?? "Expansion",
      value: k.values?.expansion ?? 0,
      ...(k.units?.expansion !== undefined ? { unit: k.units.expansion } : {}),
      ...(k.deltas?.expansion !== undefined ? { delta: k.deltas.expansion } : {}),
    },
    {
      key: "nrr",
      label: k.labels?.nrr ?? "NRR",
      value: k.values?.nrr ?? 0,
      ...(k.units?.nrr !== undefined ? { unit: k.units.nrr } : {}),
      ...(k.deltas?.nrr !== undefined ? { delta: k.deltas.nrr } : {}),
      ...(trends?.nrr !== undefined ? { trend: trends.nrr } : {}),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:gap-2">
      {items.map((it) => {
        const isPositive = (it.delta ?? 0) >= 0;
        return (
          <motion.div
            key={it.key}
            className="rounded-md border border-[--color-border] p-4 bg-[--color-bg-elevated]"
            initial={{opacity: 0, y: 6}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            transition={{duration: 0.35, ease: "easeOut"}}
          >
            <div className="text-sm text-[--color-foreground-muted]">{it.label}</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {it.unit === "€" ? (
                <CountUp end={it.value} prefix="€ " duration={1.2} separator="," />
              ) : it.unit === "%" ? (
                <CountUp end={it.value} suffix="%" duration={1.2} decimals={0} />
              ) : (
                <CountUp end={it.value} duration={1.2} />
              )}
            </div>
            {typeof it.delta === "number" && (
              <div className={`mt-1 text-xs tabular-nums ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                {isPositive ? "▲" : "▼"} {Math.abs(it.delta)}% vs. last qtr
              </div>
            )}
            {Array.isArray(it.trend) && it.trend.length > 0 && (
              <div className="mt-3 text-[--color-foreground-muted]">
                <Sparkline data={it.trend} width={220} height={52} fill="currentColor" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
