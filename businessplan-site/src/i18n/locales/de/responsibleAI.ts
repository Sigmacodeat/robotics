const responsibleAI = {
  evals: [
    "Skill-/Policy-Evals, Benchmarks, Regression-Tests",
    "Evaluationsdaten: Open-X Embodiment (Open-Source, Forschung/kommerziell je Lizenz), Ego4D (Forschung), EPIC-KITCHENS (Forschung)",
    "Evaluation-Metriken: Genauigkeit, Robustheit, Fairness, Transparenz",
    "Evaluation-Protokolle: Test- und Trainingsdaten, Hyperparameter, Modelle",
  ],
  redTeam: [
    "Red-Team-Szenarien (Edge-Cases, Safety, HRI)",
  ],
  provenance: [
    "Provenienz: Datasets/Model Cards/Datasheets, Versionsstände",
    "Datasets: Open‑X Embodiment (Open‑Source, Forschung/kommerziell je Lizenz), Ego4D (Forschung), EPIC‑KITCHENS (Forschung)",
    "Policies/Repos: RT‑X/RT‑2 (Quellenangaben, Commit‑Hashes, Versionierung)",
    "Sim‑Assets: Isaac/MuJoCo (Lizenztypen vermerkt) – Szenen/Roboter/Objekte dokumentiert",
    "Lizenzhinweise: Nutzungskontext (Forschung/kommerziell), Einschränkungen, Contact‑Points für Compliance",
  ],
} as const;

export default responsibleAI;
