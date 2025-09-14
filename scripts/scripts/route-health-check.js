#!/usr/bin/env node
/*
  Route Health Check (dev)
  - Pingt eine Auswahl relevanter Routen parallel
  - Erkennt automatisch Port 3000 oder 3001 (fallback)
  - Nutzt Node 18+/20+ global fetch
  - Exit-Code 0 (immer) – mit --strict optional non-zero bei Fehlern
*/

const DEFAULT_PORTS = [3000, 3001];
const TIMEOUT_MS = 15000; // allow cold starts / first render
const STRICT = process.argv.includes('--strict');

function withTimeout(p, ms, label) {
  let t;
  const timeout = new Promise((_, rej) => (t = setTimeout(() => rej(new Error(`Timeout after ${ms}ms (${label})`)), ms)));
  return Promise.race([p.finally(() => clearTimeout(t)), timeout]);
}

async function probePath(port, path) {
  try {
    const res = await withTimeout(fetch(`http://localhost:${port}${path}`), TIMEOUT_MS, `probe:${port}${path}`);
    return res.status < 400;
  } catch {
    return false;
  }
}

async function detectPort() {
  const explicit = process.env.NEXT_DEV_PORT || process.env.PORT;
  if (explicit) return Number(explicit);
  const candidates = await Promise.all(
    DEFAULT_PORTS.map(async (p) => {
      const checks = await Promise.all([
        probePath(p, '/'),
        probePath(p, '/chapters/cover'),
        probePath(p, '/chapters/executive'),
      ]);
      const score = checks.filter(Boolean).length;
      return { port: p, score };
    })
  );
  const best = candidates.sort((a, b) => b.score - a.score)[0];
  return (best && best.score > 0) ? best.port : 3000;
}

function buildRoutes(locale = 'de') {
  return [
    '/',
    '/pitch',
    '/lebenslauf',
    `/` + locale + '/lebenslauf',
    '/chapters/cover',
    '/chapters/executive',
    '/chapters/market',
    '/chapters/technology',
    '/chapters/business-model',
    '/chapters/gtm',
    '/chapters/impact',
    '/chapters/risks',
    '/chapters/finance',
    '/chapters/team',
    '/chapters/traction-kpis',
  ];
}

async function checkRoute(base, path) {
  const url = base + path;
  try {
    const res = await withTimeout(fetch(url, { redirect: 'manual' }), TIMEOUT_MS, path);
    const ok = res.status >= 200 && res.status < 400; // 3xx erlaubt (SSR/redirects)
    return { path, status: res.status, ok };
  } catch (err) {
    // retry once after short delay to mitigate cold-build timeouts
    await new Promise(r => setTimeout(r, 400));
    try {
      const res2 = await withTimeout(fetch(url, { redirect: 'manual' }), TIMEOUT_MS, path + ':retry');
      const ok2 = res2.status >= 200 && res2.status < 400;
      return { path, status: res2.status, ok: ok2 };
    } catch (err2) {
      return { path, status: 0, ok: false, err: err2?.message || String(err2) };
    }
  }
}

(async () => {
  const port = await detectPort();
  const base = `http://localhost:${port}`;
  const locale = process.env.NEXT_LOCALE || 'de';
  const routes = buildRoutes(locale);
  console.log(`[health] Prüfe ${routes.length} Routen gegen ${base} (locale=${locale}) ...`);
  const results = await Promise.all(routes.map(r => checkRoute(base, r)));
  const failures = results.filter(r => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? '✅' : '❌'} ${r.path} ${r.status ? '(' + r.status + ')' : ''}${r.err ? ' - ' + r.err : ''}`);
  }
  if (failures.length) {
    console.log(`[health] ${failures.length} fehlgeschlagene Route(n).`);
    if (STRICT) process.exit(1);
  } else {
    console.log('[health] Alle Routen erreichbar.');
  }
  process.exit(0);
})();
