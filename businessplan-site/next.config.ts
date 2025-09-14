import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Point to the i18n request configuration (required by next-intl v4)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Ensure Turbopack selects this project as root (multiple lockfiles detected)
  turbopack: {
    root: __dirname
  },
  
  // Enable static exports for the whole app
  output: 'export',
  
  // Ensure static assets are properly served
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  
  // Add base path if needed (should match Vercel project settings)
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Ensure source maps are generated for debugging
  productionBrowserSourceMaps: true,
  
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
