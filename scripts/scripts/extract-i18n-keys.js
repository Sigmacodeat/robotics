const fs = require('fs');
const path = require('path');

// Suchmuster: t('key') oder t("key") oder t(`key`)
const tPattern = /t\((['"`])(.*?)\1\)/g;
// Suchmuster: useTranslations('namespace')
const useTranslationsPattern = /useTranslations\((['"`])(.*?)\1\)/g;

function extractKeys(fileContent) {
  const keys = new Set();
  let match;

  // t(...) Aufrufe
  while ((match = tPattern.exec(fileContent)) !== null) {
    keys.add(match[2]);
  }

  // useTranslations(...) Aufrufe
  while ((match = useTranslationsPattern.exec(fileContent)) !== null) {
    keys.add(match[2]);
  }

  return Array.from(keys);
}

function scanDirectory(directory) {
  const results = {};
  const files = fs.readdirSync(directory, { recursive: true });

  files.forEach(file => {
    const filePath = path.join(directory, file);
    // Nur Dateien im src-Verzeichnis berücksichtigen
    if (filePath.includes('node_modules') || !filePath.includes('src')) {
      return;
    }
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const keys = extractKeys(content);
      if (keys.length > 0) {
        results[filePath] = keys;
      }
    }
  });

  return results;
}

const projectRoot = path.join(__dirname, '..');
const allKeys = scanDirectory(projectRoot);

// Schreibe die extrahierten Schlüssel in eine Datei
const outputPath = path.join(projectRoot, 'used-keys.json');
fs.writeFileSync(outputPath, JSON.stringify(allKeys, null, 2));
console.log(`Extrahiere Schlüssel in ${outputPath} geschrieben.`);
