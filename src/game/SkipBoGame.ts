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
import type { SimulationApp, GameResult } from './types';

export class SkipBoGame {
    app: SimulationApp;
    players: Player[];
    drawPile: number[];
    discardPile: number[];
    buildPiles: number[][];
    currentPlayerIndex: number;
    turnCount: number;
    winner: Player | null;

    constructor(app: SimulationApp) {
        this.app = app;
        this.players = [new Player(0, true), new Player(1, false)]; // P1: KI, P2: Random
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
        this.players.forEach(player => {
            player.stockpile = this.drawPile.splice(0, STOCKPILE_SIZE);
            player.hand = [];
            player.jokersPlayed = 0;
            player.discardPiles = Array.from({ length: DISCARD_PILE_COUNT }, () => []);
        });
        this.buildPiles = Array.from({ length: BUILD_PILE_COUNT }, () => []);
        this.currentPlayerIndex = 0; // P1 starts
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
     * @returns True if a play was made.
     */
    makePlay(player: Player, source: string, cardValue: number): boolean {
        for (let i = 0; i < BUILD_PILE_COUNT; i++) {
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
     * Implements the core game loop for one player's turn.
     */
    playerTurn(player: Player): void {
        let playsMade = true;
        let cardsPlayedThisTurn = 0;

        this.drawCards(player); // 1. Draw cards up to 5

        while (playsMade && this.winner === null) {
            playsMade = false;

            // --- Strategy Implementation ---

            // Determine the next required card values for each build pile
            const requiredValues = this.buildPiles.map(p => p.length > 0 ? p[p.length - 1] + 1 : 1);

            // --- 1. Prioritize Stockpile Card Play (KI Strategy: Always play Stockpile if possible) ---
            const topStockpile = player.topStockpileCard;
            if (topStockpile !== null) {
                // The KI (P1) is smart: Check if the stockpile card or a joker can immediately play the stockpile card
                for (const requiredVal of requiredValues) {
                    if (requiredVal > 12) continue; // Pile is full and will be cleared

                    // Check if Stockpile card itself works (or is a Joker)
                    if (topStockpile === requiredVal || topStockpile === JOKER_VALUE) {
                        if (this.makePlay(player, 'stockpile', topStockpile)) {
                            playsMade = true;
                            cardsPlayedThisTurn++;
                            // If stockpile was emptied, draw 5 new cards immediately and continue turn
                            if (player.stockpile.length === 0) {
                                this.app.logEvent('SUCCESS', `${player.name} hat gewonnen!`);
                                return;
                            }
                            break; // Restart play loop after a successful move
                        }
                    }
                }
            }

            if (playsMade) continue; // Restart play loop

            // --- 2. Play from Hand or Discard Piles (P1 KI Strategy: Play lowest number first, prioritize Hand over Discard) ---

            const playCandidates: Array<{ source: string; card: number; priority: number }> = [];

            // Candidate: Hand cards (excluding Jokers)
            player.hand.filter(c => c !== JOKER_VALUE).forEach(card => {
                requiredValues.forEach((requiredVal) => {
                    if (card === requiredVal) {
                        playCandidates.push({ source: 'hand', card: card, priority: card * 10 - requiredVal }); // Low number is better
                    }
                });
            });

            // Candidate: Discard piles (only top card)
            player.discardPiles.forEach((pile, pileIndex) => {
                const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
                if (topCard !== null && topCard !== JOKER_VALUE) {
                    requiredValues.forEach((requiredVal) => {
                        if (topCard === requiredVal) {
                            playCandidates.push({ source: `discard-${pileIndex}`, card: topCard, priority: 1000 + topCard }); // Discards are generally lower priority
                        }
                    });
                }
            });

            // Candidate: Jokers (Hand only)
            const jokerInHand = player.hand.includes(JOKER_VALUE);
            if (jokerInHand) {
                requiredValues.forEach((requiredVal) => {
                    if (requiredVal <= 12) {
                        // KI Strategy: Only use Joker if it advances the stockpile or completes a pile (12)
                        const isStrategic = requiredVal === 12 || requiredVal === player.topStockpileCard;
                        if (player.isAI) {
                            if (isStrategic) {
                                playCandidates.push({ source: 'hand', card: JOKER_VALUE, priority: 5000 + requiredVal }); // Highest priority for strategic Joker use
                            }
                        } else {
                            // Random player uses Joker when possible
                            playCandidates.push({ source: 'hand', card: JOKER_VALUE, priority: 100 + requiredVal });
                        }
                    }
                });
            }

            if (topStockpile === JOKER_VALUE && player.isAI) {
                // If the stockpile card is a Joker, it must be used if any play is possible
                requiredValues.forEach((requiredVal) => {
                    if (requiredVal <= 12) {
                        playCandidates.push({ source: 'stockpile', card: JOKER_VALUE, priority: 9999 + requiredVal }); // Absolute highest priority
                    }
                });
            }

            if (playCandidates.length > 0) {
                let bestPlay;
                if (player.isAI) {
                    // P1 (KI): Find the highest priority play
                    bestPlay = playCandidates.sort((a, b) => b.priority - a.priority)[0];
                } else {
                    // P2 (Random): Pick a random valid play
                    bestPlay = playCandidates[Math.floor(Math.random() * playCandidates.length)];
                }

                if (bestPlay) {
                    // The makePlay function needs the value of the card played, not the final value.
                    if (this.makePlay(player, bestPlay.source, bestPlay.card)) {
                        playsMade = true;
                        cardsPlayedThisTurn++;

                        // Check for win condition again after play
                        if (player.stockpile.length === 0) {
                            this.app.logEvent('SUCCESS', `${player.name} hat gewonnen!`);
                            this.winner = player;
                            return;
                        }
                    }
                }
            }
        }

        // --- 3. End Turn (Discard) ---
        if (this.winner === null) {
            if (player.hand.length > 0) {
                let discardCard: number;
                let discardPileIndex: number;

                if (player.isAI) {
                    // P1 (KI) Discard Strategy: Keep cards needed for stockpile. Discard high cards or cards that block a future 1-5 build.
                    // Simple KI: Discard the highest non-joker card on the pile with the lowest top card.

                    // Find a non-joker card to discard
                    const nonJokers = player.hand.filter(c => c !== JOKER_VALUE).sort((a, b) => b - a);
                    const cardToDiscard = nonJokers.length > 0 ? nonJokers[0] : JOKER_VALUE; // If only jokers, discard one joker

                    const cardIndex = player.hand.indexOf(cardToDiscard);
                    discardCard = player.hand.splice(cardIndex, 1)[0];

                    // Find the discard pile with the lowest top card to 'bury' the high card
                    discardPileIndex = 0;
                    let minTopCard = Infinity;
                    player.discardPiles.forEach((pile, index) => {
                        const topCard = pile.length > 0 ? pile[pile.length - 1] : 0;
                        if (topCard < minTopCard) {
                            minTopCard = topCard;
                            discardPileIndex = index;
                        }
                    });

                } else {
                    // P2 (Random) Discard Strategy: Pick a random card and a random pile.
                    const randomIndex = Math.floor(Math.random() * player.hand.length);
                    discardCard = player.hand.splice(randomIndex, 1)[0];
                    discardPileIndex = Math.floor(Math.random() * DISCARD_PILE_COUNT);
                }

                player.discardPiles[discardPileIndex].push(discardCard);
                this.app.logEvent('INFO', `${player.name} beendet Zug mit Ablage auf Stapel ${discardPileIndex + 1}.`);
            } else {
                this.app.logEvent('WARN', `${player.name} konnte keine Handkarten ablegen (Hand leer). Zug beendet.`);
            }
        }
    }

    /**
     * Simulates a full game and returns the result object.
     */
    run(): GameResult {
        this.createDeck();
        this.deal();
        this.winner = null;
        let currentTurn = 0;
        const startTime = Date.now();
        this.app.tempJokersPlayed = 0;

        // Start with P1, then alternate
        while (this.winner === null && currentTurn < MAX_TURNS_LIMIT) {
            const player = this.players[this.currentPlayerIndex];
            currentTurn++;
            this.app.logEvent('TURN', `Zug ${currentTurn}: ${player.name} startet.`);

            this.playerTurn(player);

            if (this.winner) {
                break;
            }

            // Switch player
            this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        }

        const durationMs = Date.now() - startTime;
        const winner = this.winner as Player | null; // Type assertion for TypeScript

        return {
            id: Math.floor(Math.random() * 999999) + 1,
            winner: winner ? (winner.id === 0 ? 'Spieler 1 (KI)' : 'Spieler 2 (Random)') : 'TIE',
            turns: currentTurn,
            duration: durationMs,
            starter: this.players[0].id === 0 ? 'P1' : 'P2', // Mock: P1 always starts
            jokers: this.app.tempJokersPlayed,
            strategy: winner ? (winner.isAI ? 'Optimiert' : 'Zufall') : 'Zufall'
        };
    }
}
