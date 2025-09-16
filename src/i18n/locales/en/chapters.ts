const chapters = {
  cover: { title: 'Cover' },
  executive: { subtitle: 'Overview & Key Facts' },
  market: { subtitle: 'Market & Competition' },
  technology: { subtitle: 'Technology & Architecture' },
  finance: { subtitle: 'Finance & KPIs' },
  risks: { subtitle: 'Risks & Mitigation' },
  impact: { subtitle: 'Impact & Sustainability' },
  compliance: { subtitle: 'Compliance & Responsible AI' },
  team: { subtitle: 'Team & Organization' },
  products: { subtitle: 'Products & Roadmap' },
  businessModel: {
    subtitle: 'Business Model & Monetization',
    gtmTitle: 'Go‑to‑market & Pilots',
    grantFitTitle: 'Grant Fit (AWS / FFG)',
    moatTitle: 'IP & Technical Moat',
    overviewTitle: 'Overview',
  },
  executiveSummary: {
    title: 'Executive Summary',
    paragraphs: [
      'Value proposition: Humanoid AI robotics as RaaS with a robot app store and policy hub – certified skills are composed into end‑to‑end workflows, safely rolled out (CE/AI Act) and monitored fleet‑wide.',
      'Traction/KPIs: pilot fleet (logistics/manufacturing) in preparation, app store beta; target KPIs >99.99% uptime, <10ms edge response, >60% skill adoption per customer within 6 months.',
      'Funding ask: seed + grants for team, safety evidence and pilot fleet; use of funds: R&D/safety, app store/SDK, GTM partnerships, compliance/CE documentation.',
    ],
    sections: {
      problem: {
        title: 'Problem',
        content:
          'Acute labor shortages, hazardous/monotonous tasks and fragmented IT/OT stacks constrain productivity. Traditional automation is inflexible, costly to change, and does not scale across sites and use cases.',
      },
      solution: {
        title: 'Solution',
        platform: {
          title: 'Platform',
          content:
            'Humanoid AI robotics as RaaS with a robot app store: certified skills (grasping, navigation, inspection, handling) are composed into end‑to‑end workflows and deployed fleet‑wide.',
        },
        technology: {
          title: 'Technology',
          content:
            'Perception (multi‑sensor/VLM/3D), decision (planner/policies/safety), execution (force/impedance). RL/IL agents learn from demos & simulation; policy hub, tele‑assist, fleet learning, CE/AI Act compliance.',
        },
      },
      market: {
        title: 'Market',
        content:
          'Automation/reshoring megatrend. TAM >$40B by 2030 (Service Robotics & Humanoids). Strong demand in logistics, manufacturing, facility & service.',
      },
      usps: {
        title: 'USPs',
        items: [
          'Robot app store: fast time‑to‑value, modular skills, vendor‑neutral',
          'Policy hub & safety guardrails: deterministic, auditable execution',
          'Fleet learning: continuous performance gains (RL/IL)',
          '99.99% uptime, <10ms edge response, zero‑downtime updates',
          'Enterprise integration (ERP/WMS/MES/IoT, digital twins)',
        ],
      },
      businessModel: {
        title: 'Business Model',
        content:
          'RaaS (subscription + usage) + skill licenses + marketplace fee. Enterprise rollouts with service and support plans.',
      },
    },
  },
} as const;

export default chapters;
