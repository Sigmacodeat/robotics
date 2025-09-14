"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import { useLocale, useTranslations } from 'next-intl';
import { buildLocalePath } from '@/i18n/path';

export default function ChapterNavigation({
  currentChapter,
  totalChapters
}: {
  currentChapter: number;
  totalChapters: number;
}) {
  const locale = useLocale();
  const t = useTranslations('bp');
  const prevChapter = currentChapter > 1 ? currentChapter - 1 : null;
  const nextChapter = currentChapter < totalChapters ? currentChapter + 1 : null;

  return (
    <div className="mt-12 flex justify-between">
      {prevChapter ? (
        <Link href={buildLocalePath(locale, `/chapters/${prevChapter}`)}>
          <Button
            variant="outline"
            className="bg-[--color-surface] text-[--color-foreground] ring-1 ring-[--color-border-subtle] hover:bg-[--color-surface-2] hover:text-[--color-foreground] active:bg-[--color-surface] focus-visible:ring-[--color-border] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] dark:bg-[--color-surface] dark:hover:bg-[--color-surface-2] dark:text-[--color-foreground]"
          >
            {t('labels.back')}
          </Button>
        </Link>
      ) : (
        <div />
      )}
      
      {nextChapter ? (
        <Link href={buildLocalePath(locale, `/chapters/${nextChapter}`)}>
          <Button
            variant="outline"
            className="bg-[--color-surface] text-[--color-foreground] ring-1 ring-[--color-border-subtle] hover:bg-[--color-surface-2] hover:text-[--color-foreground] active:bg-[--color-surface] focus-visible:ring-[--color-border] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] dark:bg-[--color-surface] dark:hover:bg-[--color-surface-2] dark:text-[--color-foreground]"
          >
            {t('labels.next')}
          </Button>
        </Link>
      ) : (
          <Button
            variant="outline"
            className="bg-[--color-surface] text-[--color-foreground] ring-1 ring-[--color-border-subtle] hover:bg-[--color-surface-2] hover:text-[--color-foreground] active:bg-[--color-surface] focus-visible:ring-[--color-border] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-surface] dark:bg-[--color-surface] dark:hover:bg-[--color-surface-2] dark:text-[--color-foreground]"
          >
            {t('labels.finish')}
          </Button>
      )}
    </div>
  );
}
