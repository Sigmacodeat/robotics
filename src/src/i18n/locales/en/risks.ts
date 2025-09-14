const risks = {
  title: "Risks",
  list: [
    "Technology risk (TRL, sim‑to‑real, safety/HRI)",
    "Go‑to‑market (OEM/integrator reliance, certification cycles)",
    "Financing (hardware CAPEX, scaling costs)",
    "Compliance (EU AI Act, CE, cybersecurity/privacy)",
    "Talent (DeepTech, competition for experts)",
  ],
  tech: {
    title: "Technology",
    complexity: {
      title: "Complexity",
      risk: "Whole‑body manipulation, sim‑to‑real and safety increase system complexity and pose integration/stability risks.",
      mitigation: "Phased plan with clear milestones (WP1–WP4), early end‑to‑end tests, canary rollouts, tele‑assist and robust observability (tracing/logs/metrics).",
    },
    aiSafety: {
      title: "AI Safety",
      risk: "Misbehavior of learned policies under edge conditions (out‑of‑distribution, latency, sensor noise) can affect safety/HRI.",
      mitigation: "Zone/contact‑force guardrails, formal constraints, red teaming & evaluations, human‑in‑the‑loop for risky maneuvers, audit trail & provenance.",
    },
    vendors: {
      title: "Vendor dependence",
      risk: "Dependence on hardware/cloud vendors can impact costs, lead times and roadmap.",
      mitigation: "Abstraction layer (ROS2/hardware adapters), multi‑vendor qualification, long‑term SLAs and second‑source strategy.",
    },
  },
  market: {
    title: "Market",
    adoption: {
      title: "Adoption",
      risk: "Enterprise adoption may be delayed (change management, plant certification, internal compliance).",
      mitigation: "Design‑partner program, measurable pilot KPIs, training/enablement, pre‑built templates for common processes.",
    },
    competition: {
      title: "Competition",
      risk: "Strong competition from OEM stacks and horizontal platforms; price pressure on standard skills.",
      mitigation: "Differentiation via app store/SDK, certified third‑party skills, EU compliance & safety as market drivers, focus on high‑impact workflows.",
    },
    pricing: {
      title: "Pricing",
      risk: "Limited willingness to pay for certain workflows or in early automation phases.",
      mitigation: "Tiered + usage model, ROI simulator, pay‑per‑outcome options and lean entry bundles (PoC packages).",
    },
  },
  finance: {
    title: "Finance",
    grants: {
      title: "Grants",
      risk: "Missing or delayed grant approvals strain the cash runway.",
      mitigation: "Hybrid financing (seed + grants), milestone‑based use of funds, alternative programs (EU/co‑funding).",
    },
    cashflow: {
      title: "Cash flow",
      risk: "Upfront financing of hardware/prototypes, long sales cycle and capex can burden liquidity.",
      mitigation: "Hardware leasing/partners, staggered deliveries, prepayments/deposits, strict working‑capital monitoring.",
    },
  },
  regulatory: {
    title: "Regulatory",
    eu: {
      title: "EU/AI Act",
      risk: "Misclassification or incomplete evidence can delay certification and rollouts.",
      mitigation: "Early compliance management, risk/data/model governance, complete logs, model cards/datasheets and CE documentation.",
    },
    cert: {
      title: "Certifications",
      risk: "On‑site acceptance (safety/HRI) varies by location and requires additional tests.",
      mitigation: "Standardized test plans, re‑use of certified modules, close collaboration with safety officers, pilot plants as references.",
    },
  },
  operations: {
    title: "Operations",
    talent: {
      title: "Talent",
      risk: "Scarcity of DeepTech profiles (robotics/controls/ML) limits execution speed.",
      mitigation: "ESOP & employer branding, remote‑friendly teams, university collaborations, targeted senior hires with multiplier effect.",
    },
    keyPeople: {
      title: "Key people",
      risk: "Dependence on key personnel increases failure/knowledge risks.",
      mitigation: "Documentation, pairing/reviews, rotation, contingency plans and redundancy for critical roles.",
    },
  },
  mitigation: {
    title: "Mitigation",
    items: [
      "Milestone plan with evals & risk register (WP1–WP4)",
      "Partnerships (integrators/OEMs), design‑partner program",
      "Hybrid financing (seed + grants), cost control",
      "Provenance/evals, security program, compliance docs",
      "ESOP & branding, cooperation with universities/networks",
    ],
  },
  mitigationDetailed: {
    title: "Mitigation (detailed)",
    tech: [
      "Risk register per work package (WP1–WP4) with clear owners",
      "Canary rollouts, feature flags, gradual activation",
      "Evaluations/red teaming, formal constraints, simulated edge cases",
    ],
    market: [
      "Design partners & references, repeatable pilot playbooks",
      "ROI simulators and clear business cases per workflow",
      "Communicate certification roadmaps (CE/AI Act)",
    ],
    finance: [
      "Leasing/partnerships for CAPEX, prepayments/deposits",
      "Scenario planning and cost control, runway alerts",
      "Multi‑track grants and milestone gatekeeping",
    ],
    legal: [
      "Early involvement of compliance/safety officers",
      "Standardized test/acceptance protocols, audit trails",
      "Contract SLAs and liability provisions with partners",
    ],
  },
  additional: {
    Monitoring: "KPIs/telemetry, A/B evals, red teaming for safety/AI",
    ThirdParties: "Contracts/SLAs, audit trails, pen tests",
  },
  benefits: [
    "Faster certifications via reusable, verified modules",
    "Higher customer loyalty through measurable ROI and predictable rollouts",
    "Product quality through telemetry, end‑to‑end evals and fleet learning",
  ],
} as const;

export default risks;
