const technology = {
  // Tech KPIs used for the 4 cards under the title
  kpi: {
    uptime: '99.99%',
    latencyP95: '<10 ms',
    buildTime: '~8 min',
    trl: '3 → 8 (2030)'
  },
  stack: [
    "Python, ROS2 (rclcpp/rclpy), Nav2/MoveIt",
    "PyTorch/JAX, diffusion policies, VLM/VLA (OpenVLA, RT‑X)",
    "Isaac Lab/Sim, CuOpt, Triton Inference + TensorRT‑LLM",
    "LangGraph/agents, gRPC/event streams, Kafka/Redpanda",
    "Cloud‑native microservices (K8s), feature flags, canary",
  ],
  points: [
    "Humanoid locomotion & balance: MPC, WBC and learned policies for robust walking, stairs/ladders, recovery steps",
    "Whole‑body manipulation: bimanual grasping, force/impedance control, hand‑eye coordination; VLM‑backed 3D perception (RGB‑D/LiDAR)",
    "Sim‑to‑real for humanoids: physics‑accurate simulation (MuJoCo/Isaac) + domain randomization/diffusion policies",
    "Safety & HRI: zone/contact‑force guardrails, collaborative trajectories, audit logs & provenance",
    "Edge execution <10ms: TensorRT/XLA/ONNX Runtime, zero‑copy pipelines on ARM/x86 GPUs; fleet‑wide versioning via policy hub",
  ],
  safetyCompliancePoints: [
    "EU AI Act implementation, audit logs, provenance",
    "Safety guardrails (zones/contact force), HRI risk assessment",
    "Canary rollouts, tele‑assist, observability",
  ],
  trl: { today: 3, target: "7–8" },
  compare: [
    ["Locomotion/balance", "Gait libs + heuristics, limited terrain", "MPC/WBC + learned recovery; robust terrain adaptation"],
    ["Manipulation", "Single‑arm, fixed sequences", "Bimanual, whole‑body, force control; learned skills"],
    ["Perception", "2D/marker‑based", "VLM + 3D representations, open vocabularies"],
    ["Deployment", "Monolithic releases", "Policy hub, canary, tele‑assist, fleet learning"],
    ["Safety/HRI", "Basic E‑stop/fencing", "Zone/contact‑force limits, collaborative trajectories, CE artifacts"],
    ["Platform", "Closed stacks", "App store/RaaS + SDK, third‑party skills, billing/licensing"],
  ],
  references: [
    "[1] EU AI Act & CE guidelines – safety management, technical documentation",
    "[2] Whole‑body control & MPC – humanoid locomotion/balance (ETH/CMU/Google Robotics)",
    "[3] VLMs & 3D perception for robotics – OpenVLA, RT‑X, GPV",
    "[4] Sim2Real for humanoids – diffusion policies, domain randomization (Stanford/Google)",
    "[5] MLOps/provenance – model cards, data sheets, audit trails",
  ],
} as const;

export default technology;
