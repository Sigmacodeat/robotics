const exit = {
  title: "Exit-Strategie",
  options: {
    a: { title: "Trade Sale (Strategic)", points: [] },
    b: { title: "PE / Growth Buyout", points: [] },
    c: { title: "IPO (Langfrist-Option)", points: [] },
  },
  notes: "Hohes strategisches Interesse durch AI/Robotics-Konsolidierung; Co-Selling/Allianzen erhöhen Valuation-Optionen.",
  roi: { title: "ROI & Investor-Value", text: "Illustrative Szenarien zeigen attraktive Multiples unter konservativen Wachstumsannahmen." },
  valuation: {
    title: "Bewertungsansatz",
    methods: [
      "Umsatz-Multiples (ARR forward)",
      "Vergleichstransaktionen",
      "Discounted Cash Flow (Sensitivität)",
    ],
    range: "€30–60 Mio (illustrativ)",
    multiples: ["EV/ARR 8–12x", "EV/EBITDA 15–25x"],
  },
  earnOut: {
    title: "Earn-out-Mechanismen",
    mechanics: [
      "Leistungsbasierte Tranchen (ARR-/EBITDA-Meilensteine)",
      "Retention-gebundenes Equity-Vesting",
      "Clawback-Klauseln für außergewöhnliche Ereignisse",
    ],
  },
  secondary: {
    title: "Secondary-Optionen",
    points: [
      "Teilweiser Gründerliquidität bei Series A/B",
      "Mitarbeiterliquidität über Tender Offer",
    ],
  },
  coInvest: {
    title: "Co‑Investment-Strukturen",
    points: [
      "Strategisches Co-Invest mit GTM-Partnern",
      "Syndiziertes SPV für strategische Käufer",
    ],
  },
  buyers: {
    title: "Potenzielle Käufer",
    strategic: ["Odds-Plattformen", "Datenanbieter", "Sportmedien", "US-Sportsbooks"],
    financial: ["Growth-Equity-Fonds", "Sektorfokussierte PE"],
  },
  timeline: {
    title: "Exit-Zeitplan",
    phases: [
      { period: "2026–2027", activities: ["ARR > €10 Mio skalieren", "Unit Economics stabil halten"] },
      { period: "2028–2029", activities: ["EBITDA positiv", "Käuferuniversum verbreitern"] },
      { period: "2030+", activities: ["Exit-Fenster (IPO oder Trade Sale)"] },
    ],
  },
  preparation: {
    title: "Exit-Vorbereitung",
    actions: [
      "Bankfähige KPIs: auditierte ARR, Churn <10%, Bruttomarge >60%",
      "Compliance-Bereitschaft: CE, AI Act, Datenschutz",
      "Datenraum: Verträge, IP, Tech-Dokumente, Security-Reports",
    ],
  },
  risks: {
    title: "Exit-Risiken & Gegenmaßnahmen",
    items: [
      { risk: "Marktfenster verschiebt sich", mitigation: "Dual-Track-Prozess (IPO/Trade Sale), flexible Timing" },
      { risk: "Käuferkonzentration", mitigation: "Käuferuniversum verbreitern (strategisch/finanziell)" },
      { risk: "Regulatorische Verzögerungen", mitigation: "Frühe Zertifizierung, Legal Counsel" },
    ],
  },
} as const;

export default exit;
