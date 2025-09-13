const mlops = {
  stack: [
    "Policy hub, versioning, feature flags, canary rollouts",
    "Telemetry pipelines (logs/traces/metrics) & observability",
    "CI/CD for models & skills incl. offline/online evals",
  ],
  practices: [
    "Model registry & reproducibility, rollback strategies",
    "A/B evals, shadow mode, data quality guards",
    "Security reviews & approval gates (four‑eyes principle)",
  ],
} as const;

export default mlops;
