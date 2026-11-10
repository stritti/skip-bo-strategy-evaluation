/**
 * Normalization for shared simulation runs committed to public/data/runs/.
 */

import type { GameResult } from '../game/types';
import type { SimulationRun } from './dbService';

export interface SharedRunIndexEntry {
    file: string;
    label?: string;
    strategyP1?: string;
    strategyP2?: string;
    gamesCount?: number;
    winsP1?: number;
    winsP2?: number;
    ties?: number;
    totalTurns?: number;
    totalJokers?: number;
    seed?: number;
    timestamp?: number;
}

/**
 * Builds a summary-only SimulationRun from an index entry (no results payload).
 * Used for the history list; full results are fetched lazily via the file name.
 */
export function entryToSummaryRun(entry: SharedRunIndexEntry): SimulationRun {
    return {
        file: entry.file,
        shared: true,
        version: 1,
        timestamp: entry.timestamp ?? 0,
        gamesCount: entry.gamesCount ?? 0,
        winsP1: entry.winsP1 ?? 0,
        winsP2: entry.winsP2 ?? 0,
        ties: entry.ties ?? 0,
        strategyP1: entry.strategyP1 ?? '',
        strategyP2: entry.strategyP2 ?? '',
        totalTurns: entry.totalTurns ?? 0,
        totalJokers: entry.totalJokers ?? 0,
        seed: entry.seed,
        results: []
    };
}

/**
 * Normalizes a shared run file into a SimulationRun. Accepts both the plain
 * SimulationRun shape and the dashboard JSON export shape ({ metadata, results }).
 */
export function normalizeSharedRun(raw: unknown, entry?: SharedRunIndexEntry): SimulationRun | null {
    const r = raw as Record<string, unknown> | null;
    if (!r || !Array.isArray(r.results)) return null;
    const results = r.results as GameResult[];

    if (typeof r.gamesCount === 'number') {
        return { ...(r as unknown as SimulationRun), results, shared: true };
    }

    // Dashboard export shape: { metadata: {...}, results: [...] }
    const meta = (r.metadata ?? {}) as Record<string, unknown>;
    const winsP1 = results.filter(x => x.winnerId === 0).length;
    const winsP2 = results.filter(x => x.winnerId === 1).length;
    const ties = results.length - winsP1 - winsP2;
    const timestamp = typeof meta.exportDate === 'string' && !Number.isNaN(Date.parse(meta.exportDate))
        ? Date.parse(meta.exportDate)
        : (entry?.timestamp ?? Date.now());

    return {
        timestamp,
        gamesCount: results.length || entry?.gamesCount || 0,
        winsP1,
        winsP2,
        ties,
        strategyP1: String(meta.strategyP1 ?? ''),
        strategyP2: String(meta.strategyP2 ?? ''),
        totalTurns: results.reduce((s, x) => s + (x.turns ?? 0), 0),
        totalJokers: results.reduce((s, x) => s + (x.jokers ?? 0), 0),
        seed: typeof meta.seed === 'number' ? meta.seed : entry?.seed,
        results,
        shared: true
    };
}
