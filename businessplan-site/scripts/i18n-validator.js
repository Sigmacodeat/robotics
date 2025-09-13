/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

/**
 * Flacht alle Schlüssel eines Objekts/Arrays zu dot-notation ab.
 * Beispiel: { a: { b: 1, c: [2,3] } } => ['a.b','a.c.0','a.c.1']
 */
function extractKeys(obj, parent = '', depth = 0) {
  let keys = [];
  if (obj === null || obj === undefined) return keys;
  if (typeof obj !== 'object') {
    return parent ? [parent] : [];
  }
  if (Array.isArray(obj)) {
    // Nur den Array-Pfad aufnehmen, keine Index-Keys
    if (parent) keys.push(parent);
    // Wenn Array-Elemente Objekte sind, deren Struktur unter 'parent[]' sammeln
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      keys = keys.concat(extractKeys(obj[0], parent ? parent + '[]' : '[]', depth + 1));
    }
    return keys;
  }
  for (const key in obj) {
    const fullKey = parent ? `${parent}.${key}` : key;
    const val = obj[key];
    if (Array.isArray(val)) {
      // Nur den Array-Pfad aufnehmen
      keys.push(fullKey);
      if (val.length > 0 && typeof val[0] === 'object' && val[0] !== null) {
        keys = keys.concat(extractKeys(val[0], fullKey + '[]', depth + 1));
      }
    } else if (typeof val === 'object' && val !== null) {
      keys.push(fullKey);
      keys = keys.concat(extractKeys(val, fullKey, depth + 1));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * Ermittelt den (groben) Typ eines Werts: 'null' | 'array' | 'object' | 'string' | 'number' | 'boolean'.
 */
function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'object') return 'object';
  return t; // string | number | boolean | undefined | function (letztere sollten in JSON nicht vorkommen)
}

/**
 * Baut eine Map Pfad -> Typinformationen für Basisdaten auf.
 * Für Arrays wird zusätzlich der Elementtyp aus dem ersten Element versucht abzuleiten.
 */
function buildTypeMap(obj, parent = '', map = {}) {
  const currentType = getType(obj);
  if (currentType === 'array') {
    const fullKey = parent;
    let elementType = 'unknown';
    if (obj.length > 0) {
      elementType = getType(obj[0]);
    }
    map[fullKey] = { type: 'array', elementType };
    // Für Objekte in Arrays prüfen wir nur das erste Element rekursiv
    if (obj.length > 0 && elementType === 'object') {
      buildTypeMap(obj[0], parent + '[]', map);
    }
  } else if (currentType === 'object') {
    for (const key in obj) {
      const fullKey = parent ? `${parent}.${key}` : key;
      const child = obj[key];
      const childType = getType(child);
      if (childType === 'array') {
        let elementType = 'unknown';
        if (Array.isArray(child) && child.length > 0) {
          elementType = getType(child[0]);
        }
        map[fullKey] = { type: 'array', elementType };
        if (Array.isArray(child) && child.length > 0 && elementType === 'object') {
          buildTypeMap(child[0], fullKey + '[]', map);
        }
      } else if (childType === 'object') {
        map[fullKey] = { type: 'object' };
        buildTypeMap(child, fullKey, map);
      } else {
        map[fullKey] = { type: childType };
      }
    }
  } else if (parent) {
    map[parent] = { type: currentType };
  }
  return map;
}

/**
 * Holt einen Wert aus einem Objekt per dot-Pfad (ohne Array-Indizes; Arrays werden komplett zurückgegeben).
 */
