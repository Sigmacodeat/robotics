import { getTranslations } from 'next-intl/server';

export type MarketSegment = { label: string; share: number };

export type MarketI18n = {
  checklistItems: Array<{ id: string; label: string; required: boolean }>;
  segments: MarketSegment[];
  pestel: string[];
  marketDetails: string[];
  hardwarePlayers: string[];
  softwarePlayers: string[];
  diffPoints: string[];
  swotStrengths: string[];
  swotWeaknesses: string[];
  swotOpportunities: string[];
  swotThreats: string[];
  gtmPhase1: string[];
  tam: string | null;
  sam: string | null;
  som: string | null;
  tBpSectionMarket: string;
};

function toStringArray(val: unknown): string[] {
  return Array.isArray(val) && val.every(v => typeof v === 'string') ? (val as string[]) : [];
}

function toSegmentArray(val: unknown): MarketSegment[] {
  return Array.isArray(val) && val.every(v => v && typeof v.label === 'string' && typeof v.share === 'number')
    ? (val as MarketSegment[])
    : [];
}

export async function fetchMarketI18n(): Promise<MarketI18n> {
  const tBp = await getTranslations('bp');
  const tContent = await getTranslations('content');

  const checklistKeys = ['size', 'target', 'competition', 'trends', 'ffg-growth', 'aws-innovation'] as const;
  const checklistItems = checklistKeys.map((id) => ({ id, label: tBp(`required.${id}`), required: true }));

  const segments = toSegmentArray(tContent.raw('market.segments'));
  const pestel = toStringArray(tContent.raw('marketCompetitive.overview'));
  const marketDetails = toStringArray(tContent.raw('market.details'));
  const hardwarePlayers = toStringArray(tContent.raw('marketCompetitive.hardware'));
  const softwarePlayers = toStringArray(tContent.raw('marketCompetitive.software'));
  const diffPoints = toStringArray(tContent.raw('marketCompetitive.differentiation'));

  const swotStrengths = toStringArray(tContent.raw('swot.strengths'));
  const swotWeaknesses = toStringArray(tContent.raw('swot.weaknesses'));
  const swotOpportunities = toStringArray(tContent.raw('swot.opportunities'));
  const swotThreats = toStringArray(tContent.raw('swot.threats'));

  const gtmPhase1 = toStringArray(tContent.raw('gtm.phase1'));

  const tam = (tContent('market.tam') as string) ?? null;
  const sam = (tContent('market.sam') as string) ?? null;
  const som = (tContent('market.som') as string) ?? null;

  return {
    checklistItems,
    segments,
    pestel,
    marketDetails,
    hardwarePlayers,
    softwarePlayers,
    diffPoints,
    swotStrengths,
    swotWeaknesses,
    swotOpportunities,
    swotThreats,
    gtmPhase1,
    tam,
    sam,
    som,
    tBpSectionMarket: tBp('sections.market'),
  };
}
