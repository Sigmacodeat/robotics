/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Sorts all locale JSON files recursively and optionally prunes keys
 * that do not exist in the base (EN) locale.
 *
 * Usage:
 *   node scripts/sort-i18n.js [--baseLocale=en] [--localesDir=src/i18n/messages] [--prune-extra]
 */

const fs = require('fs');
const path = require('path');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function sortObjectDeep(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectDeep);
  }
  if (!isPlainObject(obj)) return obj;
  const out = {};
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  for (const k of keys) {
    out[k] = sortObjectDeep(obj[k]);
  }
  return out;
}

function pruneToBase(base, target) {
  // If base is primitive/array, return target as-is (structure validated elsewhere)
  if (!isPlainObject(base)) {
    if (Array.isArray(base)) return Array.isArray(target) ? target : base;
    return target;
  }
  const out = {};
  for (const key of Object.keys(base)) {
    if (!(key in target)) continue;
    const b = base[key];
    const t = target[key];
    if (isPlainObject(b)) {
      out[key] = pruneToBase(b, isPlainObject(t) ? t : {});
    } else if (Array.isArray(b)) {
      // Keep array as-is (do not attempt deep pruning)
      out[key] = Array.isArray(t) ? t : b;
    } else {
      out[key] = t;
    }
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const baseLocaleArg = args.find((a) => a.startsWith('--baseLocale='));
  const localesDirArg = args.find((a) => a.startsWith('--localesDir='));
  const prune = args.includes('--prune-extra');

  const baseLocale = baseLocaleArg ? baseLocaleArg.split('=')[1] : 'en';
  const localesDir = localesDirArg ? localesDirArg.split('=')[1] : 'src/i18n/messages';

  const baseFile = path.join(process.cwd(), localesDir, `${baseLocale}.json`);
  if (!fs.existsSync(baseFile)) {
    console.error(`Base locale not found: ${baseFile}`);
    process.exit(1);
  }
  const base = readJSON(baseFile);

  const files = fs.readdirSync(path.join(process.cwd(), localesDir)).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const full = path.join(process.cwd(), localesDir, file);
    const data = readJSON(full);
    let out = data;
    if (prune && file !== `${baseLocale}.json`) {
      out = pruneToBase(base, data);
    }
    out = sortObjectDeep(out);
    writeJSON(full, out);
    console.log(`Sorted${prune && file !== `${baseLocale}.json` ? ' & pruned' : ''}: ${full}`);
  }
}

if (require.main === module) {
  main();
}
