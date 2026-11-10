import { describe, it, expect } from 'vitest';
import { SkipBoGame } from '../game/SkipBoGame';
import { mulberry32, shuffle } from '../game/utils';
import type { SimulationApp, GameResult } from '../game/types';

const silentApp = (): SimulationApp => ({
    logEvent: () => { },
    tempJokersPlayed: 0
});

const withoutDuration = ({ duration, ...rest }: GameResult) => rest;

describe('mulberry32', () => {
    it('produces values in [0, 1) and is deterministic per seed', () => {
        const seqA1 = Array.from({ length: 100 }, () => mulberry32(123)());
        const seqA2 = Array.from({ length: 100 }, () => mulberry32(123)());
        const seqB = Array.from({ length: 100 }, () => mulberry32(124)());

        expect(seqA1).toEqual(seqA2);
        expect(seqA1).not.toEqual(seqB);
        for (const value of seqA1) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });
});

describe('shuffle', () => {
    it('is deterministic with a seeded rng and keeps all elements', () => {
        const arr = Array.from({ length: 162 }, (_, i) => i);
        const a = shuffle([...arr], mulberry32(7));
        const b = shuffle([...arr], mulberry32(7));

        expect(a).toEqual(b);
        expect([...a].sort((x, y) => x - y)).toEqual(arr);
    });
});

describe('SkipBoGame reproducibility', () => {
    it('produces identical results for the same seed', () => {
        const run = (seed: number) =>
            new SkipBoGame(silentApp(), 'Zufall', 'Zufall', seed).run();

        const r1 = run(20240613);
        const r2 = run(20240613);

        expect(withoutDuration(r1)).toEqual(withoutDuration(r2));
        expect(r1.seed).toBe(20240613);
    });

    it('generates a seed automatically when none is given', () => {
        const game = new SkipBoGame(silentApp());
        const result = game.run();

        expect(result.seed).toBe(game.seed);
        expect(Number.isInteger(result.seed)).toBe(true);
    });

    it('completes games within the turn limit across many seeds', () => {
        for (let seed = 1; seed <= 20; seed++) {
            const result = new SkipBoGame(silentApp(), 'Optimiert', 'Zufall', seed).run();
            expect(result.turns).toBeGreaterThan(0);
            expect(result.turns).toBeLessThanOrEqual(1000);
            expect(result.winner).not.toBe('');
        }
    });
});
