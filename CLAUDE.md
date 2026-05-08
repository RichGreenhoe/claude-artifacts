# CLAUDE.md

## Repository Purpose

A growing collection of Claude-built React components ("artifacts"), served through a Vite + React dashboard hosted on GitHub Pages. Each artifact is a standalone `.jsx` file at the repo root; the `src/` directory is the dashboard app that indexes and renders them.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # production build → dist/
```

Deployment is automatic via GitHub Actions on every push to `main`.

## Architecture

### Dashboard (`src/`)

- **`src/artifacts.js`** — single source of truth for all artifact metadata (slug, title, description, icon, tags, lazy import). Add new artifacts here.
- **`src/App.jsx`** — dashboard grid, renders a card per artifact using CSS Modules.
- **`src/ArtifactPage.jsx`** — renders the artifact component at `/#/:slug` with a floating ← Dashboard nav pill.
- **`src/main.jsx`** — `HashRouter` entry point. Hash routing is used so GitHub Pages static hosting requires no server config.
- **`vite.config.js`** — base path is `/` in dev, `/claude-artifacts/` in production.

### Artifacts (repo root)

Each `.jsx` file is a self-contained React component:
- Exports a default component
- Inline styles only (JS style objects) — no CSS files, no Tailwind, no CSS modules
- No dependencies beyond React itself

### Adding an Artifact

1. Add `my-artifact.jsx` to the repo root.
2. Add an entry to `src/artifacts.js` with a `lazy(() => import("../my-artifact.jsx"))` component field.
3. Commit and push — the dashboard redeploys automatically.
