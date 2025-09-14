import { describe, expect, test } from "@jest/globals";
import { LinePointSchema, SeriesSchema, ScatterPointSchema } from "@charts/schemas";

describe("charts/schemas", () => {
  test("LinePointSchema parses valid point", () => {
    const res = LinePointSchema.safeParse({ label: "2025", value: 100 });
    expect(res.success).toBe(true);
  });

  test("LinePointSchema rejects invalid point", () => {
    const res = LinePointSchema.safeParse({ label: {}, value: "x" });
    expect(res.success).toBe(false);
  });

  test("SeriesSchema requires non-empty points", () => {
    const res = SeriesSchema.safeParse({ name: "A", points: [] });
    expect(res.success).toBe(false);
  });

  test("SeriesSchema accepts colored series", () => {
    const res = SeriesSchema.safeParse({ name: "A", color: "#fff", points: [{ label: 1, value: 10 }] });
    expect(res.success).toBe(true);
  });

  test("ScatterPointSchema accepts emphasis/size/color", () => {
    const res = ScatterPointSchema.safeParse({ x: 5, y: 7, label: "X", size: 10, emphasis: true, color: "#09f" });
    expect(res.success).toBe(true);
  });
});
