import { describe, expect, it } from "vitest";
import { DEFAULT_STATE, MAX_DAYS_KEPT, parseState, sanitizeState } from "./storage";

describe("parseState", () => {
  it("returns defaults for missing or malformed JSON", () => {
    expect(parseState(null)).toEqual(DEFAULT_STATE);
    expect(parseState("")).toEqual(DEFAULT_STATE);
    expect(parseState("{not json")).toEqual(DEFAULT_STATE);
    expect(parseState("[]")).toEqual(DEFAULT_STATE);
    expect(parseState("42")).toEqual(DEFAULT_STATE);
  });

  it("keeps valid data", () => {
    const state = parseState(
      JSON.stringify({
        tab: "prep",
        weight: 215,
        goal: 190,
        rotation: "B",
        filter: "Belly focus",
        days: { "2026-10-01": { checks: { protein: true, bjj: true }, protein: 150, fiber: 30 } },
        shop: { "b-salmon": true },
        weights: { "0": 215, "3": 208.4 },
      }),
    );
    expect(state).toEqual({
      tab: "prep",
      weight: 215,
      goal: 190,
      rotation: "B",
      filter: "Belly focus",
      days: { "2026-10-01": { checks: { protein: true, bjj: true }, protein: 150, fiber: 30 } },
      shop: { "b-salmon": true },
      weights: { "0": 215, "3": 208.4 },
    });
  });
});

describe("sanitizeState", () => {
  it("drops unknown enum values", () => {
    const state = sanitizeState({ tab: "admin", rotation: "C", filter: "<script>" });
    expect(state.tab).toBe("today");
    expect(state.rotation).toBe("A");
    expect(state.filter).toBe("All");
  });

  it("blocks prototype pollution keys", () => {
    const raw = JSON.parse(
      '{"days":{"__proto__":{"checks":{"protein":true}}},"shop":{"__proto__":true,"constructor":true},"weights":{"__proto__":200}}',
    );
    const state = sanitizeState(raw);
    expect(Object.keys(state.days)).toEqual([]);
    expect(Object.keys(state.shop)).toEqual([]);
    expect(Object.keys(state.weights)).toEqual([]);
    expect(({} as Record<string, unknown>).checks).toBeUndefined();
  });

  it("drops unknown ids and non-true checkmarks", () => {
    const state = sanitizeState({
      days: { "2026-10-01": { checks: { protein: true, hack: true, bjj: "yes" }, protein: 10 } },
      shop: { "a-beef": true, "z-unknown": true, "a-salmon": 1 },
    });
    expect(state.days["2026-10-01"]!.checks).toEqual({ protein: true });
    expect(state.shop).toEqual({ "a-beef": true });
  });

  it("clamps or drops out-of-range numbers", () => {
    const state = sanitizeState({
      weight: 5000,
      goal: -3,
      days: {
        "2026-10-01": { checks: {}, protein: 1e9, fiber: -4 },
        "2026-10-02": { checks: {}, protein: "lots" },
        "not-a-date": { checks: { protein: true } },
      },
      weights: { "0": 50, "1": 210, "13": 200, "01x": 200 },
    });
    expect(state.weight).toBeNull();
    expect(state.goal).toBeNull();
    expect(state.days["2026-10-01"]).toEqual({ checks: {}, protein: 5000, fiber: 0 });
    expect(state.days["2026-10-02"]).toBeUndefined();
    expect(state.days["not-a-date"]).toBeUndefined();
    expect(state.weights).toEqual({ "1": 210 });
  });

  it("keeps only the most recent days", () => {
    const days: Record<string, unknown> = {};
    for (let i = 0; i < MAX_DAYS_KEPT + 20; i++) {
      const d = new Date(2025, 0, 1 + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      days[key] = { checks: { steps: true }, protein: 0, fiber: 0 };
    }
    const kept = Object.keys(sanitizeState({ days }).days).sort();
    expect(kept).toHaveLength(MAX_DAYS_KEPT);
    expect(kept[0]).toBe("2025-01-21");
  });
});
