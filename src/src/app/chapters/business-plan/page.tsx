import type { Metadata } from 'next';
import BusinessPlanSections from '@/app/components/chapters/sections/BusinessPlanSections';
import ChapterShell from '@/app/components/chapters/ChapterShell';
import { chapters } from '@/app/chapters/chapters.config';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function BusinessPlanFullPage() {
  // Render den kompletten Businessplan als eigenes Kapitel (ohne Nummern-Navigation)
  // Praktisch für Review/Export sowie Deep-Links auf Unterabschnitte mit Ankern
  return (
    <ChapterShell currentChapter={1} totalChapters={chapters.length}>
      <div className="container-gutter">
        <div className="reading-max">
          <BusinessPlanSections />
        </div>
      </div>
    </ChapterShell>
  );
}
