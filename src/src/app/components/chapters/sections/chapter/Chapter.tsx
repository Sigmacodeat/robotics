"use client";
import { ReactNode } from "react";
import { Section } from "../Section";
import { useMessages, useTranslations } from "next-intl";

export type ChapterProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  sidebar?: ReactNode;
  pageBreakBefore?: boolean;
  avoidBreakInside?: boolean;
  // Animation variants can be customized per chapter
  variant?: "fadeIn" | "fadeInUp" | "slideInLeft" | "slideInRight" | "scaleIn";
  headingVariant?: "fadeInUp" | "fadeIn";
  contentVariant?: "fadeInUp" | "fadeIn";
  staggerChildren?: number;
  viewportMargin?: string;
  className?: string;
  // Alignment controls (forwarded to Section)
  headingAlign?: "left" | "center" | "right";
  contentAlign?: "left" | "center" | "right";
  // Control scroll-snap behavior (forwarded to Section)
  snap?: boolean;
  // Dense mode for compact layout (forwarded to Section)
  dense?: boolean;
};

/**
 * Chapter is a thin wrapper around Section that adds a canonical layout for chapters
 * with an optional right/second column for charts, stats or animations. This prepares
 * the architecture for per-chapter modular content and animations.
 */
export default function Chapter({
  id,
  title,
  subtitle,
  children,
  sidebar,
  pageBreakBefore,
  avoidBreakInside = true,
  variant = "fadeInUp",
  headingVariant = "fadeInUp",
  contentVariant = "fadeInUp",
  staggerChildren,
  viewportMargin,
  className,
  headingAlign = "center",
  contentAlign = "left",
  snap,
  dense,
}: ChapterProps) {
  const hasSidebar = !!sidebar;
  const t = useTranslations();
  const messages = useMessages() as unknown as Record<string, any> | undefined;
  let autoSubtitle: string | undefined = undefined;
  if (!subtitle && id) {
    const hasKey = Boolean(
      messages &&
      typeof messages === 'object' &&
      (messages as any).chapters &&
      typeof (messages as any).chapters === 'object' &&
      (messages as any).chapters[id] &&
      typeof (messages as any).chapters[id] === 'object' &&
      (messages as any).chapters[id].subtitle
    );
    if (hasKey) {
      try {
        autoSubtitle = t(`chapters.${id}.subtitle` as any);
      } catch {
        autoSubtitle = undefined;
      }
    }
  }
  return (
    <Section
      id={id}
      title={title}
      {...((subtitle ?? autoSubtitle) ? { subtitle: (subtitle ?? autoSubtitle) as string } : {})}
      avoidBreakInside={avoidBreakInside}
      variant={variant}
      headingVariant={headingVariant}
      contentVariant={contentVariant}
      headingAlign={headingAlign}
      contentAlign={contentAlign}
      {...(dense !== undefined ? { dense } : {})}
      {...(pageBreakBefore !== undefined ? { pageBreakBefore } : {})}
      {...(staggerChildren !== undefined ? { staggerChildren } : {})}
      {...(viewportMargin !== undefined ? { viewportMargin } : {})}
      {...(className ? { className } : {})}
      {...(snap !== undefined ? { snap } : {})}
    >
      {hasSidebar ? (
        <div className="mt-2 grid gap-8 md:grid-cols-[1fr_minmax(320px,520px)]">
          <div>{children}</div>
          <div className="block md:sticky md:top-24">{sidebar}</div>
        </div>
      ) : (
        children
      )}
    </Section>
  );
}
