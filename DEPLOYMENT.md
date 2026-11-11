# 🚀 Deployment-Anleitung

Die Skip-Bo Strategy Evaluation App ist produktionsreif. Konfiguriert ist **Netlify** über `netlify.toml` (Build: `npm run build`, Publish: `dist`, SPA-Redirects, Security-Header, Asset-Caching). Das Projekt deployt automatisch bei jedem Push auf `main`.

## Aktive Konfiguration: Netlify

1. Repository auf [netlify.com](https://netlify.com) verbinden ("New site from Git").
2. Build Settings werden automatisch aus `netlify.toml` übernommen:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Jeder Push auf `main` (und jeder PR mit Deploy-Preview) baut und deployed die App.

## Sicheres Teilen von Runs (Netlify Function)

Lokale Runs können direkt aus dem Frontend geteilt werden: `/.netlify/functions/share-run` (`netlify/functions/share-run.ts`) validiert die Anfrage und öffnet Branch + Pull Request. Dafür in den Netlify-Umgebungsvariablen des Sites setzen:

- `SHARE_TOKEN` – gemeinsames Secret; Nutzer geben es im Teilen-Dialog der App ein (wird nur als Bearer-Token gesendet und nie geloggt)
- `GITHUB_TOKEN` – Fine-Grained PAT mit `contents: write` und `pull-requests: write` auf diesem Repository (erstellt Branch/PR)
- optional `GITHUB_REPOSITORY` (Default: `stritti/skip-bo-strategy-evaluation`)
- optional `SHARE_ALLOWED_ORIGINS` – kommagetrennte Origin-Allowlist (Default: Produktions-URL; lokales `netlify dev` braucht zusätzlich `http://localhost:8888`)

Sicherheit: HTTPS-only (Netlify), timing-sicherer Token-Vergleich, Origin-Allowlist, Body-Cap 500 KB (= CI-Limit), AJV-Validierung gegen `schemas/simulation-run.schema.json` inkl. Seed-Pflicht, Duplikat-Abweisung (409). Vor dem Merge greifen PR-Review + CI (Index-Regenerierung via `runs-index.yml`, Re-Simulation via Test-Gate). Runs enthalten keine PII.

## Alternative: GitHub Pages

Dafür fehlt noch ein Workflow `.github/workflows/deploy.yml` (z. B. `actions/deploy-pages`). Danach in den Repo-Settings unter **Pages** die Source auf "GitHub Actions" stellen. Der `base`-Pfad in `vite.config.ts` muss dann auf `/skip-bo-strategy-evaluation/` gesetzt werden.

## Alternative: Vercel

1. Auf [vercel.com](https://vercel.com) das Repository importieren – Vite wird automatisch erkannt.
2. **Wichtig**: Base URL in `vite.config.ts` auf `/` lassen (Root-Deployment):
   ```typescript
   base: '/',
   ```

## Build lokal testen

```bash
npm run build   # Produktions-Build (tsc + vite-ssg build: Client-Bundle + prerendered statische Seite pro Route)
npm test        # Unit-Tests (Vitest)
npm run preview # Vorschau unter http://localhost:4173
```

Hinweis: Der Build erzeugt neben `dist/index.html` auch `dist/<route>/index.html` pro Route (SSG via `vite-ssg`, dirStyle `nested`). Netlify liefert diese Dateien direkt aus; die SPA-Redirects greifen nur für nicht vorhandene Pfade.

## Troubleshooting

### Problem: Routing funktioniert nicht nach dem Deployment

- **Netlify/Vercel**: SPA-Redirects sind bereits konfiguriert (`netlify.toml` bzw. Plattform-Default).
- **GitHub Pages**: `public/404.html` als Kopie von `index.html` ablegen.

### Problem: Assets werden nicht geladen

`base` in `vite.config.ts` prüfen: `/` für Netlify/Vercel, `/<repo-name>/` für GitHub Pages.

---
*Dieses Projekt wurde zu Bildungs- und Analysezwecken erstellt.*
