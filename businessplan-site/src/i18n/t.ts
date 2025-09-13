import type { I18nKey } from './messages/keys.d';

// Create a simple translator over a localized messages object (already locale-picked)
export function createTranslator(messages: any) {
  const getByPath = (obj: any, p: string): any => p.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);

  function t(key: I18nKey): string {
    const v = getByPath(messages, key);
    if (v == null) throw new Error(`Missing i18n key: ${key}`);
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }
  (t as any).raw = (key: I18nKey) => getByPath(messages, key);
  return t as ((key: I18nKey) => string) & { raw: (key: I18nKey) => any };
}
