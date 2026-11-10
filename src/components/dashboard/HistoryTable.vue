<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { SimulationRun } from '../../services/dbService';
import { isEnPath } from '../../i18n';

const route = useRoute();
const lp = computed(() => (isEnPath(route.path) ? '/en' : ''));

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
        {{ t('dash.historyTitle') }}
      </h3>
      
      <div class="flex items-center gap-4">
        <button @click="emit('loadAll')"
          class="bg-skipbo-blue text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-700 transition flex items-center gap-2">
          <i class="ph-bold ph-chart-pie-slice"></i>
          {{ t('dash.loadAll', { n: history.length }) }}
        </button>
        <button @click="emit('clearHistory')"
          class="text-xs text-red-600 hover:text-red-800 font-bold hover:underline transition">
          {{ t('dash.clearHistory') }}
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium">
          <tr>
            <th class="px-6 py-3">{{ t('dash.colDate') }}</th>
            <th class="px-6 py-3 text-right">{{ t('dash.colGames') }}</th>
            <th class="px-6 py-3 text-right">{{ t('dash.colWin') }}</th>
            <th class="px-6 py-3">{{ t('dash.colStrategyP1') }}</th>
            <th class="px-6 py-3">{{ t('dash.colStrategyP2') }}</th>
            <th class="px-6 py-3 text-right">{{ t('dash.colAvgTurns') }}</th>
            <th class="px-6 py-3 text-right">{{ t('dash.colTies') }}</th>
            <th class="px-6 py-3 text-right">{{ t('dash.colSeed') }}</th>
            <th class="px-6 py-3 text-right">{{ t('dash.colAction') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
          <tr v-for="run in history" :key="run.id" class="transition"
              :class="run.id === currentRunId ? 'bg-blue-50/60 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'">
            <td class="px-6 py-3 whitespace-nowrap text-gray-900 dark:text-slate-200 flex items-center gap-2">
              <i v-if="run.id === currentRunId" class="ph-fill ph-check-circle text-blue-600 dark:text-blue-400"></i>
              {{ formatDate(run.timestamp) }}
              <span v-if="run.shared" class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50" title="Aus dem Repository geladen (public/data/runs)">
                <i class="ph-bold ph-globe"></i>{{ t('dash.shared') }}
              </span>
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
            <td class="px-6 py-3 text-right font-mono dark:text-slate-300">{{ (run.ties ?? 0).toLocaleString('de-DE') }}</td>
            <td class="px-6 py-3 text-right font-mono text-xs dark:text-slate-400">
              {{ run.seed ?? '—' }}
              <router-link v-if="run.shared && run.file" :to="`${lp}/runs/${run.file.replace(/\.json$/, '')}`" title="Permalink"
                class="ml-2 inline-flex items-center text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 align-middle">
                <i class="ph-bold ph-link"></i>
              </router-link>
            </td>
            <td class="px-6 py-3 text-right">
              <button v-if="run.id !== currentRunId" @click="emit('loadRun', run)"
                class="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1 ml-auto">
                <i class="ph-bold ph-eye"></i>{{ t('dash.load') }}
              </button>
              <span v-else class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-900/50 inline-flex items-center gap-1">
                <i class="ph-weight-bold ph-check"></i>{{ t('dash.active') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
