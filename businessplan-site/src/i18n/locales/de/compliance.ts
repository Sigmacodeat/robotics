const compliance = {
  aws: [
    "Vorgaben für sichere Cloud‑Architektur, Verschlüsselung, Monitoring",
  ],
  privacy: [
    "DSGVO‑konforme Datenflüsse, Datenminimierung, Edge‑Inference",
  ],
  safety: [
    "Zonen/Kontaktkraft‑Limits, HRI‑Risikobeurteilung, Fail‑Safe",
  ],
  safetyStandards: [
    "CE, ISO 10218/TS 15066, ISO 13482",
  ],
  aiAct: [
    "Risikomanagement, Logging/Audits, Human Oversight, Model Cards",
  ],
  securityProgram: [
    "Zero‑Trust, Secrets‑Management, Pen‑Tests, Threat‑Modeling",
  ],
} as const;

export default compliance;
