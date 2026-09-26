import { useState } from "react";
import type { Update } from "../App";
import NumberField from "../components/NumberField";
import { HABIT_GROUPS, HABITS } from "../data/habits";
import { RECIPES } from "../data/recipes";
import type { AppState, DayLog } from "../data/types";
import { addDays, dateKey, lastDays, longDate, weeksLeft } from "../lib/dates";
import { FIBER_MAX, FIBER_MIN, calorieRange, parseGrams, parsePounds, weeklyPace } from "../lib/nutrition";

type Props = { state: AppState; update: Update; target: number | null };

const EMPTY_DAY: DayLog = { checks: {}, protein: 0, fiber: 0 };

function Targets({ state, update, target }: Props) {
  const left = weeksLeft(new Date());
  const pace = weeklyPace(state.weight, state.goal, left);
  const calories = calorieRange(state.weight);

  return (
    <section className="stack tight">
      <div className="field-row">
        <NumberField
          label="Current weight (lb)"
          value={state.weight}
          placeholder="e.g. 215"
          parse={parsePounds}
          onCommit={(weight) => update((s) => ({ ...s, weight }))}
        />
        <NumberField
          label="Christmas goal (lb)"
          value={state.goal}
          placeholder="e.g. 185"
          parse={parsePounds}
          onCommit={(goal) => update((s) => ({ ...s, goal }))}
        />
      </div>
      <div className="stats">
        <div className="stat primary">
          <strong>{target !== null ? `${target} g` : "0.8 g/lb"}</strong>
          <span>{target !== null ? "Protein per day" : "Protein: enter weight"}</span>
        </div>
        <div className="stat">
          <strong>
            {FIBER_MIN}–{FIBER_MAX} g
          </strong>
          <span>Fiber per day</span>
        </div>
        <div className="stat">
          <strong>7k–10k</strong>
          <span>Steps per day</span>
        </div>
        <div className="stat">
          <strong>{left.toFixed(1)}</strong>
          <span>Weeks to Christmas</span>
        </div>
        <div className={pace?.aggressive ? "stat warn" : "stat"}>
          <strong>{pace ? `${pace.perWeek.toFixed(1)} lb` : "—"}</strong>
          <span>{pace ? `Per week to lose ${pace.toLose} lb` : "Weekly pace: enter goal"}</span>
        </div>
      </div>
      {calories && (
        <p className="muted">
          Starting calories: about {calories[0]}–{calories[1]} a day. That is a rule of thumb (weight × 11 to 13), not a
          number from Dan's article; the higher end fits heavy training days. Adjust after two weeks based on your trend.
        </p>
      )}
      {pace?.aggressive && (
        <div className="callout warn">
          <h2>That pace is aggressive</h2>
          <p>
            More than about 2 lb a week usually costs muscle. A slightly later finish that holds beats a crash that
            rebounds.
          </p>
        </div>
      )}
    </section>
  );
}

function Tally({ entry, target, onAdd, onReset }: {
  entry: DayLog;
  target: number | null;
  onAdd: (protein: number, fiber: number) => void;
  onReset: () => void;
}) {
  const [protein, setProtein] = useState<number | null>(null);
  const [fiber, setFiber] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const addOther = () => {
    if (protein === null && fiber === null) {
      return;
    }
    onAdd(protein ?? 0, fiber ?? 0);
    setProtein(null);
    setFiber(null);
    setResetKey((k) => k + 1);
  };

  const fiberNote =
    entry.fiber >= FIBER_MIN
      ? entry.fiber > FIBER_MAX
        ? `Above ${FIBER_MAX} g`
        : "In range"
      : `${FIBER_MIN - entry.fiber} g to reach ${FIBER_MIN} g`;

  return (
    <div className="panel stack tight">
      <div className="section-head">
        <h3>Protein and fiber</h3>
        <button type="button" className="link-button" onClick={onReset}>
          Reset
        </button>
      </div>
      {target !== null ? (
        <div className="meter-row">
          <div className="meter-labels">
            <span>{entry.protein} g protein</span>
            <span>
              {entry.protein >= target ? "Target hit" : `${target - entry.protein} g to go of ${target} g`}
            </span>
          </div>
          <progress className="meter protein" max={target} value={Math.min(entry.protein, target)} />
        </div>
      ) : (
        <p className="muted">Protein so far: {entry.protein} g. Enter your weight above to set the target.</p>
      )}
      <div className="meter-row">
        <div className="meter-labels">
          <span>{entry.fiber} g fiber</span>
          <span>{fiberNote}</span>
        </div>
        <progress className="meter fiber" max={FIBER_MAX} value={Math.min(entry.fiber, FIBER_MAX)} />
      </div>
      <p className="label">Tap what you ate (adds one portion)</p>
      <div className="chip-row">
        {RECIPES.map((r) => (
          <button
            key={r.id}
            type="button"
            className="chip small"
            title={`${r.protein} g protein, ${r.fiber} g fiber`}
            onClick={() => onAdd(r.protein, r.fiber)}
          >
            {r.short} +{r.protein}
          </button>
        ))}
      </div>
      <div className="field-row end" key={resetKey}>
        <NumberField compact label="Protein g" value={protein} placeholder="0" parse={parseGrams} onCommit={setProtein} />
        <NumberField compact label="Fiber g" value={fiber} placeholder="0" parse={parseGrams} onCommit={setFiber} />
        <button type="button" className="chip" onClick={addOther}>
          Add other food
        </button>
      </div>
    </div>
  );
}

