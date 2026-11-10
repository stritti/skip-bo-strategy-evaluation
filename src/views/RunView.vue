<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { runsIndex } from '../generated/runsIndex';
import { entryToSummaryRun } from '../services/sharedRuns';
import { isEnPath } from '../i18n';

const route = useRoute();
const { t } = useI18n({ useScope: 'global' });

const seedParam = computed(() => Number(route.params.seed));
const entry = computed(() => runsIndex.find(e => e.seed === seedParam.value) ?? null);
const run = computed(() => (entry.value ? entryToSummaryRun(entry.value) : null));
const winRateP1 = computed(() =>
    run.value && run.value.gamesCount > 0 ? run.value.winsP1 / run.value.gamesCount : 0
);
const fileUrl = computed(() =>
    entry.value ? `${import.meta.env.BASE_URL}data/runs/${entry.value.file}` : ''
);
const dashboardPath = computed(() => (isEnPath(route.path) ? '/en' : '/'));
const formattedDate = computed(() =>
    run.value ? new Date(run.value.timestamp).toLocaleString('de-DE') : ''
);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div v-if="run" class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div class="bg-gradient-to-r from-skipbo-blue to-skipbo-blue/80 px-8 py-10 text-white">
        <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ entry!.label ?? t('run.title') }}</h1>
        <p class="text-blue-100">{{ t('run.matchup') }}: <strong>{{ run.strategyP1 }}</strong> vs. <strong>{{ run.strategyP2 }}</strong></p>
      </div>

      <div class="p-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">{{ t('run.games') }}</div>
            <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white">{{ run.gamesCount.toLocaleString('de-DE') }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">{{ t('run.winRate') }}</div>
            <div class="text-2xl font-mono font-bold" :class="winRateP1 >= 0.5 ? 'text-green-600' : 'text-red-600'">{{ (winRateP1 * 100).toFixed(1) }}%</div>
          </div>
          <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">{{ t('run.wins') }}</div>
            <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white">{{ run.winsP1.toLocaleString('de-DE') }} : {{ run.winsP2.toLocaleString('de-DE') }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center">
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">{{ t('run.ties') }}</div>
            <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white">{{ (run.ties ?? 0).toLocaleString('de-DE') }}</div>
          </div>
        </div>

        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-8">
          <div class="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
            <dt class="text-gray-500">{{ t('run.seed') }}</dt>
            <dd class="font-mono font-bold text-gray-900 dark:text-white">{{ run.seed }}</dd>
          </div>
          <div class="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
            <dt class="text-gray-500">{{ t('run.timestamp') }}</dt>
            <dd class="font-mono text-gray-900 dark:text-white">{{ formattedDate }}</dd>
          </div>
          <div class="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
            <dt class="text-gray-500">Ø {{ t('run.avgTurns') }}</dt>
            <dd class="font-mono text-gray-900 dark:text-white">{{ (run.totalTurns / run.gamesCount).toFixed(1) }}</dd>
          </div>
          <div class="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
            <dt class="text-gray-500">{{ t('run.permalink') }}</dt>
            <dd class="font-mono text-xs text-gray-900 dark:text-white">/runs/{{ run.seed }}</dd>
          </div>
        </dl>

        <p class="text-xs text-gray-500 dark:text-slate-400 mb-6">
          <i class="ph-bold ph-seal-check text-green-600"></i> {{ t('run.reproducible') }}
        </p>

        <div class="flex flex-wrap gap-3">
          <a :href="fileUrl" :download="entry!.file"
             class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-sm">
            <i class="ph-bold ph-download-simple"></i> {{ t('run.download') }}
          </a>
          <router-link :to="dashboardPath"
             class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <i class="ph-bold ph-gauge"></i> {{ t('run.openDashboard') }}
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-12 text-center">
      <i class="ph-bold ph-magnifying-glass-minus text-5xl text-gray-300 dark:text-slate-600 mb-4"></i>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('run.notFound') }}</h1>
      <p class="text-gray-500 dark:text-slate-400 font-mono text-sm">/runs/{{ route.params.seed }}</p>
    </div>
  </div>
</template>
