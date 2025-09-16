"use client";

import Link from "next/link";
import {useLocale} from "next-intl";
import {buildLocalePath} from "@/i18n/path";
import {forwardRef} from "react";

export type LocaleLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * LocaleLink
 * - Präfixt interne Pfade automatisch mit der aktuellen Locale gem. next-intl (as-needed)
 * - Externe Links (http/https, mailto, tel, hash-only) werden unverändert durchgereicht
 */
const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(function LocaleLink(
  {href, ...rest}, ref
) {
  const locale = useLocale();
  const isInternal = typeof href === "string" && href.startsWith("/");
  const finalHref = isInternal ? buildLocalePath(locale, href) : href;
  return <Link ref={ref} href={finalHref} {...rest} />;
});

export default LocaleLink;
