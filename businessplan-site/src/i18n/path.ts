import type { Locale } from './request';

/**
 * Baut einen lokalisierten Pfad gemäß next-intl Konfiguration:
 * - Default-Locale 'de' ohne Prefix (as-needed)
 * - Andere Locales mit '/{locale}' Prefix
 * Stellt sicher, dass der Pfad mit '/' beginnt.
 */
export function buildLocalePath(locale: string | Locale, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return locale === 'de' ? normalizedPath : `/${locale}${normalizedPath}`;
}
