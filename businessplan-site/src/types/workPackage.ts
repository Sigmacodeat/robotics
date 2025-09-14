export interface WorkPackage {
  id: string;
  title: string;
  description: string;
  startMonth: number;
  duration: number; // in months
  responsible: string;
  deliverables: string[];
  dependencies?: string[];
  milestones?: { name: string; month: number; acceptanceCriteria?: string }[];
  effortFTE?: number; // Gesamt-FTE bzw. Personenmonate
  risks?: string[];
  kpis?: string[];
  budget: {
    personnel: number;
    material: number;
    subcontracting: number;
    other: number;
  };
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
}

export const workPackages: WorkPackage[] = [
  {
    id: 'WP1',
    title: 'Projektvorbereitung & Anforderungsanalyse',
    description: 'Detaillierte Analyse der Anforderungen und Erstellung des Projektplans',
    startMonth: 0,
    duration: 2,
    responsible: 'Projektleitung',
    deliverables: ['Anforderungsdokument', 'Projektplan', 'Risikoanalyse'],
    milestones: [
      { name: 'Kickoff abgeschlossen', month: 0, acceptanceCriteria: 'Stakeholder bestätigt Scope & Ziele' },
      { name: 'Anforderungsdokument v1', month: 1, acceptanceCriteria: 'Review sign-off' },
    ],
    effortFTE: 1.0,
    risks: ['Unklare Anforderungen'],
    kpis: ['Scope-Abdeckung > 90%'],
    budget: {
      personnel: 15000,
      material: 2000,
      subcontracting: 0,
      other: 1000
    },
    status: 'planned'
  },
  {
    id: 'WP2',
    title: 'Technische Konzeption & Architektur',
    description: 'Entwicklung der Systemarchitektur und technischen Spezifikationen',
    startMonth: 2,
    duration: 3,
    responsible: 'Technischer Leiter',
    deliverables: ['Technisches Konzept', 'Systemarchitektur', 'Schnittstellenspezifikation'],
    dependencies: ['WP1'],
    milestones: [
      { name: 'Architektur-Review', month: 3, acceptanceCriteria: 'Entscheidungspapier freigegeben' },
    ],
    effortFTE: 2.0,
    risks: ['Technologieauswahl verzögert'],
    kpis: ['Architekturentscheidungen < 2 Iterationen'],
    budget: {
      personnel: 25000,
      material: 5000,
      subcontracting: 0,
      other: 2000
    },
    status: 'planned'
  },
  {
    id: 'WP3',
    title: 'Entwicklung & Implementierung',
    description: 'Umsetzung der Kernfunktionalitäten',
    startMonth: 5,
    duration: 8,
    responsible: 'Entwicklungsteam',
    deliverables: ['Quellcode', 'Testberichte', 'Dokumentation'],
    dependencies: ['WP2'],
    milestones: [
      { name: 'MVP Feature-Set', month: 8, acceptanceCriteria: 'Smoke-Tests grün, Demo möglich' },
    ],
    effortFTE: 6.0,
    risks: ['Feature-Creep', 'Integration Drittsysteme'],
    kpis: ['Velocity >= 20 Story Points/Sprint'],
    budget: {
      personnel: 80000,
      material: 10000,
      subcontracting: 15000,
      other: 5000
    },
    status: 'planned'
  },
  {
    id: 'WP4',
    title: 'Testing & Qualitätssicherung',
    description: 'Durchführung von Tests und Qualitätssicherungsmaßnahmen',
    startMonth: 10,
    duration: 4,
    responsible: 'QA-Team',
    deliverables: ['Testberichte', 'Bug-Reports', 'Freigabedokumentation'],
    dependencies: ['WP3'],
    milestones: [
      { name: 'Testabdeckung 70%', month: 12, acceptanceCriteria: 'CI zeigt Coverage >= 70%' },
    ],
    effortFTE: 2.0,
    risks: ['Instabile Testumgebung'],
    kpis: ['Defect Leakage < 3%'],
    budget: {
      personnel: 30000,
      material: 5000,
      subcontracting: 5000,
      other: 2000
    },
    status: 'planned'
  },
  {
    id: 'WP5',
    title: 'Einführung & Schulung',
    description: 'Einführung des Systems und Schulung der Anwender',
    startMonth: 14,
    duration: 2,
    responsible: 'Projektleitung',
    deliverables: ['Schulungsunterlagen', 'Benutzerhandbuch', 'Abschlussbericht'],
    dependencies: ['WP4'],
    milestones: [
      { name: 'Go-Live', month: 15, acceptanceCriteria: 'Abnahme durch Stakeholder' },
    ],
    effortFTE: 1.5,
    risks: ['User Adoption geringer als geplant'],
    kpis: ['NPS > 30'],
    budget: {
      personnel: 15000,
      material: 3000,
      subcontracting: 0,
      other: 2000
    },
    status: 'planned'
  }
];
