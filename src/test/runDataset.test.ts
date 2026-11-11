import { describe, it, expect } from 'vitest';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import parquet from 'parquetjs-lite';
import { buildDataset, GAMES_SCHEMA_FIELDS, RUNS_SCHEMA_FIELDS, type RunFileInput } from '../services/runDataset';
import type { SharedRunIndexEntry } from '../services/sharedRuns';

const runsDir = fileURLToPath(new URL('../../public/data/runs/', import.meta.url));
const index = JSON.parse(readFileSync(join(runsDir, 'index.json'), 'utf-8')) as SharedRunIndexEntry[];

function loadInputs(): RunFileInput[] {
    const labelByFile = new Map(index.map(e => [e.file, e.label]));
    return readdirSync(runsDir)
        .filter(f => f.endsWith('.json') && f !== 'index.json')
        .sort()
        .map(file => ({
            file,
            raw: JSON.parse(readFileSync(join(runsDir, file), 'utf-8')),
            label: labelByFile.get(file)
        }));
}

describe('run dataset export (parquet rows)', () => {
    const { runs, games } = buildDataset(loadInputs());

    it('has one run row per shared run file', () => {
        expect(runs.length).toBe(index.length);
        expect(runs.map(r => r.file)).toEqual(index.map(e => e.file));
    });

    it('run rows match the aggregates in index.json', () => {
        for (const row of runs) {
            const entry = index.find(e => e.file === row.file);
            expect(entry).toBeDefined();
            expect(row.games_count).toBe(entry!.gamesCount);
            expect(row.wins_p1).toBe(entry!.winsP1);
            expect(row.wins_p2).toBe(entry!.winsP2);
            expect(row.ties).toBe(entry!.ties);
            expect(row.total_turns).toBe(entry!.totalTurns);
            expect(row.total_jokers).toBe(entry!.totalJokers);
            expect(row.seed).toBe(entry!.seed);
            expect(row.label).toBe(entry!.label ?? null);
        }
    });

    it('game rows add up to the run aggregates', () => {
        expect(games.length).toBe(runs.reduce((s, r) => s + r.games_count, 0));
        for (const row of runs) {
            const g = games.filter(x => x.run_file === row.file);
            expect(g.length).toBe(row.games_count);
            expect(g.filter(x => x.winner_id === 0).length).toBe(row.wins_p1);
            expect(g.filter(x => x.winner_id === 1).length).toBe(row.wins_p2);
            expect(g.filter(x => x.winner_id === null).length).toBe(row.ties);
            expect(g.reduce((s, x) => s + x.turns, 0)).toBe(row.total_turns);
            expect(g.reduce((s, x) => s + x.jokers, 0)).toBe(row.total_jokers);
        }
    });

    it('every game row carries its per-game seed and run seed', () => {
        for (const g of games) {
            expect(Number.isInteger(g.game_seed)).toBe(true);
            expect(Number.isInteger(g.run_seed)).toBe(true);
        }
    });

    it('parquet round-trip preserves runs and games rows', async () => {
        const dir = mkdtempSync(join(tmpdir(), 'skipbo-dataset-'));
        try {
            const keysOf = (fields: Record<string, unknown>) => Object.keys(fields);
            const normalize = (x: Record<string, unknown>, keys: string[]) =>
                Object.fromEntries(keys.map(k => [k, k in x && typeof x[k] === 'bigint' ? Number(x[k]) : (x[k] ?? null)]));
            for (const [name, fields, rows] of [
                ['runs.parquet', RUNS_SCHEMA_FIELDS, runs],
                ['games.parquet', GAMES_SCHEMA_FIELDS, games]
            ] as const) {
                const file = join(dir, name);
                const writer = await parquet.ParquetWriter.openFile(new parquet.ParquetSchema(fields), file);
                for (const row of rows) await writer.appendRow(row as never);
                await writer.close();
                const reader = await parquet.ParquetReader.openFile(file);
                const cursor = reader.getCursor();
                const back: Record<string, unknown>[] = [];
                let r: Record<string, unknown> | undefined;
                while ((r = await cursor.next())) back.push(r);
                await reader.close();
                expect(back.map(r => normalize(r, keysOf(fields)))).toEqual(rows);
            }
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });
});
