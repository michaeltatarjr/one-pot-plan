import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "../App";
import type { AppState } from "../data/types";
import { freshState } from "../lib/storage";
import PlanView from "./PlanView";
import PrepView from "./PrepView";
import RecipesView from "./RecipesView";
import TodayView from "./TodayView";

const noop = () => {};

const logged: AppState = {
  ...freshState(),
  weight: 215,
  goal: 185,
  filter: "Belly focus",
  rotation: "B",
  weights: { "0": 215, "1": 212 },
};

describe("views render without crashing", () => {
  it("renders the app shell with the Today tab", () => {
    const html = renderToStaticMarkup(<App />);
    expect(html).toContain("One-Pot Plan");
    expect(html).toContain("Belly fat");
    expect(html).toContain("CAROL Bike");
  });

  it("renders Today with targets from weight", () => {
    const html = renderToStaticMarkup(<TodayView state={logged} update={noop} target={172} />);
    expect(html).toContain("172 g");
    expect(html).toContain("That pace is aggressive");
    expect(html).toContain("Last 7 days");
  });

  it("renders Recipes filtered to belly focus", () => {
    const html = renderToStaticMarkup(<RecipesView state={logged} update={noop} target={172} />);
    expect(html).toContain("Sheet-pan salmon and crucifers");
    expect(html).not.toContain("Sheet-pan vegetable frittata");
  });

  it("renders Prep for rotation B", () => {
    const html = renderToStaticMarkup(<PrepView state={logged} update={noop} />);
    expect(html).toContain("Shopping list B");
    expect(html).toContain("Wild salmon fillets");
  });

  it("renders Plan with the weight chart once two weights exist", () => {
    const html = renderToStaticMarkup(<PlanView state={logged} update={noop} replaceState={noop} />);
    expect(html).toContain("Belly fat playbook");
    expect(html).toContain("Body weight by plan week");
    expect(html).toContain("Week 13");
  });
});
