 "use client";
import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string; // applies to inner content wrapper
  outerClassName?: string; // applies to the outer <section>
  pageBreakBefore?: boolean;
  avoidBreakInside?: boolean;
  snap?: boolean;
  dense?: boolean; // kompakter Modus: geringere Außen-/Innenabstände, kein farbiger Container
  noContainer?: boolean; // do not apply container-gutter on outer section
  noOuterPadding?: boolean; // remove outer vertical paddings
  noInnerPadding?: boolean; // remove inner content padding
  compactHeading?: boolean; // reduce heading margins
  noBorder?: boolean; // remove inner wrapper border entirely
  // Die folgenden Props bleiben zur Abwärtskompatibilität erhalten, werden aber nicht mehr verwendet
  // (Animationen wurden entfernt für sofortiges Rendern ohne Verzögerungen):
  variant?: unknown;
  headingVariant?: unknown;
  contentVariant?: unknown;
  staggerChildren?: number;
  viewportMargin?: string;
  // Alignment controls (optional)
  headingAlign?: "left" | "center" | "right";
  contentAlign?: "left" | "center" | "right";
}

export function Section(props: SectionProps) {
  const {
    id,
    title,
    subtitle,
    children,
    className,
    outerClassName,
    pageBreakBefore,
    avoidBreakInside,
    snap = false,
    dense = false,
    noContainer = false,
    noOuterPadding = false,
    noInnerPadding = false,
    compactHeading = false,
    headingAlign = "left",
    contentAlign = "left",
    noBorder = false,
  } = props;

  return (
    <section
      id={id}
      className={`${noContainer ? "" : "container-gutter"} ${noOuterPadding ? "py-0" : (dense ? "py-8 md:py-10" : "py-16 md:py-20")} scroll-mt-20 ${pageBreakBefore ? "break-before" : ""} ${snap ? "snap-start min-h-[100dvh] flex flex-col justify-start" : ""} ${outerClassName || ""}`}
    >
      {title && String(title).trim().length > 0 ? (
        <h2
          className={`${compactHeading ? 'mb-2 md:mb-3' : 'mb-6 md:mb-8'} leading-tight section-title ${styles.headingAppear} ${
            headingAlign === "center" ? "text-center" : headingAlign === "right" ? "text-right" : "text-left"
          } ${headingAlign === "center" ? "mx-auto max-w-[28ch]" : ""}`}
          style={{ textWrap: 'balance' as any }}
        >
          <span className="text-[--color-foreground-strong]">{title}</span>
        </h2>
      ) : null}
      {subtitle ? (
        <p
          className={`mb-3 md:mb-4 text-[13.5px] md:text-sm text-[--color-foreground-muted] ${styles.contentAppear} ${
            headingAlign === "center" ? "text-center mx-auto max-w-[52ch]" : headingAlign === "right" ? "text-right" : "text-left"
          }`}
          style={{ textWrap: 'balance' as any }}
        >
          {subtitle}
        </p>
      ) : null}
      <div
        className={`reading-max leading-relaxed text-[--color-foreground] ${noInnerPadding ? "p-0" : (dense ? "p-3 md:p-4" : "p-4 md:p-6")} ${className || ""} ${styles.contentAppear} ${
          avoidBreakInside ? "avoid-break-inside" : ""
        } ${contentAlign === "center" ? "text-center" : contentAlign === "right" ? "text-right" : "text-left"} rounded-2xl ${noBorder ? "border-0" : "border border-[--color-border]"} bg-[var(--color-surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] supports-[backdrop-filter]:backdrop-blur-sm`}
      >
        {children}
      </div>
    </section>
  );
}
