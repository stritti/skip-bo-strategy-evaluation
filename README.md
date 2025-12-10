# Skip-Bo Strategy Evaluation 🃏📊

Eine moderne Web-Anwendung zur Simulation und Auswertung verschiedener Strategien im Kartenspiel Skip-Bo. Entwickelt mit Vue 3, TypeScript und TailwindCSS.

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

## 🎮 Benutzung

1. **Konfiguration**: Öffnen Sie das Dashboard und stellen Sie die Anzahl der zu simulierenden Spiele ein (z.B. 10.000).
2. **Strategie wählen**: Setzen Sie Spieler 1 auf "Optimiert" und Spieler 2 auf "Zufall" (oder eine andere Kombination).
3. **Start**: Klicken Sie auf den Play-Button.
4. **Auswertung**: Nach Abschluss sehen Sie sofort die Ergebnisse. Klicken Sie auf "Zur Datentabelle", um Details zu sehen, oder laden Sie vergangene Läufe aus der Tabelle unten.

---
*Dieses Projekt wurde zu Bildungs- und Analysezwecken erstellt.*
