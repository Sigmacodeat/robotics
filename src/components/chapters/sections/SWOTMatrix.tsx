"use client";
import React, { useId } from "react";
import { Plus, Minus, ShieldCheck, AlertTriangle, TrendingUp, AlertOctagon, ArrowUpRight, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export type SWOTData = {
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
};

type SWOTLabels = {
  strengths?: string;
  weaknesses?: string;
  opportunities?: string;
  threats?: string;
  none?: string;
};

interface SWOTMatrixProps {
  title?: string;
  data: SWOTData;
  labels?: SWOTLabels;
}

/**
 * Responsive 2x2 SWOT grid with accessible semantics.
 */
export default function SWOTMatrix({ title, data, labels }: SWOTMatrixProps) {
  const t = useTranslations();
  const { strengths = [], weaknesses = [], opportunities = [], threats = [] } = data ?? {};
  const hasAny = strengths.length + weaknesses.length + opportunities.length + threats.length > 0;
  if (!hasAny) return null;

  const Card = ({ heading, items, variant }: { heading: string; items: string[]; variant?: "positive" | "negative" | "opportunity" | "threat" }) => {
    const titleId = useId();
    const accentBorder =
      variant === "positive"
        ? "border-emerald-500/70"
        : variant === "negative"
        ? "border-rose-500/70"
        : variant === "opportunity"
        ? "border-amber-500/70"
        : variant === "threat"
        ? "border-orange-500/70"
        : "border-transparent";
    const bgTint =
      variant === "positive"
        ? "bg-emerald-500/5"
        : variant === "negative"
        ? "bg-rose-500/5"
        : variant === "opportunity"
        ? "bg-amber-500/5"
        : variant === "threat"
        ? "bg-orange-500/5"
        : "";
    // Header-Icons je Kategorie (anders als List-Icons)
    const icon =
      variant === "positive" ? (
        <span className="h-7 w-7 grid place-items-center flex-shrink-0">
          <ShieldCheck aria-hidden className="h-5 w-5 text-emerald-500" />
        </span>
      ) : variant === "negative" ? (
        <span className="h-7 w-7 grid place-items-center flex-shrink-0">
          <AlertTriangle aria-hidden className="h-5 w-5 text-rose-500" />
        </span>
      ) : variant === "opportunity" ? (
        <span className="h-7 w-7 grid place-items-center flex-shrink-0">
          <TrendingUp aria-hidden className="h-5 w-5 text-amber-500" />
        </span>
      ) : variant === "threat" ? (
        <span className="h-7 w-7 grid place-items-center flex-shrink-0">
          <AlertOctagon aria-hidden className="h-5 w-5 text-orange-500" />
        </span>
      ) : null;
    return (
      <section aria-labelledby={titleId} className={`card p-5 md:p-6 pb-7 md:pb-8 border-t-2 ${accentBorder} ${bgTint}`}>
        <div className="flex items-center gap-2.5 mb-3 md:mb-3.5">
          {icon}
          <h4 id={titleId} className="font-semibold">
            {heading}
          </h4>
        </div>
        {items.length > 0 ? (
          <ul className="pl-0 space-y-3 md:space-y-3 leading-relaxed">
            {items.map((it, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm md:text-[15px]">
                <span className="mt-[2px] h-6 w-6 flex-shrink-0 grid place-items-center">
                  {variant === "positive" ? (
                    <Plus aria-hidden className="h-5 w-5 text-emerald-500" />
                  ) : variant === "negative" ? (
                    <Minus aria-hidden className="h-5 w-5 text-rose-500" />
                  ) : variant === "opportunity" ? (
                    <ArrowUpRight aria-hidden className="h-5 w-5 text-amber-500" />
                  ) : variant === "threat" ? (
                    <AlertCircle aria-hidden className="h-5 w-5 text-orange-500" />
                  ) : null}
                </span>
                <span className="flex-1">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[--color-foreground-muted]">{t("common.none")}</p>
        )}
      </section>
    );
  };

  return (
    <div className="mt-6">
      {title ? <h3 className="font-semibold">{title}</h3> : null}
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {strengths.length > 0 && (
          <Card heading={labels?.strengths ?? "Strengths"} items={strengths} variant="positive" />
        )}
        {weaknesses.length > 0 && (
          <Card heading={labels?.weaknesses ?? "Weaknesses"} items={weaknesses} variant="negative" />
        )}
        {opportunities.length > 0 && (
          <Card heading={labels?.opportunities ?? "Opportunities"} items={opportunities} variant="opportunity" />
        )}
        {threats.length > 0 && (
          <Card heading={labels?.threats ?? "Threats"} items={threats} variant="threat" />
        )}
      </div>
    </div>
  );
}
