import { test, expect } from '@playwright/test';

// E2E-Smoketests für Technology (Kapitel 6) und Executive (Kapitel 1)
// Prüfen: Seite lädt, H1 vorhanden, html lang korrekt, grundlegende KPI-Karten sichtbar

test.describe('Technology & Executive – E2E Sanity', () => {
  test('Technology (Kapitel 6) lädt und zeigt H1 & KPI-Karten', async ({ page }) => {
    await page.goto('/chapters/6');
    // Warte robust auf ersten sichtbaren Marker (H1 oder KPI‑Karte)
    const ready6 = page.locator('h1.section-title, .kpi-card--bm').first();
    await expect(ready6).toBeVisible({ timeout: 20000 });
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /^(de|de-.*)$/);

    const h1s = page.getByRole('heading', { level: 1 });
    await expect(h1s).not.toHaveCount(0);

    // Mindestens eine KPI-Karte sichtbar
    const kpis = page.locator('.kpi-card--bm');
    await expect(kpis.first()).toBeVisible();
  });

  test('Technology: Specs-Tabelle und Quellen-Chips (falls vorhanden)', async ({ page }) => {
    await page.goto('/chapters/6');
    await page.waitForSelector('h1, [role="heading"][aria-level="1"]', { state: 'attached', timeout: 20000 });

    const specsHeading = page.getByText(/Technische Spezifikationen \(Humanoide\)/i).first();
    const headingCount = await specsHeading.count();
    if (headingCount > 0) {
      // Tabelle direkt hinter der Überschrift finden
      const table = specsHeading.locator('xpath=following::table[1]');
      await expect(table).toBeVisible();
      await expect(table.locator('th').first()).toBeVisible();
      const rowCount = await table.locator('tbody tr').count();
      expect(rowCount).toBeGreaterThan(0);

      // Quellen-Chips/Links im Headerbereich (direkt neben der Überschrift) prüfen
      const headerWrap = specsHeading.locator('xpath=ancestor::div[contains(@class, "flex")][1]');
      const linkCount = await headerWrap.locator('a[href^="http"]').count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('Executive (Kapitel 1) lädt und zeigt H1 & KPI-Karten', async ({ page }) => {
    await page.goto('/chapters/1');
    const ready1 = page.locator('h1.section-title, .kpi-card--bm').first();
    await expect(ready1).toBeVisible({ timeout: 20000 });
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /^(de|de-.*)$/);

    const h1s = page.locator('h1.section-title');
    await expect(h1s).not.toHaveCount(0);

    // Mindestens eine KPI-Karte sichtbar
    const kpis = page.locator('.kpi-card--bm');
    await expect(kpis.first()).toBeVisible();
  });

  test('Executive: KPI-Icons (SVG) vorhanden und mehrere Karten sichtbar', async ({ page }) => {
    await page.goto('/chapters/1');
    await page.waitForSelector('h1, [role="heading"][aria-level="1"]', { state: 'attached', timeout: 20000 });
    const cards = page.locator('.kpi-card--bm');
    await page.waitForSelector('.kpi-card--bm', { state: 'visible', timeout: 20000 });
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    const svgCount = await cards.locator('svg').count();
    expect(svgCount).toBeGreaterThan(0);
  });
});
