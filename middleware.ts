import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

let intlFactory: any | null = null;

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname || '/';
  // Nur für englische Locale-Pfade aktivieren; Standard-Locale 'de' ist ohne Prefix
  if (!pathname.startsWith('/en')) {
    return NextResponse.next();
  }

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
      console.error('[intl-middleware/en] failed', {
        url: req.nextUrl?.href,
        method: req.method,
        error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : String(err)
      });
    } catch {}
  }
  return NextResponse.next();
}

export const config = {
  // Nur englische Locale-Pfade matchen; verhindert unnötige Edge-Ausführung
  matcher: ['/en/:path*']
};

