/**
 * Skip-Bo Player Class
 */

import { DISCARD_PILE_COUNT } from './constants';

export class Player {
    id: number;
    name: string;
    isAI: boolean;
    stockpile: number[];
    hand: number[];
    discardPiles: number[][];
    jokersPlayed: number;

    constructor(id: number, isAI: boolean) {
        this.id = id;
        this.name = `Spieler ${id + 1}`;
        this.isAI = isAI;
        this.stockpile = [];
        this.hand = [];
        this.discardPiles = Array.from({ length: DISCARD_PILE_COUNT }, () => []);
        this.jokersPlayed = 0;
    }

    /**
     * Gets the top card of the stockpile, or null if empty.
     */
    get topStockpileCard(): number | null {
        return this.stockpile.length > 0 ? this.stockpile[this.stockpile.length - 1] : null;
    }

    /**
     * Returns all playable cards (hand, stockpile, and top of discard piles).
     */
    get playableCards(): number[] {
        const playable = [...this.hand];

        if (this.topStockpileCard !== null) {
            playable.push(this.topStockpileCard);
        }

        this.discardPiles.forEach(pile => {
            if (pile.length > 0) {
                playable.push(pile[pile.length - 1]);
            }
        });

        return playable;
    }
}
