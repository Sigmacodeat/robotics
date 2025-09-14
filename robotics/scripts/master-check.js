#!/usr/bin/env node
/**
 * Master-Check Pipeline
 *
 * Läuft eine Sequenz robuster Checks:
 * - ESLint (optional --fix)
 * - TypeScript Type-Check (tsc --noEmit)
 * - i18n-Checks (Schema, Konsistenz, ungenutzte Keys)
 * - Unit-Tests (Jest)
 * - Optional: E2E-Tests (Playwright) — deaktiviert mit --fast
 * - Next.js Build (fasst viele Integrations-/Route-Probleme)
 *
 * Flags:
 *   --fast  -> Überspringt E2E-Tests und i18n:unused (schneller lokaler Recheck)
 *   --fix   -> Führt ESLint mit --fix aus
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const isFast = args.includes('--fast');
const isFix = args.includes('--fix');

function run(cmd, cmdArgs = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      cwd: opts.cwd || process.cwd(),
      env: process.env,
    });
    child.on('exit', (code) => {
      if (code === 0) return resolve();
      const err = new Error(`${cmd} ${cmdArgs.join(' ')} exited with code ${code}`);
      err.code = code;
      reject(err);
    });
  });
}

async function main() {
  const steps = [];

  // 1) ESLint
  steps.push({
    name: 'ESLint',
    run: () => run('npm', ['run', 'lint', ...(isFix ? ['--', '--fix'] : [])]),
  });

  // 2) TypeScript Type-Check
  steps.push({
    name: 'TypeScript Type-Check',
    run: () => run('npx', ['tsc', '--noEmit']),
  });

  // 3) i18n Validierung (Schema + Konsistenz)
  steps.push({ name: 'i18n Schema', run: () => run('npm', ['run', 'i18n:schema']) });
  steps.push({ name: 'i18n Check', run: () => run('npm', ['run', 'i18n:check']) });
  if (!isFast) {
    // Verwende den TS-basierten Unused-Check, da keine en.json als Basisdatei existiert
    steps.push({ name: 'i18n Unused', run: () => run('npm', ['run', 'i18n:unused:ts']) });
  }

  // 4) Unit-Tests (Jest)
  steps.push({ name: 'Unit Tests', run: () => run('npm', ['run', 'test']) });

  // 5) Optional: E2E (Playwright)
  if (!isFast) {
    steps.push({ name: 'E2E Tests', run: () => run('npm', ['run', 'test:e2e']) });
  }

  // 6) Next.js Build (Routen/Integrationscheck)
  steps.push({ name: 'Next Build', run: () => run('npm', ['run', 'build']) });

  const failures = [];
  for (const step of steps) {
    const label = `▶ ${step.name}`;
    console.log('\n' + '='.repeat(80));
    console.log(label);
    console.log('='.repeat(80));
    try {
      await step.run();
      console.log(`✔ ${step.name} OK`);
    } catch (err) {
      console.error(`✖ ${step.name} FAILED`);
      failures.push({ step: step.name, error: err.message || String(err) });
    }
  }

  console.log('\n' + '-'.repeat(80));
  if (failures.length === 0) {
    console.log('Alle Checks erfolgreich.');
    process.exit(0);
  } else {
    console.error('Zusammenfassung fehlgeschlagener Checks:');
    for (const f of failures) {
      console.error(` - ${f.step}: ${f.error}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
