<script setup lang="ts">
/**
 * Data Export Component
 * Allows exporting simulation data as CSV or JSON
 */

import type { GameResult } from '../../game/types';

interface Props {
    data: GameResult[];
    strategyP1: string;
    strategyP2: string;
    isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isDisabled: false
});

const exportToCSV = () => {
    if (props.data.length === 0) return;

    // CSV Header
    const headers = ['ID', 'Winner', 'Turns', 'Duration (ms)', 'Starter', 'Jokers', 'Strategy'];
    const csvContent = [
        headers.join(','),
        ...props.data.map(row => [
            row.id,
            row.winner,
            row.turns,
            row.duration,
            row.starter,
            row.jokers,
            row.strategy
        ].join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `skip-bo-simulation-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportToJSON = () => {
    if (props.data.length === 0) return;

    const metadata = {
        exportDate: new Date().toISOString(),
        totalGames: props.data.length,
        strategyP1: props.strategyP1,
        strategyP2: props.strategyP2
    };

    const exportData = {
        metadata,
        results: props.data
    };

    const jsonContent = JSON.stringify(exportData, null, 2);

    // Create download
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `skip-bo-simulation-${Date.now()}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <i class="ph-bold ph-download text-blue-600"></i>
            Daten exportieren
        </h4>
        <p class="text-sm text-gray-600 mb-4">
            Exportieren Sie alle {{ data.length.toLocaleString('de-DE') }} Spielergebnisse für externe Analysen.
        </p>
        <div class="flex gap-3">
            <button
                @click="exportToCSV"
                :disabled="isDisabled || data.length === 0"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                <i class="ph-bold ph-file-csv"></i>
                CSV
            </button>
            <button
                @click="exportToJSON"
                :disabled="isDisabled || data.length === 0"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                <i class="ph-bold ph-file-text"></i>
                JSON
            </button>
        </div>
        <div class="mt-3 text-xs text-gray-500">
            💡 Nutzen Sie CSV für Excel/R, JSON für Python/JavaScript
        </div>
    </div>
</template>
