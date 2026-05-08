# Claude Artifacts

A growing collection of interactive tools and calculators built with Claude — each a self-contained React component.

The dashboard is a Vite + React app deployed automatically to GitHub Pages via GitHub Actions on every push to `main`. Clicking a card renders the live artifact in-app; a floating **← Dashboard** pill navigates back.

## Live Site

**[richgreenhoe.github.io/claude-artifacts](https://richgreenhoe.github.io/claude-artifacts)**

## Artifacts

| Name | Description |
|------|-------------|
| [Bonvoy Points Calculator](bonvoy-calc.jsx) | Compare Marriott hotels by cents-per-point value to find the best redemption |

## Development

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # production build → dist/
```

## GitHub Pages Setup

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source → GitHub Actions**.
3. Push any commit to `main` — the workflow builds and deploys automatically.

## Adding an Artifact

1. Add the `.jsx` file to the repo root. It must export a default React component.
2. Add an entry to `src/artifacts.js` — slug, title, description, icon, tags, and a `lazy()` import.
3. Add a row to the Artifacts table above.
4. Commit and push.
