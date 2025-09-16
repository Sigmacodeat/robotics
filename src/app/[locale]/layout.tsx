import { setRequestLocale } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const l = locale === 'en' ? 'en' : 'de';
  setRequestLocale(l);
  return children;
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}
