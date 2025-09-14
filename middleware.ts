import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['de', 'en'],
  // Align with src/i18n/request.ts (defaultLocale: 'de', localePrefix: 'as-needed')
  defaultLocale: 'de',
  localePrefix: 'as-needed'
});

export const config = {
  // Exclude Next.js internals, API routes and all files with an extension from i18n handling
  // Recommended pattern per next-intl v4 docs
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
