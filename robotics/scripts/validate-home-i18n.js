/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Validate i18n usage specifically for the Homepage.
 *
 * Usage:
 *   node scripts/validate-home-i18n.js [--baseLocale=en] [--localesDir=src/i18n/messages] \
 *     [--entries=src/app/page.tsx,src/app/[locale]/page.tsx] [--srcDir=src]
 *
 * What it does:
 * - Starts from the given entry files (homepage) and recursively resolves local imports
 * - Extracts used i18n keys via next-intl usage patterns (useTranslations/getTranslations/t/raw)
 * - Compares used keys to locale JSONs
 * - Reports:
 *   - Missing keys (used but not defined in base locale)
 *   - Unused keys within used namespaces (present in base locale but not used on homepage)
 *   - Empty values for used keys per locale
 */

const fs = require('fs');
const path = require('path');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
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

function walkDeps(entries, { srcRoot }) {
  const exts = ['.tsx', '.ts', '.jsx', '.js'];
  const visited = new Set();
  const queue = [];

  const resolveImport = (fromFile, spec) => {
    // Ignore node_modules and absolute URLs
    if (/^(react|next|@|#|http|https):/.test(spec)) return null;
    // Alias '@/': map to srcRoot
    if (spec.startsWith('@/')) {
      spec = path.join(srcRoot, spec.slice(2));
    } else if (spec.startsWith('/')) {
      // absolute from project root
      spec = path.join(process.cwd(), spec.replace(/^\//, ''));
    } else {
      // relative to fromFile
      spec = path.join(path.dirname(fromFile), spec);
    }
    // Try file directly, then add extensions, then index files
    const candidates = [];
    candidates.push(spec);
    for (const ext of exts) candidates.push(spec + ext);
    for (const ext of exts) candidates.push(path.join(spec, 'index' + ext));
    for (const c of candidates) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
    }
    return null;
  };

  const addFile = (f) => {
    if (!f) return;
    if (!fs.existsSync(f)) return;
    const stat = fs.statSync(f);
    if (!stat.isFile()) return;
    if (visited.has(f)) return;
    visited.add(f);
    queue.push(f);
  };

  for (const e of entries) addFile(e);

  const importRegex = /(^|\n)\s*import\s+[^'";]+from\s*['"]([^'\"]+)['"];?|(^|\n)\s*import\s*['"]([^'\"]+)['"];?/g;

  while (queue.length > 0) {
    const file = queue.pop();
    const src = fs.readFileSync(file, 'utf8');
    // collect imports
    importRegex.lastIndex = 0;
    let m;
    while ((m = importRegex.exec(src))) {
      const spec = m[2] || m[4];
      const resolved = resolveImport(file, spec);
      if (resolved && resolved.startsWith(srcRoot)) addFile(resolved);
    }
  }

  return [...visited];
}

function collectUsedKeysFromFiles(files) {
  const reUseTranslations = /useTranslations\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const reGetTranslations = /getTranslations\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const reTRich = /\bt(?:\.rich)?\(\s*['\"]([^'\"]+)['\"]/g; // t('key') or t.rich('key')
  const reTBacktick = /\bt(?:\.rich)?\(\s*`([^`$]+)`/g; // backticks without interpolation
  const reRaw = /\braw\(\s*['\"]([^'\"]+)['\"]/g;
  const reRawBacktick = /\braw\(\s*`([^`$]+)`/g;
  const reFullyQualified = /\bt(?:\.rich)?\(\s*['\"]([a-zA-Z0-9_.]+\.[a-zA-Z0-9_.-]+)['\"]/g; // t('ns.key')
  const reFullyQualifiedBacktick = /\bt(?:\.rich)?\(\s*`([a-zA-Z0-9_.]+\.[a-zA-Z0-9_.-]+)`/g;

  const fileNamespaces = new Map();
  const fullyQualified = new Set();

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const namespaces = new Set();
    for (const m of src.matchAll(reUseTranslations)) namespaces.add(m[1]);
    for (const m of src.matchAll(reGetTranslations)) namespaces.add(m[1]);
    if (namespaces.size > 0) fileNamespaces.set(file, namespaces);

    for (const m of src.matchAll(reFullyQualified)) fullyQualified.add(m[1]);
    for (const m of src.matchAll(reFullyQualifiedBacktick)) fullyQualified.add(m[1]);
  }

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
        if (k.includes('.')) continue; // already fully qualified
        used.add(`${ns}.${k}`);
      }
    }
  }

  return used;
}

function main() {
  const args = process.argv.slice(2);
  const baseLocaleArg = args.find((a) => a.startsWith('--baseLocale='));
  const localesDirArg = args.find((a) => a.startsWith('--localesDir='));
  const entriesArg = args.find((a) => a.startsWith('--entries='));
  const srcDirArg = args.find((a) => a.startsWith('--srcDir='));

  const baseLocale = baseLocaleArg ? baseLocaleArg.split('=')[1] : 'en';
  const localesDir = localesDirArg ? localesDirArg.split('=')[1] : 'src/i18n/messages';
  const srcDir = srcDirArg ? srcDirArg.split('=')[1] : 'src';

  const defaultEntries = [
    path.join(process.cwd(), srcDir, 'app/page.tsx'),
    path.join(process.cwd(), srcDir, 'app/[locale]/page.tsx'),
  ];

  const entries = entriesArg
    ? entriesArg.split('=')[1].split(',').map((p) => (path.isAbsolute(p) ? p : path.join(process.cwd(), p)))
    : defaultEntries;

  const srcRoot = path.join(process.cwd(), srcDir);

  const existingEntries = entries.filter((f) => fs.existsSync(f));
  if (existingEntries.length === 0) {
    console.error('No homepage entry files found. Checked:', entries.join(', '));
    process.exit(1);
  }

  const files = walkDeps(existingEntries, { srcRoot });
  const usedKeys = collectUsedKeysFromFiles(files);

  const baseFile = path.join(process.cwd(), localesDir, `${baseLocale}.json`);
  if (!fs.existsSync(baseFile)) {
    console.error(`Base locale file not found: ${baseFile}`);
    process.exit(1);
  }
  const base = readJSON(baseFile);

  // Flatten base keys
  function flatten(obj, parent = '') {
    const keys = [];
    if (obj && typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        const full = parent ? `${parent}.${k}` : k;
        const val = obj[k];
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          keys.push(full);
          keys.push(...flatten(val, full));
        } else {
          keys.push(full);
        }
      }
    }
    return keys;
  }
  const baseKeys = new Set(flatten(base));

  // Compute missing (used but not in base)
  const missing = [...usedKeys].filter((k) => !baseKeys.has(k));

  // Compute namespaces used by homepage
  const usedNamespaces = new Set([...usedKeys].map((k) => k.split('.')[0]));

  // Unused within used namespaces: base keys that start with a used namespace but are not used
  const unusedWithinNs = [...baseKeys].filter((k) => {
    const ns = k.split('.')[0];
    return usedNamespaces.has(ns) && !usedKeys.has(k);
  });

  // Empty values per locale for used keys
  const localeFiles = fs.readdirSync(path.join(process.cwd(), localesDir)).filter((f) => f.endsWith('.json'));
  const emptyByLocale = [];
  for (const file of localeFiles) {
    const locale = file.replace(/\.json$/, '');
    const data = readJSON(path.join(process.cwd(), localesDir, file));
    const empties = [];
    for (const key of usedKeys) {
      const val = getByPath(data, key);
      if (val === '' || val === null) {
        empties.push(key);
      }
    }
    emptyByLocale.push({ locale, emptyKeys: empties });
  }

  // Output
  console.log(`Scanned homepage entries: ${existingEntries.map((f) => path.relative(process.cwd(), f)).join(', ')}`);
  console.log(`Resolved dependent files: ${files.length}`);
  console.log(`Used keys detected: ${usedKeys.size}`);

  if (missing.length > 0) {
    console.error('❌ Missing keys in base locale (likely typos on homepage):');
    for (const k of missing) console.error('  -', k);
  } else {
    console.log('✅ No missing keys in base locale.');
  }

  if (unusedWithinNs.length > 0) {
    console.warn('⚠️ Unused keys within used namespaces (present in base but not referenced on homepage):');
    for (const k of unusedWithinNs) console.warn('  -', k);
  } else {
    console.log('✅ No unused keys within used namespaces for homepage.');
  }

  let hasEmpty = false;
  for (const { locale, emptyKeys } of emptyByLocale) {
    if (emptyKeys.length > 0) {
      hasEmpty = true;
      console.warn(`⚠️ Empty values in ${locale}:`);
      for (const k of emptyKeys) console.warn('  -', k);
    } else {
      console.log(`✅ ${locale}: No empty values for used homepage keys.`);
    }
  }

  // Exit code: 1 if any critical issue (missing or empty in base)
  const baseEmpties = emptyByLocale.find((x) => x.locale === baseLocale)?.emptyKeys ?? [];
  if (missing.length > 0 || baseEmpties.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
