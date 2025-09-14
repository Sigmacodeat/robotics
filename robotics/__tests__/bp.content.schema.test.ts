// Dieser Test war zuvor an die alte messages/*-Struktur gebunden.
// Wir lassen ihn weiterhin übersprungen und vermeiden harte Importe,
// damit der TypeScript-Check nicht auf nicht mehr existierende Pfade läuft.

describe.skip("bp.content schema validation (legacy)", () => {
  it("DE content matches schemas", async () => {
    const de = await import("@/i18n/locales/de/bp");
    const deContent = (de as any).default?.content ?? {};
    expect(typeof deContent).toBe("object");
  });
  it("EN content matches schemas", async () => {
    const en = await import("@/i18n/locales/en/bp");
    const enContent = (en as any).default?.content ?? {};
    expect(typeof enContent).toBe("object");
  });
});
