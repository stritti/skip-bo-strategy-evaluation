# Skip-Bo Strategy Evaluation 🃏📊

Eine moderne Web-Anwendung zur Simulation und Auswertung verschiedener Strategien im Kartenspiel Skip-Bo. Entwickelt mit Vue 3, TypeScript und TailwindCSS.

> [!NOTE]
> **Pure Vibe Coding**: Diese gesamte Anwendung wurde vollständig "Vibe Coded" – ohne jeglichen manuellen Eingriff in den Code.  
> Erstellt mit **Gemini 3 Pro** in **Antigravity**.

## 🚀 Features

### Simulation
- **High-Speed Simulation**: Simulieren Sie tausende von Spielrunden in wenigen Sekunden direkt im Browser.
- **Anpassbare Strategien**: Wählen Sie für beide Spieler individuell die Spielweise:
  - 🧠 **Optimiert**: Eine intelligente KI, die Gewinnchancen maximiert.
  - 🎲 **Zufall**: Spielt rein zufällige gültige Züge.
  - ⚡ **Spontan**: Eine impulsive Strategie (erstbeste Option).
- **Live-Feedback**: Verfolgen Sie den Fortschritt über eine dynamische Fortschrittsleiste und Echtzeit-Logs ("Matrix-Style").

### Analyse & Visualisierung
- **Interaktive Charts**: Visualisierung von Gewinnraten (Win Rate) und Spieldauer (Rundenanzahl) mittels Chart.js.
- **Detaillierte Historie**: Alle Simulationsläufe werden lokal gespeichert (IndexedDB) und können jederzeit erneut geladen werden.
- **Data Explorer**: Untersuchen Sie die Rohdaten jedes einzelnen Spiels in einer sortierbaren Tabelle (Sieger, Züge, Jokereinsatz).
- **Kumulative Statistik**: Sehen Sie aggregierte Kennzahlen über alle geladenen Simulationen hinweg.

### Auffindbarkeit (SEO/SSG)
- **Statisches Prerendering**: Der Build (`vike build`) erzeugt pro Route eine statische HTML-Seite (`dist/client/<route>/index.html`) – Suchmaschinen indexieren den vollen Inhalt ohne JS.
- **Per-route SEO-Metadaten**: Titel, Beschreibung, Canonical, hreflang, Open Graph und Twitter Cards pro Route – im prerendered HTML (via `+onRenderHtml`/`applyServerSeo`) und clientseitig bei Navigation (`applyPageSeo` in `src/utils/seo.ts`).

## 🛠 Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, Script Setup)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Sprache**: TypeScript
- **Datenbank**: IndexedDB (via `idb` library)
- **Charts**: Chart.js (via `vue-chartjs`)
- **Icons**: Phosphor Icons

## 📦 Installation & Start

Stellen Sie sicher, dass [Node.js](https://nodejs.org/) installiert ist.

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd skip-bo-strategy-evaluation
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   Die App ist nun unter `http://localhost:5173` erreichbar.

4. **Produktions-Build**
   ```bash
   npm run build
   ```

## 📊 Analytics (datensparsam)

Die App nutzt selbstgehostetes [Plausible](https://plausible.io) (keine Cookies, keine PII) – bereits für Pageviews/Outbound-Links aktiv. Zusätzlich werden Custom Events gesendet: `simulation_started`, `simulation_finished` (Strategien, N, Siege, Seed), `run_loaded`, `runs_aggregated`, `export_csv`, `export_json` (siehe `src/utils/analytics.ts`).

## 🌐 Sprachen

Die App ist zweisprachig: Deutsch (Default, `/`) und Englisch (`/en/...`) – inkl. hreflang-Alternates, per-route SEO-Metadaten in beiden Sprachen und Sprachumschalter in der Navigation. Übersetzt sind aktuell Navigation, Footer, About, Regeln, Strategie und das Strategie-Duell; Dashboard/Analyse/Data Explorer folgen.

## 🎮 Benutzung

1. **Konfiguration**: Öffnen Sie das Dashboard und stellen Sie die Anzahl der zu simulierenden Spiele ein (z.B. 10.000).
2. **Strategie wählen**: Setzen Sie Spieler 1 auf "Optimiert" und Spieler 2 auf "Zufall" (oder eine andere Kombination).
3. **Start**: Klicken Sie auf den Play-Button.
4. **Auswertung**: Nach Abschluss sehen Sie sofort die Ergebnisse. Klicken Sie auf "Zur Datentabelle", um Details zu sehen, oder laden Sie vergangene Läufe aus der Tabelle unten.

## 🤝 Geteilte Simulationsläufe

Alle Runs bleiben lokal in der IndexedDB des Browsers. Damit Runs **allen** zur Verfügung stehen, können sie ins Repository committed werden: JSON-Export eines Laufs nach `public/data/runs/` legen und in `public/data/runs/index.json` eintragen (siehe `public/data/runs/README.md`). Die App lädt diese geteilten Runs automatisch und zeigt sie in der Historie als „geteilt" an. Eine serverseitige Speicherung (für echtes automatisches Teilen aller Runs) würde einen Backend-Endpunkt benötigen – bei statischem Hosting ist der Repository-Weg die datensparsame Variante.

**Qualitätssicherung in CI:** Geteilte Runs müssen dem versionierten Schema `schemas/simulation-run.schema.json` (`version: 1`) entsprechen und werden in `npm test` automatisch mit ihrem Seed **re-simuliert** – Aggregatwerte und Einzelergebnisse müssen exakt reproduzierbar sein (Reproduzierbarkeits-Gate, siehe `src/test/sharedRunsValidation.test.ts`). Die App lädt nur die Aggregat-Summaries aus `index.json` (schnell); die Einzelergebnisse eines geteilten Runs werden erst beim Öffnen lazy nachgeladen (`npm run runs:index` regeneriert den Index).

> **KI-Transparenz (EU AI Act, Art. 50):** Diese App wurde mit KI-Unterstützung (Gemini 3 Pro via Antigravity) erstellt. Simulationsergebnisse sind deterministisch über Seeds replizierbar.

## Zitieren

Maschinenlesbare Zitationsdaten in [CITATION.cff](CITATION.cff) (GitHub rendert daraus einen „Cite this repository"-Block). BibTeX:

```bibtex
@software{strittmatter2026skipbo,
  author = {Strittmatter, Stephan},
  title  = {Skip-Bo Strategy Evaluation},
  year   = {2026},
  url    = {https://skip-bo-strategy-analysis.netlify.app/},
  license = {MIT}
}
```

---
*Dieses Projekt wurde zu Bildungs- und Analysezwecken erstellt.*  
*© 2026 Stephan Strittmatter · MIT-Lizenz*
