# Security

This app is a static PWA. It never sends your weight, food or training data anywhere.

- State is stored only in `localStorage` under `one-pot-plan:v1`.
- Everything loaded from storage or a backup file is schema-checked in `src/lib/storage.ts`: prototype keys (`__proto__`, `constructor`, `prototype`) are dropped, ids must match the known habit and shopping lists, dates must be real calendar days, and numbers are range-checked.
- Backup imports are capped at 1 MB and must carry the app name and version.
- Production HTML sets a strict Content-Security-Policy (`script-src 'self'`, `style-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `form-action 'none'`). No inline scripts or styles, no `dangerouslySetInnerHTML`.
- No analytics, no auth, no network calls, no environment secrets.
- CI runs `npm audit` before building; Dependabot watches npm and GitHub Actions weekly.
- `glob` is pinned forward with an npm `overrides` entry because `workbox-build` still requests a deprecated major.

Report issues by opening a GitHub issue on the repo you publish this to.
