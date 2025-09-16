const gtm = {
  // Standardisierte Aufzählungspunkte für Market-Seite (Kapitel 3.8 – Phase 1)
  phase1: [
    'Pilotprojekte mit Pflegeheimen, Hotels, Forschungsinstituten',
    'Kooperationen mit österreichischen Universitäten (TU Wien, FH Hagenberg, JKU Linz)',
    'Skalierung (Phase 2 – 2028–2029): Aufbau RaaS-Infrastruktur für B2B-Kunden, Launch Roboter-Appstore (Beta), Ziel: 20–30 Kunden in DACH-Region',
    'Expansion (Phase 3 – 2030): Eintritt in EU-Markt (Healthcare + Office), White-Label-Lösungen für internationale Partner, Appstore als Standard-Ökosystem für humanoide Roboter',
  ],
  phases: [
    { name: "Phase 1 – Piloten", items: ["PoC in Logistik/Fertigung", "SLA/Support‑Modell definieren", "Partner‑Onboarding (Integratoren, OEMs)"] },
    { name: "Phase 2 – App‑Store Beta", items: ["Developer‑SDK", "Third‑Party‑Skills", "Billing/Licensing"] },
    { name: "Phase 3 – Enterprise Rollout", items: ["Multi‑Site Deployments", "Analytics/KPIs", "Enablement & Training"] },
  ],
  tactics: [
    "Design‑Partner‑Programm (3–5 Leitkunden)",
    "Allianzen mit Robotik‑OEMs & Integratoren",
    "Developer‑Programm für Skill‑Anbieter (Rev‑Share)",
    "Zertifizierungen/CE/AI‑Act als Marktzutrittsturbo",
    "Showcases & Demos (Messen, Labs, Video‑Katalog)",
    "Content/Demand‑Gen: Tech‑Blogs, Benchmark‑Videos, Webinar‑Series",
    "Field‑Marketing: Werks‑Demos mit OEM/Integrator vor Ort",
  ],
  kpis: [
    ">99.99% Uptime (rolling 30d)",
    "<10ms Edge‑Reaktionszeit",
    ">60% Skill‑Adoption je Kunde",
    ">3 aktive Skills je Roboter nach 90 Tagen",
    "Net Expansion >120%",
    "Sales‑Cycle <90 Tage (Pilot → Rollout)",
    "PoC‑Conversion >50%",
  ],
  funnel: [
    { stage: "Awareness", metric: "Reichweite/Impressions", target: ">500k/Quartal", notes: "Paid + Earned Media, Social Video Demos" },
    { stage: "Interest", metric: "Website‑Besuche / Demo‑Views", target: ">60k/Quartal", notes: "SEO, Tech‑Blog, Benchmark‑Videos" },
    { stage: "Consideration", metric: "Qualified Leads (MQL)", target: "3.5% von Visits", notes: "Lead‑Magnete, Whitepaper, Webinare" },
    { stage: "Evaluation", metric: "SQL/Design‑Partner", target: "40% der MQL", notes: "Use‑Case‑Scoping, ROI‑Simulator" },
    { stage: "Pilot", metric: "PoC‑Start", target: ">50% der SQL", notes: "Werk‑Demos, Integrator‑Support, SLAs" },
    { stage: "Rollout", metric: "Multi‑Site Deployments", target: ">60% der Pilots", notes: "Enablement, Training, Analytics" },
    { stage: "Expansion", metric: "Net Expansion", target: ">120%", notes: "App‑Store‑Upsell, neue Skills/Use‑Cases" },
  ],
  channelMix: [
    { channel: "Allianzen (OEM/Integrator)", share: 35, metrics: ["Partner‑Pipeline", "Co‑Seller‑Deals"], notes: "Hebel über bestehende Kundenbasen" },
    { channel: "Design‑Partner/Direct", share: 25, metrics: ["SQLs", "PoC‑Starts"], notes: "Schnelle Validierung, Referenzen" },
    { channel: "Developer/Marketplace", share: 15, metrics: ["SDK‑Signups", "Third‑party Skills"], notes: "Ökosystem‑Wachstum, Rev‑Share" },
    { channel: "Events & Demos", share: 10, metrics: ["Leads", "Demo‑Requests"], notes: "Live‑Erlebnis, Trust" },
    { channel: "Content/SEO/Community", share: 10, metrics: ["Visits", "MQL‑Rate"], notes: "Langfristige Demand‑Gen" },
    { channel: "Paid (Targeted ABM)", share: 5, metrics: ["CTR", "CPL"], notes: "Eng fokussiert auf ICP Accounts" },
  ],
} as const;

export default gtm;
