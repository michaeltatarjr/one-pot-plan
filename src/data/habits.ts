import type { Habit, HabitGroup } from "./types";

export const HABIT_GROUPS: HabitGroup[] = ["Dan's targets", "Belly fat", "Training"];

export const HABITS: Habit[] = [
  { id: "protein", label: "Protein target", group: "Dan's targets" },
  { id: "fiber", label: "Fiber 25–38 g", group: "Dan's targets" },
  { id: "steps", label: "7,000–10,000 steps", group: "Dan's targets" },
  { id: "soluble", label: "Soluble fiber source", group: "Belly fat" },
  { id: "ferment", label: "Fermented food", group: "Belly fat" },
  { id: "noalc", label: "No alcohol or added sugar", group: "Belly fat" },
  { id: "sleep", label: "7+ hours sleep on schedule", group: "Belly fat" },
  { id: "bjj", label: "Jiu Jitsu", group: "Training" },
  { id: "plunge", label: "Cold plunge", group: "Training" },
  { id: "ruck", label: "Rucking", group: "Training" },
  { id: "carol", label: "CAROL Bike", group: "Training" },
  { id: "kb", label: "Kettlebells", group: "Training" },
];

export const HABIT_IDS: ReadonlySet<string> = new Set(HABITS.map((h) => h.id));
