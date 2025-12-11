<script setup lang="ts">
/**
 * Power Analysis Tool Component
 * Calculates required sample size for detecting an effect
 */

import { ref, computed } from 'vue';
import { calculateRequiredSampleSize, calculatePower } from '../../utils/statistics';

const desiredEffectSize = ref(0.5); // Medium effect by default
const desiredPower = ref(0.8);

const requiredN = computed(() => {
    return calculateRequiredSampleSize(desiredEffectSize.value, desiredPower.value);
});

const effectSizeLabel = computed(() => {
    const d = desiredEffectSize.value;
    if (d < 0.2) return 'Sehr klein';
    if (d < 0.5) return 'Klein';
    if (d < 0.8) return 'Mittel';
    return 'Groß';
});

const actualPower = ref(1000); // Default sample size
const actualEffectSize = ref(0.5);

const estimatedPower = computed(() => {
    return calculatePower(actualPower.value, actualEffectSize.value);
});
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h4 class="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <i class="ph-bold ph-calculator text-purple-600"></i>
            Power-Analyse Tool
        </h4>

        <!-- Sample Size Calculator -->
        <div class="mb-6">
            <h5 class="font-semibold text-gray-800 mb-3 text-sm">Benötigte Stichprobengröße</h5>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-2">
                        Erwarteter Effekt (Cohen's d): {{ desiredEffectSize.toFixed(2) }} ({{ effectSizeLabel }})
                    </label>
                    <input 
                        v-model.number="desiredEffectSize" 
                        type="range" 
                        min="0.1" 
                        max="1.5" 
                        step="0.05"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div class="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Klein (0.2)</span>
                        <span>Mittel (0.5)</span>
                        <span>Groß (0.8+)</span>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-2">
                        Gewünschte Power: {{ (desiredPower * 100).toFixed(0) }}%
                    </label>
                    <input 
                        v-model.number="desiredPower" 
                        type="range" 
                        min="0.7" 
                        max="0.99" 
                        step="0.01"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                </div>
            </div>

            <div class="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div class="text-sm text-gray-700 mb-1">Empfohlene Mindestanzahl:</div>
                <div class="text-3xl font-mono font-bold text-purple-900">
                    {{ requiredN.toLocaleString('de-DE') }} Spiele
                </div>
                <div class="text-xs text-gray-600 mt-2">
                    Pro Strategie-Vergleich ({{ (desiredPower * 100).toFixed(0) }}% Chance, Effekt von d={{ desiredEffectSize.toFixed(2) }} zu erkennen)
                </div>
            </div>
        </div>

        <!-- Power Estimator -->
        <div class="pt-6 border-t border-gray-200">
            <h5 class="font-semibold text-gray-800 mb-3 text-sm">Power-Schätzung für aktuelle Simulation</h5>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-2">
                        Stichprobengröße: {{ actualPower }}
                    </label>
                    <input 
                        v-model.number="actualPower" 
                        type="range" 
                        min="100" 
                        max="10000" 
                        step="100"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-2">
                        Erwarteter Effekt: {{ actualEffectSize.toFixed(2) }}
                    </label>
                    <input 
                        v-model.number="actualEffectSize" 
                        type="range" 
                        min="0.1" 
                        max="1.5" 
                        step="0.05"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>

            <div class="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div class="text-sm text-gray-700 mb-1">Geschätzte Power:</div>
                <div class="text-3xl font-mono font-bold text-blue-900">
                    {{ (estimatedPower * 100).toFixed(1) }}%
                </div>
                <div class="text-xs text-gray-600 mt-2">
                    {{ estimatedPower >= 0.8 ? '✅ Ausreichend (≥80%)' : '⚠️ Zu niedrig (empfohlen: ≥80%)' }}
                </div>
            </div>
        </div>

        <div class="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <strong>💡 Hinweis:</strong> Power = Wahrscheinlichkeit, einen echten Effekt zu erkennen. 
            Standard ist 80% (falsch-negativ Rate von 20%).
        </div>
    </div>
</template>
