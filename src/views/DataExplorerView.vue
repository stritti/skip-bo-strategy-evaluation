<script setup lang="ts">
import DataTable from '../components/data/DataTable.vue';
import Pagination from '../components/data/Pagination.vue';
import { useSimulation } from '../composables/useSimulation';
import { downloadCSV } from '../services/csvExportService';

const simulation = useSimulation();

const handleDownloadCSV = () => {
  downloadCSV(
    simulation.averageTurns.value,
    simulation.averageJokers.value,
    simulation.winRateP1.value,
    1000
  );
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Ergebnis-Tabelle</h2>
        <p class="text-gray-500 text-sm">Auszug aus der simulierten Datenbank ({{
          simulation.totalRows.toLocaleString('de-DE') }} Einträge)</p>
      </div>

      <div class="flex items-center gap-2">
        <span v-if="!simulation.isFinished.value"
          class="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded font-bold">
          ⚠ Simulation läuft noch
        </span>
        <button @click="handleDownloadCSV" :disabled="!simulation.isFinished.value"
          class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all">
          <i class="ph-bold ph-download-simple"></i>
          CSV Exportieren
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <!-- Table Header Filter -->
      <div class="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4 overflow-x-auto">
        <div class="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-600">
          <i class="ph-bold ph-funnel"></i> Filter: Alle
        </div>
        <div class="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-600">
          <i class="ph-bold ph-arrows-down-up"></i> Sortierung: {{ simulation.sortColumn.value }} ({{ simulation.sortDirection.value.toUpperCase() }})
        </div>
      </div>

      <DataTable 
        :data="simulation.paginatedData.value" 
        :is-finished="simulation.isFinished.value"
        :sort-column="simulation.sortColumn.value"
        :sort-direction="simulation.sortDirection.value"
        @toggleSort="simulation.toggleSort"
      />
      
      <Pagination 
        :current-page="simulation.currentPage.value"
        :page-size="simulation.pageSize"
        :total-rows="simulation.rawData.value.length"
        :is-finished="simulation.isFinished.value"
        @next-page="simulation.nextPage"
        @prev-page="simulation.prevPage"
      />
    </div>
  </div>
</template>
