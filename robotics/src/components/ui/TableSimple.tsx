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
};

export default function TableSimple({ headers, rows, caption, className, animateRows = false, rowVariant = "fadeInUp", stagger = 0.06, zebra = false, denseRows = false, emphasizeFirstCol = false }: TableSimpleProps) {
  const reduceMotion = useReducedMotion();
  const tbodyMotionProps = reduceMotion
    ? {}
    : ({ variants: variantsMap.fadeIn, initial: "hidden", whileInView: "visible" } as const);
  const rowMotionVariants = reduceMotion ? {} : variantsMap[rowVariant];
  const cellPadding = denseRows ? "py-1.5" : "py-2.5";
  const zebraClass = zebra ? "even:bg-[--muted]/3" : "";
  return (
    <div className={`overflow-x-auto rounded-xl bg-[--color-surface] shadow-sm ring-[0.5px] ring-[--color-border-subtle]/16 ${className || ""}`}>
      <table className="w-full text-sm border-collapse">
        {caption && <caption className="text-left p-3 text-[--color-foreground-muted]">{caption}</caption>}
        {headers && (
          <thead className="bg-[--color-surface-2]">
            <tr className="border-b-[0.5px] border-[--color-border-subtle]/16">
              {headers.map((h, i) => (
                <th key={i} className={`text-left px-3 ${cellPadding} font-medium text-[--color-foreground-muted]`}>
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
              <motion.tr key={ri} className={`border-t-[0.5px] border-[--color-border-subtle]/14 ${zebraClass}`} variants={rowMotionVariants}>
                {r.map((c, ci) => {
                  const isNumeric = typeof c === "number" || (typeof c === "string" && /^\s*-?\d+[\d,.\s]*%?(?:\s*[kKmM€$])?\s*$/.test(c));
                  const alignClass = isNumeric ? "text-right tabular-nums" : "text-left";
                  const content = emphasizeFirstCol && ci === 0 ? <span className="font-semibold">{c}</span> : c;
                  return (
                    <td key={ci} className={`px-3 ${cellPadding} text-[--color-foreground] ${alignClass}`}>{content}</td>
                  );
                })}
              </motion.tr>
            ))}
          </motion.tbody>
        ) : (
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className={`border-t-[0.5px] border-[--color-border-subtle]/14 ${zebraClass}`}>
                {r.map((c, ci) => {
                  const isNumeric = typeof c === "number" || (typeof c === "string" && /^\s*-?\d+[\d,.\s]*%?(?:\s*[kKmM€$])?\s*$/.test(c));
                  const alignClass = isNumeric ? "text-right tabular-nums" : "text-left";
                  const content = emphasizeFirstCol && ci === 0 ? <span className="font-semibold">{c}</span> : c;
                  return (
                    <td key={ci} className={`px-3 ${cellPadding} text-[--color-foreground] ${alignClass}`}>{content}</td>
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
