import { describe, it, expect } from 'vitest';
import { normalizeSharedRun } from '../services/sharedRuns';
import type { GameResult } from '../game/types';

const result = (winnerId: number | null): GameResult => ({
    id: 1,
    winner: winnerId === null ? 'TIE' : `Spieler ${winnerId! + 1}`,
    winnerId,
    turns: 100,
    duration: 5,
    starter: 'P1',
    jokers: 3,
    strategy: 'Optimiert',
    seed: 42
});

describe('normalizeSharedRun', () => {
    it('passes through a plain SimulationRun and marks it shared', () => {
        const run = {
            timestamp: 1000,
            gamesCount: 2,
            winsP1: 1,
            winsP2: 1,
            ties: 0,
            strategyP1: 'Optimiert',
            strategyP2: 'Zufall',
            totalTurns: 200,
            totalJokers: 6,
            seed: 42,
            results: [result(0), result(1)]
        };
        const normalized = normalizeSharedRun(run);
        expect(normalized).not.toBeNull();
        expect(normalized!.shared).toBe(true);
        expect(normalized!.gamesCount).toBe(2);
        expect(normalized!.seed).toBe(42);
    });

    it('converts a dashboard JSON export ({ metadata, results }) into a run', () => {
        const exportShape = {
            metadata: {
                exportDate: '2026-11-10T13:00:00.000Z',
                totalGames: 3,
                strategyP1: 'Optimiert',
                strategyP2: 'Zufall',
                seed: 20260613
            },
            results: [result(0), result(1), result(null)]
        };
        const normalized = normalizeSharedRun(exportShape);
        expect(normalized).not.toBeNull();
        expect(normalized!.shared).toBe(true);
        expect(normalized!.gamesCount).toBe(3);
        expect(normalized!.winsP1).toBe(1);
        expect(normalized!.winsP2).toBe(1);
        expect(normalized!.ties).toBe(1);
        expect(normalized!.totalTurns).toBe(300);
        expect(normalized!.totalJokers).toBe(9);
        expect(normalized!.strategyP1).toBe('Optimiert');
        expect(normalized!.seed).toBe(20260613);
        expect(normalized!.timestamp).toBe(Date.parse('2026-11-10T13:00:00.000Z'));
    });

    it('falls back to index metadata when export metadata is missing', () => {
        const normalized = normalizeSharedRun(
            { results: [result(0)] },
            { file: 'x.json', gamesCount: 1, seed: 7, timestamp: 555 }
        );
        expect(normalized!.seed).toBe(7);
        expect(normalized!.timestamp).toBe(555);
        expect(normalized!.gamesCount).toBe(1);
    });

    it('returns null for unusable files', () => {
        expect(normalizeSharedRun(null)).toBeNull();
        expect(normalizeSharedRun({ foo: 'bar' })).toBeNull();
        expect(normalizeSharedRun('nope')).toBeNull();
    });
});
