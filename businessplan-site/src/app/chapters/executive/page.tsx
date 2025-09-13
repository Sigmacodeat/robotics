// PDF-like layout: no animated reveal
import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { getMessages } from '@/i18n/messages';
import { chapters } from '../chapters.config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InViewFade from '@/components/animation/InViewFade';
import MiniBar from '@/components/charts/MiniBar';
import MiniDonut from '@/components/charts/MiniDonut';
import MiniSparkline from '@/components/charts/MiniSparkline';
import { KPI_ANIM_DURATION, KPI_BAR_HEIGHT, KPI_SPARK_HEIGHT, KPI_DONUT_CLASS, getKpiDelay } from '@/components/charts/kpiAnimation';
import { TrendingUp, CreditCard, CircleDollarSign, Percent, Brain, Store, ShieldCheck, BadgeCheck } from 'lucide-react';
import { buildLocalePath } from '@/i18n/path';
import { NumberedList, NumberedItem } from '@/app/components/chapters/NumberedList';
import { getChapterTheme } from '@/app/chapters/chapterTheme';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const index = Math.max(0, chapters.findIndex((c) => c.slug === 'executive')) + 1;
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: buildLocalePath(locale, `/chapters/${index}`) }
  };
}

export default async function ExecutiveSummaryPage() {
  const t = await getTranslations('chapters.executiveSummary');
  const tBp = await getTranslations('bp');
  const locale = await getLocale();
  const { chapters, bp } = await getMessages(locale.startsWith('de') ? 'de' : 'en');
  const exec = (chapters as any)?.executiveSummary ?? {};
  const chapterIndex = 1;
  const chapterTitle = `${locale.startsWith('de') ? 'Kapitel' : 'Chapter'} ${chapterIndex} – ${tBp('sections.executive', { defaultMessage: 'Executive Summary' })}`;
  const theme = getChapterTheme('executive');

  // Helper: normalize a string or array-like content into bullet items when appropriate
  const normalizeBullets = (val: unknown): string[] | null => {
    try {
      if (Array.isArray(val)) {
        const arr = (val as unknown[]).map(x => String(x ?? '').trim()).filter(Boolean);
        return arr.length ? arr : null;
      }
      const raw = String(val ?? '').trim();
      if (!raw) return null;
      // Detect simple bullet patterns: line breaks, leading dashes or • separators
      const candidates = raw
        .split(/\n+/)
        .flatMap(line => line.split(/\s*[•·]\s+/))
        .flatMap(line => line.split(/\s*;\s+/))
        .map(s => s.replace(/^[-–]\s*/, '').trim())
        .filter(Boolean);
      // Only treat as bullets if we have multiple meaningful items
      if (candidates.length >= 2) return candidates;
      return null;
    } catch {
      return null;
    }
  };

  const BulletList: React.FC<{ items: string[] }> = ({ items }) => {
    const iconCycle = [Store, Brain, ShieldCheck, BadgeCheck] as const;
    let prevIcon: React.ComponentType<any> | null = null;
    return (
      <ul className="not-prose space-y-2">
        {items.map((it, i) => {
          const lower = String(it ?? '').toLowerCase();
          let Icon: React.ComponentType<any> | null =
            (lower.includes('ki') || lower.includes('ai') || lower.includes('agent')) ? Brain :
            (lower.includes('app') || lower.includes('store') || lower.includes('plattform')) ? Store :
            (lower.includes('safety') || lower.includes('compliance') || lower.includes('iso') || lower.includes('ce') || lower.includes('eu ai act') || lower.includes('gdpr') || lower.includes('dsgvo')) ? ShieldCheck :
            (lower.includes('ip') || lower.includes('patent') || lower.includes('marke') || lower.includes('strategie')) ? BadgeCheck :
            null;
          // Fallback-Rotation und Vermeidung gleicher Icons nacheinander
          if (!Icon) Icon = iconCycle[i % iconCycle.length];
          if (Icon === prevIcon) Icon = iconCycle[(i + 1) % iconCycle.length];
          prevIcon = Icon;
          return (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-md bg-[--muted]/30 ring-1 ring-[--color-border-subtle] text-[--color-foreground-muted] flex-shrink-0" aria-hidden>
                {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : <span className="h-1.5 w-1.5 rounded-full bg-[--color-primary] inline-block" aria-hidden />}
              </span>
              <span className="text-[13px] md:text-[14px] leading-relaxed text-[--color-foreground] opacity-95">{it}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  // Absicherung für t.raw(), falls Keys im Kapitel-Namespace fehlen
  function safeRaw<T = unknown>(key: string, fallback: T): T {
    try {
      return (t.raw(key) as T);
    } catch {
      return fallback;
    }
  }
  const kpiBadges = (() => {
    const de = locale.startsWith('de');
    const mv: any = (bp as any)?.market?.volume ?? {};
    const svcCagr = typeof mv?.service?.cagr === 'string' ? mv.service.cagr : undefined;
    const humCagr = typeof mv?.humanoid?.cagr === 'string' ? mv.humanoid.cagr : undefined;
    const cagrService = svcCagr ? (de ? `CAGR (Service): ${svcCagr}` : `CAGR (Service): ${svcCagr}`) : (de ? 'CAGR (Service): ~16%' : 'CAGR (Service): ~16%');
    const cagrHumanoid = humCagr ? (de ? `CAGR (Humanoide): ${humCagr}` : `CAGR (Humanoids): ${humCagr}`) : (de ? 'CAGR (Humanoide): ~39%' : 'CAGR (Humanoids): ~39%');
    const rev2030Raw = (bp as any)?.execFacts?.revenue2030 as string | undefined;
    // Normalize revenue badge like "€25–40 Mio (2030)"
    const revBadge = (() => {
      if (!rev2030Raw) return de ? 'Umsatz 2030: €25–40 Mio' : 'Revenue 2030: €25–40M';
      const cleaned = rev2030Raw
        .replace(/Umsatz\s*2030:\s*/i, '')
        .replace(/Revenue\s*2030:\s*/i, '')
        .trim();
      return de ? `${cleaned} (2030)` : `${cleaned} (2030)`;
    })();
    const appStoreShare = de ? 'App‑Store Split: 30%/70% (Plattform/Entwickler)' : 'App‑store split: 30%/70% (platform/developers)';
    return [
      cagrService,
      cagrHumanoid,
      de ? 'Break-even 2028' : 'Break-even 2028',
      revBadge,
      appStoreShare,
      de ? 'EU AI Act & DSGVO Ready' : 'EU AI Act & GDPR Ready',
      de ? 'RaaS (Robots-as-a-Service)' : 'RaaS (Robots-as-a-Service)'
    ];
  })();

  // Normalize USP items to a safe array to avoid calling .map on non-arrays
  const uspsItems = (() => {
    const raw = (exec?.sections?.usps?.items as unknown) ?? safeRaw('sections.usps.items', [] as string[]);
    if (Array.isArray(raw)) return raw as string[];
    if (typeof raw === 'string') return [raw];
    return [] as string[];
  })();

  const statCards = (() => {
    const de = locale.startsWith('de');
    const bpAny = bp as any;
    const bm = (bpAny?.content?.businessModel as any) ?? (bpAny?.businessModel as any) ?? {};
    const kpi = (bm?.kpi as any) ?? {};
    return [
      {
        kind: 'arpu' as const,
        label: de ? 'ARPU (RaaS)' : 'ARPU (RaaS)',
        value: typeof kpi?.arpu === 'string' ? kpi.arpu : (de ? '€3.0k–€4.0k / Roboter / Monat' : '€3.0k–€4.0k / robot / month'),
        sub: de ? 'ø pro Roboter (Monat)' : 'avg per robot (monthly)',
        Icon: TrendingUp
      },
      {
        kind: 'cac' as const,
        label: 'CAC',
        value: typeof kpi?.cac === 'string' ? kpi.cac : (de ? '€4k–€8k' : '€4k–€8k'),
        sub: de ? 'Customer Acquisition Cost' : 'Customer Acquisition Cost',
        Icon: CreditCard
      },
      {
        kind: 'ltv' as const,
        label: 'LTV',
        value: typeof kpi?.ltv === 'string' ? kpi.ltv : (de ? '€40k–€60k' : '€40k–€60k'),
        sub: de ? 'Lebenszeitwert (Beitrag)' : 'Lifetime value (contribution)',
        Icon: CircleDollarSign
      },
      {
        kind: 'margin' as const,
        label: de ? 'Bruttomarge' : 'Gross Margin',
        value: typeof kpi?.grossMargin === 'string' ? kpi.grossMargin : (de ? '70–80%' : '70–80%'),
        sub: de ? 'indikativ' : 'indicative',
        Icon: Percent
      }
    ] as const;
  })();

  return (
    <div className="space-y-6">
      <div className="prose prose-sm md:prose-base max-w-none [font-feature-settings:'ss01','ss02','liga','clig','tnum'] prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:space-y-1.5">
        <h1 className="section-title font-semibold tracking-tight leading-tight text-[--color-foreground-strong] scroll-mt-24">
          {chapterTitle}
        </h1>
        {/* Kein dekorativer Divider – ruhiger PDF-Look */}
        {/* Profilzeile entfernt – konsolidiert nur im Lebenslauf sichtbar */}
        {/* KPI-Stat-Karten - Dezent & Edel */}
        <div className="not-prose mt-4 grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {statCards.map((s, idx) => (
            <InViewFade key={`${String(s.label)}-${idx}`} delay={idx * 0.05} className="h-full">
              <Card elevated={false} className="kpi-card kpi-card--spacious kpi-card--hairline h-full bg-transparent shadow-none hover:shadow-none transition-all duration-200">
                <div className="kpi-card kpi-card--bm relative h-full rounded-2xl">
                  <div className="kpi-card-content p-3 md:p-4 pb-7 md:pb-8 text-center">
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium tracking-wide uppercase mb-2 text-[--color-foreground]">
                      {('Icon' in s && s.Icon) ? <s.Icon className="h-3.5 w-3.5 text-[--color-foreground-muted]" aria-hidden /> : null}
                      <span>{s.label}</span>
                    </div>
                    <div className="mb-3 w-full kpi-visual">
                      {s.kind === 'cac' ? (
                        <MiniBar
                          data={[24, 36, 42, 51, 58]}
                          height={KPI_BAR_HEIGHT}
                          color={theme.warning}
                          bg={theme.warning ? `${theme.warning}18` : 'rgba(245,158,11,0.12)'}
                          delay={getKpiDelay(idx)}
                          duration={KPI_ANIM_DURATION}
                          className="w-full"
                        />
                      ) : s.kind === 'arpu' || s.kind === 'ltv' ? (
                        <MiniSparkline
                          data={s.kind === 'arpu' ? [40, 46, 49, 51, 55] : [180, 240, 300, 420, 560]}
                          height={KPI_SPARK_HEIGHT}
                          delay={getKpiDelay(idx)}
                          duration={KPI_ANIM_DURATION}
                          className="w-full"
                          colorStart={s.kind === 'arpu' ? theme.success : theme.warning}
                          colorEnd={s.kind === 'arpu' ? theme.primary : theme.warning}
                          showArea={false}
                          showDot
                        />
                      ) : (
                        <MiniDonut
                          value={0.7}
                          color={theme.primary}
                          bg={`${theme.primary}20`}
                          delay={getKpiDelay(idx)}
                          duration={KPI_ANIM_DURATION}
                          className={KPI_DONUT_CLASS}
                        />
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <div className="kpi-value-row font-bold text-[--color-foreground-strong] [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums] kpi-value">
                        {s.value}
                      </div>
                      <div className="kpi-sub text-[10px] md:text-[11px] leading-tight text-[--color-foreground] one-line">{s.sub}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </InViewFade>
          ))}
        </div>
        {/* KPI-Badges unter den Animationen */}
        {kpiBadges.length > 0 && (
          <div className="not-prose mt-4 md:mt-5 max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2.5">
            {(() => {
              const assumptions = locale.startsWith('de')
                ? 'Annahmen (2030): konservativ/realistisch; Pricing & Conversion gemäß Business Model; Quelle: internes Planungsmodell.'
                : 'Assumptions (2030): conservative/realistic; pricing & conversion per business model; source: internal planning model.';
              return kpiBadges.slice(0, 5).map((k, i) => {
                const is2030Revenue = /\(2030\)/.test(String(k));
                return (
                  <span
                    key={`${i}-${k || 'badge'}`}
                    className="badge leading-none hover:bg-[--muted]/22 transition-colors"
                    title={is2030Revenue ? assumptions : undefined}
                  >
                    {k}
                  </span>
                );
              });
            })()}
          </div>
        )}

        {/* Kompaktes Summary (Problem/Solution/Market) – ohne Grid, vertikal */}
        <div className="mt-5 space-y-6">
          <Card className="h-full bg-transparent shadow-none border-0">
            <CardHeader className="p-3">
              <CardTitle className="not-prose text-[13px] md:text-[15px] leading-tight font-semibold tracking-tight text-[--color-foreground]">{`${chapterIndex}.1 – ${t('sections.problem.title')}`}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed">
              {(() => {
                const val = exec?.sections?.problem?.content ?? t('sections.problem.content');
                const bullets = normalizeBullets(val);
                return bullets ? <BulletList items={bullets} /> : <p>{val}</p>;
              })()}
            </CardContent>
          </Card>
          <Card className="h-full bg-transparent shadow-none border-0">
            <CardHeader className="p-3">
              <CardTitle className="not-prose text-[13px] md:text-[15px] leading-tight font-semibold tracking-tight text-[--color-foreground]">{`${chapterIndex}.2 – ${t('sections.solution.title')}`}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <NumberedList>
                <NumberedItem num={`${chapterIndex}.2.1`}>
                  <div className="text-[13px] md:text-[14px] font-semibold text-[--color-foreground] mb-1">
                    {t('sections.solution.platform.title')}
                  </div>
                  {(() => {
                    const val = exec?.sections?.solution?.platform?.content ?? t('sections.solution.platform.content');
                    const bullets = normalizeBullets(val);
                    return bullets ? <BulletList items={bullets} /> : (
                      <p className="text-[13px] md:text-[14px] leading-relaxed text-[--color-foreground] opacity-90">{val}</p>
                    );
                  })()}
                </NumberedItem>
                <NumberedItem num={`${chapterIndex}.2.2`}>
                  <div className="text-[13px] md:text-[14px] font-semibold text-[--color-foreground] mb-1">
                    {t('sections.solution.technology.title')}
                  </div>
                  {(() => {
                    const val = exec?.sections?.solution?.technology?.content ?? t('sections.solution.technology.content');
                    const bullets = normalizeBullets(val);
                    return bullets ? <BulletList items={bullets} /> : (
                      <p className="text-[13px] md:text-[14px] leading-relaxed text-[--color-foreground] opacity-90">{val}</p>
                    );
                  })()}
                </NumberedItem>
              </NumberedList>
            </CardContent>
          </Card>
          <Card className="h-full bg-transparent shadow-none border-0">
            <CardHeader className="p-3">
              <CardTitle className="not-prose text-[13px] md:text-[15px] leading-tight font-semibold tracking-tight text-[--color-foreground]">{`${chapterIndex}.3 – ${t('sections.market.title')}`}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed">
              {(() => {
                const val = exec?.sections?.market?.content ?? t('sections.market.content');
                const bullets = normalizeBullets(val);
                return bullets ? <BulletList items={bullets} /> : <p>{val}</p>;
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Ausführliche Darstellung – konsolidiert: USPs und Business Model als Karten */}
        <div className="not-prose mt-5 space-y-3">
          {/* USPs */}
          <span id="usps" className="sr-only" aria-hidden="true" />
          <Card className="h-full bg-transparent shadow-none border-0">
            <CardHeader className="border-b-0 p-3">
              <CardTitle className="not-prose text-[13px] md:text-[15px] leading-tight font-semibold tracking-tight text-[--color-foreground]">
                {`${chapterIndex}.4 – ${t('sections.usps.title')}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-1">
                <NumberedList>
                  {uspsItems.map((item: string, index: number) => (
                    <NumberedItem key={index} num={`${chapterIndex}.4.${index + 1}`}>{item}</NumberedItem>
                  ))}
                </NumberedList>
              </div>
            </CardContent>
          </Card>

          {/* Business Model */}
          <span id="businessModel" className="sr-only" aria-hidden="true" />
          <Card className="h-full bg-transparent shadow-none border-0">
            <CardHeader className="border-b-0 p-3">
              <CardTitle className="not-prose text-[13px] md:text-[15px] leading-tight font-semibold tracking-tight text-[--color-foreground]">
                {`${chapterIndex}.5 – ${t('sections.businessModel.title')}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-[13px] md:text-[14px] text-[--color-foreground] opacity-90 leading-relaxed">
                {exec?.sections?.businessModel?.content ?? t('sections.businessModel.content')}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Market wurde bereits oben zusammengefasst */}
      </div>

      {/* Notizen und Checkliste entfernt gemäß Vorgabe */}
    </div>
  );
}
