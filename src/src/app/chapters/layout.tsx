import type { ReactNode } from 'react';
import { chapters } from './chapters.config';
import BusinessPlanSections from '@/app/components/chapters/sections/BusinessPlanSections';
import CoverPage from '@/components/document/CoverPage';
import ClosingPage from '@/components/document/ClosingPage';
import PrintTOC from '@/components/document/PrintTOC';
import CompactChapterNav from '@/components/chapters/CompactChapterNav';

export default async function ChaptersLayout(props: any) {
  const children: ReactNode = props?.children;
  const params = props?.params;
  const rawParams: any = (params && typeof params.then === 'function') ? await params : params;
  const chapterId = rawParams?.chapterId;
  const current = Number(chapterId);
  const currentChapter = !Number.isNaN(current) && current > 0 ? current : 1;

  return (
    <section className="container-gutter py-6" aria-labelledby="chapters-heading" role="region">
      <h2 id="chapters-heading" className="sr-only">Kapitelinhalt</h2>

      {/* Versteckte Print-Quelle (nur im Druck sichtbar) */}
      <div
        id="print-source"
        data-testid="print-source"
        className="hidden print:block"
      >
        <CoverPage />
        {/* Print watermark */}
        <div className="print-watermark" aria-hidden>
          <span>VERTRAULICH</span>
        </div>
        {/* Print Table of Contents */}
        <PrintTOC
          title="Inhalt"
          items={chapters.map(c => ({ id: c.slug, title: c.title }))}
        />
        <div className="business-plan-content">
          <BusinessPlanSections />
        </div>
        <ClosingPage />
      </div>

      {/* Layout-Hintergrund (nur Screen): subtiler Brand-Gradient */}
      <div className="relative">
        {/* Entfernt: optisches Hintergrund-Grid */}

        {/* Layout: links kompakte Vertikal-Navigation (Desktop), oben horizontale Variante (Mobile) */}
        <div className="lg:flex lg:items-start lg:gap-6">
          {/* Links (nur Desktop): Vertikale, dezente, sticky Navigation */}
          <aside className="hidden lg:block lg:w-64 lg:shrink-0" aria-label="Kapitel-Menü">
            <CompactChapterNav currentChapter={currentChapter} orientation="vertical" />
          </aside>

          {/* Rechts: Inhalt mit mobiler Top-Navigation */}
          <div className="min-w-0 flex-1">
            {/* Mobile Top-Nav */}
            <div className="lg:hidden">
              <CompactChapterNav currentChapter={currentChapter} orientation="horizontal" />
            </div>

            {/* Seiteninhalt – Fortschritt und Navigation kommen aus ChapterShell */}
            <section className="mt-4 lg:mt-0" aria-label={`Kapitel ${currentChapter}`}>
              {children}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return chapters.map((_, index) => ({
    chapterId: String(index + 1)
  }));
}
