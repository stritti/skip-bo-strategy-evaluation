import { describe, it, expect } from 'vitest';
import { SkipBoGame } from '../game/SkipBoGame';
import type { SimulationApp } from '../game/types';

const silentApp = (): SimulationApp => ({
    logEvent: () => { },
    tempJokersPlayed: 0
});

describe('starting player', () => {
    it('varies across seeds but is reproducible per seed', () => {
        const starters = new Set<string>();
        for (let seed = 1; seed <= 40; seed++) {
            const result = new SkipBoGame(silentApp(), 'Optimiert', 'Zufall', seed).run();
            starters.add(result.starter);
        }
        expect(starters.has('P1')).toBe(true);
        expect(starters.has('P2')).toBe(true);

        const a = new SkipBoGame(silentApp(), 'Zufall', 'Zufall', 7).run();
        const b = new SkipBoGame(silentApp(), 'Zufall', 'Zufall', 7).run();
        expect(a.starter).toBe(b.starter);
    });
});

describe('winnerId', () => {
    it('is consistent with the winner string and reproducible', () => {
        for (let seed = 1; seed <= 20; seed++) {
            const result = new SkipBoGame(silentApp(), 'Optimiert', 'Zufall', seed).run();

            if (result.winner === 'TIE') {
                expect(result.winnerId).toBeNull();
            } else {
                expect([0, 1]).toContain(result.winnerId);
                expect(result.winner.includes(`Spieler ${result.winnerId! + 1}`)).toBe(true);
            }
        }

        const a = new SkipBoGame(silentApp(), 'Zufall', 'Zufall', 99).run();
        const b = new SkipBoGame(silentApp(), 'Zufall', 'Zufall', 99).run();
        expect(a.winnerId).toBe(b.winnerId);
    });
});

describe('result ids', () => {
    it('are sequential across games of the same game instance', () => {
        const game = new SkipBoGame(silentApp(), 'Optimiert', 'Zufall', 5);
        const first = game.run();
        const second = game.run();

        expect(first.id).toBe(1);
        expect(second.id).toBe(2);
    });
});
