import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { chapters } from '../chapters.config';
import { getMessages } from '@/i18n/messages';
import { WorkPackagesDetailedChapter } from '@components/chapters';
import { notFound } from 'next/navigation';
import type { WorkPackageItem, WorkPackagesLabels } from '@components/chapters/types/work-packages';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const index = Math.max(0, chapters.findIndex((c) => c.slug === 'work-packages')) + 1;
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: `/${locale}/chapters/${index}` }
  } as Metadata;
}

export default async function WorkPackagesSlugPage() {
  const locale = await getLocale();
  const t = await getTranslations('bp');
  const index = chapters.findIndex((c) => c.slug === 'work-packages');
  const chapter = index >= 0 ? chapters[index] : undefined;

  if (!chapter) {
    return notFound();
  }

  const messages = await getMessages(locale.startsWith('de') ? 'de' : 'en');

  const wpd = (messages?.content?.workPackagesDetailed ?? messages?.bp?.workPackagesDetailed) as {
    title?: string;
    note?: string;
    headersEffort?: (string | number)[];
    items?: WorkPackageItem[];
  } | undefined;

  // Labels aus Messages extrahieren (mehrere mögliche Orte), ansonsten Komponentendefaults nutzen
  const rawLabels = (wpd as any)?.labels
    ?? (messages as any)?.content?.workPackagesLabels
    ?? (messages as any)?.bp?.workPackagesLabels
    ?? undefined;

  const labels: WorkPackagesLabels | undefined = rawLabels ? {
    objectives: rawLabels.objectives ?? 'Ziele',
    scope: rawLabels.scope ?? 'Scope',
    deliverables: rawLabels.deliverables ?? 'Deliverables',
    dependencies: rawLabels.dependencies ?? 'Abhängigkeiten',
    effort: rawLabels.effort ?? 'FTE',
    personMonths: rawLabels.personMonths ?? 'PM',
    trl: rawLabels.trl ?? 'TRL',
    risks: rawLabels.risks ?? 'Risiken',
    mitigation: rawLabels.mitigation ?? 'Mitigation',
    kpis: rawLabels.kpis ?? 'KPIs',
    milestones: rawLabels.milestones ?? 'Milestones',
    budget: rawLabels.budget ?? 'Budget',
    budgetPersonnel: rawLabels.budgetPersonnel ?? 'Begründung Personal',
    budgetMaterial: rawLabels.budgetMaterial ?? 'Begründung Sachkosten',
    budgetSubcontracting: rawLabels.budgetSubcontracting ?? 'Begründung Fremdleistungen',
    budgetOther: rawLabels.budgetOther ?? 'Begründung Sonstiges',
    wp: rawLabels.wp ?? 'WP',
    role: rawLabels.role ?? 'Rolle',
    fte: rawLabels.fte ?? 'FTE',
    pm: rawLabels.pm ?? 'PM',
  } : undefined;

  if (!wpd || !wpd.items || wpd.items.length === 0) {
    return (
      <div className="p-4 bg-[--color-surface] border border-[--color-border-subtle] rounded-md">
        <h1 className="text-lg font-semibold mb-1 text-[--color-foreground]">{chapter.title}</h1>
        <p className="text-[--color-foreground-muted]">
          Die Arbeitspakete konnten nicht geladen werden. Bitte i18n-Konfiguration prüfen.
        </p>
      </div>
    );
  }

  const headersEffort = Array.isArray(wpd.headersEffort) ? wpd.headersEffort : undefined;

  // Einheitlicher, i18n-basierter Titel mit Kapitelnummer (analog zu TechnologyPage)
  const chapterIndex = Math.max(0, chapters.findIndex((c) => c.slug === 'work-packages')) + 1;
  const computedTitle = `${locale.startsWith('de') ? 'Kapitel' : 'Chapter'} ${chapterIndex} – ${t('headings.workPackages')}`;

  return (
    <>
      {/* Subchapter Anchors for navigation */}
      <span id="overview" className="sr-only" aria-hidden="true" />
      {/* Optional: Intro/Note as overview */}
      {wpd?.note ? (
        <div className="mb-3 text-[13px] md:text-[14px] text-[--color-foreground] opacity-90 leading-relaxed">
          {wpd.note}
        </div>
      ) : null}

      <span id="details" className="sr-only" aria-hidden="true" />
      <WorkPackagesDetailedChapter
        id={String(chapter.id)}
        title={computedTitle}
        headersEffort={headersEffort}
        items={wpd.items}
        {...(labels ? { labels } as const : {})}
      />

      {/* Timeline anchor (content optional) */}
      <span id="timeline" className="sr-only" aria-hidden="true" />
    </>
  );
}
