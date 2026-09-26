import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { Update } from "../App";
import Bullets from "../components/Bullets";
import NumberField from "../components/NumberField";
import WeightChart from "../components/WeightChart";
import { PILLARS, PLAYBOOK } from "../data/playbook";
import type { AppState } from "../data/types";
import { MAX_BACKUP_BYTES, backupFileName, exportBackup, importBackup } from "../lib/backup";
import { currentWeekIndex, planWeeks, shortDate } from "../lib/dates";
import { parsePounds } from "../lib/nutrition";

type Props = { state: AppState; update: Update; replaceState: Dispatch<SetStateAction<AppState>> };

function Timeline({ state, update }: Pick<Props, "state" | "update">) {
  const weeks = planWeeks();
  const current = currentWeekIndex(new Date());
  const points = weeks
    .filter((w) => state.weights[String(w.index)] !== undefined)
    .map((w) => ({ label: `Wk ${w.index + 1}`, value: state.weights[String(w.index)] ?? 0 }));

  const setWeight = (index: number, value: number | null) =>
    update((s) => {
      const weights = { ...s.weights };
      if (value === null) {
        delete weights[String(index)];
      } else {
        weights[String(index)] = value;
      }
      return { ...s, weights };
    });

  return (
    <section className="stack tight">
      <h2>13 weeks to Christmas</h2>
      {points.length >= 2 && <WeightChart points={points} goal={state.goal} />}
      <ol className="week-list">
        {weeks.map((w) => (
          <li key={w.index} className={w.index === current ? "week current" : "week"}>
            <div className="week-head">
              <strong>Week {w.index + 1}</strong>
              <span className="muted">
                {shortDate(w.start)} – {shortDate(w.end)} · Rotation {w.rotation}
              </span>
            </div>
            <p>{w.focus}</p>
            <NumberField
              compact
              label="Weight (lb)"
              value={state.weights[String(w.index)] ?? null}
              placeholder="—"
              parse={parsePounds}
              onCommit={(v) => setWeight(w.index, v)}
            />
          </li>
        ))}
      </ol>
      <p className="muted">
        After Christmas: Dan says metabolic flexibility takes 3–4 months to build, which lands in January. Keep the
        system running for a year to lock it in.
      </p>
    </section>
  );
}

function Backup({ state, replaceState }: Pick<Props, "state" | "replaceState">) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const download = () => {
    const blob = new Blob([exportBackup(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = backupFileName();
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Backup downloaded.");
  };

  const restore = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (file.size > MAX_BACKUP_BYTES) {
      setMessage("That file is too large to be a backup from this app.");
      return;
    }
    const result = importBackup(await file.text());
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    if (window.confirm("Replace everything in the app with this backup?")) {
      replaceState(result.state);
      setMessage("Backup restored.");
    }
  };

  return (
    <section className="panel stack tight">
      <h3>Backup</h3>
      <p className="muted">Your data lives only on this phone. Download a backup now and then.</p>
      <div className="chip-row">
        <button type="button" className="chip" onClick={download}>
          Download backup
        </button>
        <button type="button" className="chip" onClick={() => fileRef.current?.click()}>
          Restore from file
        </button>
        <input
          ref={fileRef}
          className="sr-only"
          type="file"
          accept="application/json,.json"
          tabIndex={-1}
          onChange={(e) => {
            void restore(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {message && (
        <p className="muted" role="status">
          {message}
        </p>
      )}
    </section>
  );
}

export default function PlanView({ state, update, replaceState }: Props) {
  return (
    <div className="stack">
      <section className="stack tight">
        <h2>The three pillars</h2>
        {PILLARS.map((p) => (
          <div key={p.title}>
            <h3>{p.title}</h3>
            <Bullets items={p.lines} />
          </div>
        ))}
      </section>

      <section className="stack tight">
        <h2>Belly fat playbook</h2>
        <div className="callout">
          <h3>You can't burn fat from one spot</h3>
          <p>
            But deep belly fat tends to respond first to the levers below. That is how Dan's client Brad cut his
            visceral fat by 60% in 12 weeks.
          </p>
        </div>
        <dl className="playbook">
          {PLAYBOOK.map((row) => (
            <div key={row.lever} className="play">
              <dt>{row.lever}</dt>
              <dd>{row.why}</dd>
              <dd className="how">{row.how}</dd>
            </div>
          ))}
        </dl>
        <p className="muted small">
          Research summaries are general findings, not individual guarantees. Check with your doctor before hard
          intervals if you have heart or blood-pressure concerns.
        </p>
      </section>

      <Timeline state={state} update={update} />
      <Backup state={state} replaceState={replaceState} />

      <p className="muted small">
        Sources: Dan Go, "If You Want To Drop 30 Pounds By Christmas, Copy This" (Sep 2026); your sp-21-day recipe
        catalog. Educational only, not medical advice.
      </p>
    </div>
  );
}
