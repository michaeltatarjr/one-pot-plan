import type { Update } from "../App";
import { COOK, SHOP } from "../data/shop";
import type { AppState, Rotation } from "../data/types";

type Props = { state: AppState; update: Update };

const LABEL: Record<Rotation, string> = {
  A: "A: soup, chili, salmon",
  B: "B: chicken pan, skillets, salmon",
};

export default function PrepView({ state, update }: Props) {
  const rot = state.rotation;
  const plan = COOK[rot];
  const groups = SHOP[rot];
  const ids = groups.flatMap((g) => g.items.map((i) => i.id));
  const got = ids.filter((id) => state.shop[id]).length;

  const toggle = (id: string, checked: boolean) =>
    update((s) => {
      const shop = { ...s.shop };
      if (checked) {
        shop[id] = true;
      } else {
        delete shop[id];
      }
      return { ...s, shop };
    });

  const clear = () =>
    update((s) => {
      const shop = { ...s.shop };
      ids.forEach((id) => delete shop[id]);
      return { ...s, shop };
    });

  return (
    <div className="stack">
      <h2>Weekly rhythm</h2>
      <div className="chip-row" role="group" aria-label="Rotation">
        {(["A", "B"] as const).map((r) => (
          <button
            key={r}
            type="button"
            className={rot === r ? "chip active" : "chip"}
            aria-pressed={rot === r}
            onClick={() => update((s) => ({ ...s, rotation: r }))}
          >
            {LABEL[r]}
          </button>
        ))}
      </div>
      <p className="muted">
        Alternate each week (the Plan tab shows which). Shop Saturday, cook Sunday, salmon fresh on Wednesday. Frittata,
        chia cups, shakes and fish boats happen every week.
      </p>

      <section className="stack tight">
        <h3>Sunday cook, about 75 minutes</h3>
        <ol className="cook-list">
          {plan.sunday.map((s) => (
            <li key={s.time}>
              <span className="time">{s.time}</span>
              <span>{s.task}</span>
            </li>
          ))}
        </ol>
        <p>{plan.midweek}</p>
        <p className="muted">{plan.portions}</p>
      </section>

      <section className="panel stack tight">
        <div className="section-head">
          <h3>
            Shopping list {rot} · {got} of {ids.length}
          </h3>
          <button type="button" className="link-button" onClick={clear} disabled={got === 0}>
            Clear
          </button>
        </div>
        {groups.map((g) => (
          <div key={g.group}>
            <p className="label">{g.group}</p>
            {g.items.map((i) => (
              <label key={i.id} className="check-row">
                <input type="checkbox" checked={state.shop[i.id] === true} onChange={(e) => toggle(i.id, e.target.checked)} />
                <span className="check-label">{i.name}</span>
                <span className="qty">{i.qty}</span>
              </label>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
