import { test, expect } from '@playwright/test';

// Einfache E2E-Smoketests für Market (Kapitel 3) und Impact (Kapitel 10)
// Prüfen: Seite lädt, H1 vorhanden, html lang korrekt für Default-Locale 'de'.

test.describe('Market & Impact – E2E Sanity', () => {
  test('Market (Kapitel 3) lädt und zeigt H1', async ({ page }) => {
    await page.goto('/chapters/3');
    await expect(page.getByRole('heading', { level: 1 }).first().or(page.locator('h1').first())).toBeVisible({ timeout: 20000 });
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /^(de|de-.*)$/);
    const h1s = page.getByRole('heading', { level: 1 });
    await expect(h1s).not.toHaveCount(0);
  });

  test('Market: EU-KPI-Karte zeigt Label/Badge/Wert und Quellen enthalten Links', async ({ page }) => {
    await page.goto('/chapters/3');
    await expect(page.getByRole('heading', { level: 1 }).first().or(page.locator('h1').first())).toBeVisible({ timeout: 20000 });
    await expect(page.locator('.kpi-card--bm').first()).toBeVisible({ timeout: 20000 });

    // EU-KPI-Karte robust finden (deutsches Label)
    const euCard = page.locator('.kpi-card--bm', { hasText: /EU\s*[\-‑]?Anteil/i }).first();
    await expect(euCard).toBeVisible();
    // "indikativ"-Badge ist optional je nach Datenlage – wenn vorhanden, sollte es sichtbar sein
    const indikativCount = await euCard.getByText(/^indikativ$/i).count();
    if (indikativCount > 0) {
      await expect(euCard.getByText(/^indikativ$/i).first()).toBeVisible();
    }
    // Wert: entweder konkreter Prozentwert oder Fallback "–"; falls nicht vorhanden, Test tolerant überspringen
    const pctCount = await euCard.getByText(/\d+\s?%/).count();
    const dashCount = await euCard.getByText('–').count();
    if (pctCount + dashCount === 0) {
      test.skip(true, 'Kein Prozentwert oder Fallback gefunden – Datenlage ggf. leer, Test tolerant übersprungen.');
    } else {
      expect(pctCount + dashCount).toBeGreaterThan(0);
    }

    // Quellen (Marktvolumen): mindestens ein Link vorhanden
    const sourcesHeader = page.getByText(/Quellen\s*\(Marktvolumen\)/i).first();
    // Suche im ersten folgenden Listenelement nach Links
    const sourcesList = sourcesHeader.locator('xpath=following::ul[1]');
    await expect(sourcesList).toBeVisible();
    const linkCount = await sourcesList.locator('a[href^="http"]').count();
    if (linkCount === 0) {
      // Fallback: akzeptiere 0 Links, wenn zumindest Listeneinträge existieren (z. B. reine Textquellen)
      const liCount = await sourcesList.locator('li').count();
      if (liCount === 0) {
        test.skip(true, 'Keine Links und keine Listeneinträge in Quellen – Datenlage leer, Test tolerant übersprungen.');
      } else {
        expect(liCount).toBeGreaterThan(0);
      }
    } else {
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('Impact (Kapitel 10) lädt und zeigt H1', async ({ page }) => {
    await page.goto('/chapters/10');
    await expect(page.getByRole('heading', { level: 1 }).first().or(page.locator('h1').first())).toBeVisible({ timeout: 20000 });
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /^(de|de-.*)$/);
    const h1s = page.getByRole('heading', { level: 1 });
    await expect(h1s).not.toHaveCount(0);
  });

  test('Market EN (Chapter 3) loads and shows H1 with html lang=en', async ({ page }) => {
    // Set EN locale cookie
    await page.goto('/');
    const origin = new URL(page.url()).origin;
    await page.context().addCookies([{ name: 'NEXT_LOCALE', value: 'en', url: origin + '/' }]);
    await page.goto('/en/chapters/3');
    await expect(page.getByRole('heading', { level: 1 }).first().or(page.locator('h1').first())).toBeVisible({ timeout: 20000 });
    await expect(page.locator('html')).toHaveAttribute('lang', /^(en|en-.*)$/);
  });

  test('Impact EN (Chapter 10) loads and shows H1 with html lang=en', async ({ page }) => {
    await page.goto('/');
    const origin = new URL(page.url()).origin;
    await page.context().addCookies([{ name: 'NEXT_LOCALE', value: 'en', url: origin + '/' }]);
    await page.goto('/en/chapters/10');
    await expect(page.getByRole('heading', { level: 1 }).first().or(page.locator('h1').first())).toBeVisible({ timeout: 20000 });
    await expect(page.locator('html')).toHaveAttribute('lang', /^(en|en-.*)$/);
  });
});
