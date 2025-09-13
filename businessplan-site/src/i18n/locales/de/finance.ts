const finance = {
  revenueNarrative: 'RaaS ist der primäre Umsatztreiber (3.000–4.000 € pro Roboter und Monat); der App‑Store liefert ab Jahr 3 zusätzlich ~5–15% Umsatzanteil durch Upsell (Skills/SLAs).',
  breakEven: [
    { label: 2025, value: -240 },
    { label: 2026, value: -120 },
    { label: 2027, value: 10 },
    { label: 2028, value: 140 },
  ],
  revenueVsCost: {
    revenue: [
      { label: 2025, value: 480 },
      { label: 2026, value: 820 },
      { label: 2027, value: 1200 },
      { label: 2028, value: 1700 },
    ],
    costs: [
      { label: 2025, value: 720 },
      { label: 2026, value: 940 },
      { label: 2027, value: 1190 },
      { label: 2028, value: 1450 },
    ],
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
      { name: "App‑Store", color: "#f59e0b", values: [100, 170, 240, 300, 400] },
    ],
  },
  assumptions: [
    "Ø RaaS‑Preis je Roboter: ~€3.500/Monat (Range 3.000–4.000 €)",
    "Deckungsbeitrag nach COGS: ~€2.100/Monat je Roboter",
    "CAC ~€6.000; Payback ~3 Monate; LTV (Beitrag) ~€50.000",
    "App‑Store‑Anteil: 5–15% des Umsatzes ab Jahr 3",
    "Wachstum getrieben durch Roll‑outs (OEM/Integrator) und Upsell (SLAs, Apps)",
    "Asset‑Strategie: Kauf (CAPEX) der Kern‑Assets (Humanoide, Sensorik, Compute) zur maximalen Flexibilität und schnellen Iterationen"
  ],
  assumptionsTable: {
    headers: ["Jahr", "Roboter", "Ø‑Preis (€/Monat)", "Auslastung", "Monatsumsatz (k€)", "Jahresumsatz (k€)"],
    rows: [
      [2025, 8, 3300, "70%", 18, 220],
      [2026, 20, 3400, "78%", 53, 630],
      [2027, 30, 3500, "82%", 86, 1030],
      [2028, 40, 3500, "85%", 117, 1400],
      [2029, 50, 3500, "90%", 158, 1900]
    ]
  },
  useOfFundsYears: {
    headers: ["Jahr", "Personal", "Hardware CAPEX", "Cloud/Infra", "GTM/Vertrieb", "Compliance/Safety", "Operations", "Summe"],
    rows: [
      [2025, 420, 160, 60, 70, 25, 25, 760],
      [2026, 620, 120, 90, 80, 30, 40, 980],
      [2027, 820, 90, 120, 100, 35, 50, 1215],
      [2028, 980, 60, 140, 120, 40, 60, 1400],
      [2029, 1100, 40, 160, 140, 45, 70, 1555],
    ]
  },
  profitBridgeSteps: [
    { label: "Umsatz", value: 2300, type: "increase", color: "#22c55e" },
    { label: "COGS", value: 700, type: "decrease", color: "#ef4444" },
    { label: "Bruttogewinn", value: 1600, type: "subtotal", color: "#64748b" },
    { label: "OPEX", value: 1000, type: "decrease", color: "#ef4444" },
    { label: "Sonstiges", value: 200, type: "decrease", color: "#ef4444" },
    { label: "EBITDA", value: 400, type: "total", color: "#0ea5e9" },
  ],
  capexOpex: {
    headers: ["Kategorie", "2025", "2026", "2027"],
    rows: [
      ["CAPEX – Hardware", 120, 80, 60],
      ["CAPEX – Tools", 40, 20, 10],
      ["OPEX – Cloud", 60, 90, 120],
      ["OPEX – Support", 30, 50, 70],
    ],
  },
  projectionsScenarios: {
    headers: ["Szenario", "ARR 2027", "EBITDA 2029"],
    rows: [
      ["Basis", "€12 Mio.", "€4 Mio."],
      ["Upside", "€16 Mio.", "€6 Mio."],
      ["Konservativ", "€9 Mio.", "€2.5 Mio."],
    ],
  },
  fundingStrategy: [
    "2025: Seed €0,6 Mio. (Produkt/Team/GTM) + Grants €0,2–0,4 Mio.",
    "2026: Bridge €0,3–0,5 Mio. zur Beschleunigung Pilot‑Rollouts",
    "Optional 2027: Series‑A abhängig von KPI‑Meilensteinen",
  ],
  runway: [
    ["Aktueller Cash", 450000],
    ["Monatlicher Burn", -65000],
    ["Runway (Monate)", 7],
  ],
  kpis: {
    labels: { payback: "Payback", grossMargin: "Bruttomarge" },
    units: { payback: "mo", grossMargin: "%", cac: "€", ltv: "€" },
    values: { cac: 6000, ltv: 50000, payback: 3, grossMargin: 64 },
    deltas: { cac: -2.1, ltv: 4.5, payback: -1.0, grossMargin: 0.8 },
  },
} as const;

export default finance;
