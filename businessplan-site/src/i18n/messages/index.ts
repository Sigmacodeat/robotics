import de from '../locales/de';
import en from '../locales/en';

export type SupportedLocale = 'de' | 'en';

export async function getMessages(locale: SupportedLocale) {
  const m = locale === 'de' ? de : en;
  // Bündle die Kapitel unter einem gemeinsamen content-Objekt,
  // damit Aufrufe wie `const { content } = await getMessages(...)` funktionieren.
  const bundledContent = {
    businessModel: (m as any).businessModel ?? {},
    market: (m as any).market ?? {},
    impact: (m as any).impact ?? {},
    finance: (m as any).finance ?? {},
    gtm: (m as any).gtm ?? {},
    products: (m as any).products ?? {},
    operations: (m as any).operations ?? {},
    mlops: (m as any).mlops ?? {},
    responsibleAI: (m as any).responsibleAI ?? {},
    teamOrg: (m as any).teamOrg ?? {},
    technology: (m as any).technology ?? {},
    risks: (m as any).risks ?? {},
    exit: (m as any).exit ?? {},
    capTable: (m as any).capTable ?? {},
    costPlan: (m as any).costPlan ?? {},
    financePlanDetailed: (m as any).financePlanDetailed ?? {},
    marketCompetitive: (m as any).marketCompetitive ?? {},
    dissemination: (m as any).dissemination ?? {},
    company: (m as any).company ?? {},
    cta: (m as any).cta ?? {},
    workPackagesDetailed: (m as any).workPackagesDetailed ?? {},
  } as const;

  // WICHTIG: bestehendes top-level content (z. B. content.solution.*) nicht überschreiben
  const merged = {
    ...(m as any),
    content: {
      ...((m as any).content ?? {}),
      ...bundledContent,
    },
  } as const;

  return merged;
}

export default getMessages;
