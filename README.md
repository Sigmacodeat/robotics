This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Projektstruktur (Chapters)

- __Seiten (Routen)__: `app/chapters/`
  - Einzelne Kapitel-Seiten wie `market/`, `technology/`, `business-model/`, …
  - Kapitel-Layout: `app/chapters/layout.tsx`

- __Kapitel-Komponenten (Public API)__: `src/components/chapters/`
  - Öffentliche Exporte: `src/components/chapters/index.ts`
  - Kapitel-Komponenten: `src/components/chapters/chapters/`
  - Sections: `src/components/chapters/sections/`
  - Shared UI: `src/components/chapters/shared/`

- __Weitere Komponenten (konsolidiert unter `src/components/`)__
  - CV: `src/components/cv/*` (vorher `app/components/cv/*`)
  - KPI: `src/components/kpi/*` (vorher `app/components/kpi/*`)
  - Layout-Helfer: `src/components/layout/*` (vorher `app/components/layout/*`)
  - Overlays: `src/components/overlays/*` (vorher `app/components/overlays/*`)
  - Theme: `src/components/theme/*` (vorher `app/components/theme/*`)
  - Animation: `src/components/animation/*` (vorher `app/components/animation/*`)

- __i18n__:
  - Nachrichten: `src/i18n/locales/en/`, `src/i18n/locales/de/`
  - Routing: `app/[locale]/...` (next-intl Provider ist global in `app/layout.tsx`)

## Import-Konventionen

- __Immer die Public-API verwenden__ (Pfad-Alias `@components/*`):

```ts
// Kapitel-Komponenten (zentral über Public-API)
import { WorkPackagesDetailedChapter, FinanceChapter } from '@components/chapters';

// Sections & Shared UI
import BusinessPlanSections from '@components/chapters/sections/BusinessPlanSections';
import { NumberedList, NumberedItem } from '@components/chapters/NumberedList';
import SectionCard from '@components/chapters/SectionCard';
import SplitSection from '@components/chapters/shared/SplitSection';
```

- __Keine tiefen Pfade in `app/components/...` mehr nutzen__ – alles ist unter `src/components/chapters/*` konsolidiert und via `@components/chapters/*` erreichbar.

- __Alias-Übersicht__

  - `@components/*` → `src/components/*` (einzige Quelle für Komponenten)
  - `@/app/*` → `app/*` (nur für Routen/Layouts/Server-spezifische Files)

## Manifest

- Das Web App Manifest wird über die Route `app/manifest.ts` ausgeliefert.
- Die frühere Datei `public/site.webmanifest` wurde entfernt und es existiert kein Redirect mehr.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
