# 30 by Christmas: One-Pot Plan

Phone app version of Dan Go's three pillars (metabolic flexibility, muscle, recovery) built on the one-pot recipes from the old Standard Process guide, with a belly-fat focus. Low dairy; hard cheese in small amounts only.

- **Today:** protein, fiber and pace targets from your weight; daily checklist (Dan's targets, belly fat, Jiu Jitsu, cold plunge, rucking, CAROL Bike, kettlebells); protein and fiber tally; last 7 days.
- **Recipes:** 11 dairy-light recipes with belly-fat tags and a Belly focus filter.
- **Prep:** alternating rotation A and B with a timed Sunday cook and a checkable shopping list.
- **Plan:** three pillars, belly fat playbook, 13-week timeline with weekly weigh-ins and a chart, and backup and restore.

This is a food and habit tracker, not medical advice.

## Local

```bash
npm install
npm test
npm run dev
```

Open `http://localhost:5282/`. Port 5281 is sp-21-day and 5173 is Helio on this machine.

### If `npm install` fails with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

AVG Web Shield intercepts HTTPS and re-signs it with its own root certificate, which Windows trusts but Node does not by default. Tell Node to use the Windows certificate store instead of turning off certificate checks:

```powershell
$env:NODE_USE_SYSTEM_CA = "1"   # this terminal only
npm install
```

To make it permanent, set `NODE_USE_SYSTEM_CA=1` as a user environment variable. Never set `strict-ssl=false`.

## Publish to GitHub Pages

1. Create an empty GitHub repo named `one-pot-plan`.
2. From this folder:

```bash
git init -b main
git add .
git commit -m "Add One-Pot Plan PWA"
git remote add origin https://github.com/YOUR_USER/one-pot-plan.git
git push -u origin main
```

3. Repo **Settings → Pages → Source: GitHub Actions**.
4. After the workflow finishes, the app is at `https://YOUR_USER.github.io/one-pot-plan/`.

The production build uses `base: /one-pot-plan/`. If you host at a domain root, change `BASE` in `vite.config.ts` to `/`.

## Install on iPhone

1. Open the Pages URL in **Safari**.
2. Share → **Add to Home Screen**.
3. Open the **One-Pot Plan** icon. It runs full-screen and works offline.

Progress stays on that phone. Use **Plan → Backup → Download backup** now and then; clearing Safari data for the site resets everything.

## Scripts

```bash
npm test          # Vitest unit tests (nutrition, dates, storage sanitizing, backup)
npm run lint      # TypeScript, no emit
npm run build     # type-check and production build to dist/
npm run preview   # serve dist/ on port 5282
npm run icons     # regenerate PNG icons (Node built-ins only)
npm audit --omit=dev
```
