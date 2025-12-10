<script setup lang="ts">
defineProps<{
  currentPage: number;
  pageSize: number;
  totalRows: number;
  isFinished: boolean;
}>();

const emit = defineEmits<{
  nextPage: [];
  prevPage: [];
}>();
</script>

<template>
  <div class="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
    <div class="text-xs text-gray-500">
      Zeige <span class="font-bold text-gray-900">{{ (currentPage - 1) * pageSize + 1 }}</span>
      bis <span class="font-bold text-gray-900">{{ Math.min(currentPage * pageSize, totalRows) }}</span> 
      von {{ totalRows.toLocaleString('de-DE') }} Ergebnissen
    </div>
    <div class="flex items-center gap-2">
      <button @click="emit('prevPage')" :disabled="currentPage === 1"
        class="p-2 rounded hover:bg-white border border-transparent hover:border-gray-300 disabled:opacity-30 transition">
        <i class="ph-bold ph-caret-left"></i>
      </button>
      <span class="text-sm font-bold text-gray-700 w-8 text-center">{{ currentPage }}</span>
      <button @click="emit('nextPage')" :disabled="currentPage * pageSize >= totalRows"
        class="p-2 rounded hover:bg-white border border-transparent hover:border-gray-300 disabled:opacity-30 transition">
        <i class="ph-bold ph-caret-right"></i>
      </button>
    </div>
  </div>
</template>