function getByPath(obj, pathStr) {
  if (!pathStr) return obj;
  const parts = pathStr.split('.');
  let cur = obj;
  for (let raw of parts) {
    if (cur == null) return undefined;
    const isArraySeg = raw.endsWith('[]');
    const key = isArraySeg ? raw.slice(0, -2) : raw;
    cur = cur[key];
    if (isArraySeg) {
      if (!Array.isArray(cur)) return undefined;
      cur = cur[0];
    }
  }
  return cur;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Vergleicht die Struktur/Typ-Map der Basissprache mit einer Ziel-Locale und ermittelt Typabweichungen.
 */
function compareTypes(baseTypeMap, localeContent) {
  const mismatches = [];
  const flexibleArrayObject = new Set([
    'content.financePlanDetailed.capexOpex',
    'content.finance.capexOpex',
  ]);
  for (const [key, expected] of Object.entries(baseTypeMap)) {
    if (!key) continue; // root-schutz
    // Skip strikte Typprüfung für bp.required.* (Strings vs. Objekte werden in manchen Locales detaillierter gepflegt)
    if (key.startsWith('bp.required.')) continue;
    const actualVal = getByPath(localeContent, key);
    if (actualVal === undefined) continue; // fehlende Keys werden separat behandelt
    const actualType = getType(actualVal);
    if (expected.type !== actualType) {
      // Erlaube Array<Object> vs. Object (Dictionary) für bekannte Pfade
      if (flexibleArrayObject.has(key)) {
        const cond =
          (expected.type === 'array' && actualType === 'object') ||
          (expected.type === 'object' && actualType === 'array');
        if (cond) continue;
      }
      mismatches.push({ key, expected: expected.type, actual: actualType });
      continue;
    }
    if (expected.type === 'array' && expected.elementType && expected.elementType !== 'unknown') {
      const first = Array.isArray(actualVal) ? actualVal[0] : undefined;
      const actualElType = getType(first);
      if (Array.isArray(actualVal) && actualVal.length === 0) {
        // Leere Arrays akzeptieren wir bzgl. Elementtyp
        continue;
      }
      if (actualElType !== expected.elementType) {
        mismatches.push({ key: key + '[*]', expected: expected.elementType, actual: actualElType });
      }
    }
  }
  return mismatches;
}

/**
 * Liest Basis- und Zielsprachen ein und ermittelt fehlende Keys und Typabweichungen je Locale.
 * Gibt ein Array von { locale, missingKeys, typeMismatches } (ohne Basissprache) zurück.
 */
function validateLocales({ localesDir, baseLocale = 'en' }) {
  const baseFile = path.join(localesDir, `${baseLocale}.json`);
  if (!fs.existsSync(baseFile)) {
    throw new Error(`Basissprache nicht gefunden: ${baseFile}`);
  }
  const baseContent = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
  const baseKeys = extractKeys(baseContent);
  const baseTypeMap = buildTypeMap(baseContent);

  const results = [];
  const files = fs.readdirSync(localesDir)
    .filter(f => f.endsWith('.json'))
    .filter(f => f !== 'combined.json');
  for (const file of files) {
    if (file === `${baseLocale}.json`) continue;
    const locale = file.replace(/\.json$/, '');
    const filePath = path.join(localesDir, file);
    const localeContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const localeKeys = extractKeys(localeContent);
    const localeKeySet = new Set(localeKeys);
    const missingKeys = baseKeys.filter((k) => {
      if (localeKeySet.has(k)) return false;
      // Base hat Array-Index-Key (a.b.0): gilt nicht als fehlend, wenn Locale irgendeinen Index unter a.b hat
      const m = k.match(/^(.*)\.(\d+)$/);
      if (m) {
        const parent = m[1];
        const hasAnyIndex = localeKeys.some((x) => new RegExp('^' + escapeRegExp(parent) + '\\.(?:\\d+)(?:$|\.)').test(x));
        if (hasAnyIndex) return false;
      }
      // Umgekehrt: Base hat primitiven Key (a.b), Locale aber Array-Indizes (a.b.0, a.b.1 ...)
      // -> nicht als missing werten; Typkonflikt wird separat gemeldet
      const regex = new RegExp('^' + escapeRegExp(k) + '\\.(?:\\d+)(?:$|\.)');
      if (localeKeys.some((x) => regex.test(x))) return false;
      return true;
    });
    const typeMismatches = compareTypes(baseTypeMap, localeContent);
    results.push({ locale, missingKeys, typeMismatches });
  }
  return results;
}

module.exports = {
  extractKeys,
  validateLocales,
  getType,
  buildTypeMap,
  compareTypes,
};
