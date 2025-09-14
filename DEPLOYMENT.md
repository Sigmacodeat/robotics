# Deployment-Setup (Vercel + Monorepo)

Dieses Repo deployt die App im Unterordner `businessplan-site/` nach Vercel.

## Projektstruktur

- Root-Repo: Metadaten, `vercel.json`, `.gitignore`, `README.md`
- App: `businessplan-site/` (Next.js 15)

## Vercel-Konfiguration

- `vercel.json` im Repo-Root:
  - `installCommand`: `cd businessplan-site && pnpm install --frozen-lockfile`
  - `buildCommand`: `cd businessplan-site && pnpm build`
  - Framework: `nextjs`
  - Auto-Deploy: für `main` aktiviert

## Empfohlene Projekteinstellungen (in Vercel UI)

1. Project → Settings → Git
   - Branch: `main`
   - Automatic Deployments: ON
   - Ignored Build Step (optional, nur `main` bauen):
     ```bash
     if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then echo "ignore"; exit 0; fi
     ```

2. Project → Settings → Environment Variables
   - (falls benötigt) API Keys etc. nur hier pflegen, nicht in `.env` committen

3. Project → Settings → General
   - Framework Preset: Next.js
   - Node.js: >= 18

## Wichtige Hinweise

- Keine weiteren Vercel-Projekte mit demselben GitHub-Repo + Branch verknüpfen. Sonst gibt es mehrere Deployments pro Push.
- Falls doch Duplikate existieren:
  - Duplikat-Projekt öffnen → Settings → Danger Zone → Delete Project
  - oder: Settings → Git → Automatic Deployments = OFF (oder Ignored Build Step = `echo "ignore"`)

## Troubleshooting

- Frozen lockfile Fehler:
  - Lokal `pnpm install` im Subordner ausführen und lockfile committen
  - Stelle sicher, dass `pnpm-lock.yaml` im Subordner aktuell ist

- Finden/Erkennen der App:
  - `vercel.json` steuert Install/Build im Subordner – Root Directory muss in Vercel nicht gesetzt werden

- Mehrfach-Deployments:
  - Prüfe unter Vercel → Dashboard, ob mehrere Projekte auf dasselbe Repo/Branch zeigen. Duplikate löschen oder deaktivieren.
