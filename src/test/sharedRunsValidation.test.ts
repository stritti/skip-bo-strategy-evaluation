import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../schemas/simulation-run.schema.json';
import { SkipBoGame } from '../game/SkipBoGame';
import type { GameResult, SimulationApp, Strategy } from '../game/types';
import { normalizeSharedRun, type SharedRunIndexEntry } from '../services/sharedRuns';

const runsDir = fileURLToPath(new URL('../../public/data/runs/', import.meta.url));
const MAX_RUN_FILE_BYTES = 500_000;

const silentApp = (): SimulationApp => ({
    logEvent: () => { },
    tempJokersPlayed: 0
});

const ajv = new Ajv2020({ strict: false, allErrors: true });
const validate = ajv.compile(schema);

const index = JSON.parse(readFileSync(join(runsDir, 'index.json'), 'utf-8')) as SharedRunIndexEntry[];

const withoutDuration = ({ duration, ...rest }: GameResult) => rest;

describe('shared runs (public/data/runs) – schema, size, reproducibility', () => {
    it('index.json lists at least one run', () => {
        expect(Array.isArray(index)).toBe(true);
        expect(index.length).toBeGreaterThan(0);
    });

    it('every run file in the directory is listed in index.json', () => {
        const files = readdirSync(runsDir).filter(f => f.endsWith('.json') && f !== 'index.json');
        for (const file of files) {
            expect(index.some(e => e.file === file), `orphan run file not in index.json: ${file}`).toBe(true);
        }
    });

    for (const entry of index) {
        describe(`run ${entry.file}`, () => {
            const filePath = join(runsDir, entry.file);
            const data = JSON.parse(readFileSync(filePath, 'utf-8'));

            it('stays within the size limit', () => {
                expect(statSync(filePath).size).toBeLessThanOrEqual(MAX_RUN_FILE_BYTES);
            });

            it('matches schemas/simulation-run.schema.json', () => {
                const valid = validate(data);
                expect(valid, JSON.stringify(validate.errors ?? null)).toBe(true);
            });

            it('index entry is consistent with the run file', () => {
                const run = normalizeSharedRun(data, entry);
                expect(run).not.toBeNull();
                if (entry.gamesCount !== undefined) expect(run!.gamesCount).toBe(entry.gamesCount);
                if (entry.seed !== undefined) expect(run!.seed).toBe(entry.seed);
            });

            it('index entry aggregates match the run file (npm run runs:index)', () => {
                const run = normalizeSharedRun(data, entry);
                expect(run).not.toBeNull();
                expect(entry.strategyP1).toBe(run!.strategyP1);
                expect(entry.strategyP2).toBe(run!.strategyP2);
                expect(entry.winsP1).toBe(run!.winsP1);
                expect(entry.winsP2).toBe(run!.winsP2);
                expect(entry.ties).toBe(run!.ties ?? 0);
                expect(entry.totalTurns).toBe(run!.totalTurns);
                expect(entry.totalJokers).toBe(run!.totalJokers);
                expect(entry.timestamp).toBe(run!.timestamp);
            });

            it('is reproducible: re-simulation with the recorded seed matches the stored run', { timeout: 60000 }, () => {
                const run = normalizeSharedRun(data, entry);
                expect(run).not.toBeNull();
                expect(run!.seed).not.toBeNull();
                expect(run!.results.length).toBe(run!.gamesCount);

                const game = new SkipBoGame(
                    silentApp(),
                    run!.strategyP1 as Strategy,
                    run!.strategyP2 as Strategy,
                    run!.seed!
                );
                const replayed: GameResult[] = [];
                for (let i = 0; i < run!.gamesCount; i++) replayed.push(game.run());

                const winsP1 = replayed.filter(r => r.winnerId === 0).length;
                const winsP2 = replayed.filter(r => r.winnerId === 1).length;
                const ties = replayed.length - winsP1 - winsP2;

                expect({
                    gamesCount: replayed.length,
                    winsP1,
                    winsP2,
                    ties,
                    totalTurns: replayed.reduce((s, r) => s + r.turns, 0),
                    totalJokers: replayed.reduce((s, r) => s + r.jokers, 0)
                }).toEqual({
                    gamesCount: run!.gamesCount,
                    winsP1: run!.winsP1,
                    winsP2: run!.winsP2,
                    ties: run!.ties ?? 0,
                    totalTurns: run!.totalTurns,
                    totalJokers: run!.totalJokers
                });

                expect(replayed.map(withoutDuration)).toEqual(run!.results.map(withoutDuration));
            });
        });
    }
});
