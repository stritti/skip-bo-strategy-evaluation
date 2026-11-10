import { describe, it, expect } from 'vitest';
import { SkipBoGame } from '../game/SkipBoGame';
import type { SimulationApp } from '../game/types';

const silentApp = (): SimulationApp => ({
    logEvent: () => { },
    tempJokersPlayed: 0
});

describe('deck composition', () => {
    it('creates a 162-card deck with 12 of each number and 18 jokers', () => {
        const game = new SkipBoGame(silentApp(), 'Optimiert', 'Zufall', 42);
        game.createDeck();

        expect(game.drawPile.length).toBe(162);

        const counts = new Map<number, number>();
        for (const card of game.drawPile) {
            counts.set(card, (counts.get(card) ?? 0) + 1);
        }
        for (let value = 1; value <= 12; value++) {
            expect(counts.get(value)).toBe(12);
        }
        expect(counts.get(0)).toBe(18);
    });

    it('deals 30 stockpile cards per player', () => {
        const game = new SkipBoGame(silentApp(), 'Optimiert', 'Zufall', 42);
        game.deal();

        expect(game.players[0].stockpile.length).toBe(30);
        expect(game.players[1].stockpile.length).toBe(30);
        expect(game.drawPile.length).toBe(162 - 60);
    });
});

describe('findBestMove_Standard', () => {
    it('plays the matching hand card onto the pile that needs it', () => {
        const game = new SkipBoGame(silentApp(), 'Optimiert', 'Zufall', 42);
        game.createDeck();
        game.deal();

        const player = game.players[0];
        game.buildPiles[0] = [];
        player.hand = [1, 5, 8, 10, 12];
        player.stockpile = [99];

        const move = game.findBestMove_Standard(player);
        expect(move).not.toBeNull();
        expect(move?.card).toBe(1);
        expect(move?.source).toBe('hand');
        expect(move?.buildPileIndex).toBe(0);
    });
});

describe('findAllMoves_Advanced', () => {
    it('prioritizes hand over discard for the same card', () => {
        const game = new SkipBoGame(silentApp(), 'Fortgeschritten', 'Zufall', 42);
        game.createDeck();
        game.deal();

        const player = game.players[0];
        game.buildPiles[0] = [1, 2, 3, 4];
        player.hand = [5, 10];
        player.discardPiles[0] = [5];
        player.stockpile = [99];

        const moves = game.findAllMoves_Advanced(player);
        const handMove = moves.find(m => m.source === 'hand' && m.card === 5);
        const discardMove = moves.find(m => m.source === 'discard-0' && m.card === 5);

        expect(handMove).toBeDefined();
        expect(discardMove).toBeDefined();
        expect(handMove!.priority).toBeGreaterThan(discardMove!.priority);
        expect(game.findNextMove(player)?.source).toBe('hand');
    });
});
