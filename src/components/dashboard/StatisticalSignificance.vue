<script setup lang="ts">
/**
 * Statistical Significance Badge Component
 * Displays chi-square test results with visual indicators
 */

interface Props {
    chiSquare: number;
    pValue: number;
    isSignificant: boolean;
    applicable: boolean;
    strategyA: string;
    strategyB: string;
}

const props = defineProps<Props>();

const significanceLabel = (p: number): string => {
    if (p < 0.001) return 'Hochsignifikant (p < 0.001)';
    if (p < 0.01) return 'Sehr signifikant (p < 0.01)';
    if (p < 0.05) return 'Signifikant (p < 0.05)';
    return 'Nicht signifikant (p ≥ 0.05)';
};

const interpretationText = (p: number): string => {
    if (p < 0.001) return 'Mit 99.9% Sicherheit kein Zufall';
    if (p < 0.01) return 'Mit 99% Sicherheit kein Zufall';
    if (p < 0.05) return 'Mit 95% Sicherheit kein Zufall';
    return 'Unterschied könnte zufällig sein';
};
</script>

<template>
    <div v-if="applicable" class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 class="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <i class="ph-bold ph-chart-line-up text-blue-600"></i>
            Statistische Signifikanz
        </h3>

        <!-- Significance Badge -->
        <div class="mb-4">
            <div 
                :class="[
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm',
                    isSignificant 
                        ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                        : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                ]"
            >
                <i :class="isSignificant ? 'ph-fill ph-check-circle' : 'ph-fill ph-warning-circle'"></i>
                {{ significanceLabel(pValue) }}
            </div>
        </div>

        <!-- Test Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">χ² Statistik</div>
                <div class="text-2xl font-mono font-bold text-gray-900">{{ chiSquare.toFixed(2) }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">p-Wert</div>
                <div class="text-2xl font-mono font-bold text-gray-900">{{ pValue.toFixed(4) }}</div>
            </div>
        </div>

        <!-- Interpretation -->
        <div 
            :class="[
                'mt-4 p-4 rounded-lg border-l-4',
                isSignificant 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-yellow-50 border-yellow-500'
            ]"
        >
            <p class="text-sm text-gray-700">
                <strong>Interpretation:</strong> {{ interpretationText(pValue) }}
            </p>
            <p class="text-xs text-gray-600 mt-2" v-if="isSignificant">
                Der Unterschied zwischen <strong>{{ strategyA }}</strong> und <strong>{{ strategyB }}</strong> 
                ist statistisch nachweisbar und nicht zufällig.
            </p>
            <p class="text-xs text-gray-600 mt-2" v-else>
                Bei dieser Stichprobengröße kann nicht mit Sicherheit ausgeschlossen werden, 
                dass der Unterschied zufällig ist. Erhöhen Sie die Anzahl der Spiele für präzisere Aussagen.
            </p>
        </div>

        <!-- Info Box -->
        <div class="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
            <strong>Hinweis:</strong> Chi-Quadrat Test prüft, ob die Gewinnraten-Unterschiede 
            statistisch signifikant sind (H₀: gleiche Wahrscheinlichkeiten).
        </div>
    </div>
</template>
