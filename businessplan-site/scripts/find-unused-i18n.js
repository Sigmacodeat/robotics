/* eslint-disable @typescript-eslint/no-require-imports */
/*
  Find and optionally remove unused i18n keys.
  Usage:
    node scripts/find-unused-i18n.js [--apply] [--baseLocale=en] [--localesDir=src/i18n/messages] [--srcDir=src]

  Behaviour:
  - Scans code for next-intl usages: useTranslations('ns'), getTranslations('ns')
  - Collects t('key'), t.rich('key', ...), t(`key`) without interpolations
  - Also collects fully qualified calls like t('ns.key') anywhere
  - Builds full keys as `${ns}.${key}` for calls with scoped translator
  - Compares against all keys defined in base locale JSON
  - Prints unused keys. With --apply, removes them from ALL locale files in localesDir

  Notes:
  - Only literal namespaces and keys are detected. Dynamic keys/namespaces are ignored/safe.
  - Template literals with interpolations (e.g. t(`foo.${bar}`)) are ignored to avoid false positives.
*/

const fs = require('fs');
const path = require('path');
const { extractKeys } = require('./i18n-validator');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function flatten(obj, parent = '') {
  // Delegate to extractKeys for consistency
  const keys = extractKeys(obj, parent);
  return keys;
}

function walk(dir, includes = [/.*/], excludes = [/node_modules\//, /\.next\//, /dist\//, /build\//]) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = full.replace(process.cwd() + path.sep, '');
    const stat = fs.statSync(full);
    if (excludes.some((rx) => rx.test(rel))) continue;
    if (stat.isDirectory()) {
      results.push(...walk(full, includes, excludes));
    } else {
      if (includes.some((rx) => rx.test(entry))) {
        results.push(full);
      }
    }
  }
  return results;
}

function collectUsedKeys({ srcDir }) {
  const files = walk(srcDir, [/\.tsx?$/, /\.jsx?$/, /\.mdx?$/]);

  // Map file -> [namespaces]
  const fileNamespaces = new Map();
  // Global fully qualified keys ns.key seen anywhere
  const fullyQualified = new Set();

  const reUseTranslations = /useTranslations\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const reGetTranslations = /getTranslations\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const reTRich = /\bt(?:\.rich)?\(\s*['\"]([^'\"]+)['\"]/g; // captures key inside t('key') or t.rich('key')
  const reTBacktick = /\bt(?:\.rich)?\(\s*`([^`$]+)`/g; // backticks without interpolation
  const reRaw = /\braw\(\s*['\"]([^'\"]+)['\"]/g; // captures key inside raw('key')
  const reRawBacktick = /\braw\(\s*`([^`$]+)`/g; // backticks without interpolation in raw()
  const reFullyQualified = /\bt(?:\.rich)?\(\s*['\"]([a-zA-Z0-9_.]+\.[a-zA-Z0-9_.-]+)['\"]/g; // t('ns.key')
  const reFullyQualifiedBacktick = /\bt(?:\.rich)?\(\s*`([a-zA-Z0-9_.]+\.[a-zA-Z0-9_.-]+)`/g;

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const namespaces = new Set();
    for (const m of src.matchAll(reUseTranslations)) namespaces.add(m[1]);
    for (const m of src.matchAll(reGetTranslations)) namespaces.add(m[1]);
    if (namespaces.size > 0) fileNamespaces.set(file, namespaces);

    for (const m of src.matchAll(reFullyQualified)) fullyQualified.add(m[1]);
    for (const m of src.matchAll(reFullyQualifiedBacktick)) fullyQualified.add(m[1]);
  }

  // Now, for each file with namespaces, collect t('key') usages and combine
  const used = new Set(fullyQualified);
  for (const [file, namespaces] of fileNamespaces.entries()) {
    const src = fs.readFileSync(file, 'utf8');
    const keys = new Set();
    for (const m of src.matchAll(reTRich)) keys.add(m[1]);
    for (const m of src.matchAll(reTBacktick)) keys.add(m[1]);
    for (const m of src.matchAll(reRaw)) keys.add(m[1]);
    for (const m of src.matchAll(reRawBacktick)) keys.add(m[1]);
    if (keys.size === 0) continue;
    for (const ns of namespaces) {
      for (const k of keys) {
        // Skip keys that already include a dot (likely fully qualified); we already captured those
        if (k.includes('.')) continue;
        used.add(`${ns}.${k}`);
      }
    }
  }

  return used;
}

function getByPath(obj, pathStr) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function deleteByPath(obj, pathStr) {
  const parts = pathStr.split('.');
  function _del(target, idx) {
    if (idx === parts.length - 1) {
      delete target[parts[idx]];
      return;
    }
    const key = parts[idx];
    if (!(key in target)) return;
    _del(target[key], idx + 1);
    // cleanup empty objects
    if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key]) && Object.keys(target[key]).length === 0) {
      delete target[key];
    }
  }
  _del(obj, 0);
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const baseLocaleArg = args.find((a) => a.startsWith('--baseLocale='));
  const localesDirArg = args.find((a) => a.startsWith('--localesDir='));
  const srcDirArg = args.find((a) => a.startsWith('--srcDir='));
  const allowNamespacesArg = args.find((a) => a.startsWith('--allowNamespaces='));
  const allowNamespaces = allowNamespacesArg ? allowNamespacesArg.split('=')[1].split(',') : [];

  const baseLocale = baseLocaleArg ? baseLocaleArg.split('=')[1] : 'en';
  const localesDir = localesDirArg ? localesDirArg.split('=')[1] : 'src/i18n/messages';
  const srcDir = srcDirArg ? srcDirArg.split('=')[1] : 'src';

  const baseFile = path.join(process.cwd(), localesDir, `${baseLocale}.json`);
  if (!fs.existsSync(baseFile)) {
    console.error(`Base locale file not found: ${baseFile}`);
    process.exit(1);
  }

  const base = readJSON(baseFile);
  const baseKeys = new Set(flatten(base));
  const usedKeys = collectUsedKeys({ srcDir: path.join(process.cwd(), srcDir) });

  const unused = [...baseKeys].filter((k) => !usedKeys.has(k));

  console.log(`Total base keys: ${baseKeys.size}`);
  console.log(`Total used keys (detected): ${usedKeys.size}`);
  console.log(`Unused keys (candidate for removal): ${unused.length}`);
  if (unused.length > 0) {
    console.log('--- Unused keys ---');
    for (const k of unused) console.log(k);
  }

  if (!apply) {
    console.log('\nDry run. To apply removals across all locales, re-run with --apply');
    process.exit(0);
  }

  // Apply removals to all locale files in localesDir
  const localeFiles = fs.readdirSync(path.join(process.cwd(), localesDir)).filter((f) => f.endsWith('.json'));
  for (const file of localeFiles) {
    const full = path.join(process.cwd(), localesDir, file);
    const data = readJSON(full);
    for (const key of unused) {
      if (getByPath(data, key) !== undefined) {
        deleteByPath(data, key);
      }
    }
    writeJSON(full, data);
    console.log(`Updated ${full}`);
  }
}

if (require.main === module) {
  main();
}
