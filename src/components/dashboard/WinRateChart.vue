<script setup lang="ts">
import { ref, onMounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

defineExpose({
  canvasRef
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <h3 class="font-bold text-gray-900 mb-1">Siegesverteilung</h3>
    <p class="text-sm text-gray-500 mb-6">Optimierte Strategie vs. Zufall</p>
    <div class="chart-container">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>
