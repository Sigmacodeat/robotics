/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Repairs a corrupted JSON file by truncating any trailing garbage after the
 * last position where JSON.parse still succeeds.
 *
 * Usage:
 *   node scripts/repair-json.js <path/to/file.json>
 */
const fs = require('fs');

function repairJSONFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // Fast path: if valid, do nothing
  try {
    JSON.parse(src);
    console.log(`OK: ${filePath} is already valid JSON`);
    return false;
  } catch (_) {
    // continue
  }

  let lastGood = -1;
  // Collect candidate end indices at each '}' or ']' occurrence
  const candidates = [];
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '}' || ch === ']') candidates.push(i);
  }
  for (const i of candidates) {
    const slice = src.slice(0, i + 1);
    try {
      JSON.parse(slice);
      lastGood = i + 1;
    } catch (_) {
      // ignore
    }
  }
  if (lastGood === -1) {
    throw new Error(`Could not find any valid JSON prefix in ${filePath}`);
  }
  const repaired = src.slice(0, lastGood) + '\n';
  fs.writeFileSync(filePath, repaired, 'utf8');
  console.log(`Repaired: truncated ${filePath} to ${lastGood} bytes`);
  return true;
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node scripts/repair-json.js <path/to/file.json>');
    process.exit(1);
  }
  try {
    const changed = repairJSONFile(target);
    process.exit(changed ? 0 : 0);
  } catch (e) {
    console.error(`Failed to repair ${target}:`, e.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
