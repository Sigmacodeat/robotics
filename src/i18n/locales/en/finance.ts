const finance = {
  revenueNarrative: 'RaaS is the primary revenue driver (€3,000–€4,000 per robot and month); from year 3, the app store contributes ~5–15% through upsell (skills/SLAs).',
  breakEven: [
    { label: 2025, value: -240 },
    { label: 2026, value: -120 },
    { label: 2027, value: 10 },
    { label: 2028, value: 140 },
    { label: 2029, value: 320 },
  ],
  revenueVsCost: {
    revenue: [
      { label: 2025, value: 480 },
      { label: 2026, value: 820 },
      { label: 2027, value: 1200 },
      { label: 2028, value: 1700 },
      { label: 2029, value: 2300 },
    ],
    costs: [
      { label: 2025, value: 720 },
      { label: 2026, value: 940 },
      { label: 2027, value: 1190 },
      { label: 2028, value: 1450 },
      { label: 2029, value: 1750 },
    ],
  },
  useOfFundsYears: {
    headers: ["Year", "Personnel", "Hardware CAPEX", "Cloud/Infra", "GTM/Sales", "Compliance/Safety", "Operations", "Total"],
    rows: [
      [2025, 420, 160, 60, 70, 25, 25, 760],
      [2026, 620, 120, 90, 80, 30, 40, 980],
      [2027, 820, 90, 120, 100, 35, 50, 1215],
      [2028, 980, 60, 140, 120, 40, 60, 1400],
      [2029, 1100, 40, 160, 140, 45, 70, 1555],
    ]
  },
  cashFlow: {
    operating: [ [2025, -420], [2026, -180], [2027, 140], [2028, 420], [2029, 680] ],
    investing: [ [2025, -160], [2026, -120], [2027, -90], [2028, -60], [2029, -40] ],
    financing: [ [2025, 600], [2026, 0], [2027, 0], [2028, 0], [2029, 0] ],
  },
  revenueComposition: {
    labels: [2025, 2026, 2027, 2028, 2029],
    series: [
      { name: "RaaS", color: "#3b82f6", values: [380, 650, 960, 1400, 1900] },
      { name: "App Store", color: "#f59e0b", values: [100, 170, 240, 300, 400] },
    ],
  },
  assumptions: [
    "Avg RaaS price per robot: ~€3,500/month (range €3,000–€4,000)",
    "Contribution after COGS: ~€2,100/month per robot",
    "CAC ~€6,000; Payback ~3 months; LTV (contribution) ~€50,000",
    "App‑Store share: 5–15% of revenue from year 3",
    "Growth via rollouts (OEM/integrator) and upsell (SLAs, apps)"
  ],
  assumptionsTable: {
    headers: ["Year", "Robots", "Avg price (€/month)", "Utilization", "Monthly revenue (k€)", "Annual revenue (k€)"],
    rows: [
      [2025, 8, 3300, "70%", 18, 220],
      [2026, 20, 3400, "78%", 53, 630],
      [2027, 30, 3500, "82%", 86, 1030],
      [2028, 40, 3500, "85%", 117, 1400],
      [2029, 50, 3500, "90%", 158, 1900]
    ]
  },
  profitBridgeSteps: [
    { label: "Revenue", value: 2300, type: "increase", color: "#22c55e" },
    { label: "COGS", value: 700, type: "decrease", color: "#ef4444" },
    { label: "Gross Profit", value: 1600, type: "subtotal", color: "#64748b" },
    { label: "OPEX", value: 1000, type: "decrease", color: "#ef4444" },
    { label: "Other", value: 200, type: "decrease", color: "#ef4444" },
    { label: "EBITDA", value: 400, type: "total", color: "#0ea5e9" },
  ],
  capexOpex: {
    headers: ["Category", "2025", "2026", "2027"],
    rows: [
      ["CAPEX – hardware", 120, 80, 60],
      ["CAPEX – tools", 40, 20, 10],
      ["OPEX – cloud", 60, 90, 120],
      ["OPEX – support", 30, 50, 70],
    ],
  },
  projectionsScenarios: {
    headers: ["Scenario", "ARR 2027", "EBITDA 2029"],
    rows: [
      ["Base", "€12m", "€4m"],
      ["Upside", "€16m", "€6m"],
      ["Conservative", "€9m", "€2.5m"],
    ],
  },
  fundingStrategy: [
    "2025: Seed €0.6m (product/team/GTM) + grants €0.2–0.4m",
    "2026: Bridge €0.3–0.5m to accelerate pilot rollouts",
    "Optional 2027: Series A depending on KPI milestones",
  ],
  // Explicit allocation (shares in %)
  fundingStrategyAllocation: [
    { area: "Team", percent: 55 },
    { area: "Hardware CAPEX", percent: 20 },
    { area: "GTM/Sales", percent: 12 },
    { area: "Cloud/Infra", percent: 8 },
    { area: "Compliance/Safety", percent: 5 }
  ],
  runway: [
    ["Current cash", 450000],
    ["Monthly burn", -65000],
    ["Runway (months)", 7],
  ],
  // Investor terms (for Ask & Terms)
  terms: [
    "Instrument: SAFE",
    "Discount: 15%",
    "Valuation Cap: €5.0m",
    "Pro‑rata rights: yes",
  ],
  // Ticket size (for Use of Funds / Ask)
  fundingRound: {
    ticket: "€600,000"
  },
  kpis: {
    labels: { payback: "Payback", grossMargin: "Gross margin" },
    units: { payback: "mo", grossMargin: "%", cac: "€", ltv: "€" },
    values: { cac: 6000, ltv: 50000, payback: 3, grossMargin: 64 },
    deltas: { cac: -2.1, ltv: 4.5, payback: -1.0, grossMargin: 0.8 },
  },
} as const;

export default finance;
