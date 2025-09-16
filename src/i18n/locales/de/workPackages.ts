const workPackages = {
  title: "Arbeitspakete & Budget (indicative)",
  headers: ["WP", "Bezeichnung", "Zeitplan", "Deliverables", "Budget (k€)"],
  rows: [
    { id: "WP1", name: "Projektvorbereitung & Anforderungsanalyse", timeline: "M0–M2", deliverables: ["Anforderungsdokument", "Projektplan", "Risikoanalyse"], budget: 18 },
    { id: "WP2", name: "Technische Konzeption & Architektur", timeline: "M3–M5", deliverables: ["Technisches Konzept", "Systemarchitektur", "Schnittstellen"], budget: 32 },
    { id: "WP3", name: "Entwicklung & Implementierung", timeline: "M6–M13", deliverables: ["Kernfeatures", "Tests", "Dokumentation"], budget: 110 },
    { id: "WP4", name: "Testing & Qualitätssicherung", timeline: "M11–M14", deliverables: ["Testberichte", "Bug-Reports", "Freigabe"], budget: 42 },
    { id: "WP5", name: "Einführung & Schulung", timeline: "M15–M16", deliverables: ["Schulungen", "Handbuch", "Abschlussbericht"], budget: 20 },
  ],
} as const;

export default workPackages;
