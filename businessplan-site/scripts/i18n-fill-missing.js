/*
  Fills missing/empty string values in locale JSON files using base (EN) defaults.
  - Only replaces string values that are missing or empty ("" or whitespace-only)
  - Keeps arrays/objects as-is
  - Traverses nested objects safely
*/

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const BASE_LOCALE = 'en';
const LOCALES_DIR = path.join(__dirname, '../src/i18n/messages');

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function fillMissing(baseNode, targetNode) {
  // Strings: copy base if target missing/empty
  if (typeof baseNode === 'string') {
    if (typeof targetNode !== 'string' || targetNode.trim() === '') return baseNode;
    return targetNode;
  }

  // Numbers/booleans/null: copy base if target undefined, else keep target
  if (typeof baseNode !== 'object' || baseNode === null) {
    return targetNode === undefined ? baseNode : targetNode;
  }

  // Arrays
  if (Array.isArray(baseNode)) {
    if (!Array.isArray(targetNode)) return baseNode;
    // If array of objects, try to merge first element structure; otherwise keep target
    if (baseNode.length > 0 && isPlainObject(baseNode[0])) {
      const out = targetNode.slice();
      // Ensure at least one element exists to carry structure
      if (out.length === 0) {
        out.push(fillMissing(baseNode[0], {}));
      } else {
        out[0] = fillMissing(baseNode[0], isPlainObject(out[0]) ? out[0] : {});
      }
      return out;
    }
    return targetNode;
  }

  // Objects: deep merge per key
  const out = isPlainObject(targetNode) ? { ...targetNode } : {};
  for (const key of Object.keys(baseNode)) {
    out[key] = fillMissing(baseNode[key], out[key]);
  }
  return out;
}

function main() {
  const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
  const basePath = path.join(LOCALES_DIR, `${BASE_LOCALE}.json`);
  if (!fs.existsSync(basePath)) {
    console.error(`Base locale not found: ${basePath}`);
    process.exit(1);
  }
  const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));

  for (const file of files) {
    const locale = path.basename(file, '.json');
    if (locale === BASE_LOCALE) continue;
    const targetPath = path.join(LOCALES_DIR, file);
    const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

    const filled = fillMissing(base, target);

    // Pretty write
    fs.writeFileSync(targetPath, JSON.stringify(filled, null, 2) + '\n', 'utf8');
    console.log(`Filled missing strings for locale: ${locale}`);
  }
}

if (require.main === module) {
  main();
}
