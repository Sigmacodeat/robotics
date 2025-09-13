#!/usr/bin/env node
/*
  Ensure bp.finance keys exist – LEGACY helper for JSON locales.
  Hinweis: JSON-Locales (combined.json) werden nicht mehr aktiv verwendet.
  Dieses Skript bleibt für historische Migrationen/Backups bestehen und ist ein No-Op,
  wenn keine combined.json vorhanden ist.
*/
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const combinedPath = path.join(root, 'src', 'i18n', 'messages', 'combined.json');

function load() {
  if (!fs.existsSync(combinedPath)) {
    console.log('[i18n] ensure-finance (legacy): combined.json nicht gefunden – überspringe (no-op).');
    return null;
  }
  try {
    const raw = fs.readFileSync(combinedPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[i18n] ensure-finance (legacy): Konnte combined.json nicht lesen:', e?.message || e);
    return null;
  }
}

function save(obj) {
  if (!obj) return;
  fs.writeFileSync(combinedPath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function ensure(obj, pathArr, init) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const k = pathArr[i];
    if (typeof cur[k] !== 'object' || cur[k] == null) cur[k] = {};
    cur = cur[k];
  }
  const last = pathArr[pathArr.length - 1];
  if (typeof cur[last] === 'undefined') cur[last] = init;
}

function leaf(de, en) { return { de, en }; }

function main() {
  const data = load();
  if (!data) {
    // Keine combined.json – nichts zu tun
    return console.log('[i18n] ensure-finance: übersprungen.');
  }
  if (!data.bp) data.bp = {};
  if (!data.bp.finance) data.bp.finance = {};

  // Arrays of lines
  ensure(data, ['bp','finance','teamPlan'], [
    leaf('2025: 6 FTE (3x Software/AI, 1x Robotics, 1x PM, 1x BizDev)','2025: 6 FTE (3x Software/AI, 1x Robotics, 1x PM, 1x BizDev)'),
    leaf('2026: 10 FTE (+2 Robotics, +1 AI Research, +1 QA)','2026: 10 FTE (+2 Robotics, +1 AI Research, +1 QA)'),
    leaf('2027: 16 FTE (+3 Fullstack, +2 Robotics, +1 UX)','2027: 16 FTE (+3 Fullstack, +2 Robotics, +1 UX)'),
    leaf('2028: 24 FTE (+4 Robotics, +2 AI, +2 Support)','2028: 24 FTE (+4 Robotics, +2 AI, +2 Support)'),
    leaf('2029/30: 32–35 FTE (+5 Robotics, +4 AI, +2 Ops, +2 Sales)','2029/30: 32–35 FTE (+5 Robotics, +4 AI, +2 Ops, +2 Sales)')
  ]);

  ensure(data, ['bp','finance','personnelCosts'], [
    leaf('2025: 450.000 €','2025: €450,000'),
    leaf('2026: 750.000 €','2026: €750,000'),
    leaf('2027: 1.200.000 €','2027: €1,200,000'),
    leaf('2028: 1.800.000 €','2028: €1,800,000'),
    leaf('2029/30: 2.400.000 €','2029/30: €2,400,000')
  ]);

  ensure(data, ['bp','finance','infraCosts'], [
    leaf('Humanoide Roboter: 2025 1x (150.000 €), 2027 +2 (300.000 €), 2029 +5 (750.000 €)','Humanoid robots: 2025 1x (€150k), 2027 +2 (€300k), 2029 +5 (€750k)'),
    leaf('Server/Cloud & Infrastruktur: 2025 50.000 €, steigend bis 250.000 € (2030)','Server/Cloud & infrastructure: 2025 €50k, growing to €250k by 2030'),
    leaf('High-End Workstations: 40.000 € (2025), 20.000 € (2026)','High-end workstations: €40k (2025), €20k (2026)'),
    leaf('Sensorik/Peripherie: 10.000–35.000 € jährlich','Sensors/peripherals: €10k–€35k yearly')
  ]);

  ensure(data, ['bp','finance','overhead'], [
    leaf('Miete & Office: Ø 100.000 €/Jahr','Rent & office: ~€100k/year'),
    leaf('Administration & Rechtsberatung: Ø 50.000 €/Jahr','Admin & legal: ~€50k/year'),
    leaf('Marketing & Vertrieb: 2027 150.000 €, 2030 500.000 €','Marketing & sales: €150k (2027), €500k (2030)')
  ]);

  ensure(data, ['bp','finance','thirdParty'], [
    leaf('Beratung, Zertifizierung, IP: 50–150k €/Jahr','Advisory, certification, IP: €50–150k/year'),
    leaf('Patente, rechtliche Themen: 20–60k €/Jahr','Patents, legal: €20–60k/year')
  ]);

  // Tables: arrays of arrays (strings)
  ensure(data, ['bp','finance','totalsTable'], [
    ['2025','375.000 €','200.000 €','150.000 €','725.000 €'],
    ['2026','750.000 €','225.000 €','200.000 €','1.175.000 €'],
    ['2027','1.200.000 €','400.000 €','300.000 €','1.900.000 €'],
    ['2028','1.575.000 €','500.000 €','400.000 €','2.475.000 €'],
    ['2029','2.025.000 €','950.000 €','550.000 €','3.525.000 €'],
    ['2030','2.475.000 €','1.000.000 €','850.000 €','4.325.000 €']
  ]);

  ensure(data, ['bp','finance','revenueForecast'], [
    leaf('2025: 0 € (Fokus F&E)','2025: €0 (R&D focus)'),
    leaf('2026: 100.000 € (Pilotpartnerschaften)','2026: €100,000 (pilot partnerships)'),
    leaf('2027: 500.000 € (Erste RaaS-Kunden + Beta-Plattform)','2027: €500,000 (first RaaS customers + beta platform)'),
    leaf('2028: 2.500.000 € (Plattform + RaaS-Scaling)','2028: €2,500,000 (platform + RaaS scaling)'),
    leaf('2029: 7.500.000 € (EU-Rollout + 50 Apps)','2029: €7,500,000 (EU rollout + 50 apps)'),
    leaf('2030: 20.000.000 € (Skalierung + 200 Apps)','2030: €20,000,000 (scaling + 200 apps)')
  ]);

  ensure(data, ['bp','finance','capitalNeeds'], [
    leaf('Gesamt: ~9,44 Mio. € über 5 Jahre','Total: ~€9.44M over 5 years'),
    leaf('CAPEX: 3,6 Mio. € (Investitionen)','CAPEX: €3.6M (investments)'),
    leaf('OPEX: 10,7 Mio. € (Betriebskosten)','OPEX: €10.7M (operating)')
  ]);

  ensure(data, ['bp','finance','funding'], [
    leaf('Förderfähige Kosten: >80% der Ausgaben (R&D-nah)','Eligible costs: >80% of spend (R&D)'),
    leaf('Förderquote: aws Seedfinancing (bis 800k, 50–70%), FFG Basisprogramm (bis 2 Mio, 50–60%)','Rates: aws Seedfinancing (up to €800k, 50–70%), FFG base (up to €2M, 50–60%)'),
    leaf('Strategie: 2025–2026 aws + FFG (~1,2 Mio), 2027–2028 FFG (~2–3 Mio)','Strategy: 2025–2026 aws + FFG (~€1.2M), 2027–2028 FFG (~€2–3M)'),
    leaf('Eigenleistung: VC / Private Funding (ca. 40–50%)','Equity: VC / private funding (~40–50%)')
  ]);

  ensure(data, ['bp','finance','fundingStrategy'], [
    leaf('Phase 1 (2025–2026): aws Preseed/Seed + FFG Basisprogramm','Phase 1 (2025–2026): aws preseed/seed + FFG base'),
    leaf('Phase 2 (2027–2028): aws Seedfinancing + Business Angel + FFG','Phase 2 (2027–2028): aws seedfinancing + business angel + FFG'),
    leaf('Phase 3 (2029–2030): VC Series A/B + EU‑Förderungen','Phase 3 (2029–2030): VC Series A/B + EU grants')
  ]);

  ensure(data, ['bp','finance','revenueTable'], [
    ['2025','0 €','0 €','0 €','50k €','50k €'],
    ['2026','0 €','0 €','50k €','150k €','200k €'],
    ['2027','500k €','100k €','250k €','300k €','1,15 Mio €'],
    ['2028','2 Mio €','500k €','750k €','1 Mio €','4,25 Mio €'],
    ['2029','6 Mio €','1,5 Mio €','2 Mio €','2 Mio €','11,5 Mio €'],
    ['2030','15 Mio €','5 Mio €','5 Mio €','3 Mio €','28 Mio €']
  ]);

  save(data);
  console.log('Ensured bp.finance keys in', path.relative(process.cwd(), combinedPath));
}

main();
