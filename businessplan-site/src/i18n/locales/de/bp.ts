// bp.de.ts
import sections from './sections'
import technology from './technology'
import risks from './risks'
import exit from './exit'
import gtm from './gtm'

import businessModel from './businessModel'
import market from './market'
import impact from './impact'
import finance from './finance'
import products from './products'
import operations from './operations'
import mlops from './mlops'
import responsibleAI from './responsibleAI'
import teamOrg from './teamOrg'
import capTable from './capTable'
import costPlan from './costPlan'
import financePlanDetailed from './financePlanDetailed'
import marketCompetitive from './marketCompetitive'
import dissemination from './dissemination'
import company from './company'
import cta from './cta'

const exitAug = {
  ...exit,
  options: {
    ...(exit as any).options,
    a: { ...((exit as any).options?.a ?? {}), chartTitle: 'Trade Sale – Bewertungsbandbreite' },
    b: { ...((exit as any).options?.b ?? {}), chartTitle: 'PE/Growth Buyout – Bewertungsbandbreite' },
    c: { ...((exit as any).options?.c ?? {}), chartTitle: 'IPO (Langfrist) – Bewertungsbandbreite' },
  },
} as const

const bp = {
  sections,
  technology,
  risks,
  exit: exitAug,
  gtm,
  team: {
    esopDetails: [
      'Poolgröße initial 12%, optionale Erhöhung auf 15% nach Series A',
      'Vesting 4 Jahre mit 1 Jahr Cliff, danach monatlich',
      'Double‑Trigger Acceleration: 50% bei Change of Control + Kündigung ohne Grund',
      'FMV/Jahresbewertung (EU‑409A‑Äquivalent); Strike‑Preis = FMV zum Grant‑Zeitpunkt',
    ],
  },
  // Top‑Level Referenz für Wettbewerbsdaten (für Market‑Seite)
  marketCompetitive,
  tractionKpis: {
    kpis: [
      { label: 'Units (Roboter)', value: 50, unit: '', delta: 15 },
      { label: 'MRR', value: 175, unit: 'k€', delta: 22 },
      { label: 'NRR', value: 118, unit: '%', delta: 4 },
      { label: 'Churn', value: 8, unit: '%', delta: -1 },
      { label: 'Uptime', value: 99.99, unit: '%', delta: 0.02 },
      { label: 'Adoption (MoM)', value: 45, unit: '%', delta: 8 },
    ],
    trendsSeries: [
      { name: 'Units', data: [10, 20, 30, 40, 50, 65], color: '#22c55e' },
      { name: 'MRR (k€)', data: [40, 70, 100, 130, 175, 230], color: '#3b82f6' },
      { name: 'Churn (%)', data: [14, 12, 11, 10, 9, 8], color: '#ef4444' },
    ],
    highlights: [
      'RaaS‑Rollouts mit Partnern (OEM/Integrator) beschleunigen Units & MRR',
      'App‑Store Anteil ab Jahr 3 bei 5–15% des Umsatzes (Upsell)',
      'Payback ~3 Monate (CAC ~€6k), LTV (Beitrag) ~€50k, LTV/CAC > 7x',
    ],
    kpisExplain: [
      'Units = aktive Roboter im Feld; MRR in k€ (RaaS). NRR inkl. Upsell/Expansion, Churn monatlich.',
    ],
    methodology: [
      'Kohortenanalyse und Rolling Averages (28 Tage) für ARPU/CAC.',
      'Mix aus bezahlten und organischen Kanälen; Attribution via UTMs.',
    ],
    evidence: [
      'Produkt-Logs, Zahlungsbelege (Stripe), CRM-Exporte (HubSpot).',
    ],
    deliverables: [
      'Q4: >10 Arbs/Tag, Viral Coefficient >1.2, Churn <10%'
    ],
    captions: {
      kpis: 'Live-Kennzahlen (indikativ, gerichtete Tendenzen)',
      trends: 'Trend-Serien (ARPU/LTV steigen; CAC sinkt)'
    },
    benchmarks: {
      title: 'Benchmarks (SoA vs. Unser Ansatz)',
      headers: ['Metrik', 'SoA', 'Unser Ansatz'],
      rows: [
        ['Bruttomarge', '65–75%', '70–80%'],
        ['LTV/CAC', '3–4x', '>5x'],
        ['Uptime', '99.9%', '99.99%'],
      ],
    },
  },
  execFacts: {
    cagr: 'CAGR >60% bis 2030',
    breakEven: 'Break-even: 2028',
    revenue2030: 'Umsatz 2030: €25–40 Mio',
    compliance: '99.99% Uptime, <10ms Latenz',
    model: 'Basketball-Arbitrage, AI-gestützt',
  },
  labels: {
    back: 'Zurück',
    next: 'Weiter',
    seeAlso: 'Siehe auch',
    euShare: 'EU-Anteil am Weltmarkt',
    // Ergänzungen
    operating: 'Operativ',
    investing: 'Investition',
    financing: 'Finanzierung',
    innovationTech: 'Innovation & Technik',
    euFocusPrivacy: 'EU‑Fokus & Datenschutz',
    exposure: 'Exposure',
    coverage: 'Coverage',
  },
  links: {
    tech: 'Kapitel 6 – Technologie',
    responsibleAI: 'Compliance & Responsible AI',
  },
  emptyNotice: 'Noch keine Daten verfügbar',
  headings: {
    valueProp: 'Value Proposition',
    pricing: 'Pricing',
    revenueStreams: 'Umsatzströme',
    unitEconomics: 'Unit Economics',
    salesChannels: 'Vertriebskanäle',
    partnerships: 'Partnerschaften',
    breakEven: 'Break-even',
    revenueVsCost: 'Umsatz vs. Kosten',
    cashFlow: 'Cashflow',
    kpis: 'KPIs',
    tractionKpis: 'Traction & KPIs',
    esop: 'ESOP',
    stack: 'Stack',
    overview: 'Überblick',
    team: 'Team',
    workPackages: 'Arbeitspakete',
    timeline: 'Zeitplan',
    roadmap: 'Roadmap',
    trl: 'TRL',
    safety: 'Sicherheit',
    ipMoat: 'IP & Moat',
    innovation: 'Innovation',
    awsCompliance: 'aws Compliance',
    teamOrg: 'Team & Organisation',
    teamOrgCoreEngineering: 'Core Engineering',
    teamOrgPlatformCloud: 'Platform & Cloud',
    teamOrgProduct: 'Produkt & Design',
    teamOrgGtmPartnerships: 'GTM & Partnerschaften',
    roles: 'Rollen',
    profitBridge: 'Profit Bridge',
    founders: 'Gründer',
    roleSkillMatrix: 'Rollen-/Skill-Matrix',
    teamPlan: 'Teamplan',
    marketVolume: 'Marktvolumen & Trends',
    segments: 'Segmente',
    phases: 'Phasen',
    funnel: 'Funnel',
    channelMix: 'Channel Mix',
    tactics: 'Taktiken',
    // Ergänzungen für fehlende Übersetzungen
    legal: 'Rechtliches',
    risks: 'Risiken',
    financing: 'Finanzierung',
    fundraising: 'Fundraising',
    useOfFunds: 'Mittelverwendung',
    fundingStrategy: 'Finanzierungsstrategie',
    projections: 'Projektionen',
    runway: 'Runway',
    plOverview: 'GuV-Übersicht',
    competition: 'Wettbewerb',
    traction: 'Traction',
    businessModelKPIs: 'Business Model KPIs',
    successFactors: 'Erfolgsfaktoren',
    capexOpex: 'CAPEX / OPEX',
    revenueComposition: 'Umsatzkomposition',
    capTableCurrent: 'Cap Table – aktuell',
    capTablePostRound: 'Cap Table – nach Runde',
    mitigation: 'Mitigation',
    riskMatrix: 'Risk Matrix',
    aws: 'AWS',
    privacy: 'Privacy',
    safetyStandards: 'Safety Standards',
    aiAct: 'AI Act',
    securityProgram: 'Security Program',
    evaluations: 'Evaluations',
    redTeam: 'Red Team',
    provenance: 'Provenance',
    // Fehlende Übersetzungen (verwendet in BusinessPlanSections)
    practices: 'Best Practices',
    slas: 'SLAs',
    supportingDocs: 'Begleitdokumente',
    references: 'Referenzen',
    // Ergänzung für fehlende Überschrift
    technical: 'Technik',
    // Ergänzungen für SWOT-Überschriften
    strengths: 'Stärken',
    weaknesses: 'Schwächen',
    opportunities: 'Chancen',
    threats: 'Risiken',
  },
  series: {
    revenue: 'Umsatz',
    costs: 'Kosten',
    operating: 'Operativ',
    investing: 'Investition',
    financing: 'Finanzierung',
  },
  tables: {
    headers: {
      deliverables: 'Deliverables',
      teamSize: 'Teamgröße',
      focus: 'Fokus',
      roles: 'Rollen',
      year: 'Jahr',
      role: 'Rolle',
      ai: 'AI',
      controls: 'Controls',
      cloud: 'Cloud',
      product: 'Produkt',
      safety: 'Safety',
      sdk: 'SDK',
      gtm: 'GTM',
      segment: 'Segment',
      share: 'Anteil',
      stage: 'Stufe',
      metric: 'Metrik',
      target: 'Ziel',
      notes: 'Notizen',
      channel: 'Kanal',
      // Ergänzungen für fehlende Tabellen-Header
      category: 'Kategorie',
      amount: 'Betrag',
      name: 'Name',
      workPackage: 'WP',
      timeline: 'Zeitplan',
      quarter: 'Quartal',
      revenue: 'Umsatz',
      cogs: 'COGS',
      grossProfit: 'Bruttogewinn',
      opex: 'OPEX',
      ebitda: 'EBITDA',
      strengths: 'Stärken',
      weaknesses: 'Schwächen',
    },
    // Ergänzungen für fehlende Tabellen-Untertitel
    captions: {
      useOfFundsY1: 'Mittelverwendung Jahr 1',
    },
  },
  figures: {
    revenueVsCostDescription: 'Modellhafte Gegenüberstellung von Umsatz und Kosten in der Planungsperiode.',
    breakEvenDescription: 'Break-even Verlauf über die Planjahre – kumulierte Deckungsbeiträge vs. Fixkosten.',
    cashFlowDescription: 'Vereinfachter Cashflow mit Fokus auf operativen Mittelzufluss/-abfluss (indikativ).',
    // Ergänzungen für fehlende Figure-Beschreibungen
    revenueDescription: 'Erläuterung zur Umsatzentwicklung in der Planungsperiode (indikativ).',
    ebitdaDescription: 'EBITDA-Entwicklung über die Jahre inkl. wesentlicher Treiber (indikativ).',
    revenueCompositionDescription: 'Zusammensetzung der Umsätze nach Produkten/Segmenten (Stacked).',
    profitBridgeDescription: 'Waterfall-Darstellung vom Umsatz bis EBITDA (Profit Bridge).',
    marketVolumeAlt: 'Diagramm: Marktvolumen (global/EU) – Alt-Text',
    revenueBarsAlt: 'Diagramm: Umsatzbalken nach Segmenten – Alt-Text',
    marketVolumeCaption: 'Marktvolumen & EU-Anteil (Quelle: interne Analyse)',
    revenueBarsCaption: 'Umsatz nach Produkten/Segmenten (indikativ)',
    scenariosDescription: 'Szenarioanalyse (Base/Bull/Bear) mit Auswirkungen auf Umsatz und Profitabilität.',
    runwayDescription: 'Runway-Visualisierung basierend auf Cash-Bestand und monatlichem Burn.',
    capexOpexDescription: 'Aufteilung von CAPEX und OPEX über die Planungsperiode.',
    totalsDescription: 'Summendarstellung zentraler Finanzkennzahlen über den Zeitraum.',
  },
  kpis: {
    breakEven: 'Break-even',
    cagr: 'CAGR',
    revenue2030: 'Umsatz 2030',
    market2030: 'Markt 2030',
  },
  kpisValues: {
    breakEvenYear: '2028',
    cagr: '45–60%',
    revenue2030: '€25–40 Mio',
    market2030: '€40+ Mrd',
  },
  kpisSub: {
    breakEven: 'Deckungsbeitrag = Fixkosten',
    cagr: 'jährliches Wachstum',
    revenue2030: 'Zielbandbreite',
    market2030: 'globales Marktvolumen',
  },
  impactKpi: {
    co2PerTask: 'CO₂ pro Aufgabe',
    incidents: 'Zwischenfälle',
    productivity: 'Produktivität',
    uptime: 'Uptime',
  },
  impactKpiDesc: {
    co2PerTask: 'CO₂-Emissionen pro erledigter Aufgabe',
    incidents: 'Sicherheitsrelevante Zwischenfälle',
    productivity: 'Produktivitätssteigerung pro Mitarbeiter',
    uptime: 'Verfügbarkeitszeit des Systems',
  },
  impactHeadings: {
    economic: 'Ökonomischer Impact',
    environmental: 'Ökologischer Impact',
    policy: 'Policy & Regulierung',
    societal: 'Gesellschaftlicher Impact',
    sustainability: 'Nachhaltigkeit',
  },
  notes: {
    esop: 'ESOP (Mitarbeiterbeteiligung) zur Incentivierung und Bindung des Kernteams; marktübliche Poolgröße 10–15%.',
    roleSkillLegend: 'Legende: ● stark, ○ gut, - Grundlagen',
  },
  market: {
    traction: market.traction,
    // Bestehende volume-Keys bleiben zur Abwärtskompatibilität erhalten, werden jedoch
    // durch humanoid/service-spezifische Blöcke ergänzt. Zahlen konservativ gemäß Quellen.
    volume: {
      global: 'Globales Marktvolumen (Service gesamt): 2024: ~47,10 Mrd. USD → 2029: ~98,65 Mrd. USD (MarketsandMarkets)',
      // EU-Anteil konkretisiert (indikativ)
      eu: 'EU‑Anteil: 30% (indikativ)',
      cagr: 'CAGR (Service 2024–2029): 15,9%',
      drivers: 'Haupttreiber: Fachkräftemangel, Automatisierung, demografischer Wandel',
      humanoid: {
        global: 'Humanoide: 2025: ~$2,92 Mrd. → 2030: ~$15,26 Mrd. (MarketsandMarkets)',
        cagr: '39,2% (2025–2030)',
        notes: 'Spannweite je Studie; konservativ: 12–18 Mrd., optimistisch: 30–40 Mrd. bis 2035 (u. a. Goldman Sachs)'
      },
      service: {
        global: 'Service‑Robotik gesamt: 2024: ~47,10 Mrd. USD → 2029: ~98,65 Mrd. USD (MarketsandMarkets)',
        cagr: '15,9% (2024–2029)'
      },
      sources: [
        'MarketsandMarkets – Service Robotics Market (2024–2029): https://www.marketsandmarkets.com/Market-Reports/service-robotics-market-681.html',
        'MarketsandMarkets – Humanoid Robot Market (2025–2030): https://www.marketsandmarkets.com/Market-Reports/humanoid-robot-market-99567653.html',
        'Goldman Sachs (Humanoide ~2035): https://www.goldmansachs.com/insights/articles/the-global-market-for-robots-could-reach-38-billion-by-2035',
        'Statista – Service Robotics Europe (2019–2029): https://www.statista.com/outlook/tmo/robotics/service-robotics/europe'
      ]
    },
    // Duale Marktgrößen – optional; Kapitel rendert dual, wenn vorhanden
    size: {
      humanoid: {
        tam: 'TAM (Humanoide): ~15 Mrd. USD (2030, M&M)',
        sam: 'SAM (Humanoide): Industrienahe Use-Cases (Logistik/Industrie/Facility) in DACH/EU',
        som: 'SOM (Humanoide): Pilotregionen (DACH/EU) mit Enterprise-Rollouts und Partner-Ökosystem'
      },
      service: {
        tam: 'TAM (Service gesamt): ~99 Mrd. USD (2029, M&M)',
        sam: 'SAM (Service): Relevante vertikale Segmente mit Zahlungsbereitschaft (Healthcare, Hospitality, Education, Logistik)',
        som: 'SOM (Service): Zielsegmente in DACH/EU via RaaS & App‑Store, skalierbar über Partner'
      }
    },
  },
  content: {
    businessModel,
    market,
    impact,
    finance,
    gtm,
    products,
    operations,
    mlops,
    responsibleAI,
    teamOrg,
    technology,
    risks,
    exit,
    capTable,
    costPlan,
    financePlanDetailed,
    marketCompetitive,
    dissemination,
    company,
    cta,
  },
  // SWOT-Daten für Kapitel 3.7 – standardisierte Aufzählungspunkte
  swot: {
    strengths: [
      'KI‑Agenten × Humanoide – orchestrierbar statt starr; hohe Adaptivität in Echtzeit',
      'Plattform + App‑Store – wiederkehrende Umsätze, Netzwerkeffekte, geringe Grenzkosten',
      'Execution‑starkes Team (AI, Cloud, Robotics) – kurze Ship‑Zyklen, hohe Lernrate',
      'EU‑Footprint – Förderzugang, Datenschutz‑Trust, Talentpool',
    ],
    weaknesses: [
      'Drittanbieter‑Hardware – Liefer-/Qualitätsrisiko, begrenzte Verhandlungsmacht',
      'Kapitalintensive F&E – längere Amortisation (Hardware + ML)',
      'Compliance/Zertifizierung – Time‑to‑Market‑Risiko, Audit‑Aufwand',
    ],
    opportunities: [
      'EU‑Regulierung & Trust – Vorteil durch Compliance‑by‑Design (AI Act/CE)',
      'Demografischer Wandel – steigende Nachfrage nach Assistenz & Automatisierung',
      'Ökosystem‑Aufbau via App‑Store – Third‑Party‑Skills, Revenue‑Share, Lock‑in‑Moat',
      'Partnerschaften mit OEMs/Integratoren – beschleunigte RaaS‑Rollouts',
    ],
    threats: [
      'Rascher SoA‑Fortschritt großer Player (OpenAI/Figure, NVIDIA‑Stacks)',
      'Supply‑Chain/Hardware‑Engpässe – Preisvolatilität & Lead‑Times',
      'Vendor‑Lock‑ins durch proprietäre Plattformen',
      'Privacy/Haftungsrisiken bei Fehlfunktionen (Produkthaftung)',
    ],
  },
} as const

export default bp
