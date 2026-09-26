import type { CookPlan, Rotation, ShopGroup } from "./types";

export const COOK: Record<Rotation, CookPlan> = {
  A: {
    sunday: [
      { time: "0:00", task: "Start the chili. Brown the beef; it simmers longest." },
      { time: "0:15", task: "Start the chicken and lentil soup on the second burner." },
      { time: "0:20", task: "Frittata into the oven at 375°F." },
      { time: "0:45", task: "Mix 4 chia cups and bag 7 shake packs while the pots simmer." },
      { time: "1:00", task: "Shred the chicken, finish the soup with greens and miso." },
      { time: "1:15", task: "Cool, portion into glass, label." },
    ],
    midweek: "Wednesday: sheet-pan salmon, cooked fresh. Fatty fish, meal two: salmon or sardine boats for one lunch.",
    portions: "16 lunch and dinner portions (soup 6, chili 6, salmon 4), plus 6 frittata squares and 4 chia cups.",
  },
  B: {
    sunday: [
      { time: "0:00", task: "Oven to 425°F. Both chicken and sweet potato pans in." },
      { time: "0:10", task: "Start the sausage, bean and kale skillet." },
      { time: "0:25", task: "Beef skillet on the second burner. Quinoa or rice pot on the third." },
      { time: "0:40", task: "Sheet pans out. Drop the oven to 375°F and put the frittata in." },
      { time: "0:45", task: "Mix 4 chia cups and bag 7 shake packs." },
      { time: "1:10", task: "Frittata out. Cool, portion into glass, label." },
    ],
    midweek: "Wednesday: sheet-pan salmon, cooked fresh. Fatty fish, meal two: salmon or sardine boats for one lunch. The stir-fry is an optional swap for any weeknight.",
    portions: "17 lunch and dinner portions (chicken pan 5, sausage skillet 4, beef skillet 4, salmon 4), plus 6 frittata squares and 4 chia cups.",
  },
};

