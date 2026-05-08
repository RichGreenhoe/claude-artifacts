# Claude Artifacts

A growing collection of interactive tools and calculators built with Claude — each a self-contained React component hosted as a Claude artifact.

The `index.html` at the root serves as a dashboard, hosted via GitHub Pages.

## Live Site

[richgreenhoe.github.io/claude-artifacts](https://richgreenhoe.github.io/claude-artifacts)

## Artifacts

| Name | Description |
|------|-------------|
| [Bonvoy Points Calculator](bonvoy-calc.jsx) | Compare Marriott hotels by cents-per-point value to find the best redemption |

## GitHub Pages Setup

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set branch to `main` and folder to `/ (root)`.
5. Click **Save** — the site will be live at `https://<your-username>.github.io/claude-artifacts` within a minute.

## Adding an Artifact

1. Add the `.jsx` file to the repo root.
2. Copy a `<a class="card">` block in `index.html` and update the icon, title, description, tags, and `href`.
3. Add a row to the table above.
4. Commit and push — the dashboard updates automatically.
