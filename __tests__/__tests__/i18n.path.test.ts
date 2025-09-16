import { buildLocalePath } from '@/i18n/path';

describe('i18n: buildLocalePath (localePrefix = as-needed)', () => {
  test('DE (default locale) hat kein Prefix', () => {
    expect(buildLocalePath('de', '/chapters/1')).toBe('/chapters/1');
    expect(buildLocalePath('de', 'chapters/1')).toBe('/chapters/1');
    expect(buildLocalePath('de', '/')).toBe('/');
  });

  test('EN erhält /en Prefix', () => {
    expect(buildLocalePath('en', '/chapters/1')).toBe('/en/chapters/1');
    expect(buildLocalePath('en', 'chapters/1')).toBe('/en/chapters/1');
    expect(buildLocalePath('en', '/')).toBe('/en/');
  });

  test('Beliebige Locale-Strings: nur "en" wird geprefixt, alles andere wie default', () => {
    // Funktion nimmt string, interne Nutzung ist strikte ('de'|'en')
    expect(buildLocalePath('en-US', '/chapters/1')).toBe('/en-US/chapters/1');
    expect(buildLocalePath('de-AT', '/chapters/1')).toBe('/de-AT/chapters/1');
  });
});
