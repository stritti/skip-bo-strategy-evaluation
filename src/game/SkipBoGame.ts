/**
 * Skip-Bo Core Game Simulation Logic
 */

import { Player } from './Player';
import { shuffle } from './utils';
import {
    JOKER_VALUE,
    STOCKPILE_SIZE,
    BUILD_PILE_COUNT,
    DISCARD_PILE_COUNT,
    HAND_SIZE,
    MAX_TURNS_LIMIT
} from './constants';
import type { SimulationApp, GameResult, Strategy, MoveOption } from './types';

export class SkipBoGame {
    app: SimulationApp;
    players: Player[];
    drawPile: number[];
    discardPile: number[];
    buildPiles: number[][];
    currentPlayerIndex: number;
    turnCount: number;
    winner: Player | null;

    constructor(app: SimulationApp, strategyP1: Strategy = 'Optimiert', strategyP2: Strategy = 'Zufall') {
        this.app = app;
        this.players = [new Player(0, strategyP1), new Player(1, strategyP2)];
        this.drawPile = [];
        this.discardPile = [];
        this.buildPiles = Array.from({ length: BUILD_PILE_COUNT }, () => []);
        this.currentPlayerIndex = 0;
        this.turnCount = 0;
        this.winner = null;
    }

    /**
     * Creates the standard 162-card deck and shuffles it.
     */
    createDeck(): void {
        const cards: number[] = [];

        // 144 Numbered Cards (12 sets of 1-12)
        for (let i = 0; i < 12; i++) {
            for (let j = 1; j <= 12; j++) {
                cards.push(j);
            }
        }

        // 18 Skip-Bo Cards (Jokers)
        for (let i = 0; i < 18; i++) {
            cards.push(JOKER_VALUE);
        }

        this.drawPile = shuffle(cards);
    }

    /**
     * Deals the cards to players.
     */
    deal(): void {
        this.createDeck(); // Ensure deck is fresh
        this.players.forEach(player => {
            player.stockpile = this.drawPile.splice(0, STOCKPILE_SIZE);
            player.hand = [];
            player.jokersPlayed = 0;
            player.discardPiles = Array.from({ length: DISCARD_PILE_COUNT }, () => []);
        });
        this.buildPiles = Array.from({ length: BUILD_PILE_COUNT }, () => []);
        this.currentPlayerIndex = 0;
        this.turnCount = 0;
        this.winner = null;
        this.app.tempJokersPlayed = 0;
    }

    /**
     * Reconstitutes the draw pile from the discard pile and shuffles it.
     */
    refillDrawPile(): void {
        if (this.drawPile.length === 0) {
            this.drawPile = shuffle(this.discardPile);
            this.discardPile = [];
            this.app.logEvent('INFO', 'Ziehstapel wurde aus Ablagestapel neu gebildet.');
        }
    }

    /**
     * Draws cards for the current player up to HAND_SIZE.
     */
    drawCards(player: Player): void {
        const needed = HAND_SIZE - player.hand.length;
        for (let i = 0; i < needed; i++) {
            if (this.drawPile.length === 0) {
                this.refillDrawPile();
            }
            if (this.drawPile.length > 0) {
                player.hand.push(this.drawPile.pop()!);
            } else {
                break; // No cards left anywhere
            }
        }
    }

    /**
     * Attempts to play a card to a build pile.
     * @param cardValue - The value of the card (1-12 or 0/Joker).
     * @param pileIndex - Index of the build pile (0-3).
     * @returns True if the card was successfully played.
     */
    playCardToBuildPile(cardValue: number, pileIndex: number): boolean {
        const currentPileTop = this.buildPiles[pileIndex].length > 0
            ? this.buildPiles[pileIndex][this.buildPiles[pileIndex].length - 1]
            : 0;
        const requiredValue = currentPileTop + 1;

        if (cardValue === JOKER_VALUE || cardValue === requiredValue) {
            // Determine the actual value used for the pile
            const finalValue = cardValue === JOKER_VALUE ? requiredValue : cardValue;

            this.buildPiles[pileIndex].push(finalValue);

            if (cardValue === JOKER_VALUE) this.app.tempJokersPlayed++;

            // Check for completion (12 played)
            if (finalValue === 12) {
                this.discardPile.push(...this.buildPiles[pileIndex]);
                this.buildPiles[pileIndex] = [];
                this.app.logEvent('SUCCESS', `Bau-Stapel ${pileIndex + 1} beendet!`);
            }
            return true;
        }
        return false;
    }

