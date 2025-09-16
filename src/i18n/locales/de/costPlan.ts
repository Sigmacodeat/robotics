const costPlan = {
  budgetRows: [
    ["F&E", "€420k", "42%"],
    ["Go‑to‑Market", "€260k", "26%"],
    ["Hardware", "€160k", "16%"],
    ["Operations", "€110k", "11%"],
    ["Compliance", "€50k", "5%"],
  ],
  // Detaillierte Aufschlüsselung der Hardware‑Investitionen (k€)
  hardwareBreakdown: {
    title: "Hardware‑Details (k€)",
    headers: ["Kategorie", "Betrag"],
    rows: [
      ["Humanoide Roboter – Modell A (2 Stk.)", 90],
      ["Humanoide Roboter – Modell B (1 Stk.)", 45],
      ["Sensorpakete (RGB‑D/LiDAR/IMU)", 10],
      ["Endeffektoren (Greifer/Kraft)", 6],
      ["Compute (Jetson Orin/Edge‑GPU)", 5],
      ["Sim‑Lizenzen/Assets", 2],
      ["Datasets (kommerzielle Lizenzen)", 2],
    ],
  },
  budgetByYear: {
    title: "Budget nach Jahr (k€)",
    headers: ["Jahr", "Betrag"],
    rows: [["2025", 760], ["2026", 820], ["2027", 890], ["2028", 940], ["2029", 980]],
  },
  // Optionale Gesamtsicht CAPEX/OPEX (k€)
  capexOpex: {
    title: "CAPEX / OPEX (k€)",
    headers: ["Kategorie", "Betrag"],
    rows: [
      ["CAPEX – Roboter/Compute", 110],
      ["CAPEX – Sensorik", 15],
      ["OPEX – Cloud/Inference", 35],
      ["OPEX – Proxies/Scraping", 12],
    ],
  },
} as const;

export default costPlan;
