import type { Recipe } from "../data/types";

export const PROTEIN_PER_LB = 0.8;
export const FIBER_MIN = 25;
export const FIBER_MAX = 38;
export const MIN_WEIGHT = 80;
export const MAX_WEIGHT = 600;
export const MAX_GRAMS = 500;

export function parsePounds(value: string): number | null {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= MIN_WEIGHT && n <= MAX_WEIGHT ? Math.round(n * 10) / 10 : null;
}

export function parseGrams(value: string): number | null {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n > 0 && n <= MAX_GRAMS ? Math.round(n) : null;
}

export function proteinTarget(weight: number | null): number | null {
  return weight === null ? null : Math.round(weight * PROTEIN_PER_LB);
}

function roundTo50(n: number): number {
  return Math.round(n / 50) * 50;
}

/** Rule-of-thumb starting range (weight × 11 to × 13), not a number from Dan's article. */
export function calorieRange(weight: number | null): [number, number] | null {
  return weight === null ? null : [roundTo50(weight * 11), roundTo50(weight * 13)];
}

export type Pace = { toLose: number; perWeek: number; aggressive: boolean };

export function weeklyPace(weight: number | null, goal: number | null, weeksLeft: number): Pace | null {
  if (weight === null || goal === null || goal >= weight || weeksLeft <= 0) {
    return null;
  }
  const toLose = Math.round((weight - goal) * 10) / 10;
  const perWeek = toLose / weeksLeft;
  return { toLose, perWeek, aggressive: perWeek > 2 };
}

export function isBellyFocus(recipe: Recipe): boolean {
  return recipe.belly.includes("Fatty fish") || recipe.belly.length >= 2;
}

export function percentOfTarget(grams: number, target: number | null): number | null {
  return target === null || target <= 0 ? null : Math.round((grams / target) * 100);
}
