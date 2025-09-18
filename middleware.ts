import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Lazy-Initialisierung, um Importzeit-Fehler (Edge) zu vermeiden.
// Falls das Erstellen der Middleware Exceptions wirft, wird dies im Handler gefangen.
let intlMiddleware: ReturnType<typeof createMiddleware> | null = null;

export default function middleware(req: NextRequest) {
  try {
    // Erzeuge die Middleware beim ersten Request (und reuse danach)
    if (!intlMiddleware) {
      intlMiddleware = createMiddleware({
        locales: ['de', 'en'],
        // Align with src/i18n/request.ts (defaultLocale: 'de', localePrefix: 'as-needed')
        defaultLocale: 'de',
        localePrefix: 'as-needed'
      });
    }
    return intlMiddleware(req);
  } catch {
    // Fail-safe: never bring the site down due to middleware errors.
    // Note: Edge logs for this catch are visible in Vercel Function logs.
    const res = NextResponse.next();
    // Diagnose-Header hilft beim Erkennen, dass der Fallback gegriffen hat
    res.headers.set('x-intl-mw-fallback', '1');
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
