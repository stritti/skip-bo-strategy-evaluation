# 🚀 Deployment-Anleitung

Die Skip-Bo Strategy Evaluation App ist produktionsreif. Konfiguriert ist **Netlify** über `netlify.toml` (Build: `npm run build`, Publish: `dist`, SPA-Redirects, Security-Header, Asset-Caching). Das Projekt deployt automatisch bei jedem Push auf `main`.

## Aktive Konfiguration: Netlify

1. Repository auf [netlify.com](https://netlify.com) verbinden ("New site from Git").
2. Build Settings werden automatisch aus `netlify.toml` übernommen:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Jeder Push auf `main` (und jeder PR mit Deploy-Preview) baut und deployed die App.

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
npm run build   # Produktions-Build (tsc + vite build)
npm test        # Unit-Tests (Vitest)
npm run preview # Vorschau unter http://localhost:4173
```

## Troubleshooting

### Problem: Routing funktioniert nicht nach dem Deployment

- **Netlify/Vercel**: SPA-Redirects sind bereits konfiguriert (`netlify.toml` bzw. Plattform-Default).
- **GitHub Pages**: `public/404.html` als Kopie von `index.html` ablegen.

### Problem: Assets werden nicht geladen

`base` in `vite.config.ts` prüfen: `/` für Netlify/Vercel, `/<repo-name>/` für GitHub Pages.

---
*Dieses Projekt wurde zu Bildungs- und Analysezwecken erstellt.*
