const technology = {
  // Tech-KPIs (werden für die 4 Karten unter dem Titel verwendet)
  kpi: {
    uptime: '99.99%',
    latencyP95: '<10 ms',
    buildTime: '~8 min',
    trl: '3 → 8 (2030)'
  },
  paragraphs: [
    "KI‑Framework: SigmaCode AI Agenten‑System, erweitert für Robotik (Verhaltenssteuerung, Orchestrierung).",
    "App‑Store: Cloud‑basierte Microservice‑Architektur mit Payment & Lizenzsystem.",
    "Safety & Compliance: Umsetzung EU AI Act & ISO 13482, Auditierbarkeit & Guardrails.",
    "IP‑Strategie: Schutz von Framework, Safety‑Layer & Orchestrierung (Patente/Marken).",
  ],
  points: [
    "Humanoide Lokomotion & Balance: MPC/WBC mit gelernten Residual‑Kontrollern; robuste Gait‑Phasen (Treppen/Leitern, Recovery‑Steps)",
    "Ganzkörper‑Manipulation: bimanuell, Kraft-/Impedanzregelung; visuomotorische Transformer (VLA) mit 3D‑Repräsentationen (RGB‑D/LiDAR)",
    "Sim‑zu‑Real: Isaac Lab/MuJoCo, Domain Randomization; Diffusion Policies & Imitation‑Learning auf Open‑X/DROID",
    "Safety & HRI: kontaktkraft‑ und zonenbasierte Guardrails, kollaborative Trajektorien; Audit‑Logs/Provenienz (Policy‑Evals)",
    "Edge‑Ausführung <10ms: TensorRT‑LLM/XLA/ONNX Runtime; Zero‑Copy‑Pipelines auf Orin/RTX; Fleet‑Versionierung via Policy Hub",
  ],
  stack: [
    "Python, ROS2 (rclcpp/rclpy), Nav2/MoveIt",
    "PyTorch/JAX, Diffusion Policies, VLM/VLA (OpenVLA, RT‑X)",
    "Isaac Lab/Sim, CuOpt, Triton Inference + TensorRT‑LLM",
    "LangGraph/Agenten, gRPC/Event‑Streams, Kafka/Redpanda",
    "Cloud‑native Microservices (K8s), Feature‑Flags, Canary",
  ],
  // Ziel‑Hardware (Humanoide) – Kurzliste für Beschaffung & Integration
  hardwareTargets: [
    "Tesla – Optimus: humanoid; Fokus auf industrielle/Alltags‑Tasks; Entwicklungsstatus fortgeschritten; Quelle: https://www.tesla.com/",
    "Figure – 02: humanoid; KI‑Kollaboration (OpenAI); aktive Entwicklung; Quelle: https://figure.ai/",
    "Agility – Digit: zweibeinig; Logistik‑Fokus; Quelle: https://agilityrobotics.com/",
  ],
  // Sensorik & Compute – Referenz‑Stack
  sensorsCompute: [
    "RGB‑D (z. B. Luxonis OAK‑D) + Hand‑Auge‑Kalibrierung",
    "LiDAR (Livox/Ouster) + 3D‑Fusion (TSDF/Gaussian)",
    "Event‑Kameras (Proprio/High‑Speed Grasping)",
    "Taktil/FT‑Sensorik (BioTac, ATI Mini45) für Griff‑Evals",
    "Compute: NVIDIA Jetson Orin (Nano/AGX) + Edge‑RTX; NVLink‑Streaming",
    "Endeffektoren: Robotiq/Schunk mit Kraftregelung, Quick‑Change",
  ],
  // Kuratierte Datensätze & Lizenzhinweise
  datasets: [
    "Open‑X Embodiment – Multi‑Task Manipulation; Quelle: https://robotics-transformer-x.github.io/",
    "DROID – Large‑Scale Robot Imitation Dataset; Quelle: https://droid-dataset.github.io/",
    "Ego4D – 3.670h, 923 Teilnehmer, 74 Orte, 9 Länder; Egocentric für Wahrnehmung/HRI; Quelle: https://ego4d-data.org/",
    "EPIC‑KITCHENS – Küchen‑Interaktionen (Hand‑Objekt); Quelle: https://epic-kitchens.github.io/",
    "RT‑X/RT‑2 – Repos/Papers; Referenz‑Policies & Datendomänen; Quelle: https://robotics-transformer-x.github.io/",
    "Isaac/MuJoCo Sim‑Assets – Sim2Real & Domain Randomization; Quelle: https://developer.nvidia.com/isaac, https://mujoco.org/",
  ],
  // Integrationsplan (Kurz)
  integrationPlan: [
    "Shortlist & Beschaffung: 1–2 humanoide Plattformen (Pilot)",
    "ROS2‑Adapter/Treiber: Teleop, State‑Estimation, Safety‑E‑Stop",
    "Perception: RGB‑D/LiDAR‑Fusion, VLM‑Assists, 6D‑Posen",
    "Manipulation: WBC/MPC + Diffusion‑/Imitation‑Skills (Greifen/Tragen)",
    "Safety/HRI‑Evals, Canary‑Rollouts, Tele‑Assist; Fleet‑Versionierung",
  ],
  compare: [
    ["Lokomotion/Balance", "Gait‑Heuristiken; limitiertes Terrain", "MPC/WBC + Residual‑Policies; robuste Terrain‑Anpassung"],
    ["Manipulation", "Einarmig, Sequenzen", "Bimanuell, Ganzkörper, Kraftregelung; Diffusion/IL‑Skills"],
    ["Perception", "2D/Marker", "VLM + 3D‑Repräsentationen (NeRF/Gaussian), offene Vokabulare"],
    ["Deployment", "Monolithisch", "Policy Hub, Canary, Tele‑Assist, Fleet Learning"],
    ["Safety/HRI", "E‑Stop/Einzäunung", "Zonen/Kontaktkraft‑Limits, kollaborative Trajektorien, CE‑Artefakte"],
    ["Plattform", "Geschlossen", "App‑Store/RaaS + SDK, Third‑Party‑Skills, Billing/Licensing"],
  ],
  references: [
    "[1] Whole‑Body Control & MPC – ETH/CMU/Google Robotics",
    "[2] VLM/VLA für Robotik – OpenVLA, RT‑X/RT‑2",
    "[3] Diffusion Policies & Imitation – DROID, Diffusion Policy",
    "[4] Sim2Real – Isaac Lab/MuJoCo, Domain Randomization",
    "[5] EU AI Act & CE – Safety‑Management, Provenienz/Audit",
  ],
  roadmap: [
    "2025: Perception/VLA‑Baselines, Isaac‑Sim‑Umgebungen",
    "2026: Integration humanoider Roboter, Live‑Demonstrator",
    "2027: Verhalten/Alltagsszenarien, Diffusion/IL‑Basismodelle",
    "2028: App‑Store Beta + Developer‑SDK (Third‑Party‑Skills)",
    "2029: RaaS‑Piloten, Fleet Learning & Monitoring",
    "2030: Zertifizierung, EU‑Launch",
  ],
  timelinePhases: [
    { period: "2025 – Grundlagen & Prototyping", items: ["KI‑Framework, ROS2‑Integration, Sim‑Demonstrator"] },
    { period: "2026 – Integration & Demo", items: ["Humanoider Demonstrator, End‑to‑End‑Tests"] },
    { period: "2027 – Verhalten & Alltag", items: ["Alltagsszenarien (Greifen/Assistenz), Basismodelle"] },
    { period: "2028 – App‑Store Beta", items: ["Developer‑SDK, Billing/Licensing"] },
    { period: "2029 – RaaS‑Piloten", items: ["Flottenmanagement, Monitoring, Updates"] },
    { period: "2030 – Zertifizierung & EU‑Launch", items: ["CE/Safety Audits, Markteintritt EU"] },
  ],
  workPackages: [
    { id: "AP1", name: "Software‑Framework für Roboter‑KI", timeline: "2025", deliverables: ["API‑Doku", "v0.1 Demo (Bewegung+Sprache)"] },
    { id: "AP2", name: "Erwerb & Integration humanoider Roboter", timeline: "2026", deliverables: ["Integrationsstudie", "Live‑Demo Q2 2026"] },
    { id: "AP3", name: "KI‑Verhaltensmodellierung", timeline: "2027", deliverables: ["Datasets", "v1.0 Basismodelle"] },
    { id: "AP4", name: "Plattform \"Roboter‑App‑Store\"", timeline: "2028", deliverables: ["Beta‑Plattform", "Developer‑SDK"] },
    { id: "AP5", name: "Roboter‑as‑a‑Service (RaaS)", timeline: "2029", deliverables: ["SaaS‑Dashboard", "3 Pilotprojekte"] },
    { id: "AP6", name: "Skalierung & Zertifizierung", timeline: "2030", deliverables: ["Zertifizierungsdokumente", "EU‑Launch"] },
  ],
  safetyCompliancePoints: [
    "EU AI Act Umsetzung, Audit‑Logs, Provenienz",
    "Safety‑Guardrails (Zonen/Kontaktkraft), HRI‑Risikobeurteilung",
    "Canary‑Rollouts, Tele‑Assist, Observability",
  ],
  standardsList: [
    "ISO 13482 (persönliche Assistenzroboter)",
    "ISO 10218 / ISO/TS 15066 (Kollaborative Robotik)",
    "CE‑Richtlinien & Technische Dokumentation",
  ],
  trl: { today: 3, target: "7–8" },
} as const;

export default technology;

