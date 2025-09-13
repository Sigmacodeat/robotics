"use client";
import {useTranslations} from "next-intl";

export function Hero() {
  const t = useTranslations("hero");
  const navT = useTranslations("nav");

  return (
    <section className="container-gutter pt-20 md:pt-28 pb-12 md:pb-16 scroll-mt-20">
      <div className="max-w-3xl">
        <h1 className="text-left text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-r from-[--color-accent] via-[--color-accent-2] to-[--color-accent-3] bg-clip-text text-transparent">
            {navT("brand")}
          </span>
          <br />
          {t("title")}
        </h1>
        <p className="mt-6 text-left text-base sm:text-lg text-[--color-foreground-muted] max-w-2xl">
          {t("subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#download" className="badge" aria-label={navT("downloadPdf")} title={navT("downloadPdf")}>
            PDF
          </a>
        </div>
      </div>
    </section>
  );
}
