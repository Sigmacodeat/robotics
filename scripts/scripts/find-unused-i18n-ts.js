#!/usr/bin/env node
/*
  Lightweight TS-aware i18n unused key finder for next-intl keys starting with "bp.".
  - Scans src/i18n/messages/en/bp.ts to extract known key paths under selected groups (sections, headings, tables.headers, tables.captions, figures, impactHeadings, series, labels)
  - Scans src/ for usages t("bp.xxx")
  - Prints keys that exist in en/bp.ts but are not referenced in code via t("...")

  Note: Content keys (bp.content.*) werden absichtlich ignoriert, da diese in diesem Projekt oft
  direkt über den messages-Objektzugriff (m("content")...) verwendet werden und nicht via t().
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EN_BP_PATH = path.join(ROOT, 'src/i18n/messages/en/bp/index.ts');
const SRC_DIR = path.join(ROOT, 'src');

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function collectEnBpKeys(tsSource) {
  // Very simple parser to collect keys under specific top-level groups
  const groups = [
    { name: 'sections', pathPrefix: 'bp.sections.' },
    { name: 'headings', pathPrefix: 'bp.headings.' },
    { name: 'tables', pathPrefix: 'bp.tables.' },
    { name: 'figures', pathPrefix: 'bp.figures.' },
    { name: 'impactHeadings', pathPrefix: 'bp.impactHeadings.' },
    { name: 'series', pathPrefix: 'bp.series.' },
    { name: 'labels', pathPrefix: 'bp.labels.' },
  ];

  const all = new Set();

  function extractBlock(source, startIndex) {
    // assume '{' at startIndex, return substring till matching '}' (balanced)
    let depth = 0;
    let i = startIndex;
    for (; i < source.length; i++) {
      const ch = source[i];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
    }
    return source.slice(startIndex, i);
  }

  for (const g of groups) {
    const idx = tsSource.indexOf(`${g.name}:`);
    if (idx === -1) continue;
    const braceIdx = tsSource.indexOf('{', idx);
    if (braceIdx === -1) continue;
    const block = extractBlock(tsSource, braceIdx);

    if (g.name === 'tables') {
      // parse nested headers/captions groups separately
      for (const sub of ['headers', 'captions']) {
        const sidx = block.indexOf(`${sub}:`);
        if (sidx === -1) continue;
        const sbrace = block.indexOf('{', sidx);
        if (sbrace === -1) continue;
        const sblock = extractBlock(block, sbrace);
        const propRegex = /\n\s*([a-zA-Z0-9_]+)\s*:/g;
        let m;
        while ((m = propRegex.exec(sblock))) {
          all.add(`${g.pathPrefix}${sub}.${m[1]}`);
        }
      }
      continue;
    }

    // generic: collect direct properties in this block (shallow)
    const propRegex = /\n\s*([a-zA-Z0-9_]+)\s*:/g;
    let m;
    while ((m = propRegex.exec(block))) {
      all.add(`${g.pathPrefix}${m[1]}`);
    }
  }

  return all;
}

function scanCodeForUsedKeys(dir) {
  const used = new Set();
  const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        // skip node_modules, coverage, .next
        if (e.name === 'node_modules' || e.name === '.next' || e.name === 'coverage') continue;
        walk(p);
      } else {
        if (!exts.has(path.extname(e.name))) continue;
        const src = readFileSafe(p);
        if (!src) continue;
        // 1) Direct next-intl usage: t("bp....")
        const reDirect = /\bt\(\s*["'](bp\.[^"']+)["']/g;
        let m;
        while ((m = reDirect.exec(src))) {
          used.add(m[1]);
        }

        // 2) Aliased translator via getTranslations('bp') or useTranslations('bp')
        //    Example: const tBp = await getTranslations('bp'); tBp('headings.ipMoat')
        //             const tBp = useTranslations('bp'); tBp('headings.ipMoat')
        const aliasRegex = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:await\s*)?(?:getTranslations|useTranslations)\(\s*["']bp["']\s*\)/g;
        const aliases = new Set();
        let am;
        while ((am = aliasRegex.exec(src))) {
          aliases.add(am[1]);
        }
        if (aliases.size > 0) {
          // Build a regex that matches any alias('path') occurrences
          const names = Array.from(aliases).map(n => n.replace(/[$]/g, "\\$&"));
          const callRe = new RegExp(`\\b(${names.join('|')})\\(\\s*["']([^"']+)["']`, 'g');
          let cm;
          while ((cm = callRe.exec(src))) {
            const path = cm[2];
            // Only count bp.* groups we care about
            // We remap alias('headings.ipMoat') => bp.headings.ipMoat
            if (/^(sections|headings|tables\.(?:headers|captions)|figures|impactHeadings|series|labels)\b/.test(path)) {
              used.add(`bp.${path}`);
            }
          }
        }
      }
    }
  }

  walk(dir);
  return used;
}

function main() {
  const source = readFileSafe(EN_BP_PATH);
  if (!source) {
    console.error(`Base locale file not found: ${EN_BP_PATH}`);
    process.exit(1);
  }
  const all = collectEnBpKeys(source);
  const used = scanCodeForUsedKeys(SRC_DIR);

  // Optional whitelist to ignore specific keys (future use / intentionally reserved)
  const whitelist = new Set([
    // Sections that are represented by dedicated namespaces elsewhere
    'bp.sections.exit',
    'bp.sections.traction',
    // Headings commonly displayed via chapter‑specific content blocks / not always referenced via t('bp.headings.*')
    'bp.headings.investing',
    'bp.headings.operating',
    'bp.headings.ours',
    'bp.headings.partners',
    'bp.headings.target',
    'bp.headings.today',
  ]);
  const unused = [...all].filter(k => !used.has(k) && !whitelist.has(k)).sort();

  if (unused.length === 0) {
    console.log('✅ Keine ungenutzten bp.* Keys (Gruppen: sections, headings, tables.headers, tables.captions, figures, impactHeadings, series, labels)');
    process.exit(0);
  }

  console.log('🔎 Unbenutzte bp.* Keys gefunden (nur ausgewählte Gruppen):');
  for (const k of unused) console.log(' -', k);
  // exit with 0 to make it informational by default; change to 1 if you want CI to fail
  process.exit(0);
}

main();
