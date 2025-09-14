export const sectionOrder = {
  // Desired chapter order in the combined view
  executive: 1,
  businessModel: 2,
  market: 3,
  gtm: 4,
  finance: 5,
  technology: 6,
  teamOrg: 7,
  risks: 8,
  tractionKpis: 9,
  impact: 10,
  exitStrategy: 11,
  // Additional sections follow afterwards
  company: 12,
  products: 13,
  // Technology deep-dive (kept as subchapters for now)
  stateOfTheArt: 14,
  innovation: 15,
  ipMoat: 16,
  // Financials & costs (detailed)
  costPlan: 17,
  capTable: 18,
  // Trust, compliance & ops
  compliance: 19,
  operations: 20,
  // Outreach
  dissemination: 21,
  // Close
  cta: 22,
  appendix: 23,
  // legacy/aux sections still referenced by components
  problem: 23,
  solution: 24,
} as const;

export type SectionId = keyof typeof sectionOrder;

export const numbered = (id: SectionId, label: string) => `${sectionOrder[id]}. ${label}`;
