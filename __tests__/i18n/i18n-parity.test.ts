import de from '@/i18n/locales/de';
import en from '@/i18n/locales/en';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectKeys(obj: unknown, prefix = ''): Set<string> {
  const keys = new Set<string>();
  if (!isPlainObject(obj)) return keys;
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    keys.add(path);
    if (isPlainObject(v)) {
      for (const ck of collectKeys(v, path)) keys.add(ck);
    }
  }
  return keys;
}

// Some objects intentionally contain free-form content structures per locale, allowlist them
const ALLOW_DIFFERENCES_PREFIXES = [
  // Free rich content may diverge between locales without being an i18n structural error
  'bp.execFacts',
  'bp.content',
];

function filterAllowed(keys: Set<string>): Set<string> {
  const filtered = new Set<string>();
  for (const k of keys) {
    if (ALLOW_DIFFERENCES_PREFIXES.some((p) => k.startsWith(p))) continue;
    filtered.add(k);
  }
  return filtered;
}

describe('i18n key parity (DE vs EN)', () => {
  it('has the same key structure for de and en (ignoring allowlist)', () => {
    const deKeys = filterAllowed(collectKeys(de));
    const enKeys = filterAllowed(collectKeys(en));

    const onlyInDe = [...deKeys].filter((k) => !enKeys.has(k));
    const onlyInEn = [...enKeys].filter((k) => !deKeys.has(k));

    // Helpful debugging on failure
    if (onlyInDe.length || onlyInEn.length) {
      // Log minimal diffs to help fix quickly
      // eslint-disable-next-line no-console
      console.warn('i18n parity diff', { onlyInDe, onlyInEn });
    }

    expect(onlyInDe).toEqual([]);
    expect(onlyInEn).toEqual([]);
  });
});
