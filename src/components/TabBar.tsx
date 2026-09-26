import type { TabId } from "../data/types";

const TABS: { id: TabId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "recipes", label: "Recipes" },
  { id: "prep", label: "Prep" },
  { id: "plan", label: "Plan" },
];

export default function TabBar({ active, onSelect }: { active: TabId; onSelect: (tab: TabId) => void }) {
  return (
    <nav className="tab-bar" aria-label="Sections">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={t.id === active ? "tab active" : "tab"}
          aria-current={t.id === active ? "page" : undefined}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
