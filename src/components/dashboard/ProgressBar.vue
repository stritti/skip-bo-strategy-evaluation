<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  progress: number;
}>();
</script>

<template>
  <div>
    <div class="relative w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
      <div class="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="flex justify-between text-xs text-gray-400 font-medium mb-4">
      <span>0%</span>
      <span>{{ Math.round(progress) }}%</span>
      <span>100%</span>
    </div>
  </div>
</template>