export const SHOP: Record<Rotation, ShopGroup[]> = {
  A: [
    {
      group: "Protein",
      items: [
        { id: "a-thighs", name: "Boneless skinless chicken thighs", qty: "2 lb" },
        { id: "a-beef", name: "Grass-fed ground beef, 90/10", qty: "2 lb" },
        { id: "a-salmon", name: "Wild salmon fillets", qty: "4 × 6 oz" },
        { id: "a-eggs", name: "Eggs + liquid egg whites", qty: "12 + 16 oz" },
        { id: "a-fishcan", name: "Canned wild salmon or sardines", qty: "2–3 cans" },
        { id: "a-powder", name: "Dairy-free protein powder", qty: "check supply" },
      ],
    },
    {
      group: "Produce",
      items: [
        { id: "a-onion", name: "Yellow onions + 1 red onion", qty: "3 + 1" },
        { id: "a-carrot", name: "Carrots", qty: "1 lb" },
        { id: "a-celery", name: "Celery", qty: "1 bunch" },
        { id: "a-garlic", name: "Garlic", qty: "2 heads" },
        { id: "a-pepper", name: "Bell peppers", qty: "3" },
        { id: "a-zucchini", name: "Zucchini", qty: "2" },
        { id: "a-spinach", name: "Baby spinach", qty: "1 large tub" },
        { id: "a-mush", name: "Mushrooms", qty: "8 oz" },
        { id: "a-broc", name: "Broccoli + cauliflower", qty: "1 head each" },
        { id: "a-citrus", name: "Lemons", qty: "3" },
        { id: "a-avo", name: "Avocados + romaine", qty: "2 + 1 head" },
        { id: "a-herbs", name: "Parsley or dill", qty: "1 bunch" },
        { id: "a-berries", name: "Frozen berries", qty: "2 bags" },
      ],
    },
    {
      group: "Pantry",
      items: [
        { id: "a-lentils", name: "Dry green or brown lentils", qty: "1 lb bag" },
        { id: "a-beans", name: "White beans, 15 oz cans", qty: "3" },
        { id: "a-tomato", name: "Crushed tomatoes, 28 oz", qty: "1 can" },
        { id: "a-broth", name: "Broth, 32 oz cartons", qty: "3" },
        { id: "a-spice", name: "Chili powder, cumin, turmeric, smoked paprika", qty: "restock" },
        { id: "a-seeds", name: "Chia seeds + ground flax", qty: "restock" },
        { id: "a-milk", name: "Unsweetened almond or coconut milk", qty: "2 cartons" },
        { id: "a-oil", name: "Olive oil, Dijon", qty: "restock" },
        { id: "a-oats", name: "Steel-cut or rolled oats (optional soluble-fiber breakfast)", qty: "1 canister" },
      ],
    },
    {
      group: "Fermented and light cheese",
      items: [
        { id: "a-miso", name: "White miso", qty: "1 tub" },
        { id: "a-kraut", name: "Raw sauerkraut (refrigerated)", qty: "1 jar" },
        { id: "a-kimchi", name: "Kimchi (refrigerated)", qty: "1 jar" },
        { id: "a-parm", name: "Parmesan or aged cheddar wedge", qty: "small" },
      ],
    },
  ],
  B: [
    {
      group: "Protein",
      items: [
        { id: "b-thighs", name: "Boneless skinless chicken thighs", qty: "2.5 lb" },
        { id: "b-sausage", name: "Chicken sausage, no added sugar", qty: "1.5 lb" },
        { id: "b-beef", name: "Grass-fed ground beef or sirloin", qty: "1.5 lb" },
        { id: "b-salmon", name: "Wild salmon fillets", qty: "4 × 6 oz" },
        { id: "b-eggs", name: "Eggs + liquid egg whites", qty: "12 + 16 oz" },
        { id: "b-fishcan", name: "Canned wild salmon or sardines", qty: "2–3 cans" },
        { id: "b-breast", name: "Chicken breast or shrimp (only if doing the stir-fry swap)", qty: "1.5 lb" },
        { id: "b-powder", name: "Dairy-free protein powder", qty: "check supply" },
      ],
    },
    {
      group: "Produce",
      items: [
        { id: "b-sweet", name: "Sweet potatoes", qty: "3" },
        { id: "b-brussels", name: "Brussels sprouts", qty: "1 lb" },
        { id: "b-pepper", name: "Bell peppers", qty: "6" },
        { id: "b-onion", name: "Yellow onions + 1 red onion", qty: "3 + 1" },
        { id: "b-kale", name: "Kale", qty: "1 large bunch" },
        { id: "b-zucchini", name: "Zucchini", qty: "2" },
        { id: "b-spinach", name: "Baby spinach", qty: "1 large tub" },
        { id: "b-mush", name: "Mushrooms", qty: "8 oz" },
        { id: "b-broc", name: "Broccoli + cauliflower (salmon pan)", qty: "1 head each" },
        { id: "b-aromatics", name: "Garlic + fresh ginger", qty: "2 heads + 1 knob" },
        { id: "b-citrus", name: "Lemons + limes", qty: "3 + 1" },
        { id: "b-dill", name: "Fresh dill or parsley", qty: "1 bunch" },
        { id: "b-avo", name: "Avocados + romaine", qty: "2 + 1 head" },
        { id: "b-berries", name: "Frozen berries", qty: "2 bags" },
      ],
    },
    {
      group: "Pantry",
      items: [
        { id: "b-beans", name: "White beans, 15 oz cans", qty: "2" },
        { id: "b-grain", name: "Quinoa or rice", qty: "1 bag" },
        { id: "b-broth", name: "Broth, 32 oz carton", qty: "1" },
        { id: "b-aminos", name: "Coconut aminos or tamari + toasted sesame oil", qty: "restock" },
        { id: "b-seeds", name: "Chia seeds + ground flax", qty: "restock" },
        { id: "b-milk", name: "Unsweetened almond or coconut milk", qty: "2 cartons" },
        { id: "b-oil", name: "Olive oil, smoked paprika, cumin", qty: "restock" },
        { id: "b-oats", name: "Steel-cut or rolled oats (optional soluble-fiber breakfast)", qty: "1 canister" },
      ],
    },
    {
      group: "Fermented and light cheese",
      items: [
        { id: "b-kimchi", name: "Kimchi (refrigerated)", qty: "1 jar" },
        { id: "b-kraut", name: "Raw sauerkraut (refrigerated)", qty: "1 jar" },
        { id: "b-miso", name: "White miso (optional, stir into any soup)", qty: "1 tub" },
        { id: "b-parm", name: "Parmesan wedge", qty: "small" },
      ],
    },
  ],
};

export const SHOP_IDS: ReadonlySet<string> = new Set(
  [...SHOP.A, ...SHOP.B].flatMap((g) => g.items.map((i) => i.id)),
);
