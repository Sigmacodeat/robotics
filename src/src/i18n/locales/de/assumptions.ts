const assumptions = {
  title: "Annahmen & Quellen (Audit-Appendix)",
  assumptions: [
    "RaaS-Preis je Roboter Ø €3.500/Monat (Range 3.000–4.000)",
    "Deckungsbeitrag je Roboter ~€2.100/Monat nach COGS",
    "CAC ~€6.000; Payback ~3 Monate; LTV (Beitrag) ~€50.000",
    "App‑Store‑Anteil am Umsatz ab Jahr 3: 5–15%",
    "Cloudkosten wachsen moderat mit Flotte (Skalierungsrabatte)",
  ],
  sources: [
    "Stripe/CRM Exporte (intern)",
    "MarketsandMarkets (Robotics/Humanoids) – 2024/2025",
    "Goldman Sachs Research (Humanoids) – ~2035 Outlook",
    "Statista – Service Robotics Europe",
    "Interne Benchmarks (Pilot/Demos)",
  ],
  table: {
    title: "Parameter (Übersicht)",
    headers: ["Parameter", "Wert", "Quelle"],
    rows: [
      ["RaaS Monatsfee (Ø)", "€3.500", "Interne Preisleitlinie"],
      ["COGS Anteil", "~30%", "Interne Kalkulation"],
      ["Cloud je Roboter/Monat", "€120–180", "Providerquoten"],
      ["CAC", "€6.000", "Kohortenanalyse"],
      ["Payback", "~3 Monate", "Kohortenanalyse"],
    ],
  },
} as const;

export default assumptions;
