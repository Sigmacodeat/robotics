import { getMessages, type SupportedLocale } from '@/i18n/messages';

describe('i18n: getMessages', () => {
  const locales: SupportedLocale[] = ['de', 'en'];

  test.each(locales)('lädt Messages für %s und hat content-Bundle', async (loc) => {
    const m = await getMessages(loc);
    expect(m).toBeTruthy();
    // einige Top-Level Namespaces sollten existieren
    expect(m).toHaveProperty('nav');
    expect(m).toHaveProperty('chapters');
    // content-Bundle vorhanden, ohne bestehendes content.* zu überschreiben
    expect(m).toHaveProperty('content');
    const content = (m as any).content;
    expect(content).toBeTruthy();
    // exemplarische Kapitel-Bundles
    expect(content).toHaveProperty('businessModel');
    expect(content).toHaveProperty('market');
    expect(content).toHaveProperty('finance');
  });
});
