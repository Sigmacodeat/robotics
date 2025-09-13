import { SectionId, sectionOrder } from "./sectionOrder";

export type SubsectionItem = {
  id: string; // anchor id in DOM
  labelKey: string; // i18n key for label
  level: 2 | 3;
};

// Define subsections per top-level section. Keep ids stable for anchors.
export const subsectionOrder: Partial<Record<SectionId, SubsectionItem[]>> = {
  company: [
    { id: "company-overview", labelKey: "bp.headings.overview", level: 2 },
    { id: "company-legal", labelKey: "bp.headings.legal", level: 2 },
    { id: "company-timeline", labelKey: "bp.headings.timeline", level: 2 },
  ],
  exitStrategy: [
    { id: "exit-options", labelKey: "bp.exit.title", level: 2 },
    { id: "exit-roi", labelKey: "bp.exit.roi.title", level: 2 },
    { id: "exit-valuation", labelKey: "bp.exit.valuation.title", level: 2 },
    { id: "exit-earnout", labelKey: "bp.exit.earnOut.title", level: 2 },
    { id: "exit-secondary", labelKey: "bp.exit.secondary.title", level: 2 },
    { id: "exit-coinvest", labelKey: "bp.exit.coInvest.title", level: 2 },
    { id: "exit-buyers", labelKey: "bp.exit.buyers.title", level: 2 },
    { id: "exit-timeline", labelKey: "bp.exit.timeline.title", level: 2 },
    { id: "exit-preparation", labelKey: "bp.exit.preparation.title", level: 2 },
    { id: "exit-risks", labelKey: "bp.exit.risks.title", level: 2 },
  ],
  teamOrg: [
    { id: "team-founders", labelKey: "bp.headings.founders", level: 2 },
    { id: "team-fte-plan", labelKey: "bp.headings.teamPlan", level: 2 },
    { id: "team-summary", labelKey: "bp.headings.summary", level: 2 },
  ],
  technology: [
    { id: "technology-stack", labelKey: "bp.headings.stack", level: 2 },
    { id: "technology-roadmap", labelKey: "bp.headings.roadmap", level: 2 },
    { id: "technology-timeline", labelKey: "bp.headings.timeline", level: 2 },
    { id: "technology-workPackages", labelKey: "bp.headings.workPackages", level: 2 },
    // WICHTIG: StateOfTheArt/Innovation/IPMoat sind Top-Level Kapitel (sectionOrder) und
    // werden NICHT als Unterpunkte von Technology gelistet, um doppelte TOC-Einträge zu vermeiden.
  ],
  gtm: [
    { id: "gtm-phases", labelKey: "bp.headings.phases", level: 2 },
    { id: "gtm-tactics", labelKey: "bp.headings.tactics", level: 2 },
    { id: "gtm-kpis", labelKey: "bp.headings.kpis", level: 2 },
    { id: "gtm-funnel", labelKey: "bp.headings.funnel", level: 2 },
    { id: "gtm-channelMix", labelKey: "bp.headings.channelMix", level: 2 },
  ],
  risks: [
    // IDs must match anchors in chapters/risks/page.tsx
    { id: "tech-risk", labelKey: "bp.risks.tech.title", level: 2 },
    { id: "market-risk", labelKey: "bp.risks.market.title", level: 2 },
    { id: "finance-risk", labelKey: "bp.risks.finance.title", level: 2 },
    { id: "regulatory", labelKey: "bp.risks.regulatory.title", level: 2 },
    { id: "operations", labelKey: "bp.risks.operations.title", level: 2 },
    { id: "mitigation", labelKey: "bp.headings.mitigation", level: 2 },
  ],
  compliance: [
    { id: "compliance-aws", labelKey: "bp.headings.awsCompliance", level: 2 },
    { id: "compliance-privacy", labelKey: "bp.headings.privacy", level: 2 },
    { id: "compliance-safety", labelKey: "bp.headings.safety", level: 2 },
    { id: "compliance-standards", labelKey: "bp.headings.standards", level: 2 },
    { id: "compliance-aiAct", labelKey: "bp.headings.aiAct", level: 2 },
    { id: "compliance-securityProgram", labelKey: "bp.headings.securityProgram", level: 2 },
  ],
  finance: [
    // High-level summaries & KPIs
    { id: "finance-kpis-summary", labelKey: "bp.headings.summary", level: 2 },
    { id: "finance-kpis", labelKey: "bp.headings.unitEconomics", level: 2 },
    // Main finance blocks
    { id: "finance-useOfFunds", labelKey: "bp.headings.useOfFunds", level: 2 },
    { id: "finance-fundraising", labelKey: "bp.headings.fundraising", level: 2 },
    { id: "finance-scenarios", labelKey: "bp.headings.scenarios", level: 2 },
    { id: "finance-runway", labelKey: "bp.headings.runway", level: 2 },
    { id: "finance-plOverview", labelKey: "bp.headings.plOverview", level: 2 },
    // Detailed tables and analytics
    { id: "finance-detailed", labelKey: "bp.tables.captions.useOfFundsY1", level: 3 },
    { id: "finance-capexOpex", labelKey: "bp.headings.capexOpex", level: 3 },
    { id: "finance-capexOpex-table", labelKey: "bp.headings.capexOpex", level: 3 },
    { id: "finance-totals", labelKey: "bp.headings.totals", level: 3 },
    { id: "finance-revenue", labelKey: "bp.headings.revenue", level: 3 },
    { id: "finance-ebitda", labelKey: "bp.headings.ebitda", level: 3 },
    { id: "finance-breakEven", labelKey: "bp.headings.breakEven", level: 3 },
    { id: "finance-revenueVsCost", labelKey: "bp.headings.revenueVsCost", level: 3 },
    { id: "finance-fundingStrategy", labelKey: "bp.headings.fundingStrategy", level: 3 },
  ],
  market: [
    // IDs must match anchors in chapters/market/page.tsx
    { id: "trends", labelKey: "bp.headings.overview", level: 2 },
    { id: "target", labelKey: "bp.headings.segments", level: 2 },
    { id: "competition", labelKey: "bp.headings.competition", level: 2 },
    { id: "size", labelKey: "bp.headings.details", level: 2 },
  ],
  operations: [
    { id: "operations-slas", labelKey: "bp.headings.slas", level: 2 },
  ],
  businessModel: [
    { id: "businessModel-kpis", labelKey: "bp.headings.businessModelKPIs", level: 2 },
    { id: "businessModel-valueProp", labelKey: "bp.headings.valueProp", level: 2 },
    { id: "businessModel-pricing", labelKey: "bp.headings.pricing", level: 2 },
    { id: "businessModel-streams", labelKey: "bp.headings.revenueStreams", level: 2 },
    { id: "businessModel-unitEconomics", labelKey: "bp.headings.unitEconomics", level: 2 },
    { id: "businessModel-salesChannels", labelKey: "bp.headings.salesChannels", level: 2 },
    { id: "businessModel-partnerships", labelKey: "bp.headings.partnerships", level: 2 },
    { id: "businessModel-pricingTiers", labelKey: "bp.headings.pricing", level: 3 },
    { id: "businessModel-pricingModel", labelKey: "bp.headings.pricing", level: 3 },
    { id: "businessModel-revenueStreamsDetailed", labelKey: "bp.headings.revenueStreams", level: 3 },
    { id: "businessModel-costStructure", labelKey: "bp.headings.details", level: 3 },
    { id: "businessModel-keyMetrics", labelKey: "bp.headings.kpis", level: 3 },
    { id: "businessModel-competitiveAdvantage", labelKey: "bp.headings.overview", level: 3 },
    { id: "businessModel-gtmPoints", labelKey: "bp.headings.tactics", level: 3 },
    { id: "businessModel-grantFitPoints", labelKey: "bp.headings.fundingStrategy", level: 3 },
    { id: "businessModel-moatPoints", labelKey: "bp.headings.ipMoat", level: 3 },
    { id: "businessModel-scaling", labelKey: "bp.headings.roadmap", level: 3 },
    { id: "businessModel-projections", labelKey: "bp.headings.projections", level: 3 },
    { id: "businessModel-successFactors", labelKey: "bp.headings.successFactors", level: 3 },
  ],
};

export function numberedSub(section: SectionId, index: number) {
  const base = sectionOrder[section];
  return `${base}.${index}`;
}

