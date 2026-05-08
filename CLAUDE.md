# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repo stores standalone React component artifacts — self-contained `.jsx` files designed to be run directly in Claude's artifact sandbox (no build step, no package.json, no bundler).

## Architecture

Each `.jsx` file is a single-file React component that:
- Uses `import { ... } from "react"` (available in the artifact runtime)
- Exports a default component as its entry point
- Carries all styles inline (via JS style objects or inline `style=` props) — no CSS files, no Tailwind, no CSS modules
- Has no external dependencies beyond React itself

### Current artifacts

- **`bonvoy-calc.jsx`** — Marriott Bonvoy points-vs-cash calculator. Compares hotel options by cents-per-point (CPP) value, renders a verdict table, and can export results as Markdown. State is local (no persistence).

## Development Notes

These files are not meant to be run locally with a dev server. To test changes, paste the component into [claude.ai](https://claude.ai) and ask Claude to render it as an artifact, or use a sandbox like [StackBlitz](https://stackblitz.com) with a Vite + React template.

There are no lint, test, or build commands — keep it that way unless a project grows to need them.
