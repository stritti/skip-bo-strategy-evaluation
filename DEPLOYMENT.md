# 🚀 Deployment-Anleitung

Die Skip-Bo Strategy Evaluation App ist produktionsreif und kann über GitHub Pages deployed werden.

## Schnellstart

1. **Code committen und pushen**:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **GitHub Pages aktivieren**:
   - Gehen Sie zu Ihrem Repository auf GitHub
   - Settings → Pages
   - Source: "GitHub Actions" auswählen
   - Der Workflow wird automatisch bei jedem Push auf `main` ausgeführt

3. **Fertig!** 🎉
   - Die App wird automatisch gebaut und deployed
   - URL: `https://stritti.github.io/skip-bo-strategy-evaluation/`

## Was wurde konfiguriert

✅ **Vite Base Path** (`vite.config.ts`):
- Konfiguriert für GitHub Pages Subdirectory: `/skip-bo-strategy-evaluation/`

✅ **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
- Automatischer Build bei jedem Push auf `main`
- TypeScript Compilation
- Vite Production Build  
- Deployment zu GitHub Pages

## Manuelle Deployment-Optionen

### Option 1: Vercel

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Importieren Sie Ihr GitHub Repository
3. Vercel erkennt automatisch Vite
4. Deploy!

**Wichtig**: Setzen Sie die Base URL auf `/`:
```typescript
// vite.config.ts
base: '/', // statt '/skip-bo-strategy-evaluation/'
```

### Option 2: Netlify

1. Gehen Sie zu [netlify.com](https://netlify.com)
2. "New site from Git" auswählen
3. Repository verbinden
4. Build Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

**Wichtig**: Setzen Sie die Base URL auf `/`:
```typescript
// vite.config.ts
base: '/', // statt '/skip-bo-strategy-evaluation/'
```

## Build lokal testen

```bash
# Produktions-Build erstellen
npm run build

# Build-Vorschau starten
npm run preview
```

Die Vorschau läuft unter `http://localhost:4173`

## Troubleshooting

### Problem: Routing funktioniert nicht nach Deployment

**Lösung für GitHub Pages**: 
Fügen Sie eine `404.html` im `public/` Ordner hinzu, die identisch zu `index.html` ist (für SPA Routing).

**Lösung für Netlify/Vercel**: 
Diese Plattformen unterstützen SPA Routing automatisch.

### Problem: Assets werden nicht geladen

**Lösung**: 
Überprüfen Sie, ob der `base` Path in `vite.config.ts` korrekt ist:
- GitHub Pages Subdirectory: `base: '/repo-name/'`
- Netlify/Vercel Root: `base: '/'`

## Weitere Informationen

Siehe [walkthrough.md](file:///home/ssr/.gemini/antigravity/brain/986893fa-c06c-497e-9d4d-97a31646f001/walkthrough.md) für detaillierte Production Readiness Assessment.
