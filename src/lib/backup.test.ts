import { describe, expect, it } from "vitest";
import type { AppState } from "../data/types";
import { MAX_BACKUP_BYTES, backupFileName, exportBackup, importBackup } from "./backup";

const sample: AppState = {
  tab: "plan",
  weight: 212,
  goal: 188,
  rotation: "B",
  filter: "Pot",
  days: { "2026-10-02": { checks: { soluble: true, ruck: true }, protein: 165, fiber: 31 } },
  shop: { "a-kimchi": true },
  weights: { "0": 212 },
};

describe("backup", () => {
  it("round-trips state through export and import", () => {
    const result = importBackup(exportBackup(sample, new Date("2026-10-03T12:00:00Z")));
    expect(result).toEqual({ ok: true, state: sample });
  });

  it("names files by date", () => {
    expect(backupFileName(new Date("2026-10-03T12:00:00Z"))).toBe("one-pot-plan-backup-2026-10-03.json");
  });

  it("rejects invalid JSON, other apps, other versions and oversized files", () => {
    expect(importBackup("nope").ok).toBe(false);
    expect(importBackup(JSON.stringify({ app: "other", version: 1, state: {} })).ok).toBe(false);
    expect(importBackup(JSON.stringify({ app: "one-pot-plan", version: 99, state: {} })).ok).toBe(false);
    expect(importBackup(" ".repeat(MAX_BACKUP_BYTES + 1)).ok).toBe(false);
  });

  it("sanitizes imported state", () => {
    const result = importBackup(
      JSON.stringify({ app: "one-pot-plan", version: 1, state: { tab: "evil", weight: 1, shop: { "x-bad": true } } }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.tab).toBe("today");
      expect(result.state.weight).toBeNull();
      expect(result.state.shop).toEqual({});
    }
  });
});
