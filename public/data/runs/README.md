# Geteilte Simulationsläufe

JSON-Dateien in diesem Ordner werden von der Web-App automatisch geladen
(`data/runs/index.json` als Index) und in der Historie als „geteilt" angezeigt.
So stehen Runs allen Nutzerinnen und Nutzern der App zur Verfügung – ohne
Backend, direkt aus dem Repository.

## Eigenen Run teilen

1. In der App einen Lauf simulieren und im Dashboard als **JSON exportieren**
   (enthält Metadaten inkl. Seed und alle Einzelergebnisse mit Per-Game-Seeds).
2. Die Datei hier als `<name>.json` ablegen.
3. In `index.json` einen Eintrag ergänzen: `{ "file": "<name>.json", "label": "...", "strategyP1": "...", "strategyP2": "...", "gamesCount": N, "seed": S, "timestamp": ... }`.
4. Per Pull Request einreichen.

Hinweis: Bitte nur moderate Dateigrößen (Richtwert ≤ ~500 KB pro Run), damit die App schnell bleibt.
