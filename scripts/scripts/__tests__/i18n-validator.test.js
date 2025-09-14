/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validateLocales, extractKeys } = require('../i18n-validator');

describe('i18n-validator', () => {
  function setupTempLocales(structure) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-test-'));
    for (const [name, obj] of Object.entries(structure)) {
      fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(obj, null, 2));
    }
    return dir;
  }

  it('extractKeys flacht Keys korrekt ab', () => {
    const obj = { a: { b: 1, c: [2, 3] }, d: 'x' };
    const keys = extractKeys(obj).sort();
    expect(keys).toEqual(['a.b', 'a.c.0', 'a.c.1', 'd'].sort());
  });

  it('validateLocales meldet fehlende Schlüssel', () => {
    const base = { bp: { title: 't', sections: { one: '1', two: '2' } } };
    const de = { bp: { title: 'T', sections: { one: 'Eins' } } }; // fehlt sections.two
    const structure = { en: base, de };
    const dir = setupTempLocales(structure);

    const results = validateLocales({ localesDir: dir, baseLocale: 'en' });
    const deResult = results.find(r => r.locale === 'de');
    expect(deResult).toBeTruthy();
    expect(deResult.missingKeys).toContain('bp.sections.two');
  });

  it('validateLocales gibt keine fehlenden Schlüssel zurück, wenn vollständig', () => {
    const base = { bp: { title: 't', sections: { one: '1' } } };
    const de = { bp: { title: 'T', sections: { one: 'Eins' } } };
    const structure = { en: base, de };
    const dir = setupTempLocales(structure);

    const results = validateLocales({ localesDir: dir, baseLocale: 'en' });
    const deResult = results.find(r => r.locale === 'de');
    expect(deResult.missingKeys).toHaveLength(0);
  });

  it('meldet Typabweichung bei primitiven Typen (z. B. string vs. array)', () => {
    const base = { content: { title: 'Hello', tags: ['a', 'b'] } };
    const de = { content: { title: ['Hallo'], tags: 'x' } }; // title sollte string sein, tags sollte array sein
    const dir = setupTempLocales({ en: base, de });
    const results = validateLocales({ localesDir: dir, baseLocale: 'en' });
    const deResult = results.find(r => r.locale === 'de');
    // keine fehlenden Keys, aber Typkonflikte
    expect(deResult.missingKeys).toHaveLength(0);
    const keys = deResult.typeMismatches.map(m => m.key).sort();
    expect(keys).toEqual(['content.tags', 'content.title'].sort());
  });

  it('prüft Elementtyp in Arrays (string[] erwartet, object[] gefunden)', () => {
    const base = { list: ['a', 'b'] }; // erwartet string[]
    const de = { list: [{ x: 1 }] }; // object[] ist falsch
    const dir = setupTempLocales({ en: base, de });
    const results = validateLocales({ localesDir: dir, baseLocale: 'en' });
    const deResult = results.find(r => r.locale === 'de');
    const mismatch = deResult.typeMismatches.find(m => m.key === 'list[*]');
    expect(mismatch).toBeTruthy();
    expect(mismatch.expected).toBe('string');
    expect(mismatch.actual).toBe('object');
  });

  it('akzeptiert leere Arrays in Locale auch wenn Base einen Elementtyp definiert', () => {
    const base = { features: [{ name: 'x' }] }; // object[] erwartet
    const de = { features: [] }; // leer -> ok
    const dir = setupTempLocales({ en: base, de });
    const results = validateLocales({ localesDir: dir, baseLocale: 'en' });
    const deResult = results.find(r => r.locale === 'de');
    // keine Typmismatches aufgrund leerem Array
    const anyMismatch = (deResult.typeMismatches || []).some(m => m.key.startsWith('features'));
    expect(anyMismatch).toBe(false);
  });

  it('wirft, wenn Basissprache fehlt', () => {
    const deOnly = { de: { a: 1 } };
    const dir = setupTempLocales(deOnly);
    expect(() => validateLocales({ localesDir: dir, baseLocale: 'en' })).toThrow(/Basissprache/);
  });
});
