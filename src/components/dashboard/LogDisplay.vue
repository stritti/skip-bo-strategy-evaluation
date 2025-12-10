<script setup lang="ts">
import type { LogEntry } from '../../game/types';

defineProps<{
  logs: LogEntry[];
}>();
</script>

<template>
  <div class="log-container mb-4 flex flex-col-reverse p-4 font-mono h-96 overflow-y-auto bg-black rounded-lg shadow-inner relative text-base border-2 border-slate-800">
    <!-- Gradients removed for clarity/contrast if user finds it hard to read -->
    
    <transition-group name="list">
      <div v-for="log in logs" :key="log.id" class="py-0 border-b border-white/10 last:border-0 whitespace-normal break-words leading-relaxed">
        <span class="text-emerald-400 font-bold mr-2">{{ log.time }}</span>
        <span :class="log.color" class="mr-2 font-bold uppercase tracking-wider">{{ log.type }}</span>
        <span class="text-gray-100">> {{ log.text }}</span>
      </div>
    </transition-group>
    
    <div v-if="logs.length === 0" class="flex h-full items-center justify-center text-gray-500 italic">
      System bereit. Warte auf Startbefehl...
    </div>
  </div>
</template>
