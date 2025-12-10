<script setup lang="ts">
import type { GameResult } from '../../game/types';

defineProps<{
  data: GameResult[];
  isFinished: boolean;
}>();
</script>

<template>
  <div class="overflow-x-auto flex-grow">
    <table class="w-full data-table">
      <thead>
        <tr>
          <th class="w-24">Game ID</th>
          <th>Sieger</th>
          <th>Züge</th>
          <th>Dauer (Sim)</th>
          <th>Startspieler</th>
          <th>Joker benutzt</th>
          <th>Strategie Typ</th>
        </tr>
      </thead>
      <tbody v-if="isFinished">
        <tr v-for="row in data" :key="row.id" class="transition-colors">
          <td class="font-mono text-xs text-gray-500">#{{ row.id }}</td>
          <td>
            <span
              :class="row.winner === 'Spieler 1 (KI)' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'"
              class="px-2 py-1 rounded text-xs font-bold">
              {{ row.winner }}
            </span>
          </td>
          <td class="font-medium text-gray-900">{{ row.turns }}</td>
          <td class="text-gray-500 text-xs">{{ row.duration }}ms</td>
          <td class="text-xs">{{ row.starter }}</td>
          <td>
            <div class="flex gap-0.5">
              <div v-for="n in row.jokers" :key="n" class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span v-if="row.jokers === 0" class="text-gray-300">-</span>
            </div>
          </td>
          <td><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{{
            row.strategy }}</span></td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="7" class="h-64 text-center text-gray-400 bg-gray-50">
            <div class="flex flex-col items-center justify-center gap-2">
              <i class="ph-duotone ph-table text-4xl mb-2 opacity-50"></i>
              <p>Keine Daten vorhanden.</p>
              <p class="text-xs">Bitte starte zuerst die Simulation im Dashboard.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
