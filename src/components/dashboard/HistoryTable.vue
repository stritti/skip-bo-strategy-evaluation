<script setup lang="ts">
import type { SimulationRun } from '../../services/dbService';

const props = defineProps<{
  history: SimulationRun[];
  currentRunId: number | null;
}>();

const emit = defineEmits<{
  clearHistory: [];
  loadRun: [run: SimulationRun];
  loadAll: [];
}>();

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden" v-if="history.length > 0">
    <div class="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 px-6 py-4 flex justify-between items-center">
      <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <i class="ph-bold ph-clock-counter-clockwise text-xl text-blue-600 dark:text-blue-400"></i>
        Simulations-Historie
      </h3>
      
      <div class="flex items-center gap-4">
        <button @click="emit('loadAll')"
          class="bg-skipbo-blue text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-700 transition flex items-center gap-2">
          <i class="ph-bold ph-chart-pie-slice"></i>
          Alle {{ history.length }} laden
        </button>
        <button @click="emit('clearHistory')"
          class="text-xs text-red-600 hover:text-red-800 font-bold hover:underline transition">
          Historie löschen
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium">
          <tr>
            <th class="px-6 py-3">Datum</th>
            <th class="px-6 py-3 text-right">Spiele</th>
            <th class="px-6 py-3 text-right">P1 (KI) Win %</th>
            <th class="px-6 py-3">Strategie P1</th>
            <th class="px-6 py-3">Strategie P2</th>
            <th class="px-6 py-3 text-right">Ø Züge</th>
            <th class="px-6 py-3 text-right">Aktion</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
          <tr v-for="run in history" :key="run.id" class="transition"
              :class="run.id === currentRunId ? 'bg-blue-50/60 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'">
            <td class="px-6 py-3 whitespace-nowrap text-gray-900 dark:text-slate-200 flex items-center gap-2">
              <i v-if="run.id === currentRunId" class="ph-fill ph-check-circle text-blue-600 dark:text-blue-400"></i>
              {{ formatDate(run.timestamp) }}
            </td>
            <td class="px-6 py-3 text-right font-mono dark:text-slate-300">{{ run.gamesCount.toLocaleString('de-DE') }}</td>
            <td class="px-6 py-3 text-right font-bold"
              :class="run.winsP1 > run.winsP2 ? 'text-green-600' : 'text-red-600'">
              {{ ((run.winsP1 / run.gamesCount) * 100).toFixed(1) }}%
            </td>
            <td class="px-6 py-3">
              <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-semibold border border-blue-100 dark:border-blue-900/50">
                {{ run.strategyP1 }}
              </span>
            </td>
            <td class="px-6 py-3">
               <span class="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-semibold border border-gray-200 dark:border-slate-600">
                {{ run.strategyP2 }}
               </span>
            </td>
            <td class="px-6 py-3 text-right dark:text-slate-300">{{ (run.totalTurns / run.gamesCount).toFixed(1) }}</td>
            <td class="px-6 py-3 text-right">
              <button v-if="run.id !== currentRunId" @click="emit('loadRun', run)"
                class="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1 ml-auto">
                <i class="ph-bold ph-eye"></i> Laden
              </button>
              <span v-else class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-900/50 inline-flex items-center gap-1">
                <i class="ph-weight-bold ph-check"></i> Aktiv
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