function LastSeven({ state, end }: { state: AppState; end: Date }) {
  const days = lastDays(end, 7);
  const cell = (d: Date) => state.days[dateKey(d)];
  return (
    <section className="stack tight">
      <h2>Last 7 days</h2>
      <div className="table-scroll">
        <table className="grid-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Habit</span>
              </th>
              {days.map((d) => (
                <th key={dateKey(d)} scope="col">
                  {d.toLocaleDateString("en-US", { weekday: "narrow" })}
                  <br />
                  {d.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Protein (g)</th>
              {days.map((d) => (
                <td key={dateKey(d)}>{cell(d)?.protein || "·"}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Fiber (g)</th>
              {days.map((d) => (
                <td key={dateKey(d)}>{cell(d)?.fiber || "·"}</td>
              ))}
            </tr>
            {HABITS.map((h) => (
              <tr key={h.id}>
                <th scope="row">{h.label}</th>
                {days.map((d) => {
                  const done = cell(d)?.checks[h.id] === true;
                  return (
                    <td key={dateKey(d)} className={done ? "done" : "none"}>
                      {done ? "✓" : "·"}
                      <span className="sr-only">{done ? "done" : "not done"}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function TodayView({ state, update, target }: Props) {
  const [offset, setOffset] = useState(0);
  const day = addDays(new Date(), offset);
  const key = dateKey(day);
  const entry = state.days[key] ?? EMPTY_DAY;
  const done = HABITS.filter((h) => entry.checks[h.id]).length;

  const editDay = (fn: (d: DayLog) => DayLog) =>
    update((s) => {
      const next = fn(s.days[key] ?? EMPTY_DAY);
      return { ...s, days: { ...s.days, [key]: next } };
    });

  const toggle = (id: string, checked: boolean) =>
    editDay((d) => {
      const checks = { ...d.checks };
      if (checked) {
        checks[id] = true;
      } else {
        delete checks[id];
      }
      return { ...d, checks };
    });

  return (
    <div className="stack">
      <Targets state={state} update={update} target={target} />

      <section className="stack tight">
        <div className="day-stepper">
          <button type="button" className="step" onClick={() => setOffset((o) => o - 1)} aria-label="Previous day">
            ‹
          </button>
          <div className="day-now">
            <strong>{longDate(day)}</strong>
            <span>
              {done} of {HABITS.length} done
            </span>
          </div>
          <button
            type="button"
            className="step"
            onClick={() => setOffset((o) => o + 1)}
            disabled={offset >= 0}
            aria-label="Next day"
          >
            ›
          </button>
        </div>
        {offset !== 0 && (
          <button type="button" className="chip" onClick={() => setOffset(0)}>
            Back to today
          </button>
        )}

        <div className="panel">
          {HABIT_GROUPS.map((group) => (
            <div key={group} className="habit-group">
              <p className="label">{group}</p>
              {HABITS.filter((h) => h.group === group).map((h) => (
                <label key={h.id} className="check-row">
                  <input
                    type="checkbox"
                    checked={entry.checks[h.id] === true}
                    onChange={(e) => toggle(h.id, e.target.checked)}
                  />
                  <span className="check-label">{h.id === "protein" && target !== null ? `Protein ${target} g` : h.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <Tally
          entry={entry}
          target={target}
          onAdd={(p, f) => editDay((d) => ({ ...d, protein: d.protein + p, fiber: d.fiber + f }))}
          onReset={() => editDay((d) => ({ ...d, protein: 0, fiber: 0 }))}
        />
      </section>

      <LastSeven state={state} end={day} />
    </div>
  );
}
