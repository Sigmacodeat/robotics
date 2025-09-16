const compliance = {
  aws: [
    "Funding criteria (DeepTech, safety, EU competitiveness)",
    "Use‑case fit (productivity, safe human/robot collaboration)",
  ],
  privacy: [
    "Privacy by design, data minimization, edge inference",
    "Provenance/lineage, model cards/data sheets",
  ],
  safety: [
    "Zone/contact‑force guardrails, collaborative trajectories",
    "CE documentation, E‑stop, fail‑safe mechanisms",
  ],
  safetyStandards: ["CE guidelines", "ISO 10218", "ISO/TS 15066", "EU AI Act (high‑risk)"],
  aiAct: [
    "Risk management, data/model governance, logging/audit",
    "Transparency/explainability, human oversight",
  ],
  securityProgram: [
    "Threat modeling, pen tests, SLAs",
    "IAM/least privilege, secrets mgmt, zero trust",
  ],
} as const;

export default compliance;
