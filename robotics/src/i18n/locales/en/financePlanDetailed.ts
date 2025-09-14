const financePlanDetailed = {
  personnel: [ [2025, "€420k"], [2026, "€620k"], [2027, "€820k"], [2028, "€980k"] ],
  totalsTitle: "Totals (k€)",
  totalsHeaders: ["Category", "Amount"],
  totalsRows: [ ["Revenue", 2300], ["COGS", 700], ["OPEX", 1000], ["EBITDA", 400] ],
  revenueTitle: "Revenue breakdown (k€)",
  revenueHeaders: ["Stream", "Amount"],
  revenueRows: [ ["Platform", 1400], ["App store", 900] ],
  ebitdaByYear: {
    title: "EBITDA by year (k€)",
    headers: ["Year", "EBITDA"],
    rows: [ [2025, -200], [2026, -60], [2027, 80], [2028, 220], [2029, 400] ],
  },
  capexOpex: {
    CAPEX: [ ["Robots", 160], ["Tools", 40] ],
    OPEX: [ ["Cloud", 120], ["Support", 80] ],
  },
} as const;

export default financePlanDetailed;
