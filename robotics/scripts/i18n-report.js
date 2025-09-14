#!/usr/bin/env node
/*
  Simple i18n report for Business Plan core keys
  - Scans tBp('…') usages
  - Compares against known bp core namespaces
  - Prints potential missing/unknown keys
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const filesToScan = [];
(function collect(dir) {
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const d of list) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) {
      if (d.name === '.next' || d.name === 'node_modules' || d.name === '.git') continue;
      collect(p);
    } else if (/\.(tsx?|jsx?)$/.test(d.name)) {
      filesToScan.push(p);
    }
  }
})(SRC);

const tBpPattern = /tBp\(\s*['"]bp\.([^'"\)]+)['"][^\)]*\)/g; // captures bp.<key>
const forbiddenTPattern = /\bt\(\s*['"]bp\.[^'"\)]*['"]/g; // direct t('bp.…') calls

const usages = new Set();
const forbidden = [];
for (const file of filesToScan) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = tBpPattern.exec(content)) !== null) {
    usages.add(m[1]);
  }
  if (forbiddenTPattern.test(content)) {
    forbidden.push(file);
  }
}

// Known root namespaces in bp core (non-exhaustive, but useful):
const knownRoots = new Set([
  'title',
  'sections',
  'headings',
  'tables',
  'labels',
  'series',
  'figures',
  'notes',
  'tech',
  'risks',
  'exit',
  'emptyNotice',
]);

// Basic report: list keys and flag those not starting with known roots
const report = [];
for (const key of Array.from(usages).sort()) {
  const top = key.split('.')[0];
  const known = knownRoots.has(top);
  report.push({ key: `bp.${key}`, top, known });
}

const unknown = report.filter((r) => !r.known);

console.log('\n[i18n-report] tBp usages:');
for (const r of report) {
  console.log(` - ${r.key}${r.known ? '' : '  (unknown root)'}`);
}

if (unknown.length) {
  console.log('\n[i18n-report] Potential unknown root keys:');
  for (const r of unknown) console.log(` ! ${r.key}`);
} else {
  console.log('\n[i18n-report] No unknown root prefixes found.');
}

if (forbidden.length) {
  console.log('\n[i18n-report] Forbidden t(\'bp.…\') calls found in:');
  for (const f of forbidden) console.log(` ! ${path.relative(ROOT, f)}`);
} else {
  console.log('\n[i18n-report] No forbidden t(\'bp.…\') usages.');
}

const strict = process.argv.includes('--strict');
if (strict && (unknown.length || forbidden.length)) {
  console.error('\n[i18n-report] Strict mode: failing due to issues above.');
  process.exit(2);
}

console.log('\n[i18n-report] Done.');