    /**
     * Tries to play a specific card type from a specific location.
     * @param player - Current player
     * @param source - 'hand', 'stockpile', or 'discard-[index]'
     * @param cardValue - The value of the card to play.
     * @param targetPileIndex - Optional: force play on specific pile. If not set, tries all.
     * @returns True if a play was made.
     */
    makePlay(player: Player, source: string, cardValue: number, targetPileIndex: number = -1): boolean {
        // Define which piles to try
        let pilesToTry: number[] = [];
        if (targetPileIndex !== -1) {
            pilesToTry = [targetPileIndex];
        } else {
            // Try all 0..3
            pilesToTry = [0, 1, 2, 3];
        }

        for (const i of pilesToTry) {
            if (this.playCardToBuildPile(cardValue, i)) {
                // Remove card from source
                if (source === 'stockpile') {
                    player.stockpile.pop();
                    this.app.logEvent('INFO', `${player.name}: Spielerstapel (${player.stockpile.length}) auf Bau-Stapel ${i + 1} gespielt.`);
                    if (player.stockpile.length === 0) {
                        this.app.logEvent('SUCCESS', `${player.name} hat seinen Spielerstapel geleert!`);
                        this.winner = player;
                    }
                } else if (source.startsWith('discard-')) {
                    const pileIndex = parseInt(source.split('-')[1]);
                    player.discardPiles[pileIndex].pop();
                    this.app.logEvent('INFO', `${player.name}: Ablage-Stapel ${pileIndex + 1} auf Bau-Stapel ${i + 1} gespielt.`);
                } else if (source === 'hand') {
                    const index = player.hand.indexOf(cardValue);
                    if (index !== -1) {
                        player.hand.splice(index, 1);
                        this.app.logEvent('INFO', `${player.name}: Handkarte ${cardValue} auf Bau-Stapel ${i + 1} gespielt.`);
                    } else if (cardValue === JOKER_VALUE) {
                        // Find and remove the Joker
                        const jokerIndex = player.hand.indexOf(JOKER_VALUE);
                        if (jokerIndex !== -1) {
                            player.hand.splice(jokerIndex, 1);
                            this.app.logEvent('INFO', `${player.name}: Joker von Hand auf Bau-Stapel ${i + 1} gespielt.`);
                        }
                    }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the required next value for a build pile.
     * @param pileIndex - Index of the build pile (0-3)
     * @returns The next required card value (1-12), or 13 if pile is complete
     */
    getBuildPileRequiredValue(pileIndex: number): number {
        const pile = this.buildPiles[pileIndex];
        return pile.length > 0 ? pile[pile.length - 1] + 1 : 1;
    }

    // --- Strategy: Advanced (Fortgeschritten) ---

    findAllMoves_Advanced(player: Player): MoveOption[] {
        const moves: MoveOption[] = [];

        // Check all 4 build piles
        for (let buildPileIdx = 0; buildPileIdx < BUILD_PILE_COUNT; buildPileIdx++) {
            const required = this.getBuildPileRequiredValue(buildPileIdx);
            if (required > 12) continue;

            // Priority 3: Stockpile
            const topStock = player.topStockpileCard;
            if (topStock !== null && (topStock === required || topStock === JOKER_VALUE)) {
                moves.push({
                    source: 'stockpile',
                    card: topStock,
                    buildPileIndex: buildPileIdx,
                    priority: 3
                });
            }

            // Priority 2: Hand cards
            player.hand.forEach(handCard => {
                if (handCard === required || handCard === JOKER_VALUE) {
                    moves.push({
                        source: 'hand',
                        card: handCard,
                        buildPileIndex: buildPileIdx,
                        priority: 2
                    });
                }
            });

            // Priority 1: Discard piles (top card only)
            player.discardPiles.forEach((pile, pileIdx) => {
                if (pile.length > 0) {
                    const topCard = pile[pile.length - 1];
                    if (topCard === required || topCard === JOKER_VALUE) {
                        moves.push({
                            source: `discard-${pileIdx}`,
                            card: topCard,
                            buildPileIndex: buildPileIdx,
                            priority: 1
                        });
                    }
                }
            });
        }

        // Sort by priority (3 > 2 > 1), then by card value
        moves.sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            // Within same priority, prefer non-jokers first, then lower values
            if (a.card === JOKER_VALUE && b.card !== JOKER_VALUE) return 1;
            if (b.card === JOKER_VALUE && a.card !== JOKER_VALUE) return -1;
            return a.card - b.card;
        });

        return moves;
    }

    findDiscard_Advanced(player: Player): MoveOption | null {
        if (player.hand.length === 0) return null;

        // Card Selection Strategy:
        // 1. Never discard Wild Cards if possible
        // 2. Avoid discarding low cards (1-3)
        // 3. Prefer discarding high cards (10-12)
        // 4. Never discard stockpile match

        const topStockpile = player.topStockpileCard;
        const nonJokers = player.hand.filter(c => c !== JOKER_VALUE);

        let cardToDiscard: number;

        if (nonJokers.length > 0) {
            const scoredCards = nonJokers.map(card => {
                let score = 0;
                if (card >= 10) score += 50;
                else if (card >= 7) score += 20;
                else if (card <= 3) score -= 30;
                if (card === topStockpile) score -= 100;
                return { card, score };
            });

            scoredCards.sort((a, b) => b.score - a.score);
            cardToDiscard = scoredCards[0].card;
        } else {
            cardToDiscard = JOKER_VALUE;
        }

        // Pile Selection: Highest current top card value (but < 12)
        let bestPileIndex = 0;
        let highestValue = -1;

        player.discardPiles.forEach((pile, idx) => {
            const topValue = pile.length > 0 ? pile[pile.length - 1] : 0;
            if (topValue < 12 && topValue > highestValue) {
                highestValue = topValue;
                bestPileIndex = idx;
            }
        });

        if (highestValue === -1) {
            for (let i = 0; i < player.discardPiles.length; i++) {
                if (player.discardPiles[i].length === 0) {
                    bestPileIndex = i;
                    break;
                }
            }
        }

        return {
            source: 'hand',
            card: cardToDiscard,
            buildPileIndex: bestPileIndex, // Used as Discard Pile Index here
            priority: 0
        };
    }


    // --- Strategy: Standard (Optimiert, Spontan, Zufall) ---

    findBestMove_Standard(player: Player): MoveOption | null {
        // Determine the next required card values for each build pile
        const requiredValues = this.buildPiles.map(p => p.length > 0 ? p[p.length - 1] + 1 : 1);

        // --- 1. Prioritize Stockpile Card ---
        const topStockpile = player.topStockpileCard;
        if (topStockpile !== null) {
            // Find a pile that needs this
            for (let i = 0; i < BUILD_PILE_COUNT; i++) {
                const req = requiredValues[i];
                if (req > 12) continue;
                if (topStockpile === req || topStockpile === JOKER_VALUE) {
                    return {
                        source: 'stockpile',
                        card: topStockpile,
                        buildPileIndex: i,
                        priority: 999
                    };
                }
            }
        }

        // --- 2. Play from Hand or Discard Piles ---
        const candidates: MoveOption[] = [];

        // Check Hand
        player.hand.filter(c => c !== JOKER_VALUE).forEach(card => {
            requiredValues.forEach((req, pileIdx) => {
                if (req > 12) return;
                if (card === req) {
                    let priority = 10;
                    if (player.strategy === 'Optimiert') priority = card * 10 - req;
                    else if (player.strategy === 'Spontan') priority = 100;
                    else priority = 1;
                    candidates.push({ source: 'hand', card, buildPileIndex: pileIdx, priority });
                }
            });
        });

        // Check Discard
        player.discardPiles.forEach((pile, pileIdx) => {
            const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
            if (topCard !== null && topCard !== JOKER_VALUE) {
                requiredValues.forEach((req, buildIdx) => {
                    if (req > 12) return;
                    if (topCard === req) {
                        let priority = 5;
                        if (player.strategy === 'Optimiert') priority = 1000 + topCard;
                        else if (player.strategy === 'Spontan') priority = 50;
                        else priority = 1;

                        candidates.push({
                            source: `discard-${pileIdx}`,
                            card: topCard,
                            buildPileIndex: buildIdx,
                            priority
                        });
                    }
                });
            }
        });

        // Check Jokers (Hand)
        if (player.hand.includes(JOKER_VALUE)) {
            requiredValues.forEach((req, pileIdx) => {
                if (req > 12) return;
                const isStrategic = req === 12 || req === player.topStockpileCard;
                let priority = 0;
                if (player.strategy === 'Optimiert') {
                    if (isStrategic) priority = 5000 + req;
                } else if (player.strategy === 'Spontan') priority = 200;
                else priority = 1;

                if (priority > 0) {
                    candidates.push({ source: 'hand', card: JOKER_VALUE, buildPileIndex: pileIdx, priority });
                }
            });
        }

        // Stockpile Joker (Optimized Logic special case)
        if (topStockpile === JOKER_VALUE && player.strategy === 'Optimiert') {
            requiredValues.forEach((req, pileIdx) => {
                if (req <= 12) {
                    candidates.push({ source: 'stockpile', card: JOKER_VALUE, buildPileIndex: pileIdx, priority: 9999 + req });
                }
            });
        }


        if (candidates.length === 0) return null;

        // Select Best
        if (player.strategy === 'Optimiert') {
            return candidates.sort((a, b) => b.priority - a.priority)[0];
        } else if (player.strategy === 'Spontan') {
            // Greedy/First found
            // In original code: "Hand then Discard then Joker".
            // Here candidates is mixed.
            // Spontan: Hand (100) > Discard (50) > Joker (200). 
            // Wait, Joker was 200?
            // "Spontan uses Jokers freely if movable" priority=200.
            // Hand normal=100.
            // So Spontan will prioritize Jokers! That matches "greedy".
            // However, list sort is stable? No.
            // Let's sort to be safe.
            return candidates.sort((a, b) => b.priority - a.priority)[0];
        } else {
            // Random
            return candidates[Math.floor(Math.random() * candidates.length)];
        }
    }


    findDiscard_Standard(player: Player): MoveOption | null {
        if (player.hand.length === 0) return null;

        let discardCard: number;
        let discardPileIndex: number;

        if (player.strategy === 'Optimiert') {
            const nonJokers = player.hand.filter(c => c !== JOKER_VALUE).sort((a, b) => b - a);
            const cardToDiscard = nonJokers.length > 0 ? nonJokers[0] : JOKER_VALUE;
            discardCard = cardToDiscard;

            discardPileIndex = 0;
            let minTopCard = Infinity;
            player.discardPiles.forEach((pile, index) => {
                const topCard = pile.length > 0 ? pile[pile.length - 1] : 0;
                if (topCard < minTopCard) {
                    minTopCard = topCard;
                    discardPileIndex = index;
                }
            });

        } else if (player.strategy === 'Spontan') {
            discardCard = player.hand[0]; // First card
            discardPileIndex = Math.floor(Math.random() * DISCARD_PILE_COUNT);
        } else {
            // Random
            const randIdx = Math.floor(Math.random() * player.hand.length);
            discardCard = player.hand[randIdx];
            discardPileIndex = Math.floor(Math.random() * DISCARD_PILE_COUNT);
        }

        return {
            source: 'hand',
            card: discardCard,
            buildPileIndex: discardPileIndex, // Target Discard Pile
            priority: 0
        };
    }

    // --- Main Game Loop Support ---

    /**
     * Finds the next move for the player based on their strategy.
     */
    findNextMove(player: Player): MoveOption | null {
        if (player.strategy === 'Fortgeschritten') {
            const moves = this.findAllMoves_Advanced(player);
            return moves.length > 0 ? moves[0] : null;
        } else {
            return this.findBestMove_Standard(player);
        }
    }

    /**
     * Executes the player's turn fully (for simulation).
     */
    playerTurn(player: Player): void {
        this.drawCards(player);

        let move = this.findNextMove(player);

        while (move && this.winner === null) {
            // Execute move
            // Determine handling of target pile
            // Standard strategy might return a move without strong pile preference but here we assign one.
            // Advanced ensures pile index.
            // makePlay tries all if target is -1, but we should use the one found.

            const success = this.makePlay(player, move.source, move.card, move.buildPileIndex);

            if (success) {
                if (player.stockpile.length === 0) return; // Winner handling in makePlay
                move = this.findNextMove(player); // Look for next move
            } else {
                break; // Should not happen if logic is correct
            }
        }

        if (this.winner === null) {
            let discardMove;
            if (player.strategy === 'Fortgeschritten') {
                discardMove = this.findDiscard_Advanced(player);
            } else {
                discardMove = this.findDiscard_Standard(player);
            }

            if (discardMove) {
                // DISCARD LOGIC:
                // The 'MoveOption' returned has 'buildPileIndex' acting as 'discardPileIndex'
                // But wait, makePlay cannot do Discard. We need strict discard logic here.
                // Actually discard IS NOT makePlay.
                // Let's implement discard execution here.

                const cardIndex = player.hand.indexOf(discardMove.card);
                if (cardIndex !== -1) {
                    player.hand.splice(cardIndex, 1);
                    player.discardPiles[discardMove.buildPileIndex].push(discardMove.card);
                    const stratName = player.strategy === 'Fortgeschritten' ? ' (Strategisch)' : '';
                    this.app.logEvent('INFO', `${player.name}${stratName} beendet Zug mit Ablage auf Stapel ${discardMove.buildPileIndex + 1}.`);
                }
            } else {
                if (player.hand.length > 0) this.app.logEvent('WARN', 'Konnte nicht ablegen.');
            }
        }
    }

    /**
     * Simulates a full game and returns the result object.
     */
    run(): GameResult {
        this.createDeck(); // Was missing in original run() sometimes? No deal calls createDeck.
        this.deal();

        const startTime = Date.now();
        let currentTurn = 0;

        while (this.winner === null && currentTurn < MAX_TURNS_LIMIT) {
            const player = this.players[this.currentPlayerIndex];
            currentTurn++;
            this.app.logEvent('TURN', `Zug ${currentTurn}: ${player.name} startet.`);

            this.playerTurn(player);

            if (this.winner) break;

            this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        }

        const durationMs = Date.now() - startTime;
        return {
            id: Math.floor(Math.random() * 999999) + 1,
            winner: this.winner ? `${this.winner.name} (${this.winner.strategy})` : 'TIE',
            turns: currentTurn,
            duration: durationMs,
            starter: this.players[0].id === 0 ? 'P1' : 'P2',
            jokers: this.app.tempJokersPlayed,
            strategy: this.winner ? this.winner.strategy : 'Zufall'
        };
    }
}
