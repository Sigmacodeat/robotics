import { notFound } from 'next/navigation';
import ChaptersLayout from '@/app/chapters/layout';

// Render localized routes like /en/chapters/... indem die korrespondierenden
// Komponenten aus src/app/chapters/... geladen werden. So bleibt der Pfad mit Locale bestehen
// und next-intl kann html[lang] korrekt setzen.
export default async function LocaleProxyPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = (await Promise.resolve(params)) ?? {} as { slug?: string[] };
  const parts = Array.isArray(slug) ? slug : [];
  if (parts.length === 0) return notFound();

  // Nur Kapitel-Routen unterstützen (chapters/...)
  if (parts[0] !== 'chapters') return notFound();

  // Fälle:
  // /[locale]/chapters/[num]
  // /[locale]/chapters/[slug]
  // /[locale]/chapters/cover, finance/work-packages etc.
  const rest = parts.slice(1);
  if (rest.length === 0) return notFound();

  try {
    if (rest.length === 1) {
      const idOrSlug = rest[0];
      if (/^\d+$/.test(idOrSlug)) {
        const mod = await import('@/app/chapters/[chapterId]/page');
        const Page = (mod as any).default as React.ComponentType<{ params: { chapterId?: string } }>;
        return (
          <ChaptersLayout>
            <Page params={{ chapterId: idOrSlug }} />
          </ChaptersLayout>
        );
      }
      const mod = await import(`@/app/chapters/${idOrSlug}/page`);
      const Page = (mod as any).default as React.ComponentType;
      return (
        <ChaptersLayout>
          <Page />
        </ChaptersLayout>
      );
    }
    // Nested wie finance/work-packages
    const nested = rest.join('/');
    const mod = await import(`@/app/chapters/${nested}/page`);
    const Page = (mod as any).default as React.ComponentType;
    return (
      <ChaptersLayout>
        <Page />
      </ChaptersLayout>
    );
  } catch {
    return notFound();
  }
}
