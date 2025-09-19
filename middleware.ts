import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Lazy-Initialisierung, um Importzeit-Fehler (Edge) zu vermeiden.
// Falls das Erstellen der Middleware Exceptions wirft, wird dies im Handler gefangen.
let intlMiddleware: ReturnType<typeof createMiddleware> | null = null;
let createIntlMw: typeof createMiddleware | null = null;

export default async function middleware(req: NextRequest) {
  try {
    // Erzeuge die Middleware beim ersten Request (und reuse danach)
    if (!intlMiddleware) {
      if (!createIntlMw) {
        // Dynamischer Import verhindert Edge-Init-Probleme auf Modulebene
        const mod = await import('next-intl/middleware');
        createIntlMw = (mod && (mod.default as typeof createMiddleware)) ?? null;
      }
      const factory = createIntlMw ?? createMiddleware;
      intlMiddleware = factory({
        locales: ['de', 'en'],
        // Align with src/i18n/request.ts (defaultLocale: 'de', localePrefix: 'as-needed')
        defaultLocale: 'de',
        localePrefix: 'as-needed'
      });
    }
    return intlMiddleware(req);
  } catch (err) {
    // Fail-safe: never bring the site down due to middleware errors.
    // Note: Edge logs for this catch are visible in Vercel Function logs.
    try {
      // Edge Runtime: console.error ist erlaubt und wird in Vercel Function Logs angezeigt
      console.error('[intl-middleware] invocation failed', {
        url: req.nextUrl?.href,
        method: req.method,
        error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : String(err)
      });
    } catch {}
    const res = NextResponse.next();
    // Diagnose-Header hilft beim Erkennen, dass der Fallback gegriffen hat
    res.headers.set('x-intl-mw-fallback', '1');
    res.headers.set('x-intl-mw-url', req.nextUrl?.pathname || 'n/a');
    return res;
  }
}

export const config = {
  // Exclude Next.js internals, API routes and all files with an extension from i18n handling
  // Recommended pattern per next-intl v4 docs
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

