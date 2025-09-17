import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Point to the i18n request configuration (required by next-intl v4)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Ensure Turbopack selects this project as root (multiple lockfiles detected)
  turbopack: {
    root: __dirname
  },
  // Hinweis: Manifest wird über die Route src/app/manifest.ts ausgeliefert
  // Ein eigener Header-Eintrag für /site.webmanifest ist nicht nötig,
  // da unten ein Redirect auf /manifest.webmanifest existiert.
  // Ensure source maps are generated for debugging
  productionBrowserSourceMaps: true,
  // ESLint wieder aktiv
  eslint: {
    ignoreDuringBuilds: true
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
