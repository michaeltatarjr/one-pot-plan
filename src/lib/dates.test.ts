import { describe, expect, it } from "vitest";
import { addDays, currentWeekIndex, dateKey, isDateKey, lastDays, planWeeks, weeksLeft } from "./dates";

describe("dateKey", () => {
  it("formats local dates as YYYY-MM-DD", () => {
    expect(dateKey(new Date(2026, 8, 5))).toBe("2026-09-05");
  });

  it("validates real calendar dates only", () => {
    expect(isDateKey("2026-11-26")).toBe(true);
    expect(isDateKey("2026-02-30")).toBe(false);
    expect(isDateKey("2026-9-5")).toBe(false);
    expect(isDateKey("__proto__")).toBe(false);
  });
});

describe("planWeeks", () => {
  const weeks = planWeeks();

  it("runs 13 Monday-start weeks from Sep 28 through the week of Christmas", () => {
    expect(weeks).toHaveLength(13);
    expect(dateKey(weeks[0]!.start)).toBe("2026-09-28");
    expect(weeks[0]!.start.getDay()).toBe(1);
    expect(dateKey(weeks[12]!.start)).toBe("2026-12-21");
    expect(dateKey(weeks[12]!.end)).toBe("2026-12-27");
  });

  it("alternates rotations starting with A", () => {
    expect(weeks.map((w) => w.rotation).slice(0, 4)).toEqual(["A", "B", "A", "B"]);
  });

  it("puts Thanksgiving (Thu Nov 26) in week 9", () => {
    const thanksgiving = new Date(2026, 10, 26);
    expect(thanksgiving.getDay()).toBe(4);
    expect(currentWeekIndex(thanksgiving)).toBe(8);
    expect(weeks[8]!.focus).toContain("Thanksgiving");
  });
});

describe("currentWeekIndex", () => {
  it("is null before the plan starts and after it ends", () => {
    expect(currentWeekIndex(new Date(2026, 8, 27))).toBeNull();
    expect(currentWeekIndex(new Date(2026, 8, 28))).toBe(0);
    expect(currentWeekIndex(new Date(2026, 11, 27))).toBe(12);
    expect(currentWeekIndex(new Date(2026, 11, 28))).toBeNull();
  });
});

describe("weeksLeft", () => {
  it("counts days to Christmas as weeks and never goes negative", () => {
    expect(weeksLeft(new Date(2026, 11, 18))).toBe(1);
    expect(weeksLeft(new Date(2026, 11, 26))).toBe(0);
  });
});

describe("lastDays", () => {
  it("returns the requested count ending on the given day", () => {
    const days = lastDays(new Date(2026, 9, 3), 7);
    expect(days.map(dateKey)).toEqual([
      "2026-09-27",
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
    ]);
    expect(dateKey(addDays(days[0]!, 6))).toBe("2026-10-03");
  });
});
