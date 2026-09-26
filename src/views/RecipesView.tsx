import type { Update } from "../App";
import Bullets from "../components/Bullets";
import { RECIPE_FILTERS, RECIPES } from "../data/recipes";
import type { AppState, Recipe } from "../data/types";
import { isBellyFocus, percentOfTarget } from "../lib/nutrition";

type Props = { state: AppState; update: Update; target: number | null };

function RecipeCard({ recipe: r, target }: { recipe: Recipe; target: number | null }) {
  const pct = percentOfTarget(r.protein, target);
  return (
    <details className="recipe-card">
      <summary>
        <span className="recipe-name">{r.name}</span>
        <span className="recipe-macros">
          {r.protein} g protein · {r.fiber} g fiber
        </span>
      </summary>
      <div className="stack tight recipe-body">
        <p className="muted">
          {r.method} · {r.portions} {r.portions === 1 ? "serving" : "portions"} · {r.when}
          {r.rotation === "Both" ? " · Every week" : ` · Rotation ${r.rotation}`}
          {pct !== null ? ` · about ${pct}% of your daily protein` : ""}
        </p>
        <p className="muted italic">{r.from}</p>
        {r.belly.length > 0 && (
          <div className="chip-row tags">
            <span className="muted">Belly fat:</span>
            {r.belly.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="recipe-block">
          <h3>Ingredients</h3>
          <Bullets items={r.ingredients} />
        </div>
        <div className="recipe-block">
          <h3>Steps</h3>
          <Bullets items={r.steps} ordered />
        </div>
        <p>{r.dan}</p>
        {r.cheese && <p className="muted">{r.cheese}</p>}
      </div>
    </details>
  );
}

export default function RecipesView({ state, update, target }: Props) {
  const shown = RECIPES.filter((r) =>
    state.filter === "All" ? true : state.filter === "Belly focus" ? isBellyFocus(r) : r.method === state.filter,
  );

  return (
    <div className="stack">
      <h2>One-pot recipes</h2>
      <div className="chip-row" role="group" aria-label="Filter recipes">
        {RECIPE_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={state.filter === f ? "chip active" : "chip"}
            aria-pressed={state.filter === f}
            onClick={() => update((s) => ({ ...s, filter: f }))}
          >
            {f}
          </button>
        ))}
      </div>
      {state.filter === "Belly focus" && (
        <p className="muted">
          Every fatty-fish recipe plus anything with two or more belly-fat tags. Fatty fish twice a week: Wednesday
          salmon and one lunch of fish boats.
        </p>
      )}
      <div className="stack tight">
        {shown.map((r) => (
          <RecipeCard key={r.id} recipe={r} target={target} />
        ))}
      </div>
      <p className="muted small">
        Protein and fiber are per-portion estimates from standard nutrition values. Check labels on sausage and protein
        powder.
      </p>
    </div>
  );
}
