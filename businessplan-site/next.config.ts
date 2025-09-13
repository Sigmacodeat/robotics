import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Point to the i18n request configuration (required by next-intl v4)
// Supported defaults are ./(src/)i18n/request.{ts,tsx,js,jsx}
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Ensure Turbopack selects this project as root (multiple lockfiles detected)
  turbopack: {
    root: __dirname
  },
  async redirects() {
    return [
      // Legacy-Locale-Prefix 'de' entfernen -> Root (as-needed)
      {
        source: '/de/:path*',
        destination: '/:path*',
        permanent: true
      }
    ];
  }
};

export default withNextIntl(nextConfig);
