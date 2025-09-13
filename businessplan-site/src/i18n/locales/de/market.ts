const market = {
  title: "Markt & Wettbewerb",
  description: [
    "Service‑Robotik: ~47,10 Mrd. USD (2024) → ~98,65 Mrd. USD (2029), CAGR 15,9%. Humanoide: ~2,92 Mrd. USD (2025) → ~15,26 Mrd. USD (2030), CAGR 39,2% (MarketsandMarkets). Fokus: Healthcare (40%), Education (25%), Retail/Logistik (20%), Hospitality (15%).",
  ],
  segments: [
    {
      name: "Healthcare",
      size: "32,5 Mrd. USD (2025)",
      growth: "28,3% p.a.",
      // Anteil für kompakte Marktsegmente-Visualisierung (summe ~100%)
      share: 40,
      label: "Gesundheit & Pflege",
    },
    {
      name: "Hospitality",
      size: "—",
      growth: "—",
      share: 15,
      label: "Gastgewerbe",
    },
    {
      name: "Education",
      size: "8,2 Mrd. USD (2025)",
      growth: "22,1% p.a.",
      share: 25,
      label: "Bildung",
    },
    {
      name: "Logistik",
      size: "—",
      growth: "—",
      share: 20,
      label: "Logistik",
    },
  ],
  competitiveAdvantage: [
    "KI-gesteuerte Persönlichkeiten für bessere Mensch-Maschine-Interaktion",
    "Modulare Plattform mit kurzen Entwicklungszyklen",
    "Starke Fokussierung auf Datenschutz und Compliance",
  ],
  // Konsolidiert aus Legacy-Inhalten
  tam: "> $40 Mrd. bis 2030 (Service Robotics & Humanoids) – getrieben durch Automatisierung, Reshoring und demografischen Wandel.",
  sam: "Industrie‑Segmente mit hohem Bedarf: Logistik, Fertigung, Facility & Service – initiale Fokuskorridore mit klarer Zahlungsbereitschaft.",
  som: "Pilot‑regionen mit Enterprise‑Rollouts (DACH/EU) und Partner‑Ökosystem – skalierbar über App‑Store und Fleet‑Deployments.",
  traction: [
    "Pilotflotte in Logistik/Fertigung startklar: 3–5 PoCs ab Q3, Rollout‑Entscheidungen bis Q4",
    "App‑Store Beta (Q4): 10+ Kern‑Skills, erste Third‑Party‑Integrationen und Billing‑Pfad",
    ">99.99% Uptime / <10ms Edge‑Reaktionszeit (SLOs); observability‑gestützt, mit Audit‑Logs",
    ">60% Skill‑Adoption je Kunde innerhalb von 6 Monaten; >3 aktive Skills/Roboter nach 90 Tagen",
    ">5 qualifizierte Design‑Partner (LOIs/PoCs) im Pipeline‑Funnel; PoC‑Conversion >50%",
    "OEM/Integrator‑Allianzen: 2+ Partnerschaften im Aufbau (Co‑Selling, Zertifizierungen, SLAs)",
  ],
} as const

export default market
