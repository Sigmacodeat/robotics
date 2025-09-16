import {getRequestConfig} from 'next-intl/server';
import deMessages from './locales/de';
import enMessages from './locales/en';

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';
export const localePrefix = 'as-needed' as const; // default locale without prefix, others with prefix

export default getRequestConfig(async ({locale}) => {
  const normalized = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  // Directly use the imported locale messages
  const messages = normalized === 'de' ? deMessages : enMessages;

  return {
    locale: normalized,
    messages
  };
});
