/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Ensures a minimal valid `cv` object exists in given locale files
 * conforming to scripts/schemas/messages.schema.json.
 *
 * Usage:
 *   node scripts/add-missing-cv.js
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/messages');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

const minimalCV = {
  pageTitle: 'Lebenslauf',
  pageSubtitle: 'Berufserfahrung und Projekte',
  title: 'Werdegang',
  noDetails: 'Keine weiteren Details verfügbar.',
  items: [
    {
      period: '2024–Heute',
      title: 'Position/Titel',
      subtitle: 'Unternehmen/Projekt',
      bullets: [
        'Kurzbeschreibung Aufgabe/Erfolg'
      ]
    }
  ]
};

function ensureCV(file) {
  const data = readJSON(file);
  if (!data.cv) {
    data.cv = minimalCV;
    writeJSON(file, data);
    console.log(`Inserted minimal cv into ${path.basename(file)}`);
  } else {
    // ensure required fields exist
    const cv = data.cv;
    cv.pageTitle ||= minimalCV.pageTitle;
    cv.pageSubtitle ||= minimalCV.pageSubtitle;
    cv.title ||= minimalCV.title;
    cv.noDetails ||= minimalCV.noDetails;
    if (!Array.isArray(cv.items) || cv.items.length === 0) {
      cv.items = minimalCV.items;
    } else {
      const first = cv.items[0] || {};
      first.period ||= minimalCV.items[0].period;
      first.title ||= minimalCV.items[0].title;
      first.subtitle ||= minimalCV.items[0].subtitle;
      if (!Array.isArray(first.bullets) || first.bullets.length === 0) {
        first.bullets = minimalCV.items[0].bullets;
      }
      cv.items[0] = first;
    }
    data.cv = cv;
    writeJSON(file, data);
    console.log(`Ensured cv fields in ${path.basename(file)}`);
  }
}

function main() {
  const targets = ['de.json', 'en.json'].map((f) => path.join(LOCALES_DIR, f));
  for (const t of targets) {
    if (!fs.existsSync(t)) continue;
    ensureCV(t);
  }
}

if (require.main === module) {
  main();
}
