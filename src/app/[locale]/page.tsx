import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import config from '@/../next-intl.config';

export default async function LocalizedHome() {
  const locale = await getLocale();
  const isDefault = locale === config.defaultLocale;
  // Build locale-aware path honoring 'as-needed' prefixing
  const target = isDefault ? '/chapters/cover' : `/${locale}/chapters/cover`;
  redirect(target);
}
