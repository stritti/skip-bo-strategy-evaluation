/**
 * Flattens shared simulation runs (public/data/runs/) into flat dataset rows
 * for the Hugging Face dataset export (scripts/export-runs-parquet.mjs).
 * Pure mapping logic only — file IO lives in the script / tests.
 */
import { normalizeSharedRun, type SharedRunIndexEntry } from './sharedRuns.ts';

export interface RunRow {
    file: string;
    label: string | null;
    strategy_p1: string;
    strategy_p2: string;
    games_count: number;
    wins_p1: number;
    wins_p2: number;
    ties: number;
    total_turns: number;
    total_jokers: number;
    seed: number | null;
    timestamp: number;
}

export interface GameRow {
    run_file: string;
    run_seed: number | null;
    game_id: number;
    winner: string;
    winner_id: number | null;
    starter: string;
    turns: number;
    duration_ms: number;
    jokers: number;
    strategy: string;
    game_seed: number;
}

export interface RunDataset {
    runs: RunRow[];
    games: GameRow[];
}

export interface RunFileInput {
    file: string;
    raw: unknown;
    label?: string;
}

export const RUNS_SCHEMA_FIELDS = {
    file: { type: 'UTF8' },
    label: { type: 'UTF8', optional: true },
    strategy_p1: { type: 'UTF8' },
    strategy_p2: { type: 'UTF8' },
    games_count: { type: 'INT32' },
    wins_p1: { type: 'INT32' },
    wins_p2: { type: 'INT32' },
    ties: { type: 'INT32' },
    total_turns: { type: 'INT64' },
    total_jokers: { type: 'INT64' },
    seed: { type: 'INT64', optional: true },
    timestamp: { type: 'INT64' }
} as const;

export const GAMES_SCHEMA_FIELDS = {
    run_file: { type: 'UTF8' },
    run_seed: { type: 'INT64', optional: true },
    game_id: { type: 'INT32' },
    winner: { type: 'UTF8' },
    winner_id: { type: 'INT32', optional: true },
    starter: { type: 'UTF8' },
    turns: { type: 'INT32' },
    duration_ms: { type: 'INT32' },
    jokers: { type: 'INT32' },
    strategy: { type: 'UTF8' },
    game_seed: { type: 'INT64' }
} as const;

export function buildDataset(inputs: RunFileInput[]): RunDataset {
    const runs: RunRow[] = [];
    const games: GameRow[] = [];
    for (const input of inputs) {
        const entry: SharedRunIndexEntry = { file: input.file, label: input.label };
        const run = normalizeSharedRun(input.raw, entry);
        if (!run) throw new Error(`cannot normalize ${input.file}`);
        runs.push({
            file: input.file,
            label: input.label ?? null,
            strategy_p1: run.strategyP1,
            strategy_p2: run.strategyP2,
            games_count: run.gamesCount,
            wins_p1: run.winsP1,
            wins_p2: run.winsP2,
            ties: run.ties ?? 0,
            total_turns: run.totalTurns,
            total_jokers: run.totalJokers,
            seed: run.seed ?? null,
            timestamp: run.timestamp
        });
        for (const g of run.results) {
            games.push({
                run_file: input.file,
                run_seed: run.seed ?? null,
                game_id: g.id,
                winner: g.winner,
                winner_id: g.winnerId ?? null,
                starter: g.starter,
                turns: g.turns,
                duration_ms: g.duration,
                jokers: g.jokers,
                strategy: g.strategy,
                game_seed: g.seed
            });
        }
    }
    return { runs, games };
}
