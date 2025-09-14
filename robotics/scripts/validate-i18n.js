/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const { validateLocales } = require('./i18n-validator');

const baseLocale = 'en';
const localesDir = path.join(__dirname, '../src/i18n/messages');

try {
  const fs = require('fs');
  const baseFile = path.join(localesDir, `${baseLocale}.json`);
  if (!fs.existsSync(baseFile)) {
    console.log(`[i18n] Basissprache ${baseLocale}.json nicht gefunden – überspringe JSON-Validierung (TS-first Modus).`);
    process.exit(0);
  }
  const results = validateLocales({ localesDir, baseLocale });
  let hasIssues = false;
  for (const { locale, missingKeys = [], typeMismatches = [] } of results) {
    if (missingKeys.length === 0 && typeMismatches.length === 0) {
      console.log(`✅ ${locale}: Keine fehlenden Schlüssel, keine Strukturkonflikte`);
      continue;
    }
    hasIssues = true;
    if (missingKeys.length > 0) {
      console.error(`❌ Fehlende Schlüssel in ${locale}:`, missingKeys);
    } else {
      console.log(`✅ ${locale}: Keine fehlenden Schlüssel`);
    }
    if (typeMismatches.length > 0) {
      console.error(`❌ Struktur-/Typabweichungen in ${locale}:`);
      for (const m of typeMismatches) {
        console.error(`  - ${m.key}: erwartet=${m.expected}, tatsächlich=${m.actual}`);
      }
    } else {
      console.log(`✅ ${locale}: Keine Struktur-/Typabweichungen`);
    }
  }
  if (hasIssues) process.exit(1);
} catch (err) {
  console.error('❌ i18n Validierung fehlgeschlagen:', err.message);
  process.exit(1);
}
