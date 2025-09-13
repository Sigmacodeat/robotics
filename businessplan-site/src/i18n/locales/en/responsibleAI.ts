const responsibleAI = {
  evals: [
    "Benchmark suites for perception/manipulation & safety metrics",
    "Latency/reliability tests with SLOs and canary comparisons",
  ],
  redTeam: [
    "Scenario‑based stress tests (out‑of‑distribution, sensor failures)",
    "HRI edge cases and fail‑safe validation with human oversight",
  ],
  provenance: [
    "Dataset lineage, versioning, model cards & data sheets",
    "Audit trails and release approval workflows",
  ],
} as const;

export default responsibleAI;
