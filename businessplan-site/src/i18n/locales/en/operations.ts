const operations = {
  slas: [
    "Uptime 99.99%, edge response <10ms (targets)",
    "Ticket response <4h (business), <1h (critical)",
    "Patch/hotfix window <24h, security fix <72h",
  ],
} as const;

export default operations;
