<script setup lang="ts">
import type { LogEntry } from '../../game/types';

defineProps<{
  logs: LogEntry[];
}>();
</script>

<template>
  <div class="log-container mb-4 flex flex-col-reverse p-4 font-mono relative">
    <div class="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-10"></div>
    <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none z-10"></div>

    <transition-group name="list">
      <div v-for="log in logs" :key="log.id" class="py-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
        <span class="text-gray-500">{{ log.time }}</span>
        <span :class="log.color">{{ log.type }}</span>
        <span class="text-gray-300">> {{ log.text }}</span>
      </div>
    </transition-group>
    <div v-if="logs.length === 0" class="flex h-full items-center justify-center text-gray-600 italic">
      System bereit. Warte auf Startbefehl...
    </div>
  </div>
</template>
