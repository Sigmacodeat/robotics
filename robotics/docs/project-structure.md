# Project Structure and Import Aliases

This document describes the current code organization under `src/` and the preferred import aliases.

## Top-Level Layout

- `src/app/`
  - App Router routes, layouts, and route-specific (non-reusable) components.
  - Chapters live under `src/app/chapters/` with their pages and any route-only components, e.g. `src/app/components/chapters/`.
- `src/components/`
  - Reusable, generic components shared across routes.
  - Subfolders:
    - `animation/` — motion helpers and variants (`variants.ts`, `MotionProvider.tsx`, etc.)
    - `charts/` — charting widgets (e.g., `CountUp.tsx`, `Sparkline.tsx`, etc.)
    - `layout/` — shared layout widgets (Header, TOC, Footer)
    - `navigation/` — nav-related UI
    - `overlays/` — dialogs, modals (e.g., `CVModal.tsx`)
    - `print/` — print helpers and components
    - `ui/` — design system primitives (button, card, checkbox, skeleton, etc.)
- `src/i18n/`
  - i18n infrastructure (messages, request helpers, provider)
- `src/lib/`
  - Generic utilities and helpers used across the app (e.g., `format.ts`, `utils.ts`).

## Import Aliases (tsconfig.json)

Use these aliases to import consistently:

- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@charts/*` → `./src/components/charts/*`
- `@ui/*` → `./src/components/ui/*`
- `@sections/*` → `./src/app/components/chapters/sections/*` (route-specific)

Examples:

```ts
import Header from "@components/layout/Header";
import { Card } from "@ui/card";
import CountUp from "@charts/CountUp";
import { variantsMap } from "@components/animation/variants";
// Route-only (chapters sections)
import { KPIs } from "@sections/KPIs";
```

## Guidelines

- Place reusable components in `src/components/`.
- Keep route-specific (chapter-only) components co-located under `src/app/components/chapters/` and import via `@sections/*` when appropriate.
- Keep generic helpers in `src/lib/`. Only co-locate small, route-private helpers next to the route when they must not be shared.
- i18n: keep all message files and helpers in `src/i18n/`.
- Prefer aliases over deep relative paths.

## Notes

- The former `src/app/lib/` and `src/app/components/*` duplicates have been consolidated.
- The i18n provider now lives at `src/i18n/I18nProvider.tsx`.
- i18n locales are TypeScript-based under `src/i18n/messages/**`. JSON locales like `de.json`/`en.json` are legacy and no longer used.
