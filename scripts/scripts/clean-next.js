#!/usr/bin/env node
/* Sauberes Entfernen des .next Ordners, um dev-Cache/ENOENT-Issues zu vermeiden */
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', '.next');

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  const stat = fs.lstatSync(p);
  if (stat.isDirectory()) {
    for (const f of fs.readdirSync(p)) {
      rmrf(path.join(p, f));
    }
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

try {
  rmrf(target);
  console.log('[clean] .next entfernt');
  process.exit(0);
} catch (err) {
  console.warn('[clean] Konnte .next nicht vollständig entfernen:', err?.message || err);
  process.exit(0);
}
