<script setup lang="ts">
import type { GameResult } from '../../game/types';

defineProps<{
  data: GameResult[];
  isFinished: boolean; // Kept for legacy compatibility if needed, though used less now
  sortColumn?: keyof GameResult;
  sortDirection?: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  toggleSort: [column: keyof GameResult];
}>();

const headers: { key: keyof GameResult; label: string }[] = [
  { key: 'id', label: 'Game ID' },
  { key: 'winner', label: 'Sieger' },
  { key: 'turns', label: 'Züge' },
  { key: 'duration', label: 'Dauer (Sim)' },
  { key: 'starter', label: 'Startspieler' },
  { key: 'jokers', label: 'Joker benutzt' },
  { key: 'strategy', label: 'Strategie Typ' },
];
</script>

<template>
  <div class="overflow-x-auto flex-grow rounded-lg border border-gray-200 shadow-sm">
    <table class="w-full data-table text-left border-collapse">
      <thead class="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
        <tr>
          <th v-for="header in headers" :key="header.key" 
              @click="emit('toggleSort', header.key)"
              class="px-4 py-3 cursor-pointer hover:bg-gray-100 transition select-none group">
            <div class="flex items-center gap-1">
              {{ header.label }}
              <div class="flex flex-col text-[8px] leading-[8px] text-gray-300">
                <i class="ph-fill ph-caret-up" 
                   :class="{ 'text-blue-600': sortColumn === header.key && sortDirection === 'asc' }"></i>
                <i class="ph-fill ph-caret-down" 
                   :class="{ 'text-blue-600': sortColumn === header.key && sortDirection === 'desc' }"></i>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length > 0" class="divide-y divide-gray-100 bg-white">
        <tr v-for="row in data" :key="row.id" class="hover:bg-blue-50/50 transition-colors">
          <td class="px-4 py-2 font-mono text-xs text-gray-500">#{{ row.id }}</td>
          <td class="px-4 py-2">
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
