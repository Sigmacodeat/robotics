# i18n Messages

Die kanonische und einzige Quelle sind TypeScript‑basierte Locale‑Dateien unter:

- `src/i18n/messages/` (z. B. `src/i18n/messages/de/**/*.ts`, `src/i18n/messages/en/**/*.ts`)

Laden zur Runtime erfolgt über `src/i18n/request.ts` (`getMessages()` + `createTranslator()`), es werden keine JSON‑Locales mehr verwendet.

Hinweise:
- Keine `de.json`/`en.json` mehr verwenden. JSON‑Locales sind legacy und werden nicht mehr gelesen.
- Validierung & Typen laufen im Build/CI:
  - Konsistenz/TS‑Validierung: `npm run -C robotics i18n:check`.
  - Typen: `npm run -C robotics i18n:types` generiert Hilfstypen/Keys.
  - Reports/Pruning: `npm run -C robotics i18n:report`, `npm run -C robotics i18n:prune`.
- ESLint verhindert harte UI‑Strings in JSX/TSX (siehe `package.json` → `eslintConfig.overrides` mit `react/jsx-no-literals`).
- Neue Keys werden in den jeweiligen TS‑Locale‑Dateien unter `src/i18n/messages/` gepflegt. Struktur folgt den vorhandenen Namespaces/Modulen (z. B. `bp`, `chapters`, …) und ist vollständig typisiert.
