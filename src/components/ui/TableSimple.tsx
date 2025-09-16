"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { variantsMap, defaultTransition, defaultViewport, type VariantName } from "../animation/variants";

export type TableSimpleProps = {
  headers?: (string | number | null)[];
  // Hinweis: Aus Server Components sollten nur serialisierbare Werte (string | number | null) übergeben werden.
  // React-Elemente führen sonst zu Serialisierungsfehlern. Daher erlauben wir hier bewusst nur serielle Zellwerte.
  rows: Array<Array<string | number | null>>;
  caption?: string;
  className?: string;
  animateRows?: boolean;
  rowVariant?: VariantName;
  stagger?: number;
  zebra?: boolean; // abwechselnde Zeilenhintergründe
  denseRows?: boolean; // kompaktere Zeilenhöhe
  emphasizeFirstCol?: boolean; // erste Spalte typografisch betonen
  noGridlines?: boolean; // entfernt alle sichtbaren Linien (Header & Zeilen)
};

export default function TableSimple({ headers, rows, caption, className, animateRows = false, rowVariant = "fadeInUp", stagger = 0.06, zebra = false, denseRows = false, emphasizeFirstCol = false, noGridlines = false }: TableSimpleProps) {
  const reduceMotion = useReducedMotion();
  const tbodyMotionProps = reduceMotion
    ? {}
    : ({ variants: variantsMap.fadeIn, initial: "hidden", whileInView: "visible" } as const);
  const rowMotionVariants = reduceMotion ? {} : variantsMap[rowVariant];
  const cellPadding = denseRows ? "py-1.5" : "py-2.5";
  const zebraClass = zebra ? "even:bg-[--muted]/6" : "";
  return (
    <div className={`overflow-x-auto rounded-xl bg-transparent shadow-none ring-0 border-0 ${className || ""}`}>
      <table className="w-full text-sm border-collapse">
        {caption && <caption className="text-left p-3 text-[--color-foreground-muted]">{caption}</caption>}
        {headers && (
          <thead className="bg-transparent">
            <tr className={`${noGridlines ? 'border-0' : 'border-b border-slate-300/30 dark:border-slate-600/30'}`}>
              {headers.map((h, i) => (
                <th key={i} className={`text-left px-3 ${cellPadding} font-medium text-[--color-foreground]`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {animateRows ? (
          <motion.tbody
            {...tbodyMotionProps}
            viewport={{ ...(defaultViewport as object) }}
            transition={{ ...defaultTransition, staggerChildren: reduceMotion ? 0 : stagger }}
          >
            {rows.map((r, ri) => (
              <motion.tr key={ri} className={`${zebraClass}`} variants={rowMotionVariants}>
                {r.map((c, ci) => {
                  const isNumeric = typeof c === "number" || (typeof c === "string" && /^\s*-?\d+[\d,.\s]*%?(?:\s*[kKmM€$])?\s*$/.test(c));
                  const alignClass = isNumeric ? "text-right tabular-nums" : "text-left";
                  const content = emphasizeFirstCol && ci === 0 ? <span className="font-semibold">{c}</span> : c;
                  const bottomBorderClass = noGridlines ? "border-0" : "border-b border-slate-300/30 dark:border-slate-600/30";
                  return (
                    <td key={ci} className={`px-3 ${cellPadding} text-[--color-foreground] ${alignClass} ${bottomBorderClass}`}>{content}</td>
                  );
                })}
              </motion.tr>
            ))}
          </motion.tbody>
        ) : (
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className={`${zebraClass}`}>
                {r.map((c, ci) => {
                  const isNumeric = typeof c === "number" || (typeof c === "string" && /^\s*-?\d+[\d,.\s]*%?(?:\s*[kKmM€$])?\s*$/.test(c));
                  const alignClass = isNumeric ? "text-right tabular-nums" : "text-left";
                  const content = emphasizeFirstCol && ci === 0 ? <span className="font-semibold">{c}</span> : c;
                  const bottomBorderClass = noGridlines ? "border-0" : "border-b border-slate-300/30 dark:border-slate-600/30";
                  return (
                    <td key={ci} className={`px-3 ${cellPadding} text-[--color-foreground] ${alignClass} ${bottomBorderClass}`}>{content}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
