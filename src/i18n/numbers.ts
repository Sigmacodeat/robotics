// Central i18n number formatting helpers
// Use these to keep currency/compact formatting consistent across charts and KPIs

export function getEuroCompactFormatter(locale: string = 'de-DE') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    notation: 'compact',
  });
}

export function formatEuroCompact(value: number, locale: string = 'de-DE') {
  return getEuroCompactFormatter(locale).format(value);
}

export function getDecimalFormatter(locale: string = 'de-DE', maximumFractionDigits = 0) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits });
}

export function formatKEuro(value: number, locale: string = 'de-DE') {
  // helper to render values like "1 900 k€" if needed
  const nf = getDecimalFormatter(locale, 0);
  return `${nf.format(value)} k€`;
}
