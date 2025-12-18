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
     * Gets the required next value for a build pile.
     * @param pileIndex - Index of the build pile (0-3)
     * @returns The next required card value (1-12), or 13 if pile is complete
     */
    getBuildPileRequiredValue(pileIndex: number): number {
        const pile = this.buildPiles[pileIndex];
        return pile.length > 0 ? pile[pile.length - 1] + 1 : 1;
    }

    /**
     * Checks if a card can be played on any build pile.
     * @param cardValue - The card value to check
     * @returns True if the card can be played
     */
    canPlayCard(cardValue: number): boolean {
        for (let i = 0; i < BUILD_PILE_COUNT; i++) {
            const required = this.getBuildPileRequiredValue(i);
            if (required > 12) continue;
            if (cardValue === JOKER_VALUE || cardValue === required) {
                return true;
            }
        }
        return false;
    }

    /**
     * Finds all possible moves for the Advanced AI strategy.
     * Returns moves sorted by priority (3 > 2 > 1).
     * @param player - The current player
     * @returns Array of MoveOption objects sorted by priority (highest first)
     */
    findAllMoves(player: Player): MoveOption[] {
        const moves: MoveOption[] = [];

        // Check all 4 build piles
        for (let buildPileIdx = 0; buildPileIdx < BUILD_PILE_COUNT; buildPileIdx++) {
            const required = this.getBuildPileRequiredValue(buildPileIdx);
            if (required > 12) continue; // Pile is complete or would be

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

        // Sort by priority (3 > 2 > 1), then by card value (lower is better for optimization)
        moves.sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            // Within same priority, prefer non-jokers first, then lower values
            if (a.card === JOKER_VALUE && b.card !== JOKER_VALUE) return 1;
            if (b.card === JOKER_VALUE && a.card !== JOKER_VALUE) return -1;
            return a.card - b.card;
        });

        return moves;
    }

    /**
     * Smart discard strategy for Advanced AI.
     * Selects which card to discard and which pile to place it on.
     * @param player - The current player
     */
    discardCardStrategically(player: Player): void {
        if (player.hand.length === 0) {
            this.app.logEvent('WARN', `${player.name} konnte keine Handkarten ablegen (Hand leer).`);
            return;
        }

        // Card Selection Strategy:
        // 1. Never discard Wild Cards if possible
        // 2. Avoid discarding low cards (1-3) that can start new build piles
        // 3. Prefer discarding high cards (10-12)
        // 4. Never discard a card matching the stockpile top card

        const topStockpile = player.topStockpileCard;
        const nonJokers = player.hand.filter(c => c !== JOKER_VALUE);

        let cardToDiscard: number;

        if (nonJokers.length > 0) {
            // Score each card (higher score = better to discard)
            const scoredCards = nonJokers.map(card => {
                let score = 0;

                // High cards are better to discard
                if (card >= 10) score += 50;
                else if (card >= 7) score += 20;
                else if (card <= 3) score -= 30; // Avoid discarding low cards

                // Never discard stockpile match
                if (card === topStockpile) score -= 100;

                return { card, score };
            });

            // Sort by score descending
            scoredCards.sort((a, b) => b.score - a.score);
            cardToDiscard = scoredCards[0].card;
        } else {
            // Only jokers left, must discard one
            cardToDiscard = JOKER_VALUE;
        }

        // Remove card from hand
        const cardIndex = player.hand.indexOf(cardToDiscard);
        const discardedCard = player.hand.splice(cardIndex, 1)[0];

        // Pile Selection Strategy:
        // Place on the pile with the highest current top card value (but not 12)
        // This creates "blocking stacks" that are less likely to be useful
        let bestPileIndex = 0;
        let highestValue = -1;

        player.discardPiles.forEach((pile, idx) => {
            const topValue = pile.length > 0 ? pile[pile.length - 1] : 0;
            if (topValue < 12 && topValue > highestValue) {
                highestValue = topValue;
                bestPileIndex = idx;
            }
        });

        // If all piles have 12 on top, use the first empty pile, or just pile 0
        if (highestValue === -1) {
            for (let i = 0; i < player.discardPiles.length; i++) {
                if (player.discardPiles[i].length === 0) {
                    bestPileIndex = i;
                    break;
                }
            }
        }

        player.discardPiles[bestPileIndex].push(discardedCard);
        this.app.logEvent('INFO', `${player.name} (Fortgeschritten) beendet Zug mit strategischer Ablage: Karte ${discardedCard} auf Stapel ${bestPileIndex + 1}.`);
    }

    /**
     * Implements the core game loop for one player's turn.
     */

    playerTurn(player: Player): void {
        this.drawCards(player); // 1. Draw cards up to 5

        // --- Advanced Strategy: Strict Priority-Based Execution ---
        if (player.strategy === 'Fortgeschritten') {
            let movesAvailable = true;

            // Execute all possible moves in priority order until no moves remain
            while (movesAvailable && this.winner === null) {
                const allMoves = this.findAllMoves(player);

                if (allMoves.length > 0) {
                    // Take the highest priority move (already sorted)
                    const bestMove = allMoves[0];

                    // Execute the move using makePlay
                    if (this.makePlay(player, bestMove.source, bestMove.card)) {
                        // Check for win condition
                        if (player.stockpile.length === 0) {
                            this.app.logEvent('SUCCESS', `${player.name} hat gewonnen!`);
                            this.winner = player;
                            return;
                        }
                    } else {
                        // Move failed, stop searching
                        movesAvailable = false;
                    }
                } else {
                    // No more moves available
                    movesAvailable = false;
                }
            }

            // End turn with strategic discard
            if (this.winner === null) {
                this.discardCardStrategically(player);
            }

            return; // Exit early for Advanced strategy
        }

        // --- Existing Strategies: Optimiert, Spontan, Zufall ---
        let playsMade = true;
        let cardsPlayedThisTurn = 0;

        while (playsMade && this.winner === null) {
            playsMade = false;

            // --- Strategy Implementation ---

            // Determine the next required card values for each build pile
            const requiredValues = this.buildPiles.map(p => p.length > 0 ? p[p.length - 1] + 1 : 1);

            // --- 1. Prioritize Stockpile Card Play (Valid for ALL strategies as it's the win condition) ---
            const topStockpile = player.topStockpileCard;
            if (topStockpile !== null) {
                // Check if stockpile card matches any required value
                for (const requiredVal of requiredValues) {
                    if (requiredVal > 12) continue;

                    if (topStockpile === requiredVal || topStockpile === JOKER_VALUE) {
                        // Optimized/Spontan: Always play stockpile immediately.
                        // Random: Might miss it, but for sanity let's say even random players want to win.
                        // However, strictly "Random" might pick from all valid moves.
                        // But typical "Random" bots in games still prioritize winning moves if obvious.
                        // Let's keep Stockpile priority for ALL strategies to ensure games finish reasonable fast.
                        // EXCEPT if we want Random to be truly chaotic.
                        // User wants "Spontan" -> maybe Spontan is greedy, Random is truly random?
                        // Let's keep Stockpile Prio for all for now, as it's the basic rule of the game.

                        if (this.makePlay(player, 'stockpile', topStockpile)) {
                            playsMade = true;
                            cardsPlayedThisTurn++;
                            if (player.stockpile.length === 0) {
                                this.app.logEvent('SUCCESS', `${player.name} hat gewonnen!`);
                                return;
                            }
                            break;
                        }
                    }
                }
            }

            if (playsMade) continue; // Restart play loop

            // --- 2. Play from Hand or Discard Piles ---

            const playCandidates: Array<{ source: string; card: number; priority: number }> = [];

            // Candidate: Hand cards (excluding Jokers)
            player.hand.filter(c => c !== JOKER_VALUE).forEach(card => {
                requiredValues.forEach((requiredVal) => {
                    if (card === requiredVal) {
                        // Priority calculation based on Strategy
                        let priority = 10;
                        if (player.strategy === 'Optimiert') {
                            priority = card * 10 - requiredVal; // Low number is better
                        } else if (player.strategy === 'Spontan') {
                            priority = 100; // Flat priority, will rely on order
                        } else { // Zufall
                            priority = 1;
                        }
                        playCandidates.push({ source: 'hand', card: card, priority });
                    }
                });
            });

            // Candidate: Discard piles (only top card)
            player.discardPiles.forEach((pile, pileIndex) => {
                const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
                if (topCard !== null && topCard !== JOKER_VALUE) {
                    requiredValues.forEach((requiredVal) => {
                        if (topCard === requiredVal) {
                            let priority = 5;
                            if (player.strategy === 'Optimiert') {
                                priority = 1000 + topCard; // Discards are lower priority than hand
                            } else if (player.strategy === 'Spontan') {
                                priority = 50; // Lower than hand
                            } else {
                                priority = 1;
                            }
                            playCandidates.push({ source: `discard-${pileIndex}`, card: topCard, priority });
                        }
                    });
                }
            });

            // Candidate: Jokers (Hand only)
            const jokerInHand = player.hand.includes(JOKER_VALUE);
            if (jokerInHand) {
                requiredValues.forEach((requiredVal) => {
                    if (requiredVal <= 12) {
                        const isStrategic = requiredVal === 12 || requiredVal === player.topStockpileCard;

                        let priority = 0;
                        if (player.strategy === 'Optimiert') {
                            if (isStrategic) priority = 5000 + requiredVal;
                        } else if (player.strategy === 'Spontan') {
                            // Spontan uses Jokers freely if movable
                            priority = 200;
                        } else {
                            // Zufall
                            priority = 1;
                        }

                        if (priority > 0) {
                            playCandidates.push({ source: 'hand', card: JOKER_VALUE, priority });
                        }
                    }
                });
            }

            // Special AI Logic for Stockpile Joker (Optimized)
            if (topStockpile === JOKER_VALUE && player.strategy === 'Optimiert') {
                requiredValues.forEach((requiredVal) => {
                    if (requiredVal <= 12) {
                        playCandidates.push({ source: 'stockpile', card: JOKER_VALUE, priority: 9999 + requiredVal });
                    }
                });
            }

            if (playCandidates.length > 0) {
                let bestPlay;
                if (player.strategy === 'Optimiert') {
                    // Find the highest priority play
                    bestPlay = playCandidates.sort((a, b) => b.priority - a.priority)[0];
                } else if (player.strategy === 'Spontan') {
                    // Pick the first one (Greedy/Quick)
                    // Since we pushed Hand then Discard, it prioritizes Hand.
                    bestPlay = playCandidates[0];
                } else {
                    // Zufall: Pick a random valid play
                    bestPlay = playCandidates[Math.floor(Math.random() * playCandidates.length)];
                }

                if (bestPlay) {
                    if (this.makePlay(player, bestPlay.source, bestPlay.card)) {
                        playsMade = true;
                        cardsPlayedThisTurn++;
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

                if (player.strategy === 'Optimiert') {
                    // Smart Discard
                    const nonJokers = player.hand.filter(c => c !== JOKER_VALUE).sort((a, b) => b - a);
                    const cardToDiscard = nonJokers.length > 0 ? nonJokers[0] : JOKER_VALUE;

                    const cardIndex = player.hand.indexOf(cardToDiscard);
                    discardCard = player.hand.splice(cardIndex, 1)[0];

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
                    // Spontan: Simply discard the last card in hand (simulating "just get rid of it") to a random pile? 
                    // Or last card to last pile?
                    // Let's do: Random card to Random pile (fast/impulsive) implies not thinking about it.
                    // Actually maybe "First card to First pile" is most "impulsive/robotic"?
                    // Let's do: First card of hand to a random pile.
                    discardCard = player.hand.shift()!; // Remove first
                    discardPileIndex = Math.floor(Math.random() * DISCARD_PILE_COUNT);
                } else {
                    // Random Discard
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
        const winner = this.winner as Player | null;

        return {
            id: Math.floor(Math.random() * 999999) + 1,
            winner: winner ? `${winner.name} (${winner.strategy})` : 'TIE',
            turns: currentTurn,
            duration: durationMs,
            starter: this.players[0].id === 0 ? 'P1' : 'P2',
            jokers: this.app.tempJokersPlayed,
            strategy: winner ? winner.strategy : 'Zufall'
        };
    }
}
