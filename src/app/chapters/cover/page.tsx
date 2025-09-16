import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import CoverPage from '@/components/document/CoverPage';
import { buildLocalePath } from '@/i18n/path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: buildLocalePath(locale, '/chapters/cover') }
  };
}

export default function CoverRoutePage() {
  return (
    <div aria-label="Deckblatt" className="relative">
      {/* Hinweis: Im Druckmodus wird dieses Deckblatt bereits automatisch vorangestellt. */}
      <CoverPage preview />
    </div>
  );
}
