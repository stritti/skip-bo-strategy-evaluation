<script setup lang="ts">
import { ref, computed } from 'vue';

const currentView = defineModel<string>('currentView', { default: 'dashboard' });

const navClass = (view: string) => {
  return currentView.value === view
    ? 'bg-red-50 text-red-700 font-bold'
    : 'hover:bg-gray-50 hover:text-red-600';
};
</script>

<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center gap-2">
          <div class="bg-red-600 text-white p-1.5 rounded-lg shadow-sm">
            <i class="ph-bold ph-cards text-xl"></i>
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-gray-900 leading-tight">Skip-Bo Analyst</h1>
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Echte Simulation</div>
          </div>
        </div>
        <div class="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-500">
          <button @click="currentView = 'dashboard'" :class="navClass('dashboard')"
            class="px-3 py-2 rounded-md transition-colors">Dashboard</button>
          <button @click="currentView = 'data'" :class="navClass('data')"
            class="px-3 py-2 rounded-md transition-colors flex items-center gap-1">
            <i class="ph ph-table"></i> Datensätze
          </button>
          <button @click="currentView = 'rules'" :class="navClass('rules')"
            class="px-3 py-2 rounded-md transition-colors flex items-center gap-1">
            <i class="ph ph-scroll"></i> Regeln
          </button>
          <button @click="currentView = 'strategy'" :class="navClass('strategy')"
            class="px-3 py-2 rounded-md transition-colors">Strategie</button>
        </div>
      </div>
    </div>
  </nav>
</template>
