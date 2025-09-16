const workPackagesDetailed = {
  title: "Work Packages – Detailed (AWS/FFG‑compliant)",
  note: "Structure: Objectives/Scope, Deliverables, Effort (FTE), Dependencies, Risks, KPIs, Milestones, Budget",
  headersEffort: ["WP", "Role", "FTE"],
  items: [
    {
      id: "WP1",
      name: "Project preparation & requirements analysis",
      timeframe: "Month 0–2",
      objectives: [
        "Goals and scope aligned with stakeholders",
        "Risks and assumptions documented",
      ],
      scope: [
        "Workshops, interview guides, documentation",
        "Project plan with milestones and sign‑offs",
      ],
      deliverables: ["Requirements document", "Project plan", "Risk analysis"],
      dependencies: [],
      effort: [
        { role: "Project lead", fte: 0.6 },
        { role: "Product manager", fte: 0.4 },
      ],
      personMonths: [
        { role: "Project lead", pm: 1.8 },
        { role: "Product manager", pm: 1.2 },
      ],
      risks: ["Unclear requirements", "Stakeholder availability"],
      mitigations: ["Early reviews", "Asynchronous alignment"],
      kpis: [
        "Scope coverage ≥ 90% (review checklist)",
        "Review iterations ≤ 2 until sign‑off",
      ],
      milestones: [
        { label: "Kickoff", month: 0, acceptance: "Stakeholder sign‑off" },
        { label: "Requirements v1", month: 1, acceptance: "Review completed (all blockers resolved)" },
      ],
      budget: { personnel: 15, material: 2, subcontracting: 0, other: 1 },
    },
    {
      id: "WP2",
      name: "Technical concept & architecture",
      timeframe: "Month 3–5",
      objectives: [
        "Target architecture and interfaces specified",
        "Make/Buy/Partner decisions",
      ],
      scope: ["System architecture", "Interfaces/SDK", "Quality attributes"],
      deliverables: ["Technical concept", "System architecture", "Interface spec"],
      dependencies: ["WP1"],
      effort: [
        { role: "CIO/CTO", fte: 0.6 },
        { role: "Platform/Full‑stack", fte: 0.8 },
        { role: "Safety engineer", fte: 0.6 },
      ],
      personMonths: [
        { role: "CIO/CTO", pm: 1.8 },
        { role: "Platform/Full‑stack", pm: 2.4 },
        { role: "Safety engineer", pm: 1.8 },
      ],
      risks: ["Delayed tech decisions"],
      mitigations: ["Spike prototypes", "Decision matrix"],
      kpis: [
        "Architecture decisions ≤ 2 iterations (decision matrix)",
        "Interface spec ≥ 90% complete",
      ],
      milestones: [
        { label: "Architecture review", month: 3, acceptance: "Decision document approved (CTO + Safety)" },
      ],
      budget: { personnel: 25, material: 5, subcontracting: 0, other: 2 },
    },
    {
      id: "WP3",
      name: "Development & implementation",
      timeframe: "Month 6–13",
      objectives: [
        "MVP functionality delivered",
        "CI/CD, observability, security gates active",
      ],
      scope: ["Core features", "Testing", "Documentation"],
      deliverables: ["Source code", "Test reports", "Documentation"],
      dependencies: ["WP2"],
      effort: [
        { role: "AI engineer", fte: 2.5 },
        { role: "Full‑stack engineer", fte: 2.0 },
        { role: "Controls engineer", fte: 1.0 },
        { role: "QA engineer", fte: 0.5 },
      ],
      personMonths: [
        { role: "AI engineer", pm: 20.0 },
        { role: "Full‑stack engineer", pm: 16.0 },
        { role: "Controls engineer", pm: 8.0 },
        { role: "QA engineer", pm: 4.0 },
      ],
      risks: ["Feature creep", "3rd‑party integration"],
      mitigations: ["Scope cut criteria", "Integration test stubs"],
      kpis: [
        "Velocity ≥ 20 SP/sprint (median across 4 sprints)",
        "Unit coverage ≥ 60% (core modules)",
        "E2E smoke suite < 10 min p95",
      ],
      milestones: [
        { label: "MVP feature set", month: 8, acceptance: "Smoke tests green, public demo ready" },
      ],
      budget: { personnel: 80, material: 10, subcontracting: 15, other: 5 },
    },
    {
      id: "WP4",
      name: "Testing & quality assurance",
      timeframe: "Month 11–14",
      objectives: ["Quality evidenced", "Release criteria met"],
      scope: ["System tests", "Safety checks", "Release docs"],
      deliverables: ["Test reports", "Bug reports", "Release documentation"],
      dependencies: ["WP3"],
      effort: [
        { role: "QA engineer", fte: 1.5 },
        { role: "SRE/MLOps", fte: 0.5 },
      ],
      personMonths: [
        { role: "QA engineer", pm: 6.0 },
        { role: "SRE/MLOps", pm: 2.0 },
      ],
      risks: ["Unstable test environment"],
      mitigations: ["Canary/chaos tests", "Isolated pipelines"],
      kpis: [
        "Defect leakage < 3% (staging→prod)",
        "MTTR < 1 day (p95)",
        "Reliability score ≥ 0.98",
      ],
      milestones: [
        { label: "Coverage 70%", month: 12, acceptance: "CI coverage ≥ 70% (core flows)" },
      ],
      budget: { personnel: 30, material: 5, subcontracting: 5, other: 2 },
    },
    {
      id: "WP5",
      name: "Rollout & training",
      timeframe: "Month 15–16",
      objectives: ["Go‑live", "User adoption/training"],
      scope: ["Training", "User manual", "Final report"],
      deliverables: ["Training materials", "User manual", "Final report"],
      dependencies: ["WP4"],
      effort: [
        { role: "Project lead", fte: 0.5 },
        { role: "Solutions engineer", fte: 1.0 },
      ],
      personMonths: [
        { role: "Project lead", pm: 1.0 },
        { role: "Solutions engineer", pm: 2.0 },
      ],
      risks: ["Low adoption"],
      mitigations: ["Enablement plan", "Support SLAs"],
      kpis: [
        "NPS ≥ 30",
        ">= 2 reference customers with written statement",
        "Onboarding time ≤ 1 day/customer",
      ],
      milestones: [
        { label: "Go‑live", month: 15, acceptance: "Stakeholder acceptance (SLA agreed)" },
      ],
      budget: { personnel: 15, material: 3, subcontracting: 0, other: 2 },
    },
  ],
} as const;

export default workPackagesDetailed;
