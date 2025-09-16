const costPlan = {
  budgetRows: [
    ["R&D", "€420k", "42%"],
    ["Go‑to‑market", "€260k", "26%"],
    ["Hardware", "€160k", "16%"],
    ["Operations", "€110k", "11%"],
    ["Compliance", "€50k", "5%"],
  ],
  // Detailed breakdown of hardware investments (k€)
  hardwareBreakdown: {
    title: "Hardware details (k€)",
    headers: ["Category", "Amount"],
    rows: [
      ["Humanoid robots – Model A (2 units)", 90],
      ["Humanoid robots – Model B (1 unit)", 45],
      ["Sensor packs (RGB‑D/LiDAR/IMU)", 10],
      ["End effectors (gripper/force)", 6],
      ["Compute (Jetson Orin/Edge‑GPU)", 5],
      ["Sim licenses/assets", 2],
      ["Datasets (commercial licenses)", 2],
    ],
  },
  budgetByYear: {
    title: "Budget by year (k€)",
    headers: ["Year", "Amount"],
    rows: [["2025", 760], ["2026", 820], ["2027", 890], ["2028", 940], ["2029", 980]],
  },
  // Optional overall CAPEX/OPEX (k€)
  capexOpex: {
    title: "CAPEX / OPEX (k€)",
    headers: ["Category", "Amount"],
    rows: [
      ["CAPEX – Robots/Compute", 110],
      ["CAPEX – Sensors", 15],
      ["OPEX – Cloud/Inference", 35],
      ["OPEX – Proxies/Scraping", 12],
    ],
  },
} as const;

export default costPlan;
