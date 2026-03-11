# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build → dist/
npm run preview   # Serve production build locally
npm run lint      # Run ESLint
```

No test framework is configured — this is a prototype without tests.

## Architecture

**Stack:** React 19 + Vite (pure JavaScript/JSX, no TypeScript).

### Monolithic structure

All application code lives in `src/App.jsx` (~2,300 lines). There are no separate component files, no external UI library, and no state management library — only React hooks.

### Screen-based navigation

Navigation is state-driven using a `screen` state variable. Screens are identified by constants in the `S` object at the top of `App.jsx`:

```js
const S = { HOME, CLIENTS, CLIENT_DETAIL, EL_STATUS, EL_WIZARD, ... }
```

Navigation happens via a `go(screen, data)` function that sets the current screen and optional context data (passed as props to screen components).

### Inline styles

All styling uses inline `style` objects — no CSS classes, no CSS modules, no Tailwind. Global resets are in `src/index.css`.

### Reusable components (inline)

Small presentational components are defined inline in `App.jsx`: `TypeBadge`, `RiskDot`, `StepBar`, `StatusPill`, `Btn`, `Header`, `BottomNav`, `Donut` (SVG chart), `Toggle`, `Section`, `Row`.

### Mock data

All data is hardcoded arrays/objects near the top of `App.jsx` (clients, signatures, forms, extensions, chats, documents, audit log). There is no API or backend.

### Bottom tab navigation

Four primary tabs: `HOME`, `CLIENTS`, `MESSAGING`, `DOCUMENTS`. Each tab renders its own screen tree, and sub-screens (e.g. `CLIENT_DETAIL`, `CHAT`) are pushed on top of the tab root.
