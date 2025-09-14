import type { MetadataRoute } from 'next';
import { buildLocalePath } from '@/i18n/path';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const LOCALES = ['de', 'en'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Localized home pages
  for (const locale of LOCALES) {
    entries.push({
      url: new URL(buildLocalePath(locale, '/'), BASE_URL).toString(),
      changeFrequency: 'weekly',
      priority: 1,
      lastModified: new Date(),
    });
    // Lebenslauf (lokalisierte kanonische Route)
    entries.push({
      url: new URL(buildLocalePath(locale, '/lebenslauf'), BASE_URL).toString(),
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: new Date(),
    });
  }

  // Non-localized routes
  entries.push({
    url: new URL('/pitch', BASE_URL).toString(),
    changeFrequency: 'monthly',
    priority: 0.6,
    lastModified: new Date(),
  });

  // Kapitel sind bewusst ausgeschlossen (setzen robots.noindex)
  return entries;
}
