export type Method = "Pot" | "Sheet pan" | "Skillet" | "Grab-and-go";
export type Rotation = "A" | "B";
export type BellyTag = "Soluble fiber" | "Fatty fish" | "Fermented" | "Polyphenols";
export type RecipeFilter = "All" | "Belly focus" | Method;
export type TabId = "today" | "recipes" | "prep" | "plan";

export type Recipe = {
  id: string;
  name: string;
  short: string;
  method: Method;
  rotation: Rotation | "Both";
  when: string;
  portions: number;
  protein: number;
  fiber: number;
  belly: BellyTag[];
  from: string;
  ingredients: string[];
  steps: string[];
  dan: string;
  cheese?: string;
};

export type CookStep = { time: string; task: string };
export type CookPlan = { sunday: CookStep[]; midweek: string; portions: string };
export type ShopItem = { id: string; name: string; qty: string };
export type ShopGroup = { group: string; items: ShopItem[] };

export type HabitGroup = "Dan's targets" | "Belly fat" | "Training";
export type Habit = { id: string; label: string; group: HabitGroup };

export type DayLog = { checks: Record<string, true>; protein: number; fiber: number };

export type AppState = {
  tab: TabId;
  weight: number | null;
  goal: number | null;
  rotation: Rotation;
  filter: RecipeFilter;
  days: Record<string, DayLog>;
  shop: Record<string, true>;
  weights: Record<string, number>;
};
