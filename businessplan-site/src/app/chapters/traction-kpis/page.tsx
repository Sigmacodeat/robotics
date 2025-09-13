import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { getMessages } from '@/i18n/messages';
import InViewFade from '@/components/animation/InViewFade';
import { chapters } from '../chapters.config';
import { buildLocalePath } from '@/i18n/path';
import TractionKPIsChapter from '@/app/components/chapters/sections/chapter/TractionKPIsChapter';
import SectionNote from '@/app/components/chapters/shared/SectionNote';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const index = Math.max(0, chapters.findIndex((c) => c.slug === 'traction-kpis')) + 1;
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: buildLocalePath(locale, `/chapters/${index}`) },
  };
}

export default async function TractionKPIsPage() {
  const tBp = await getTranslations('bp');
  const locale = await getLocale();
  const chapterIndex = Math.max(0, chapters.findIndex((c) => c.slug === 'traction-kpis')) + 1;
  const chapterTitle = `${locale.startsWith('de') ? 'Kapitel' : 'Chapter'} ${chapterIndex} – ${tBp('sections.tractionKpis', { defaultMessage: 'Traction & KPIs' })}`;
  const { bp, content } = await getMessages(locale.startsWith('de') ? 'de' : 'en');
  const bpAny = bp as any;
  const traction: string[] = Array.isArray((content as any)?.market?.traction) ? (((content as any).market.traction) as string[]) : [];
  const tk = (bpAny?.tractionKpis as any) ?? {};
  const kpis = Array.isArray(tk.kpis) ? tk.kpis : [];
  const trendsSeries = Array.isArray(tk.trendsSeries) ? tk.trendsSeries : [];
  let highlights: string[] = Array.isArray(tk.highlights) ? tk.highlights.slice() : [];
  if (traction.length > 0) {
    highlights = highlights.concat(traction);
  }
  const kpisExplain: string[] = Array.isArray(tk.kpisExplain) ? tk.kpisExplain : [];
  const methodology: string[] = Array.isArray(tk.methodology) ? tk.methodology : [];
  const evidence: string[] = Array.isArray(tk.evidence) ? tk.evidence : [];
  const deliverables: string[] = Array.isArray(tk.deliverables) ? tk.deliverables : [];
  const captions: { kpis?: string; trends?: string } | undefined = tk.captions;
  const benchmarks: { title?: string; headers?: string[]; rows: (string | number)[][] } | undefined = tk.benchmarks;

  return (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none [font-feature-settings:'ss01','ss02','liga','clig','tnum']">
        <h1 className="section-title font-semibold tracking-tight leading-tight text-[--color-foreground-strong] text-[clamp(18px,2vw,22px)]">
          {chapterTitle}
        </h1>

        {/* Modernes State-of-the-Art Traction & KPIs Kapitel – komplett aus i18n befüllt */}
        <InViewFade as="section" delay={0.05}>
          <div className="not-prose text-[12px] md:text-[13px] text-[--color-foreground-muted] mb-2">
            {tBp('headings.tractionKpis', { defaultMessage: 'Traction & KPIs' })}
          </div>
          <TractionKPIsChapter
            id="traction-kpis"
            title=""
            kpis={kpis as any}
            trendsSeries={trendsSeries}
            highlights={highlights}
            kpisExplain={kpisExplain}
            methodology={methodology}
            evidence={evidence}
            deliverables={deliverables}
            {...(benchmarks ? { benchmarks } : {})}
            {...(captions ? { captions } : {})}          />
        </InViewFade>

        {/* Benchmarks/Quellen – dezente Fußnote (klein), analog Kapitel 2 */}
        <SectionNote
          useDe={locale.startsWith('de')}
          size="xs"
          className="max-w-4xl"
          de={(
            <span>
              Benchmarks (SaaS, indikativ): Bruttomarge typ. 70–80%, LTV/CAC Ziel &gt;5x, CAC kanalabhängig. Quellen: {' '}
              <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://www.highalpha.com/2024-saas-benchmarks-report" target="_blank" rel="noreferrer noopener">High Alpha/OpenView 2024</a>,{' '}
              <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://wundertalent.co.uk/saas-ltvcac-benchmark/" target="_blank" rel="noreferrer noopener">LTV/CAC Benchmarks</a>.
            </span>
          )}
          en={(
            <span>
              Benchmarks (SaaS, indicative): gross margin typically 70–80%, LTV/CAC target &gt;5x, CAC depends on channel. Sources: {' '}
              <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://www.highalpha.com/2024-saas-benchmarks-report" target="_blank" rel="noreferrer noopener">High Alpha/OpenView 2024</a>,{' '}
              <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://wundertalent.co.uk/saas-ltvcac-benchmark/" target="_blank" rel="noreferrer noopener">LTV/CAC benchmarks</a>.
            </span>
          )}
        />
      </div>

      {/* Print is handled globally in chapters layout */}
    </div>
  );
}
