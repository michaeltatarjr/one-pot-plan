import { WEEK_FOCUS } from "../data/weeks";
import type { Rotation } from "../data/types";

export const PLAN_START = new Date(2026, 8, 28);
export const CHRISTMAS = new Date(2026, 11, 25);
const DAY_MS = 86_400_000;
const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isDateKey(value: string): boolean {
  const match = DATE_KEY.exec(value);
  if (!match) {
    return false;
  }
  const [, y, m, d] = match;
  const parsed = new Date(Number(y), Number(m) - 1, Number(d));
  return dateKey(parsed) === value;
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

export function weeksLeft(today: Date): number {
  return Math.max(0, daysBetween(today, CHRISTMAS)) / 7;
}

export type PlanWeek = { index: number; start: Date; end: Date; rotation: Rotation; focus: string };

export function planWeeks(): PlanWeek[] {
  return WEEK_FOCUS.map((focus, index) => {
    const start = addDays(PLAN_START, index * 7);
    return { index, start, end: addDays(start, 6), rotation: index % 2 === 0 ? "A" : "B", focus };
  });
}

export function currentWeekIndex(today: Date): number | null {
  const offset = daysBetween(PLAN_START, today);
  if (offset < 0) {
    return null;
  }
  const index = Math.floor(offset / 7);
  return index < WEEK_FOCUS.length ? index : null;
}

export function lastDays(end: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => addDays(end, i - (count - 1)));
}

export function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function longDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
