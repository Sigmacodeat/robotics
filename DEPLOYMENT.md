# Deployment-Setup (Vercel + Monorepo)

Dieses Repo deployt die App im Unterordner `robotics/` nach Vercel.

## Projektstruktur

- Root-Repo: Metadaten, `vercel.json`, `.gitignore`, `README.md`
- App: `robotics/` (Next.js 15)

## Vercel-Konfiguration

- Empfohlen: In Vercel die Root Directory direkt auf `robotics/` setzen. Dann sind keine
  speziellen Install/Build Commands nötig und Vercel erkennt Next.js automatisch.
  Optional kann `robotics/vercel.json` entfernt werden (Vercel-Defaults reichen).

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
   - Root Directory: `robotics/`
   - Node.js: 20.x

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
  - Setze die Root Directory in Vercel auf `robotics/`. Alternativ können Install/Build-Commands manuell gesetzt werden:
    - Install: `cd robotics && pnpm install --frozen-lockfile`
    - Build: `cd robotics && pnpm build`

- Mehrfach-Deployments:
  - Prüfe unter Vercel → Dashboard, ob mehrere Projekte auf dasselbe Repo/Branch zeigen. Duplikate löschen oder deaktivieren.
