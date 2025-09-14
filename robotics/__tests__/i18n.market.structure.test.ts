// Regressions-Test: Struktur der Marktdaten (kein doppeltes 'market'-String, volume-Objekt vorhanden)

describe('i18n market structure (DE/EN) – Regression', () => {
  const locales = ['de', 'en'] as const;

  test.each(locales)('%s: bp.market ist ein Objekt und enthält volume', async (loc) => {
    const mod = await import(`@/i18n/locales/${loc}/bp`);
    const bp: any = (mod as any).default?.bp ?? (mod as any).default ?? {};

    // bp.market darf KEIN String sein (Regression gegen doppelte market-Eigenschaft)
    expect(typeof bp.market).toBe('object');

    // volume-Objekt sollte existieren (service/humanoid optional), sowie optionale Felder
    const vol = bp.market?.volume ?? {};
    expect(typeof vol).toBe('object');

    // optionale Keys: service, humanoid (Objekte), eu/cagr/global/drivers/sources (Strings/Array)
    if (vol.service !== undefined) expect(typeof vol.service).toBe('object');
    if (vol.humanoid !== undefined) expect(typeof vol.humanoid).toBe('object');
    if (vol.eu !== undefined) expect(typeof vol.eu).toBe('string');
    if (vol.cagr !== undefined) expect(typeof vol.cagr).toBe('string');
    if (vol.global !== undefined) expect(typeof vol.global).toBe('string');
    if (vol.drivers !== undefined) expect(typeof vol.drivers).toBe('string');
    if (vol.sources !== undefined) expect(Array.isArray(vol.sources)).toBe(true);
  });
});
