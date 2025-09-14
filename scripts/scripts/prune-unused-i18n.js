#!/usr/bin/env node
/*
  Prune unused bp.* keys from en/de in safe groups after scanning usage.
  - Scans src for t("bp....") usages (like scripts/find-unused-i18n-ts.js)
  - Collects candidate keys from en/bp.ts under selected groups
  - Filters to keys not used
  - Dry-run by default: prints what would be removed
  - Use --apply to actually remove keys in BOTH en and de, keeping schema in sync

  Safety:
  - Only prunes top-level groups: sections, headings, tables.headers, tables.captions, figures, impactHeadings, series, labels
  - Does NOT touch bp.content.* or nested complex structures
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EN_BP = path.join(ROOT, 'src/i18n/messages/en/bp.ts');
const DE_BP = path.join(ROOT, 'src/i18n/messages/de/bp.ts');
const SRC_DIR = path.join(ROOT, 'src');
const APPLY = process.argv.includes('--apply');

function readFileSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function writeFile(p, content) { fs.writeFileSync(p, content, 'utf8'); }

function extractBlock(source, startIndex) {
  let depth = 0; let i = startIndex;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return source.slice(startIndex, i);
}

function collectEnKeys(tsSource) {
  const groups = [
    { name: 'sections', prefix: 'bp.sections.' },
    { name: 'headings', prefix: 'bp.headings.' },
    { name: 'tables', prefix: 'bp.tables.' },
    { name: 'figures', prefix: 'bp.figures.' },
    { name: 'impactHeadings', prefix: 'bp.impactHeadings.' },
    { name: 'series', prefix: 'bp.series.' },
    { name: 'labels', prefix: 'bp.labels.' },
  ];
  const all = new Set();
  const tableSubProps = ['headers', 'captions'];

  for (const g of groups) {
    const idx = tsSource.indexOf(`${g.name}:`);
    if (idx === -1) continue;
    const braceIdx = tsSource.indexOf('{', idx);
    if (braceIdx === -1) continue;
    const block = extractBlock(tsSource, braceIdx);

    if (g.name === 'tables') {
      for (const sub of tableSubProps) {
        const sidx = block.indexOf(`${sub}:`);
        if (sidx === -1) continue;
        const sbrace = block.indexOf('{', sidx);
        if (sbrace === -1) continue;
        const sblock = extractBlock(block, sbrace);
        const propRegex = /\n\s*([a-zA-Z0-9_]+)\s*:/g;
        let m; while ((m = propRegex.exec(sblock))) all.add(`${g.prefix}${sub}.${m[1]}`);
      }
      continue;
    }

    const propRegex = /\n\s*([a-zA-Z0-9_]+)\s*:/g;
    let m; while ((m = propRegex.exec(block))) all.add(`${g.prefix}${m[1]}`);
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
        if (e.name === 'node_modules' || e.name === '.next' || e.name === 'coverage') continue;
        walk(p);
      } else {
        if (!exts.has(path.extname(e.name))) continue;
        const src = readFileSafe(p); if (!src) continue;
        const re = /\bt\(\s*["'](bp\.[^"']+)["']/g;
        let m; while ((m = re.exec(src))) used.add(m[1]);
      }
    }
  }
  walk(dir); return used;
}

function main() {
  const enSrc = readFileSafe(EN_BP);
  const deSrc = readFileSafe(DE_BP);
  if (!enSrc || !deSrc) {
    console.error('❌ en/de bp.ts nicht gefunden');
    process.exit(1);
  }
  const all = [...collectEnKeys(enSrc)];
  const used = scanCodeForUsedKeys(SRC_DIR);
  const unused = all.filter(k => !used.has(k));

  if (unused.length === 0) {
    console.log('✅ Keine unbenutzten Keys (sichere Gruppen)');
    process.exit(0);
  }

  console.log('🔎 Kandidaten (unbenutzt):');
  for (const k of unused) console.log(' -', k);

  if (!APPLY) {
    console.log('\nℹ Dry-run. Mit --apply werden diese Keys in en/de entfernt.');
    process.exit(0);
  }

  // Apply removal: naive line-based removal for the groups we target
  function removeKeys(src, keys) {
    // Build property names per group (strip 'bp.<group>.' prefix)
    const propNames = new Set(keys.map(k => k.split('.').slice(2).join('.')));
    const lines = src.split('\n');
    const out = [];
    let skipLine = false;
    for (let line of lines) {
      // Simple removal only for shallow props like '  target: "...",' or within tables.headers/captions
      const m = line.match(/^\s*([a-zA-Z0-9_]+)\s*:\s*.*$/);
      if (m) {
        const prop = m[1];
        // shallow
        if (propNames.has(prop)) {
          continue; // drop this line
        }
      }
      out.push(line);
    }
    return out.join('\n');
  }

  // Group keys by top-level group
  const groupBy = (arr, fn) => arr.reduce((acc, x) => { const k = fn(x); (acc[k] ||= []).push(x); return acc; }, {});
  const perGroup = groupBy(unused, k => k.split('.').slice(0,2).join('.')); // e.g., 'bp.sections'

  let newEn = enSrc;
  let newDe = deSrc;

  for (const [group, keys] of Object.entries(perGroup)) {
    if (!['bp.sections', 'bp.headings'].includes(group)) continue; // safe groups for mutation
    // Reduce to shallow prop names
    const propNames = keys.map(k => k.replace(/^bp\.(?:sections|headings)\./, ''));
    newEn = removeKeys(newEn, propNames.map(p => `bp.${group.split('.')[1]}.${p}`));
    newDe = removeKeys(newDe, propNames.map(p => `bp.${group.split('.')[1]}.${p}`));
  }

  writeFile(EN_BP, newEn);
  writeFile(DE_BP, newDe);
  console.log('✅ Unbenutzte Keys in en/de entfernt (Gruppen: sections, headings)');
}

try { main(); } catch (e) { console.error('❌ prune failed:', e?.message || e); process.exit(1); }
