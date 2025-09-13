const chapters = {
  cover: { title: "Deckblatt" },
  executive: { subtitle: "Kurzüberblick & Key Facts" },
  risks: { subtitle: "Risiken & Mitigation" },
  impact: { subtitle: "Impact & Nachhaltigkeit" },
  compliance: { subtitle: "Compliance & Responsible AI" },
  team: { subtitle: "Team & Organisation" },
  products: { subtitle: "Produkte & Roadmap" },
  businessModel: {
    subtitle: "Geschäftsmodell & Monetarisierung",
    gtmTitle: "Go‑To‑Market & Piloten",
    grantFitTitle: "Grant Fit (AWS / FFG)",
    moatTitle: "IP & Technischer Moat",
    overviewTitle: "Überblick",
  },
  market: { subtitle: "Markt & Wettbewerb" },
  technology: { subtitle: "Technologie & Architektur" },
  finance: { subtitle: "Finanzen & KPIs" },
  executiveSummary: {
    title: "Executive Summary",
    paragraphs: [
      "Wertangebot: Humanoide AI‑Robotik als RaaS mit Robot‑App‑Store und Policy‑Hub – zertifizierte Skills werden zu End‑to‑End‑Workflows komponiert, sicher ausgerollt (CE/AI‑Act) und fleet‑weit überwacht.",
      "Traktion/KPIs: Pilotflotte (Logistik/Fertigung) in Vorbereitung, App‑Store‑Beta, Ziel‑KPIs >99.99% Uptime, <10ms Edge‑Reaktion, >60% Skill‑Adoption je Kunde in 6 Monaten.",
      "Finanzierungs‑Ask: Seed + Grants für Team, Safety‑Evidenzen und Pilotflotte; Mittelverwendung: R&D/Safety, App‑Store/SDK, GTM‑Partnerschaften, Compliance/CE‑Doku.",
    ],
    sections: {
      problem: {
        title: "Problem",
        content:
          "Akuter Fachkräftemangel, gefährliche/monotone Aufgaben und fragmentierte IT/OT‑Stacks bremsen die Produktivität. Klassische Automatisierung ist unflexibel, teuer in der Anpassung und skaliert schlecht über Standorte und Use‑Cases.",
      },
      solution: {
        title: "Lösung",
        platform: {
          title: "Plattform",
          content:
            "Humanoide AI‑Robotik als RaaS mit Robot‑App‑Store: zertifizierte Skills (Greifen, Navigation, Inspektion, Handling) werden zu End‑to‑End‑Workflows komponiert und fleet‑weit ausgerollt.",
        },
        technology: {
          title: "Technologie",
          content:
            "Perzeption (Multi‑Sensor/VLM/3D), Decision (Planner/Policies/Safety), Execution (Force/Impedance). RL/IL‑Agenten lernen aus Demos & Simulation; Policy‑Hub, Tele‑Assist, Fleet‑Learning, CE/AI‑Act‑Compliance.",
        },
      },
      market: {
        title: "Markt",
        content:
          "Megatrend Automatisierung/Reshoring. TAM >$40B bis 2030 (Service Robotics & Humanoids). Starke Nachfrage in Logistik, Fertigung, Facility & Service.",
      },
      usps: {
        title: "USPs",
        items: [
          "Robot‑App‑Store: schnelle Time‑to‑Value, modulare Skills, vendor‑neutral",
          "Policy‑Hub & Safety‑Guardrails: deterministische, auditierbare Ausführung",
          "Fleet‑Learning: kontinuierliche Performance‑Zuwächse (RL/IL)",
          "99.99% Uptime, <10ms Edge‑Reaktion, Zero‑Downtime‑Updates",
          "Enterprise‑Integration (ERP/WMS/MES/IoT, Digital Twins)",
        ],
      },
      businessModel: {
        title: "Geschäftsmodell",
        content:
          "RaaS (Subscription + Usage) + Skill‑Lizenzen + Marketplace‑Fee. Enterprise‑Rollouts mit Service‑ und Support‑Plänen.",
      },
    },
  },
} as const;

export default chapters;
