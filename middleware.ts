import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// TEMP: Pass-through Middleware, um Edge-Fehlerquelle einzugrenzen
export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals, API routes and all files with an extension from i18n handling
  // Recommended pattern per next-intl v4 docs
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

