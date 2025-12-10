/**
 * Chart Service for Skip-Bo Simulation Charts
 */

import { Chart, type ChartConfiguration } from 'chart.js/auto';

export interface ChartInstances {
    win?: Chart;
    dur?: Chart;
}

/**
 * Destroys all chart instances
 */
export function destroyCharts(instances: ChartInstances): void {
    if (instances.win) instances.win.destroy();
    if (instances.dur) instances.dur.destroy();
}

/**
 * Initializes the win rate doughnut chart
 */
export function createWinRateChart(
    canvas: HTMLCanvasElement,
    winRateP1: number
): Chart {
    const config: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data: {
            labels: ['Spieler 1 (Optimiert)', 'Spieler 2 (Zufall)'],
            datasets: [{
                data: [winRateP1 * 100, (1 - winRateP1) * 100],
                backgroundColor: ['#ef4444', '#cbd5e0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    };

    return new Chart(canvas, config);
}

/**
 * Initializes the duration histogram bar chart
 */
export function createDurationChart(
    canvas: HTMLCanvasElement,
    averageTurns: number
): Chart {
    const avg = averageTurns;
    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels: [
                `< ${Math.floor(avg - 7)}`,
                `${Math.floor(avg - 7)}-${Math.floor(avg - 3)}`,
                `${Math.floor(avg - 3)}-${Math.floor(avg + 3)}`,
                `${Math.floor(avg + 3)}-${Math.floor(avg + 7)}`,
                `> ${Math.floor(avg + 7)}`
            ],
            datasets: [{
                label: 'Anzahl Spiele',
                data: [100000, 300000, 450000, 100000, 50000],
                backgroundColor: '#ef4444',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { display: false },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    };

    return new Chart(canvas, config);
}
