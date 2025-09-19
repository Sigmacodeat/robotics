import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

let intlFactory: any | null = null;

export default async function middleware(req: NextRequest) {
  try {
    if (!intlFactory) {
      const mod = await import('next-intl/middleware');
      const createMiddleware = (mod && (mod.default as any)) ?? null;
      intlFactory = createMiddleware?.({
        locales: ['de', 'en'],
        defaultLocale: 'de',
        localePrefix: 'as-needed',
      });
    }
    if (intlFactory) {
      return intlFactory(req);
    }
  } catch (err) {
    try {
      console.error('[intl-middleware] failed', {
        url: req.nextUrl?.href,
        method: req.method,
        error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : String(err)
      });
    } catch {}
  }
  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals, API routes and all files with an extension from i18n handling
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

