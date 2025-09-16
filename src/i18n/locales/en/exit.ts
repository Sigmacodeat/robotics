const exit = {
  title: "Exit strategy",
  options: {
    a: { title: "Trade sale (strategic)", points: [] },
    b: { title: "PE / growth buyout", points: [] },
    c: { title: "IPO (long-term option)", points: [] },
  },
  notes: "High strategic interest due to AI/robotics consolidation; co-selling/alliances increase valuation options.",
  roi: { title: "ROI & investor value", text: "Illustrative scenarios show attractive multiples under conservative growth assumptions." },
  valuation: {
    title: "Valuation approach",
    methods: [
      "Revenue multiples (ARR forward)",
      "Comparable transactions",
      "Discounted cash flow (sensitivity)",
    ],
    range: "€30–60M (illustrative)",
    multiples: ["EV/ARR 8–12x", "EV/EBITDA 15–25x"],
  },
  earnOut: {
    title: "Earn‑out mechanisms",
    mechanics: [
      "Performance‑based tranches (ARR/EBITDA milestones)",
      "Equity vesting tied to retention",
      "Clawback clauses for extraordinary events",
    ],
  },
  secondary: {
    title: "Secondary options",
    points: [
      "Partial founder liquidity at Series A/B",
      "Employee liquidity via tender offer",
    ],
  },
  coInvest: {
    title: "Co‑investment structures",
    points: [
      "Strategic co‑investment with GTM partners",
      "Syndicated SPV for strategic buyers",
    ],
  },
  buyers: {
    title: "Potential buyers",
    strategic: ["Odds platforms", "Data providers", "Sports media", "US sportsbooks"],
    financial: ["Growth equity funds", "Sector‑focused PE"],
  },
  timeline: {
    title: "Exit timeline",
    phases: [
      { period: "2026–2027", activities: ["Scale ARR > €10M", "Keep unit economics stable"] },
      { period: "2028–2029", activities: ["EBITDA positive", "Broaden buyer universe"] },
      { period: "2030+", activities: ["Exit window (IPO or trade sale)"] },
    ],
  },
  preparation: {
    title: "Exit preparation",
    actions: [
      "Bankable KPIs: audited ARR, churn <10%, gross margin >60%",
      "Compliance readiness: CE, AI Act, privacy",
      "Data room: contracts, IP, tech docs, security reports",
    ],
  },
  risks: {
    title: "Exit risks & mitigations",
    items: [
      { risk: "Market window shifts", mitigation: "Dual‑track process (IPO/trade sale), flexible timing" },
      { risk: "Buyer concentration", mitigation: "Broaden buyer universe (strategic/financial)" },
      { risk: "Regulatory delays", mitigation: "Early certification, legal counsel" },
    ],
  },
} as const;

export default exit;
