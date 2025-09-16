export type EffortRow = { role: string; fte: number };

export type WorkPackageItem = {
  id: string;
  name: string;
  timeframe?: string;
  objectives?: string[];
  scope?: string[];
  deliverables?: string[];
  dependencies?: string[];
  effort?: EffortRow[];
  personMonths?: Array<{ role: string; pm: number }>;
  trl?: { start: number; target: number };
  budgetJustification?: { personnel?: string; material?: string; subcontracting?: string; other?: string };
  risks?: string[];
  mitigations?: string[];
  kpis?: string[];
  milestones?: Array<{ label: string; month: number; acceptance?: string }>;
  budget?: { personnel?: number; material?: number; subcontracting?: number; other?: number };
};

export type WorkPackagesLabels = {
  objectives: string;
  scope: string;
  deliverables: string;
  dependencies: string;
  effort: string;
  personMonths: string;
  trl: string;
  risks: string;
  mitigation: string;
  kpis: string;
  milestones: string;
  budget: string;
  budgetPersonnel: string;
  budgetMaterial: string;
  budgetSubcontracting: string;
  budgetOther: string;
  wp: string;
  role: string;
  fte: string;
  pm: string;
};
