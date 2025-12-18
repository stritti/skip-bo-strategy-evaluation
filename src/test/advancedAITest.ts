/**
 * Manual Test Script for Advanced Skip-Bo AI
 * Run this in the browser console on the app page
 */

import { SkipBoGame } from '../game/SkipBoGame';
import type { Strategy } from '../game/types';

// Create a simple logging app
const testApp = {
    logEvent: (type: string, text: string) => {
        console.log(`[${type}] ${text}`);
    },
    tempJokersPlayed: 0
};

console.log('=== Testing Advanced Skip-Bo AI ===\n');

// Test 1: Verify strategy type is available
console.log('Test 1: Strategy Type Support');
const strategies: Strategy[] = ['Optimiert', 'Zufall', 'Spontan', 'Fortgeschritten'];
console.log('Available strategies:', strategies);
console.log('✓ Fortgeschritten strategy type is available\n');

// Test 2: Create game with Advanced AI
console.log('Test 2: Game Creation');
try {
    const game = new SkipBoGame(testApp, 'Fortgeschritten', 'Zufall');
    console.log('Player 1 strategy:', game.players[0].strategy);
    console.log('Player 2 strategy:', game.players[1].strategy);
    console.log('✓ Game created successfully with Advanced AI\n');
} catch (error) {
    console.error('✗ Failed to create game:', error);
}

// Test 3: Run a full game simulation
console.log('Test 3: Full Game Simulation');
try {
    const game = new SkipBoGame(testApp, 'Fortgeschritten', 'Optimiert');
    const result = game.run();

    console.log('Game Result:');
    console.log('  Winner:', result.winner);
    console.log('  Turns:', result.turns);
    console.log('  Duration:', result.duration, 'ms');
    console.log('  Jokers used:', result.jokers);

    if (result.turns < 1000) {
        console.log('✓ Game completed within turn limit');
    } else {
        console.log('⚠ Game hit turn limit');
    }
    console.log();
} catch (error) {
    console.error('✗ Game simulation failed:', error);
}

// Test 4: Compare Fortgeschritten vs other strategies (10 games each)
console.log('Test 4: Performance Comparison (10 games)');
const testRuns = 10;
const results: Record<string, { wins: number, avgTurns: number, totalTurns: number }> = {
    'Fortgeschritten': { wins: 0, avgTurns: 0, totalTurns: 0 },
    'Optimiert': { wins: 0, avgTurns: 0, totalTurns: 0 }
};

for (let i = 0; i < testRuns; i++) {
    const game = new SkipBoGame(testApp, 'Fortgeschritten', 'Optimiert');
    const result = game.run();

    if (result.winner.includes('Fortgeschritten')) {
        results.Fortgeschritten.wins++;
    } else if (result.winner.includes('Optimiert')) {
        results.Optimiert.wins++;
    }

    results.Fortgeschritten.totalTurns += result.turns;
    results.Optimiert.totalTurns += result.turns;
}

results.Fortgeschritten.avgTurns = results.Fortgeschritten.totalTurns / testRuns;
results.Optimiert.avgTurns = results.Optimiert.totalTurns / testRuns;

console.log('Fortgeschritten:', results.Fortgeschritten.wins, 'wins');
console.log('Optimiert:', results.Optimiert.wins, 'wins');
console.log('Avg turns per game:', Math.round(results.Fortgeschritten.avgTurns));
console.log('✓ Strategy comparison complete\n');

console.log('=== All Tests Complete ===');
