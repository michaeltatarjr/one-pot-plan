import { useCallback, useEffect, useState } from "react";
import type { AppState, TabId } from "./data/types";
import { loadState, saveState } from "./lib/storage";
import { proteinTarget } from "./lib/nutrition";
import TabBar from "./components/TabBar";
import TodayView from "./views/TodayView";
import RecipesView from "./views/RecipesView";
import PrepView from "./views/PrepView";
import PlanView from "./views/PlanView";

export type Update = (fn: (state: AppState) => AppState) => void;

export default function App() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback<Update>((fn) => setState(fn), []);
  const setTab = (tab: TabId) => {
    update((s) => ({ ...s, tab }));
    window.scrollTo(0, 0);
  };
  const target = proteinTarget(state.weight);

  return (
    <>
      <main className="app">
        <header className="top">
          <p className="brand">30 by Christmas</p>
          <h1>One-Pot Plan</h1>
        </header>
        {state.tab === "today" && <TodayView state={state} update={update} target={target} />}
        {state.tab === "recipes" && <RecipesView state={state} update={update} target={target} />}
        {state.tab === "prep" && <PrepView state={state} update={update} />}
        {state.tab === "plan" && <PlanView state={state} update={update} replaceState={setState} />}
      </main>
      <TabBar active={state.tab} onSelect={setTab} />
    </>
  );
}
