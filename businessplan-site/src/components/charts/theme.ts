export const defaultPalette: string[] = [
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#22c55e", // green
  "#eab308", // yellow
  "#0ea5e9", // sky
  "#f97316", // orange
];

export const seriesColors = {
  revenue: "#f59e0b",
  costs: "#3b82f6",
  operating: "#10b981",
  investing: "#a855f7",
  financing: "#f59e0b",
  waterfall: {
    increase: "#16a34a",
    decrease: "#ef4444",
    subtotal: "#64748b",
    total: "#0ea5e9",
  },
} as const;

export type SeriesColorKey = keyof typeof seriesColors;
