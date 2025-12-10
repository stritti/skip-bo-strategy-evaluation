<script setup lang="ts">
const props = defineProps<{
  stats: {
    totalRuns: number;
    totalGames: number;
    winRateP1: number;
    avgTurns: number;
    avgJokers: number;
  } | null;
}>();
</script>

<template>
  <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white" v-if="stats">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold flex items-center gap-2">
          <i class="ph-bold ph-chart-line-up text-green-400"></i>
          Kumulierte Analyse
        </h3>
        <p class="text-slate-400 text-sm mt-1">Über alle {{ stats.totalRuns }} gespeicherten Läufe</p>
      </div>
      <div class="text-right">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Gesamt-Datenbasis</div>
        <div class="text-2xl font-mono font-bold">{{ stats.totalGames.toLocaleString('de-DE') }} <span class="text-sm font-normal text-slate-400">Spiele</span></div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div class="bg-slate-700/50 p-4 rounded-lg backdrop-blur-sm border border-slate-600/50">
        <div class="text-slate-400 text-xs font-bold uppercase mb-1">Ø Win-Rate P1</div>
        <div class="text-2xl font-bold text-green-400">{{ (stats.winRateP1 * 100).toFixed(1) }}%</div>
      </div>
      
      <div class="bg-slate-700/50 p-4 rounded-lg backdrop-blur-sm border border-slate-600/50">
        <div class="text-slate-400 text-xs font-bold uppercase mb-1">Ø Runden-Dauer</div>
        <div class="text-2xl font-bold text-white">{{ stats.avgTurns.toFixed(1) }} <span class="text-sm font-normal text-slate-400">Züge</span></div>
      </div>

       <div class="bg-slate-700/50 p-4 rounded-lg backdrop-blur-sm border border-slate-600/50">
        <div class="text-slate-400 text-xs font-bold uppercase mb-1">Ø Joker/Spiel</div>
        <div class="text-2xl font-bold text-purple-300">{{ stats.avgJokers.toFixed(1) }}</div>
      </div>
      
       <div class="bg-slate-700/50 p-4 rounded-lg backdrop-blur-sm border border-slate-600/50">
         <div class="text-slate-400 text-xs font-bold uppercase mb-1">P1 Vorteil</div>
         <div class="text-2xl font-bold" :class="stats.winRateP1 > 0.5 ? 'text-green-400' : 'text-red-400'">{{ ((stats.winRateP1 - 0.5) * 200).toFixed(1) }}%</div>
      </div>
    </div>
  </div>
</template>
