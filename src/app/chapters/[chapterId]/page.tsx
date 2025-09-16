import { notFound } from 'next/navigation';
import { chapters } from '../chapters.config';
import ChapterShell from '@/components/chapters/ChapterShell';
import type { ComponentType } from 'react';

export function generateStaticParams() {
  return chapters.map((_, index) => ({ chapterId: String(index + 1) }));
}

export default async function ChapterPage({ params }: { params: Promise<{ chapterId?: string }> }) {
  const { chapterId } = await params;
  const num = Number(chapterId);

  if (isNaN(num) || num < 1 || num > chapters.length) {
    return notFound();
  }

  const chapterIndex = num - 1;
  const chapter = chapters[chapterIndex];

  // Dynamischer Import basierend auf Kapitel-Slug
  let ChapterComponent: ComponentType;
  try {
    const mod = await import(`../${chapter.slug}/page`);
    ChapterComponent = mod.default as ComponentType;
  } catch {
    return notFound();
  }

  return (
    <ChapterShell currentChapter={num} totalChapters={chapters.length}>
      <ChapterComponent />
    </ChapterShell>
  );
}

