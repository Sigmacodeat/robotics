const risks = {
  title: "Risiken",
  list: [
    "Technologierisiko (TRL, Sim‑zu‑Real, Safety/HRI)",
    "Go‑to‑Market (Abhängigkeit von OEM/Integratoren, Zertifizierungszyklen)",
    "Finanzierung (Hardware‑CAPEX, Skalierungskosten)",
    "Compliance (EU AI Act, CE, Cybersecurity/Privacy)",
    "Talent (DeepTech, Wettbewerb um Expert:innen)",
  ],
  tech: {
    title: "Technologie",
    complexity: {
      title: "Komplexität",
      risk: "Ganzkörper‑Manipulation, Sim‑zu‑Real und Safety erhöhen die Systemkomplexität und bergen Integrations‑/Stabilitätsrisiken.",
      mitigation: "Phasenplan mit klaren Meilensteinen (AP1–AP4), frühzeitige Ende‑zu‑Ende‑Tests, Canary‑Rollouts, Tele‑Assist und robuste Observability (Tracing/Logs/Metriken).",
    },
    aiSafety: {
      title: "AI Safety",
      risk: "Fehlverhalten lernender Policies unter Edge‑Bedingungen (Out‑of‑Distribution, Latenz, Sensorrauschen) kann Safety/HRI beeinträchtigen.",
      mitigation: "Zonen‑/Kontaktkraft‑Guardrails, formale Constraints, Red‑Teaming & Evals, Human‑in‑the‑Loop bei riskanten Manövern, Audit‑Trail & Provenienz.",
    },
    vendors: {
      title: "Abhängigkeit von Anbietern",
      risk: "Abhängigkeit von Hardware‑/Cloud‑Anbietern kann Kosten, Lieferzeiten und Roadmap beeinflussen.",
      mitigation: "Abstraktionsschicht (ROS2/Hardware‑Adapter), Multi‑Vendor‑Qualifizierung, langfristige SLAs und Second‑Source‑Strategie.",
    },
  },
  market: {
    title: "Markt",
    adoption: {
      title: "Adoption",
      risk: "Enterprise‑Adoption kann sich verzögern (Change‑Management, Werkszertifizierung, interne Compliance).",
      mitigation: "Design‑Partner‑Programm, messbare Pilot‑KPIs, Schulungen/Enablement, vorgefertigte Templates für gängige Prozesse.",
    },
    competition: {
      title: "Wettbewerb",
      risk: "Starker Wettbewerb durch OEM‑Stacks und horizontale Plattformen; Preisdruck bei Standard‑Skills.",
      mitigation: "Differenzierung über App‑Store/SDK, zertifizierte Third‑Party‑Skills, EU‑Compliance & Safety als Markttreiber, Fokus auf High‑Impact‑Workflows.",
    },
    pricing: {
      title: "Pricing",
      risk: "Fehlende Zahlungsbereitschaft für bestimmte Workflows oder in frühen Phasen der Automatisierung.",
      mitigation: "Tiered + Usage‑Modell, ROI‑Simulator, Pay‑per‑Outcome‑Optionen und schlanke Einstiegspakete (PoC‑Bundles).",
    },
  },
  finance: {
    title: "Finanzen",
    grants: {
      title: "Förderungen",
      risk: "Ausbleibende oder verzögerte Förderzusagen belasten den Cash‑Runway.",
      mitigation: "Hybrid‑Finanzierung (Seed + Grants), Meilenstein‑getaktete Mittelverwendung, alternative Programme (EU/Kofinanzierung).",
    },
    cashflow: {
      title: "Cashflow",
      risk: "Vorfinanzierung von Hardware/Prototypen, langer Sales‑Zyklus und Capex können Liquidität strapazieren.",
      mitigation: "Hardware‑Leasing/‑Partner, gestaffelte Lieferungen, Vorauszahlungen/Deposits, striktes Working‑Capital‑Monitoring.",
    },
  },
  regulatory: {
    title: "Regulatorik",
    eu: {
      title: "EU/AI Act",
      risk: "Fehleinstufung oder unvollständige Nachweise können Zertifizierung und Rollouts verzögern.",
      mitigation: "Frühes Compliance‑Management, Risiko‑/Daten‑/Modell‑Governance, lückenlose Logs, Model Cards/Datasheets und CE‑Dokumentation.",
    },
    cert: {
      title: "Zertifizierungen",
      risk: "Werksinterne Abnahmen (Safety/HRI) variieren je Standort und erfordern zusätzliche Tests.",
      mitigation: "Standardisierte Testpläne, Re‑Use zertifizierter Module, enge Zusammenarbeit mit Sicherheitsbeauftragten, Pilot‑Werke als Referenzen.",
    },
  },
  operations: {
    title: "Operations",
    talent: {
      title: "Talent",
      risk: "Knappheit an DeepTech‑Profilen (Robotik/Controls/ML) limitiert Umsetzungstempo.",
      mitigation: "ESOP & Employer‑Branding, Remote‑freundliche Teams, Uni‑Kooperationen, gezielte Senior‑Hires mit Multiplikator‑Effekt.",
    },
    keyPeople: {
      title: "Key People",
      risk: "Abhängigkeit von Schlüsselpersonen erhöht Ausfall‑/Know‑how‑Risiken.",
      mitigation: "Dokumentation, Pairing/Reviews, Rotation, Notfall‑Pläne und Redundanz in kritischen Rollen.",
    },
  },
  mitigation: {
    title: "Gegenmaßnahmen",
    items: [
      "Meilensteinplan mit Evals & Risk Register (AP1–AP4)",
      "Partnerschaften (Integratoren/OEMs), Design‑Partner‑Programm",
      "Hybrid‑Finanzierung (Seed + Grants), Kostenkontrolle",
      "Provenienz/Evals, Sicherheitsprogramm, Compliance‑Dokus",
      "ESOP & Branding, Kooperationen mit Universitäten/Netzwerken",
    ],
  },
  mitigationDetailed: {
    title: "Gegenmaßnahmen (detailliert)",
    tech: [
      "Risk Register je Arbeitspaket (AP1–AP4) mit klaren Eigentümern",
      "Canary‑Rollouts, Feature‑Flags, schrittweise Aktivierung",
      "Evals/Red‑Teaming, formale Constraints, simulierte Edge‑Cases",
    ],
    market: [
      "Design‑Partner & Referenzen, wiederholbare Pilot‑Playbooks",
      "ROI‑Simulatoren und klare Business‑Cases pro Workflow",
      "Zertifizierungs‑Roadmaps kommunizieren (CE/AI‑Act)",
    ],
    finance: [
      "Leasing/Partnerschaften für CAPEX, Vorauszahlungen/Deposits",
      "Szenario‑Planung und Kostenkontrolle, Runway‑Alerts",
      "Mehrgleisige Förderung und Meilenstein‑Gatekeeping",
    ],
    legal: [
      "Frühe Einbindung von Compliance/Safety‑Beauftragten",
      "Standardisierte Test‑/Abnahmeprotokolle, Audit‑Trails",
      "Vertrags‑SLAs und Haftungsregelungen mit Partnern",
    ],
  },
  additional: {
    Monitoring: "KPIs/Telemetry, A/B‑Evals, Red‑Teaming für Safety/AI",
    ThirdParties: "Verträge/SLAs, Audit‑Trails, Pen‑Tests",
  },
  benefits: [
    "Schnellere Zertifizierungen durch wiederverwendbare, geprüfte Module",
    "Höhere Kundentreue via messbaren ROI und planbare Rollouts",
    "Produktqualität durch Telemetrie, E2E‑Evals und Fleet‑Learning",
  ],
} as const;

export default risks;
