import { z } from "zod";

// Primitive points
export const LinePointSchema = z.object({
  label: z.union([z.string(), z.number()]),
  value: z.number(),
});
export type LinePoint = z.infer<typeof LinePointSchema>;

export const SeriesPointSchema = z.object({
  label: z.union([z.string(), z.number()]),
  value: z.number(),
});
export type SeriesPoint = z.infer<typeof SeriesPointSchema>;

export const SeriesSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
  points: z.array(SeriesPointSchema).nonempty(),
});
export type Series = z.infer<typeof SeriesSchema>;

export const ScatterPointSchema = z.object({
  x: z.number(),
  y: z.number(),
  label: z.string().optional(),
  color: z.string().optional(),
  size: z.number().optional(),
  emphasis: z.boolean().optional(),
});
export type ScatterPoint = z.infer<typeof ScatterPointSchema>;

// Helpers
export function validateDev<T>(schema: z.ZodTypeAny, data: unknown, ctx: string): T {
  if (process.env.NODE_ENV !== "production") {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.warn(`[charts] Validation failed for ${ctx}:`, result.error.flatten());
    }
  }
  return data as T;
}
