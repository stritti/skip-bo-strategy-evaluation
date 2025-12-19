
import { SkipBoGame } from '../game/SkipBoGame';
import type { SimulationApp } from '../game/types';

// Mock App
const mockApp: SimulationApp = {
    logEvent: (type: string, text: string) => console.log(`[${type}] ${text}`),
    tempJokersPlayed: 0
};

// Test Runner Helper
function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(`Assertion Failed: ${message}`);
    }
    console.log(`PASS: ${message}`);
}

async function runTests() {
    console.log('--- Starting Game Logic Tests ---');

    console.log('Test 1: Smart Move Detection (Standard)');
    testSmartMoveDetection();

    console.log('Test 2: Advanced Strategy Move Finding');
    testAdvancedStrategy();

    console.log('--- All Tests Passed ---');
}

function testSmartMoveDetection() {
    const game = new SkipBoGame(mockApp, 'Optimiert', 'Zufall');
    game.createDeck();
    game.deal();

    const player = game.players[0];

    // Setup specific scenario
    // Build Pile 0 needs 1
    game.buildPiles[0] = [];

    // Hand has 1
    player.hand = [1, 5, 8, 10, 12];
    player.stockpile = [99]; // Irrelevant

    const move = game.findBestMove_Standard(player);
    assert(move !== null, 'Should find a move with 1');
    assert(move?.card === 1, 'Should play 1');
    assert(move?.source === 'hand', 'Should play from hand');
    assert(move?.buildPileIndex === 0, 'Should target pile 0');
}

function testAdvancedStrategy() {
    const game = new SkipBoGame(mockApp, 'Fortgeschritten', 'Zufall');
    game.createDeck();
    game.deal();

    const player = game.players[0];

    // Pile 0 needs 5
    game.buildPiles[0] = [1, 2, 3, 4];

    // Hand has 5, Discard has 5
    player.hand = [5, 10];
    player.discardPiles[0] = [5];
    player.stockpile = [99];

    const moves = game.findAllMoves_Advanced(player);

    // Hand Priority (2) vs Discard Priority (1)
    // Actually stock (3) > hand (2) > discard (1)

    const handMove = moves.find(m => m.source === 'hand' && m.card === 5);
    const discardMove = moves.find(m => m.source === 'discard-0' && m.card === 5);

    assert(!!handMove, 'Should see hand move');
    assert(!!discardMove, 'Should see discard move');
    assert(handMove!.priority > discardMove!.priority, 'Hand should have higher priority than discard');

    const bestMove = game.findNextMove(player);
    assert(bestMove?.source === 'hand', 'Should choose hand move first');
}

runTests().catch(e => {
    console.error(e);
    throw e;
});
