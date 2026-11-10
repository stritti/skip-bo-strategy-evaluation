<script setup lang="ts">
import { computed } from 'vue';
import { calculateConfidenceInterval, mcnemarExactTest, holmCorrect } from '../../utils/statistics';

const props = defineProps<{
  results: {
    strategyP1: string;
    strategyP2: string;
    games: number;
    winsP1: number;
    winsP2: number;
    winRateP1: number;
  }[];
}>();

// Enrich each matchup with a Wilson CI and a Holm-corrected exact McNemar p-value
const enriched = computed(() => {
  const items = props.results.filter(r => r.games > 0);
  const pValues = items.map(r => mcnemarExactTest(r.winsP1, r.winsP2).pValue);
  const adjusted = holmCorrect(pValues);
  return items.map((r, i) => ({
    ...r,
    ci: calculateConfidenceInterval(r.winsP1 / r.games, r.games),
    adjPValue: adjusted[i],
    significant: adjusted[i] < 0.05 && r.games >= 30
  }));
});

const getColor = (rate: number) => {
  if (rate > 0.55) return 'text-green-600';
  if (rate < 0.45) return 'text-red-600';
  return 'text-gray-600';
};
const getBgColor = (rate: number) => {
  if (rate > 0.55) return 'bg-green-50 border-green-200';
  if (rate < 0.45) return 'bg-red-50 border-red-200';
  return 'bg-gray-50 border-gray-200';
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="(item, index) in enriched" :key="index"
      class="rounded-xl border p-5 shadow-sm transition hover:shadow-md"
      :class="getBgColor(item.winRateP1)">
      
      <!-- Header match up -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-col items-center">
            <span class="text-xs uppercase font-bold text-gray-400 mb-1">Spieler 1</span>
            <span class="font-bold text-gray-800 text-lg">{{ item.strategyP1 }}</span>
        </div>
        <div class="text-gray-300 font-bold text-xl">VS</div>
        <div class="flex flex-col items-center">
            <span class="text-xs uppercase font-bold text-gray-400 mb-1">Spieler 2</span>
            <span class="font-bold text-gray-800 text-lg">{{ item.strategyP2 }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="space-y-3">
        <div class="flex justify-between items-end border-b border-gray-200/50 pb-2">
            <span class="text-sm text-gray-500">Gewinnrate P1</span>
            <span class="text-2xl font-mono font-bold" :class="getColor(item.winRateP1)">
                {{ (item.winRateP1 * 100).toFixed(1) }}%
            </span>
        </div>

        <div class="flex justify-between items-center text-xs text-gray-500">
            <span>95% CI (Wilson): ±{{ (item.ci.margin * 100).toFixed(1) }}%</span>
            <span v-if="item.significant" class="font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded">
                signifikant (Holm, p={{ item.adjPValue.toExponential(1) }})
            </span>
            <span v-else-if="item.games >= 30" class="text-gray-400">nicht signifikant (Holm)</span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="block text-gray-400 text-xs">Spiele</span>
                <span class="font-bold text-gray-700">{{ item.games.toLocaleString('de-DE') }}</span>
            </div>
            <div class="text-right">
                <span class="block text-gray-400 text-xs">Siege P1</span>
                <span class="font-bold text-gray-700">{{ item.winsP1.toLocaleString('de-DE') }}</span>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>
