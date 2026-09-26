export type Pillar = { title: string; lines: string[] };
export type PlaybookRow = { lever: string; why: string; how: string };

export const PILLARS: Pillar[] = [
  {
    title: "1. Metabolic flexibility",
    lines: [
      "Moderate calorie deficit: not so aggressive that energy tanks or you rebound.",
      "0.8 g protein per lb, 25–38 g fiber.",
      "Priority foods: fatty fish, polyphenols (berries, greens, spices), fermented foods.",
      "Eat inside the same window every day.",
      "Takes 3–4 months to build; practice it for a year.",
    ],
  },
  {
    title: "2. Muscle and strength",
    lines: [
      "Low volume, high intensity: 2 hard sets per exercise, close to failure.",
      "Every major muscle group at least twice a week.",
      "Only job: add weight or add reps.",
      "Goal is not burning fat in the gym; it is building a body that burns fat in your sleep.",
    ],
  },
  {
    title: "3. Recovery and sleep",
    lines: [
      "7,000–10,000 steps a day. Light activity speeds recovery and lowers stress.",
      "Enough hours, with the same sleep and wake times every day.",
      "Set up the bedroom to fall asleep without a fight.",
      "A nighttime routine that trains your body to shut down on schedule.",
    ],
  },
];

export const PLAYBOOK: PlaybookRow[] = [
  { lever: "Calorie deficit", why: "Deep belly (visceral) fat is usually among the first fat to go in a steady deficit.", how: "Hit protein, eat from the pots, and judge the scale by its 2-week trend." },
  { lever: "Soluble fiber", why: "Higher soluble-fiber intake is linked in studies with less visceral fat gain over time.", how: "Lentils, beans, chia, oats, Brussels sprouts or sweet potato every day." },
  { lever: "Fatty fish", why: "Omega-3s support insulin sensitivity. Dan's first priority food for belly fat.", how: "Salmon sheet pan Wednesday, plus salmon or sardine boats for one lunch." },
  { lever: "Fermented foods", why: "Dan's gut-health lever for removing visceral fat.", how: "Kimchi or sauerkraut on the chili and skillets, miso in the soup." },
  { lever: "CAROL Bike", why: "Short, very hard intervals are among the better-studied exercise tools for visceral fat.", how: "2–3 short sprint rides a week, on days that are not your heaviest Jiu Jitsu." },
  { lever: "Rucking and steps", why: "Steady low-intensity work burns fat and lowers stress without adding much fatigue.", how: "Ruck on non-Jiu Jitsu days. Walk 10 minutes after your biggest meal." },
  { lever: "Kettlebells", why: "Keeping muscle means the weight you lose comes from fat, and keeps your metabolism up.", how: "2 hard sets per exercise, each muscle group twice a week, add weight or reps." },
  { lever: "Jiu Jitsu", why: "Adds conditioning on top of the deficit.", how: "Count it as a training day and get protein in afterward." },
  { lever: "Sleep and stress", why: "Short sleep and chronic stress raise cortisol, which favors fat storage around the belly.", how: "7+ hours at the same times daily. Use the cold plunge for stress and recovery, not as a fat burner." },
  { lever: "Alcohol and added sugar", why: "Both push fat storage toward the liver and belly.", how: "Keep them out, especially on weekends." },
];
