import { HABIT_IDS } from "../data/habits";
import { RECIPE_FILTERS } from "../data/recipes";
import { SHOP_IDS } from "../data/shop";
import type { AppState, DayLog, RecipeFilter, Rotation, TabId } from "../data/types";
import { WEEK_FOCUS } from "../data/weeks";
import { isDateKey } from "./dates";
import { MAX_GRAMS, MAX_WEIGHT, MIN_WEIGHT } from "./nutrition";

export const STORAGE_KEY = "one-pot-plan:v1";
export const MAX_DAYS_KEPT = 400;
const MAX_DAILY_GRAMS = MAX_GRAMS * 10;
const TABS: TabId[] = ["today", "recipes", "prep", "plan"];
const ROTATIONS: Rotation[] = ["A", "B"];
const BLOCKED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export const DEFAULT_STATE: AppState = {
  tab: "today",
  weight: null,
  goal: null,
  rotation: "A",
  filter: "All",
  days: {},
  shop: {},
  weights: {},
};

export function freshState(): AppState {
  return { ...DEFAULT_STATE, days: {}, shop: {}, weights: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function safeEntries(value: unknown): [string, unknown][] {
  if (!isRecord(value)) {
    return [];
  }
  return Object.keys(value)
    .filter((key) => !BLOCKED_KEYS.has(key))
    .map((key) => [key, value[key]]);
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function pounds(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= MIN_WEIGHT && value <= MAX_WEIGHT
    ? Math.round(value * 10) / 10
    : null;
}

function grams(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.min(Math.round(value), MAX_DAILY_GRAMS)
    : 0;
}

function trueSet(value: unknown, allowed: ReadonlySet<string>): Record<string, true> {
  const out: Record<string, true> = {};
  for (const [key, v] of safeEntries(value)) {
    if (v === true && allowed.has(key)) {
      out[key] = true;
    }
  }
  return out;
}

function sanitizeDays(value: unknown): Record<string, DayLog> {
  const entries = safeEntries(value)
    .filter(([key]) => isDateKey(key))
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, MAX_DAYS_KEPT);
  const out: Record<string, DayLog> = {};
  for (const [key, raw] of entries) {
    if (!isRecord(raw)) {
      continue;
    }
    const log: DayLog = { checks: trueSet(raw.checks, HABIT_IDS), protein: grams(raw.protein), fiber: grams(raw.fiber) };
    if (Object.keys(log.checks).length > 0 || log.protein > 0 || log.fiber > 0) {
      out[key] = log;
    }
  }
  return out;
}

function sanitizeWeights(value: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, raw] of safeEntries(value)) {
    const index = Number(key);
    const w = pounds(raw);
    if (/^\d{1,2}$/.test(key) && index < WEEK_FOCUS.length && w !== null) {
      out[key] = w;
    }
  }
  return out;
}

export function sanitizeState(value: unknown): AppState {
  if (!isRecord(value)) {
    return freshState();
  }
  return {
    tab: oneOf<TabId>(value.tab, TABS, DEFAULT_STATE.tab),
    weight: pounds(value.weight),
    goal: pounds(value.goal),
    rotation: oneOf<Rotation>(value.rotation, ROTATIONS, DEFAULT_STATE.rotation),
    filter: oneOf<RecipeFilter>(value.filter, RECIPE_FILTERS, DEFAULT_STATE.filter),
    days: sanitizeDays(value.days),
    shop: trueSet(value.shop, SHOP_IDS),
    weights: sanitizeWeights(value.weights),
  };
}

export function parseState(raw: string | null): AppState {
  if (!raw) {
    return freshState();
  }
  try {
    return sanitizeState(JSON.parse(raw));
  } catch {
    return freshState();
  }
}

export function loadState(): AppState {
  try {
    return parseState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return freshState();
  }
}

export function saveState(state: AppState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
  } catch {
    // Quota or private-mode failures should not crash the UI.
  }
}
