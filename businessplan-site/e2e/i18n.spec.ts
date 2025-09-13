import { test, expect } from '@playwright/test';

// Sanity-Checks für i18n: Default-Locale ohne Prefix (de), EN mit /en Prefix,
// und HTML lang-Attribut ist korrekt gesetzt.

test.describe('i18n sanity', () => {
  test('root "/" rendert Deutsch (html lang=de)', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /^(de|de-.*)$/);
  });

  test('"/en/chapters/cover" rendert Englisch (html lang=en)', async ({ page }) => {
    // Stelle sicher, dass der Locale-Cookie gesetzt ist (NEXT_LOCALE=en)
    await page.goto('/');
    const origin = new URL(page.url()).origin;
    await page.context().addCookies([
      { name: 'NEXT_LOCALE', value: 'en', url: origin + '/' }
    ]);
    await page.goto('/en/chapters/cover');
    await expect.poll(async () => await page.evaluate(() => document.documentElement.lang || ''), { timeout: 8000 }).not.toBe('');
    const lang = await page.evaluate(() => document.documentElement.lang || '');
    expect(/^en(-|$)/.test(lang)).toBe(true);
  });

  test('"/en" rendert Englisch (html lang=en)', async ({ page }) => {
    await page.goto('/');
    const origin = new URL(page.url()).origin;
    await page.context().addCookies([
      { name: 'NEXT_LOCALE', value: 'en', url: origin + '/' }
    ]);
    await page.goto('/en');
    await expect.poll(async () => await page.evaluate(() => document.documentElement.lang || ''), { timeout: 8000 }).not.toBe('');
    const lang = await page.evaluate(() => document.documentElement.lang || '');
    expect(/^en(-|$)/.test(lang)).toBe(true);
  });

  test('historisches "/de/..." wird auf "/..." redirected (as-needed)', async ({ page }) => {
    const target = '/chapters/1';
    await page.goto('/de/chapters/1');
    await page.waitForURL((url) => url.pathname === target);
    expect(new URL(page.url()).pathname).toBe(target);
  });
});
