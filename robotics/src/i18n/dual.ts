// Utilities to read combined i18n entries of shape { de: X, en: X }
// and arrays/objects recursively, with strong typing.

export type Locale = 'de' | 'en';

// A localized leaf is an object with only 'de' and/or 'en' keys
type LocalizedLeaf<V> = { de: V; en: V };

// Deeply maps a combined i18n type T to the concrete locale value type
export type DeepPick<T, L extends Locale> =
  // Localized leaves {de,en}
  T extends LocalizedLeaf<infer V> ? V :
  // Arrays
  T extends (infer U)[] ? DeepPick<U, L>[] :
  // Objects
  T extends object ? { [K in keyof T]: DeepPick<T[K], L> } :
  // Primitives
  T;

export function pick<L extends Locale, T>(locale: L, v: T): DeepPick<T, L> {
  const anyV: any = v as any;
  if (anyV == null) return anyV as DeepPick<T, L>;
  const t = typeof anyV;
  if (t === 'string' || t === 'number' || t === 'boolean') return anyV as DeepPick<T, L>;
  if (Array.isArray(anyV)) return anyV.map((el: unknown) => pick(locale, el)) as DeepPick<T, L>;
  if (t === 'object') {
    const hasDe = Object.prototype.hasOwnProperty.call(anyV, 'de');
    const hasEn = Object.prototype.hasOwnProperty.call(anyV, 'en');
    if (hasDe && hasEn) return anyV[locale] as DeepPick<T, L>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(anyV)) out[k] = pick(locale, anyV[k]);
    return out as DeepPick<T, L>;
  }
  return anyV as DeepPick<T, L>;
}

export function pickArray<L extends Locale, T>(locale: L, arr: T[]): DeepPick<T, L>[] {
  return Array.isArray(arr) ? (arr.map((el) => pick(locale, el)) as DeepPick<T, L>[]) : (arr as unknown as DeepPick<T, L>[]);
}
