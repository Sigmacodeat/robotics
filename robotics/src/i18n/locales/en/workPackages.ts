const workPackages = {
  title: "Work Packages & Budget (indicative)",
  headers: ["WP", "Name", "Timeline", "Deliverables", "Budget (k€)"],
  rows: [
    { id: "WP1", name: "Project preparation & requirements", timeline: "M0–M2", deliverables: ["Requirements", "Project plan", "Risk analysis"], budget: 18 },
    { id: "WP2", name: "Technical concept & architecture", timeline: "M3–M5", deliverables: ["Tech concept", "Architecture", "Interfaces"], budget: 32 },
    { id: "WP3", name: "Development & implementation", timeline: "M6–M13", deliverables: ["Core features", "Tests", "Docs"], budget: 110 },
    { id: "WP4", name: "Testing & QA", timeline: "M11–M14", deliverables: ["Test reports", "Bug reports", "Release"], budget: 42 },
    { id: "WP5", name: "Rollout & training", timeline: "M15–M16", deliverables: ["Training", "User manual", "Final report"], budget: 20 },
  ],
} as const;

export default workPackages;
