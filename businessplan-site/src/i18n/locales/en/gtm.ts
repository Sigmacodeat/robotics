const gtm = {
  // Standardized bullet points for Market page (Chapter 3.8 – Phase 1)
  phase1: [
    'Pilot projects with nursing homes, hotels, research institutes',
    'Cooperations with Austrian universities (TU Wien, FH Hagenberg, JKU Linz)',
    'Scale (Phase 2 – 2028–2029): build RaaS infrastructure for B2B customers, launch robot app store (beta), target 20–30 customers in DACH',
    'Expansion (Phase 3 – 2030): enter EU market (healthcare + office), white‑label solutions for international partners, app store as standard ecosystem for humanoid robots',
  ],
  phases: [
    { name: "Phase 1 – pilots", items: ["PoC in logistics/manufacturing", "Define SLA/support model", "Partner onboarding (integrators, OEMs)"] },
    { name: "Phase 2 – app store beta", items: ["Developer SDK", "Third‑party skills", "Billing/licensing"] },
    { name: "Phase 3 – enterprise rollout", items: ["Multi‑site deployments", "Analytics/KPIs", "Enablement & training"] },
  ],
  tactics: [
    "Design partner program (3–5 lighthouse customers)",
    "Alliances with robotics OEMs & integrators",
    "Developer program for skill providers (rev share)",
    "Certifications/CE/AI Act as market enabler",
    "Showcases & demos (trade fairs, labs, video catalog)",
    "Content/demand gen: tech blogs, benchmark videos, webinar series",
    "Field marketing: on‑site factory demos with OEM/integrator",
  ],
  kpis: [
    ">99.99% uptime (rolling 30d)",
    "<10ms edge response",
    ">60% skill adoption per customer",
    ">3 active skills per robot after 90 days",
    "Net expansion >120%",
    "Sales cycle <90 days (pilot → rollout)",
    "PoC conversion >50%",
  ],
  funnel: [
    { stage: "Awareness", metric: "Reach/Impressions", target: ">500k/qtr", notes: "Paid + earned media, social video demos" },
    { stage: "Interest", metric: "Website visits / demo views", target: ">60k/qtr", notes: "SEO, tech blog, benchmark videos" },
    { stage: "Consideration", metric: "Qualified leads (MQL)", target: "3.5% of visits", notes: "Lead magnets, whitepapers, webinars" },
    { stage: "Evaluation", metric: "SQL/design partners", target: "40% of MQL", notes: "Use‑case scoping, ROI simulator" },
    { stage: "Pilot", metric: "PoC start", target: ">50% of SQL", notes: "On‑site demos, integrator support, SLAs" },
    { stage: "Rollout", metric: "Multi‑site deployments", target: ">60% of pilots", notes: "Enablement, training, analytics" },
    { stage: "Expansion", metric: "Net expansion", target: ">120%", notes: "App‑store upsell, new skills/use cases" },
  ],
  channelMix: [
    { channel: "Alliances (OEM/integrator)", share: 35, metrics: ["Partner pipeline", "Co‑seller deals"], notes: "Leverage existing customer bases" },
    { channel: "Design partners/direct", share: 25, metrics: ["SQLs", "PoC starts"], notes: "Rapid validation, references" },
    { channel: "Developer/marketplace", share: 15, metrics: ["SDK signups", "Third‑party skills"], notes: "Ecosystem growth, rev share" },
    { channel: "Events & demos", share: 10, metrics: ["Leads", "Demo requests"], notes: "Live experience, trust" },
    { channel: "Content/SEO/community", share: 10, metrics: ["Visits", "MQL rate"], notes: "Long‑term demand gen" },
    { channel: "Paid (targeted ABM)", share: 5, metrics: ["CTR", "CPL"], notes: "Tightly focused on ICP accounts" },
  ],
} as const;

export default gtm;
