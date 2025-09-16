const teamOrg = {
  founders: [
    "Ismet Mesic – CIO & CTO",
    "Medina Mesic, MSc – Co‑CEO & CMO",
    "Atifa Mesic – CFO",
  ],
  summary: "Management: Medina & Atifa Mesic. Technology & innovation led by the CIO/CTO. Marketing & sales, finance & banking are clearly assigned. Focus: safe, auditable humanoid robotics with an app‑store ecosystem.",
  years: [
    { year: "Y1", size: 6, focus: ["AI/robotics", "controls", "cloud"], roles: ["AI eng", "controls eng", "full‑stack", "PM"] },
    { year: "Y2", size: 10, focus: ["safety", "SDK", "GTM"], roles: ["safety eng", "SDK eng", "solutions"] },
  ],
  ftePlan: [
    { year: "Y1", teamSize: 6, roles: ["AI eng", "controls eng", "full‑stack", "PM"] },
    { year: "Y2", teamSize: 10, roles: ["safety eng", "SDK eng", "solutions", "support"] },
  ],
} as const;

export default teamOrg;

