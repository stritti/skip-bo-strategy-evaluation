/**
 * CSV Export Service for Skip-Bo Simulation Results
 */

import type { GameResult } from '../game/types';

/**
 * Generates a mock game result row based on average statistics
 */
export function generateMockRow(
    id: number,
    averageTurns: number,
    averageJokers: number,
    winRateP1: number
): GameResult {
    const isP1 = Math.random() < winRateP1;
    return {
        id: id,
        winner: isP1 ? 'Spieler 1 (KI)' : 'Spieler 2 (Random)',
        turns: Math.max(5, Math.floor(averageTurns + (Math.random() - 0.5) * 10)),
        duration: Math.floor(Math.random() * 200) + 50,
        starter: Math.random() > 0.5 ? 'P1' : 'P2',
        jokers: Math.max(0, Math.round(averageJokers + (Math.random() - 0.5) * 2)),
        strategy: isP1 ? 'Optimiert' : 'Zufall'
    };
}

/**
 * Downloads simulation results as CSV file
 */
export function downloadCSV(
    averageTurns: number,
    averageJokers: number,
    winRateP1: number,
    rowCount: number = 1000
): void {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "GameID,Winner,Turns,Duration_ms,Starter,Jokers,Strategy\\n";

    // Generate rows based on real averages
    for (let i = 1; i <= rowCount; i++) {
        const row = generateMockRow(i, averageTurns, averageJokers, winRateP1);
        csvContent += `${row.id},${row.winner},${row.turns},${row.duration},${row.starter},${row.jokers},${row.strategy}\\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skipbo_simulation_results_${rowCount}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
