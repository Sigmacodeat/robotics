/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/messages');
const EN_FILE = path.join(LOCALES_DIR, 'en.json');

function processObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      processObject(obj[key]);
    } else if (typeof obj[key] === 'string') {
      // Markiere für Übersetzung
      obj[key] = `TRANSLATION_NEEDED: ${obj[key]}`;
    }
  }
}

function main() {
  try {
    const enContent = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
    processObject(enContent);
    
    fs.writeFileSync(EN_FILE, JSON.stringify(enContent, null, 2));
    console.log('Alle Strings in en.json wurden für die Übersetzung markiert');
  } catch (error) {
    console.error('Fehler beim Markieren der Übersetzungen:', error);
    process.exit(1);
  }
}

main();
