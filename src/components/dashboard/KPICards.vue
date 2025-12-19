<script setup lang="ts">
defineProps<{
  averageTurns: number;
  winRateP1: number;
  averageJokers: number;
  winRateCI?: { margin: number; lower: number; upper: number };
  turnsCI?: { margin: number; lower: number; upper: number };
}>();
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-md"><i class="ph-bold ph-clock"></i></div>
        <span class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Ø Züge (Real)</span>
      </div>
      <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ averageTurns.toFixed(1) }}</div>
      <div v-if="turnsCI && turnsCI.margin > 0" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        ± {{ turnsCI.margin.toFixed(1) }} (95% CI)
      </div>
    </div>
    <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1.5 rounded-md"><i class="ph-bold ph-trend-up"></i></div>
        <span class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Win-Rate KI</span>
      </div>
      <div class="text-3xl font-bold text-red-600 dark:text-red-400">{{ (winRateP1 * 100).toFixed(1) }}%</div>
      <div v-if="winRateCI && winRateCI.margin > 0" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        ± {{ (winRateCI.margin * 100).toFixed(1) }}% (95% CI)
      </div>
    </div>
    <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1.5 rounded-md"><i class="ph-bold ph-user-focus"></i></div>
        <span class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">P1 Vorteil</span>
      </div>
      <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ ((winRateP1 - 0.5) * 200).toFixed(1) }}%</div>
    </div>
    <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-1.5 rounded-md"><i class="ph-bold ph-magic-wand"></i></div>
        <span class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Ø Joker/Spiel</span>
      </div>
      <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ averageJokers.toFixed(1) }}</div>
    </div>
  </div>
</template>
