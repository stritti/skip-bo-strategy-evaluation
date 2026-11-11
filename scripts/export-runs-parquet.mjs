/**
 * Exports the shared simulation runs (public/data/runs/) as a Hugging Face
 * dataset: datasets/skip-bo-runs/{runs.parquet, games.parquet, README.md}
 *
 * Usage:  npm run runs:parquet
 * Upload: huggingface-cli upload <user>/skip-bo-runs ./datasets/skip-bo-runs --repo-type dataset
 *         (requires HF_TOKEN with write access; the dataset repo must exist)
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import parquet from 'parquetjs-lite';
import { buildDataset, GAMES_SCHEMA_FIELDS, RUNS_SCHEMA_FIELDS } from '../src/services/runDataset.ts';

const runsDir = fileURLToPath(new URL('../public/data/runs/', import.meta.url));
const outDir = fileURLToPath(new URL('../datasets/skip-bo-runs/', import.meta.url));
const REPO_URL = 'https://github.com/stritti/skip-bo-strategy-evaluation';
const SITE_URL = 'https://skip-bo-strategy-analysis.netlify.app';

async function writeParquet(file, schemaFields, rows) {
    const writer = await parquet.ParquetWriter.openFile(new parquet.ParquetSchema(schemaFields), file);
    for (const row of rows) await writer.appendRow(row);
    await writer.close();
}

function datasetCard(runs, games, generatedAt) {
    const strategies = [...new Set(runs.flatMap(r => [r.strategy_p1, r.strategy_p2]))].sort();
    return `---
license: mit
pretty_name: Skip-Bo Strategy Evaluation Runs
tags:
  - skip-bo
  - card-game
  - game-simulation
  - monte-carlo
  - reproducible-research
configs:
  - config_name: default
    data_files:
      - split: runs
        path: runs.parquet
      - split: games
        path: games.parquet
---

# Skip-Bo Strategy Evaluation Runs

Open dataset of seeded, deterministic Skip-Bo simulation runs shared via the
[Skip-Bo Strategy Evaluation](https://skip-bo-strategy-analysis.netlify.app)
web app (source: [${REPO_URL}](${REPO_URL})). Every run is re-simulated from its
seed in CI, so all results are exactly reproducible.

Generated: ${generatedAt} — ${runs.length} run(s), ${games.length} game(s).
Strategies covered: ${strategies.map(s => `\`${s}\``).join(', ')}.

## Load

\`\`\`python
from datasets import load_dataset

ds = load_dataset("<user>/skip-bo-runs")
runs = ds["runs"]    # one row per simulation run (aggregates)
games = ds["games"]  # one row per game
\`\`\`

## Splits

- **runs** (run-level aggregates): \`file\`, \`label\`, \`strategy_p1\`, \`strategy_p2\`,
  \`games_count\`, \`wins_p1\`, \`wins_p2\`, \`ties\`, \`total_turns\`, \`total_jokers\`,
  \`seed\`, \`timestamp\`
- **games** (one row per game): \`run_file\`, \`run_seed\`, \`game_id\`, \`winner\`,
  \`winner_id\` (0/1, null = tie), \`starter\`, \`turns\`, \`duration_ms\`, \`jokers\`,
  \`strategy\`, \`game_seed\`

## Reproducibility

Each run stores a numeric run \`seed\` (mulberry32) and every game a per-game
\`game_seed\`. The JSON source files and the versioned schema live in the source
repository under \`public/data/runs/\` and \`schemas/simulation-run.schema.json\`;
CI validates schema conformance and re-simulates every shared run from its seed.

## License & citation

MIT License. Please cite the software via the repository's \`CITATION.cff\`:

\`\`\`bibtex
@software{strittmatter2026skipbo,
  author = {Strittmatter, Stephan},
  title  = {Skip-Bo Strategy Evaluation},
  year   = {2026},
  url    = {${SITE_URL}/},
  license = {MIT}
}
\`\`\`
`;
}

async function main() {
    const index = JSON.parse(readFileSync(join(runsDir, 'index.json'), 'utf-8'));
    const labelByFile = new Map(index.map(e => [e.file, e.label]));
    const files = readdirSync(runsDir).filter(f => f.endsWith('.json') && f !== 'index.json').sort();
    const inputs = files.map(file => ({
        file,
        raw: JSON.parse(readFileSync(join(runsDir, file), 'utf-8')),
        label: labelByFile.get(file)
    }));
    const { runs, games } = buildDataset(inputs);
    if (runs.length === 0) throw new Error(`no shared runs found in ${runsDir}`);

    mkdirSync(outDir, { recursive: true });
    await writeParquet(join(outDir, 'runs.parquet'), RUNS_SCHEMA_FIELDS, runs);
    await writeParquet(join(outDir, 'games.parquet'), GAMES_SCHEMA_FIELDS, games);
    writeFileSync(join(outDir, 'README.md'), datasetCard(runs, games, new Date().toISOString()));

    console.log(`dataset written to ${outDir}`);
    console.log(`  runs.parquet:  ${runs.length} run(s)`);
    console.log(`  games.parquet: ${games.length} game(s)`);
    console.log('upload with: huggingface-cli upload <user>/skip-bo-runs ./datasets/skip-bo-runs --repo-type dataset');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
