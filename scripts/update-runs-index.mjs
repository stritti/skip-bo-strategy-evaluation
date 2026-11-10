/**
 * Regenerates public/data/runs/index.json with precomputed aggregates per run,
 * so the app can render the shared-run history without downloading full run files.
 *
 * Usage: npm run runs:index
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { normalizeSharedRun } from '../src/services/sharedRuns.ts';

const runsDir = fileURLToPath(new URL('../public/data/runs/', import.meta.url));
const indexPath = join(runsDir, 'index.json');

const previous = JSON.parse(readFileSync(indexPath, 'utf-8'));
const previousByFile = new Map(previous.map(e => [e.file, e]));

const files = readdirSync(runsDir).filter(f => f.endsWith('.json') && f !== 'index.json').sort();

const entries = files.map(file => {
    const run = normalizeSharedRun(JSON.parse(readFileSync(join(runsDir, file), 'utf-8')), { file });
    if (!run) throw new Error(`cannot normalize ${file}`);
    const old = previousByFile.get(file) ?? {};
    return {
        file,
        label: old.label ?? file,
        strategyP1: run.strategyP1,
        strategyP2: run.strategyP2,
        gamesCount: run.gamesCount,
        winsP1: run.winsP1,
        winsP2: run.winsP2,
        ties: run.ties ?? 0,
        totalTurns: run.totalTurns,
        totalJokers: run.totalJokers,
        seed: run.seed,
        timestamp: run.timestamp
    };
});

writeFileSync(indexPath, JSON.stringify(entries, null, 2) + '\n');
console.log(`index.json updated: ${entries.length} run(s)`);
for (const e of entries) {
    console.log(`  ${e.file}: N=${e.gamesCount} wins=${e.winsP1}/${e.winsP2} ties=${e.ties} seed=${e.seed}`);
}
