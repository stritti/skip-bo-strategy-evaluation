<script setup lang="ts">
defineProps<{
  averageTurns: number;
  winRateP1: number;
  averageJokers: number;
}>();
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-blue-50 text-blue-600 p-1.5 rounded-md"><i class="ph-bold ph-clock"></i></div>
        <span class="text-xs font-bold text-gray-400 uppercase">Ø Züge (Real)</span>
      </div>
      <div class="text-3xl font-bold text-gray-900">{{ averageTurns.toFixed(1) }}</div>
    </div>
    <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-red-50 text-red-600 p-1.5 rounded-md"><i class="ph-bold ph-trend-up"></i></div>
        <span class="text-xs font-bold text-gray-400 uppercase">Win-Rate KI</span>
      </div>
      <div class="text-3xl font-bold text-red-600">{{ (winRateP1 * 100).toFixed(1) }}%</div>
    </div>
    <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-green-50 text-green-600 p-1.5 rounded-md"><i class="ph-bold ph-user-focus"></i></div>
        <span class="text-xs font-bold text-gray-400 uppercase">P1 Vorteil</span>
      </div>
      <div class="text-3xl font-bold text-green-600">{{ ((winRateP1 - 0.5) * 200).toFixed(1) }}%</div>
    </div>
    <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-purple-50 text-purple-600 p-1.5 rounded-md"><i class="ph-bold ph-magic-wand"></i></div>
        <span class="text-xs font-bold text-gray-400 uppercase">Ø Joker/Spiel</span>
      </div>
      <div class="text-3xl font-bold text-gray-900">{{ averageJokers.toFixed(1) }}</div>
    </div>
  </div>
</template>
