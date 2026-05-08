# Claude Artifacts

A growing collection of interactive tools and calculators built with Claude — each a self-contained React component.

The dashboard is a Vite + React app deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.

## Live Site

[richgreenhoe.github.io/claude-artifacts](https://richgreenhoe.github.io/claude-artifacts)

## Artifacts

| Name | Description |
|------|-------------|
| [Bonvoy Points Calculator](bonvoy-calc.jsx) | Compare Marriott hotels by cents-per-point value to find the best redemption |

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## GitHub Pages Setup

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Push any commit to `main` — the Actions workflow builds and deploys automatically.

The live URL will be `https://richgreenhoe.github.io/claude-artifacts`.

## Adding an Artifact

1. Add the `.jsx` file to the repo root.
2. Add an entry to `src/artifacts.js`.
3. Add a row to the table above.
4. Commit and push — the dashboard redeploys automatically.
