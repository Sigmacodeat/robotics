export type NumberFormatter = (n: number) => string;

export const getNumberFormatter = (locale?: string, options?: Intl.NumberFormatOptions): NumberFormatter => {
  try {
    return new Intl.NumberFormat(locale, options).format;
  } catch {
    return new Intl.NumberFormat(undefined, options).format;
  }
};

export const formatCompact = (locale?: string): NumberFormatter => getNumberFormatter(locale, { notation: "compact", maximumFractionDigits: 1 });
export const formatInteger = (locale?: string): NumberFormatter => getNumberFormatter(locale, { maximumFractionDigits: 0 });
export const formatPercent = (locale?: string): NumberFormatter => (n: number) => getNumberFormatter(locale, { style: "percent", maximumFractionDigits: 1 })(n);
export const formatCurrencyEUR = (locale?: string): NumberFormatter => getNumberFormatter(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
