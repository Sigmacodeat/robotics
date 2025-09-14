const ffg = {
  title: 'FFG Application – Structure & Contents',
  note: 'This section consolidates FFG-relevant information and references detailed work packages, milestones and budget tables.',
  sections: [
    {
      title: 'Program & Context',
      items: [
        'Funding agency: FFG (Austrian Research Promotion Agency)',
        'Program: Base programs – R&D (example, adjust per call)',
        'Submission type: Cooperative R&D / Single project (adjust)',
      ],
    },
    {
      title: 'Objectives',
      items: [
        'Develop a resilient, AI-powered arbitrage platform specializing in basketball (NBA, Euroleague, NCAA)',
        '>95% arb success rate and >4% ROI simulation, <10ms latency, 99.99% uptime',
        'Scalable cloud architecture (AWS/GCP), self-healing & chaos testing',
      ],
    },
    {
      title: 'Innovation & R&D Content',
      items: [
        'Smart AI layer: value-bet detection, RL agents (stake optimization), predictive arb signals',
        'Cluster arbs (combined markets, >5% profit), in-game arbs (momentum, injury shifts)',
        'MLOps: data normalization, feature stores, evaluations & red teaming',
      ],
    },
    {
      title: 'Work Plan & Milestones (reference)',
      items: [
        'See Work Packages (Budget) and Work Packages – Detailed (FFG-compliant)',
        'See Milestone plan (quarters, acceptance criteria, dependencies)',
      ],
    },
    {
      title: 'Budget & Use of Funds (reference)',
      items: [
        'See Finance chapter CAPEX/OPEX and detailed tables (personnel, material, subcontracting, other)',
        'Cost alerts, FinOps transparency, third-party evidence via Stripe/CRM',
      ],
    },
    {
      title: 'Impact & Exploitation',
      items: [
        'Commercialization via SaaS, app store, affiliate/MLM; viral coefficient >1.2',
        'EU added value: privacy trust, talent pool, funding access',
        'Tech transfer: open interfaces, SDK, partner ecosystem',
      ],
    },
    {
      title: 'Risks & Mitigation',
      items: [
        'Hardware/data-source risks → redundancy, orchestration, P2P execution',
        'False positives → LLM backcheck, evaluations, threshold control',
        'Scaling risks → multi‑cloud failover, observability, rate limiting',
      ],
    },
    {
      title: 'Compliance & Security',
      items: [
        'Privacy: GDPR, data minimization, edge inference',
        'Security: zero trust, secrets management, pen tests, threat modeling',
        'AI Act: risk management, logging/audits, human oversight, model cards',
      ],
    },
  ],
} as const;

export default ffg;
