const assumptions = {
  title: "Assumptions & Sources (Audit appendix)",
  sectionTitles: {
    assumptions: "Assumptions",
    sources: "Sources",
  },
  assumptions: [
    "RaaS price per robot avg €3,500/month (range 3,000–4,000)",
    "Contribution per robot ~€2,100/month after COGS",
    "CAC ~€6,000; payback ~3 months; LTV (contribution) ~€50,000",
    "App‑store share of revenue from year 3: 5–15%",
    "Cloud costs grow moderately with fleet size (scale discounts)",
  ],
  sources: [
    "Stripe/CRM exports (internal)",
    "MarketsandMarkets (Robotics/Humanoids) – 2024/2025",
    "Goldman Sachs Research (Humanoids) – ~2035 outlook",
    "Statista – Service Robotics Europe",
    "Internal benchmarks (pilots/demos)",
  ],
  table: {
    title: "Key parameters",
    headers: ["Parameter", "Value", "Source"],
    rows: [
      ["RaaS monthly fee (avg)", "€3,500", "Internal pricing guide"],
      ["COGS share", "~30%", "Internal model"],
      ["Cloud per robot/month", "€120–180", "Provider quotes"],
      ["CAC", "€6,000", "Cohort analysis"],
      ["Payback", "~3 months", "Cohort analysis"],
    ],
  },
} as const;

export default assumptions;

