/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * LEGACY: Restores the 'cv' section in JSON locale files from the backup de.json.bak
 * if it's missing (e.g., after truncation/repair). Die App nutzt TS-Locales; diese
 * Utility bleibt nur für historische Backups/Recovery bestehen.
 *
 * Features added:
 * - Comprehensive error handling
 * - Backup validation
 * - File existence checks
 * - Recovery file creation on failure
 * - Timestamped logging
 *
 * Usage:
 *   node scripts/restore-cv.js
 */
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/messages');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

// Log with timestamps
function log(message) {
  console.log(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${message}`);
}

function error(message) {
  console.error(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ❌ ${message}`);
}

// Attempt to repair corrupted JSON
function tryRepairJSON(jsonString) {
  try {
    // Basic repair: remove trailing commas
    const repaired = jsonString.replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(repaired);
  } catch (repairErr) {
    throw new Error(`JSON repair failed: ${repairErr.message}`);
  }
}

function main() {
  // Potential sources in priority order
  const cvSources = [
    path.join(LOCALES_DIR, 'de.json'),
    path.join(LOCALES_DIR, 'en.json'),
    path.join(LOCALES_DIR, 'de.json.bak')
  ];

  let cvData = null;

  // Find first valid cv source
  for (const source of cvSources) {
    if (!fs.existsSync(source)) {
      log(`[legacy-json] Source not found: ${source}`);
      continue;
    }

    try {
      const data = readJSON(source);
      if (data?.cv && Object.keys(data.cv).length > 0) {
        cvData = data.cv;
        log(`Found valid cv in ${path.basename(source)}`);
        break;
      }
    } catch (err) {
      error(`[legacy-json] Error reading ${source}: ${err.message}`);
    }
  }

  if (!cvData) {
    log('[legacy-json] No valid cv source found - creating scaffold');
    cvData = {
      // MANUAL RESTORATION REQUIRED
      // ------------------------------------
      // Paste your CV content from Notion or other sources
      // Example structure:
      /*
      "title": "Curriculum Vitae",
      "sections": {
        "education": "Bildungsweg",
        "experience": "Berufserfahrung"
      }
      */
      // ------------------------------------
      // After pasting, remove these comments
    };
  }

  const targets = ['de.json', 'en.json'].map((f) => path.join(LOCALES_DIR, f));
  for (const file of targets) {
    if (!fs.existsSync(file)) {
      error(`[legacy-json] Skipping missing file: ${file}`);
      continue;
    }

    try {
      const data = readJSON(file);
      if (data.cv) {
        log(`cv already exists in ${path.basename(file)} (skipped)`);
        continue;
      }

      // Create recovery point
      const recoveryFile = file + `.bak.${format(new Date(), 'yyyyMMdd_HHmmss')}`;
      fs.copyFileSync(file, recoveryFile);
      log(`[legacy-json] Created recovery point: ${path.basename(recoveryFile)}`);

      data.cv = cvData;
      writeJSON(file, data);
      log(`[legacy-json] Restored cv to ${path.basename(file)}`);
    } catch (err) {
      error(`[legacy-json] Failed to process ${path.basename(file)}: ${err.message}`);
    }
  }
}

if (require.main === module) {
  main();
}
