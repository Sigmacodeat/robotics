const ffg = {
  title: 'FFG-Antrag – Struktur & Inhalte',
  note: 'Diese Sektion bündelt die FFG-relevanten Angaben in komprimierter Form und verweist auf detaillierte Arbeitspakete, Meilensteine und Budgetübersichten.',
  sections: [
    {
      title: 'Programm & Kontext',
      items: [
        'Förderstelle: FFG (Österreichische Forschungsförderungsgesellschaft)',
        'Programm: Basisprogramme – F&E (Beispiel, anpassen je Call)',
        'Einreichart: Kooperatives F&E / Einzelprojekt (anpassen)',
      ],
    },
    {
      title: 'Ziele (Objectives)',
      items: [
        'Entwicklung einer resilienten, AI-gestützten Arbitrage-Plattform mit Fokus Basketball (NBA, Euroleague, NCAA)',
        '>95% Arb-Erfolgsrate und >4% ROI-Simulation, <10ms Latenz, 99.99% Uptime',
        'Skalierbare Cloud-Architektur (AWS/GCP), Self-Healing & Chaos-Testing',
      ],
    },
    {
      title: 'Innovations- und F&E-Inhalt',
      items: [
        'Smart AI Layer: Value-Bet-Detection, RL-Agenten (Stake-Optimierung), Predictive Arb-Signals',
        'Cluster-Arbs (Kombi-Märkte, >5% Profit), In-Game-Arbs (Momentum, Injury Shifts)',
        'MLOps: Data Normalisierung, Feature Stores, Evaluations & Red Teaming',
      ],
    },
    {
      title: 'Arbeitsplan & Meilensteine (Verweis)',
      items: [
        'Siehe Kapitel Arbeitspakete (Budget) und Arbeitspakete – Detailliert (FFG-konform)',
        'Siehe Meilensteinplan (Quartale, Akzeptanzkriterien, Abhängigkeiten)',
      ],
    },
    {
      title: 'Budget & Mittelverwendung (Verweis)',
      items: [
        'Siehe Finanzkapitel CAPEX/OPEX und Detailtabellen (Personal, Material, Subcontracting, Sonstiges)',
        'Kostenalarme, FinOps-Transparenz, Drittnachweise via Stripe/CRM',
      ],
    },
    {
      title: 'Impact & Verwertung',
      items: [
        'Kommerzialisierung via SaaS, App-Store, Affiliate/MLM; Viral Coefficient >1.2',
        'EU-Mehrwert: Datenschutz-Trust, Talentpool, Förderzugang',
        'Technologietransfer: Open Interfaces, SDK, Partner-Ökosystem',
      ],
    },
    {
      title: 'Risiken & Mitigation',
      items: [
        'Hardware-/Datenquellen-Risiken → Redundanz, Orchestrierung, P2P-Ausführung',
        'False Positives → LLM-Backcheck, Evaluations, Schwellensteuerung',
        'Skalierungsrisiken → Multi-Cloud-Failover, Observability, Rate Limiting',
      ],
    },
    {
      title: 'Compliance & Sicherheit',
      items: [
        'Datenschutz: DSGVO, Datenminimierung, Edge-Inference',
        'Sicherheit: Zero-Trust, Secrets-Management, Pen-Tests, Threat-Modeling',
        'AI Act: Risikomanagement, Logging/Audits, Human Oversight, Model Cards',
      ],
    },
  ],
} as const;

export default ffg;
