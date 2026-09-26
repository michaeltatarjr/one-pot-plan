import { describe, expect, it } from "vitest";
import { RECIPES } from "../data/recipes";
import {
  calorieRange,
  isBellyFocus,
  parseGrams,
  parsePounds,
  percentOfTarget,
  proteinTarget,
  weeklyPace,
} from "./nutrition";

describe("parsePounds", () => {
  it("accepts realistic body weights", () => {
    expect(parsePounds("215")).toBe(215);
    expect(parsePounds("187.46")).toBe(187.5);
  });

  it("rejects blanks, junk and out-of-range values", () => {
    expect(parsePounds("")).toBeNull();
    expect(parsePounds("abc")).toBeNull();
    expect(parsePounds("79")).toBeNull();
    expect(parsePounds("601")).toBeNull();
    expect(parsePounds("Infinity")).toBeNull();
  });
});

describe("parseGrams", () => {
  it("rounds valid grams and rejects zero, negatives and huge numbers", () => {
    expect(parseGrams("24.6")).toBe(25);
    expect(parseGrams("0")).toBeNull();
    expect(parseGrams("-5")).toBeNull();
    expect(parseGrams("501")).toBeNull();
  });
});

describe("targets", () => {
  it("uses 0.8 g of protein per pound", () => {
    expect(proteinTarget(200)).toBe(160);
    expect(proteinTarget(215)).toBe(172);
    expect(proteinTarget(null)).toBeNull();
  });

  it("gives a calorie range of weight x 11 to x 13, rounded to 50", () => {
    expect(calorieRange(200)).toEqual([2200, 2600]);
    expect(calorieRange(null)).toBeNull();
  });

  it("reports percent of the protein target", () => {
    expect(percentOfTarget(40, 160)).toBe(25);
    expect(percentOfTarget(40, null)).toBeNull();
  });
});

describe("weeklyPace", () => {
  it("computes pounds per week and flags anything over 2", () => {
    expect(weeklyPace(215, 185, 13)).toEqual({ toLose: 30, perWeek: 30 / 13, aggressive: true });
    expect(weeklyPace(215, 195, 13)?.aggressive).toBe(false);
  });

  it("returns null when there is nothing to lose or no time left", () => {
    expect(weeklyPace(200, 200, 13)).toBeNull();
    expect(weeklyPace(200, 210, 13)).toBeNull();
    expect(weeklyPace(200, 180, 0)).toBeNull();
    expect(weeklyPace(null, 180, 13)).toBeNull();
  });
});

describe("isBellyFocus", () => {
  it("includes every fatty-fish recipe and anything with two or more tags", () => {
    const focus = RECIPES.filter(isBellyFocus).map((r) => r.id);
    expect(focus).toContain("salmon");
    expect(focus).toContain("fish-boats");
    expect(focus).toContain("chili");
    expect(focus).not.toContain("frittata");
    expect(focus).not.toContain("beef-skillet");
  });
});
