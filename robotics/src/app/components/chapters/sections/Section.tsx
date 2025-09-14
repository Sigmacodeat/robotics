"use client";
import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  pageBreakBefore?: boolean;
  avoidBreakInside?: boolean;
  snap?: boolean;
  dense?: boolean; // kompakter Modus: geringere Außen-/Innenabstände, kein farbiger Container
  // Die folgenden Props bleiben zur Abwärtskompatibilität erhalten, werden aber nicht mehr verwendet
  // (Animationen wurden entfernt für sofortiges Rendern ohne Verzögerungen):
  variant?: any;
  headingVariant?: any;
  contentVariant?: any;
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
    pageBreakBefore,
    avoidBreakInside,
    snap = false,
    dense = false,
    headingAlign = "left",
    contentAlign = "left",
  } = props;

  return (
    <section
      id={id}
      className={`container-gutter ${dense ? "py-8 md:py-10" : "py-16 md:py-20"} scroll-mt-20 ${pageBreakBefore ? "break-before" : ""} ${snap ? "snap-start min-h-[100dvh] flex flex-col justify-start" : ""}`}
    >
      {title && String(title).trim().length > 0 ? (
        <h2
          className={`mb-6 md:mb-8 leading-tight section-title ${styles.headingAppear} ${
            headingAlign === "center" ? "text-center" : headingAlign === "right" ? "text-right" : "text-left"
          } ${headingAlign === "center" ? "mx-auto max-w-[28ch]" : ""}`}
          style={{ textWrap: 'balance' as any }}
        >
          <span className="text-gradient-subtle">{title}</span>
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
        className={`reading-max leading-relaxed text-[--color-foreground] ${dense ? "p-3 md:p-4" : "p-4 md:p-6"} ${dense ? "bg-transparent ring-0" : "rounded-2xl ring-[0.5px] ring-[--color-border-subtle] bg-[--color-surface]/95 supports-[backdrop-filter]:backdrop-blur-sm"} ${styles.contentAppear} ${
          avoidBreakInside ? "avoid-break-inside" : ""
        } ${contentAlign === "center" ? "text-center" : contentAlign === "right" ? "text-right" : "text-left"} ${className || ""}`}
      >
        {children}
      </div>
    </section>
  );
}
