# Geteilte Simulationsläufe

JSON-Dateien in diesem Ordner werden von der Web-App automatisch geladen
(`data/runs/index.json` als Index) und in der Historie als „geteilt" angezeigt.
So stehen Runs allen Nutzerinnen und Nutzern der App zur Verfügung – ohne
Backend, direkt aus dem Repository.

## Format & Qualitätssicherung (CI)

Jede Datei muss gegen `schemas/simulation-run.schema.json` (JSON Schema,
Draft 2020-12, `version: 1`) validieren. Der Gate läuft automatisch in
`npm test` (`src/test/sharedRunsValidation.test.ts`) und prüft pro Run:

1. **Schema-Konformität** (kanonische Run-Form oder Dashboard-Export `{ metadata, results }`),
2. **Dateigröße** ≤ 500 KB,
3. **Konsistenz** zwischen `index.json`-Eintrag und Datei (Seed, gamesCount),
4. **Reproduzierbarkeit**: Der Lauf wird mit dem gespeicherten Seed und den
   gespeicherten Strategien erneut simuliert; Aggregatwerte und jedes
   Einzelergebnis (außer `duration`) müssen exakt übereinstimmen.

Deshalb ist ein **numerischer Seed Pflicht** – Läufe ohne Seed schlagen in CI fehl.

## Eigenen Run teilen

1. In der App einen Lauf simulieren und im Dashboard als **JSON exportieren**
   (enthält `version`, Metadaten inkl. Seed und alle Einzelergebnisse mit Per-Game-Seeds).
2. Die Datei hier als `<name>.json` ablegen.
3. In `index.json` einen Eintrag ergänzen: `{ "file": "<name>.json", "label": "...", "strategyP1": "...", "strategyP2": "...", "gamesCount": N, "seed": S, "timestamp": ... }`.
4. Per Pull Request einreichen – CI validiert Schema und re-simuliert den Lauf.

Hinweis: Bitte nur moderate Dateigrößen (Hartlimit 500 KB pro Run, enforced in CI),
damit die App schnell bleibt.
