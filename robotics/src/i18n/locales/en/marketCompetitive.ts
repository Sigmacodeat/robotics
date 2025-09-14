const marketCompetitive = {
  matrix: {
    headers: ["Player", "Stack", "Openness", "Safety", "Ecosystem"],
    rows: [
      ["Incumbent A", "Closed", "Low", "Medium", "Low"],
      ["Incumbent B", "Semi‑closed", "Medium", "Medium", "Medium"],
      ["SIGMACODE AI", "Modular", "High", "High", "High"],
    ],
  },
  positioning: [
    "Open, modular stack with app‑store & SDK",
    "Policy hub & fleet learning as safety/compliance moat",
    "Enterprise‑ready integrations & observability",
  ],
  // Sources/references for overview (indicative)
  overviewSources: [
    'NVIDIA Isaac Sim / Omniverse – https://developer.nvidia.com/isaac-sim',
    'ROS 2 (Robot Operating System) – https://docs.ros.org/en/rolling/',
    'Gazebo (simulation) – https://gazebosim.org/home',
    'EU AI Act – https://artificialintelligenceact.eu/',
    'OpenAI × Figure (humanoid collaboration) – https://figure.ai/',
  ],
  // High-level notes for the Market page
  overview: [
    "Humanoid hardware is accelerating; software/ecosystems are the bottleneck.",
    "SIGMACODE AI abstracts hardware via ROS2/adapters, delivers app store & fleet rollouts.",
    "Differentiation via safety/compliance, tele‑assist, observability & SDK.",
    "State of the art: foundation models (VLA/RT recursive planners) + ROS2/Isaac stacks consolidate.",
    "Sim‑to‑real: Isaac Sim/Omniverse & Gazebo accelerate skill training and validation.",
    "Safety/AI Act: policy engines, audits, CE path become a competitive factor (trust advantage in EU).",
    "Telemetry/observability: fleet‑wide metrics/logs/video events as standard for ops & QA.",
    "App ecosystems: marketplaces with rev share drive third‑party skills and faster adoption.",
  ],
} as const;

export default marketCompetitive;
