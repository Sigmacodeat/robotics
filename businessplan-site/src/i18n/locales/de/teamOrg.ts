const teamOrg = {
  founders: [
    "Ismet Mesic – CIO & CTO",
    "Medina Mesic, MSc – Co‑CEO & CMO",
    "Atifa Mesic – CFO",
  ],
  summary:
    "Geschäftsführung: Medina & Atifa Mesic. Technologie & Innovation verantwortet der CIO/CTO. Marketing & Vertrieb, Finanzen & Banking sind klar zugeordnet. Fokus: sichere, auditierbare humanoide Robotik mit App‑Store‑Ökosystem.",
  years: [
    { year: "Y1", size: 6, focus: ["AI/Robotik", "Controls", "Cloud"], roles: ["AI Eng", "Controls Eng", "Full‑stack", "PM"] },
    { year: "Y2", size: 10, focus: ["Safety", "SDK", "GTM"], roles: ["Safety Eng", "SDK Eng", "Solutions"] },
  ],
  ftePlan: [
    { year: "Y1", teamSize: 6, focus: ["AI/Robotik", "Controls", "Cloud"], roles: ["AI Eng", "Controls Eng", "Full‑stack", "PM"] },
    { year: "Y2", teamSize: 10, focus: ["Safety", "SDK", "GTM"], roles: ["Safety Eng", "SDK Eng", "Solutions", "Support"] },
  ],
} as const;

export default teamOrg;

