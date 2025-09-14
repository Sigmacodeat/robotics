"use client";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import { buildLocalePath } from "@/i18n/path";

export default function Breadcrumbs() {
  const t = useTranslations();
  const tBp = useTranslations('bp');
  const locale = useLocale();
  const homeLabel = t("common.home", { defaultMessage: "Start" } as any);
  const bpLabel = tBp("title", { defaultMessage: "Businessplan" }) as string;

  return (
    <nav aria-label={t("common.breadcrumb", { defaultMessage: "Brotkrumen" } as any)} className="container-gutter py-3 text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        <li>
          <Link className="hover:underline" href={buildLocalePath(locale, "/")}>{homeLabel}</Link>
        </li>
        <li aria-hidden>›</li>
        <li aria-current="page" className="text-foreground">
          {bpLabel}
        </li>
      </ol>
    </nav>
  );
}
