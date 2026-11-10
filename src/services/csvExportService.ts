/**
 * CSV Export Service for Skip-Bo Simulation Results
 * Exports the actual recorded game results (no synthetic rows).
 */

import type { GameResult } from '../game/types';

const escapeCsv = (value: string | number | null | undefined): string => {
    const s = String(value ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Downloads the given simulation results as a CSV file.
 * Includes a metadata header with the strategy matchup and the run seed.
 */
export function downloadCSV(
    results: GameResult[],
    strategyP1: string,
    strategyP2: string,
    seed?: number | null
): void {
    if (results.length === 0) return;

    const headers = ['ID', 'Winner', 'WinnerID', 'Turns', 'Duration_ms', 'Starter', 'Jokers', 'Strategy', 'Seed'];
    const metadata = [
        `# strategyP1=${strategyP1}`,
        `# strategyP2=${strategyP2}`,
        seed !== undefined && seed !== null ? `# seed=${seed}` : null
    ].filter((line): line is string => line !== null);

    const rows = results.map(row => [
        row.id,
        row.winner,
        row.winnerId ?? '',
        row.turns,
        row.duration,
        row.starter,
        row.jokers,
        row.strategy,
        row.seed
    ].map(escapeCsv).join(','));

    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
        [...metadata, headers.join(','), ...rows].join('\n') + '\n'
    )}`;

    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `skipbo_simulation_${results.length}_games.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
