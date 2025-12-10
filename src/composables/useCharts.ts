/**
 * Charts Composable for Skip-Bo Simulation
 * Manages Chart.js instances lifecycle
 */

import { ref, type Ref } from 'vue';
// Chart type imported but managed through service return types
import {
    createWinRateChart,
    createDurationChart,
    destroyCharts,
    type ChartInstances
} from '../services/chartService';

export function useCharts() {
    const winRateChartRef: Ref<HTMLCanvasElement | null> = ref(null);
    const durationChartRef: Ref<HTMLCanvasElement | null> = ref(null);
    const chartInstances: ChartInstances = {};

    const initCharts = (winRateP1: number, averageTurns: number): void => {
        // Destroy existing charts
        destroyCharts(chartInstances);

        if (!winRateChartRef.value || !durationChartRef.value) {
            console.warn('Chart canvas elements not available');
            return;
        }

        // Create new charts
        chartInstances.win = createWinRateChart(winRateChartRef.value, winRateP1);
        chartInstances.dur = createDurationChart(durationChartRef.value, averageTurns);
    };

    const destroyAllCharts = (): void => {
        destroyCharts(chartInstances);
    };

    return {
        winRateChartRef,
        durationChartRef,
        initCharts,
        destroyAllCharts
    };
}
