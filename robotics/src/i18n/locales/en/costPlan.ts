const costPlan = {
  budgetRows: [
    ["R&D", "€420k", "42%"],
    ["Go‑to‑market", "€260k", "26%"],
    ["Hardware", "€160k", "16%"],
    ["Operations", "€110k", "11%"],
    ["Compliance", "€50k", "5%"],
  ],
  budgetByYear: {
    title: "Budget by year (k€)",
    headers: ["Year", "Amount"],
    rows: [["2025", 760], ["2026", 820], ["2027", 890]],
  },
} as const;

export default costPlan;
