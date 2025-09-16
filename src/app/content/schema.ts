import { z } from "zod";

export const TimePoint = z.object({
  t: z.union([z.string(), z.number()]),
  v: z.number(),
});
export type TimePoint = z.infer<typeof TimePoint>;

export const TimeSeries = z.array(TimePoint).min(1);
export type TimeSeries = z.infer<typeof TimeSeries>;

export const KPI = z.object({
  label: z.string(),
  value: z.number(),
  suffix: z.string().optional(),
  decimals: z.number().default(0),
});
export type KPI = z.infer<typeof KPI>;

export const TableCell = z.union([z.string(), z.number(), z.null()]).nullable();
export const TableRow = z.array(TableCell);
export const Table = z.object({
  header: TableRow.optional(),
  rows: z.array(TableRow),
});
export type Table = z.infer<typeof Table>;

export const SectionContent = z.object({
  id: z.string(),
  title: z.string(),
  body: z.array(z.string()).default([]),
  kpis: z.array(KPI).default([]),
  series: z.record(z.string(), TimeSeries).default({}),
  tables: z.record(z.string(), Table).default({}),
});
export type SectionContent = z.infer<typeof SectionContent>;

export const DocumentContent = z.object({
  locale: z.union([z.literal("de"), z.literal("en")]),
  sections: z.array(SectionContent),
});
export type DocumentContent = z.infer<typeof DocumentContent>;
