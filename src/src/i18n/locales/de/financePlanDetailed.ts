const financePlanDetailed = {
  personnel: [ [2025, "€420k"], [2026, "€620k"], [2027, "€820k"], [2028, "€980k"] ],
  totalsTitle: "Summen (k€)",
  totalsHeaders: ["Kategorie", "Betrag"],
  totalsRows: [ ["Umsatz", 2300], ["COGS", 700], ["OPEX", 1000], ["EBITDA", 400] ],
  revenueTitle: "Umsatzstruktur (k€)",
  revenueHeaders: ["Strom", "Betrag"],
  revenueRows: [ ["Plattform", 1400], ["App‑Store", 900] ],
  ebitdaByYear: {
    title: "EBITDA nach Jahr (k€)",
    headers: ["Jahr", "EBITDA"],
    rows: [ [2025, -200], [2026, -60], [2027, 80], [2028, 220], [2029, 400] ],
  },
  capexOpex: {
    CAPEX: [
      ["Humanoide Roboter – Figure 02 (2 Stk.)", 90],
      ["Humanoide Roboter – Agility Digit (1 Stk.)", 45],
      ["Sensorpakete (RGB‑D/LiDAR/IMU)", 10],
      ["Endeffektoren (Greifer/Kraft)", 6],
      ["Compute (Jetson Orin/Edge‑GPU)", 5],
      ["Sim‑Lizenzen/Assets (Isaac/MuJoCo)", 2],
      ["Datasets (kommerzielle Lizenzen)", 2],
    ],
    OPEX: [ ["Cloud", 120], ["Support", 80] ],
  },
} as const;

export default financePlanDetailed;
