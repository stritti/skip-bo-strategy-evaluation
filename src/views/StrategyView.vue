<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { Scenario } from '../game/types';

const scenarios: Record<number, Scenario> = reactive({
  1: {
    title: "Der Blocker",
    desc: "Sollte man eigene Karten zurückhalten, um den Gegner zu blockieren?",
    stacks: [
      { label: "Gegner", value: "7", styleClass: "bg-red-50 text-red-600 border-red-200" },
      { label: "Deine Hand", value: "7", styleClass: "bg-blue-50 text-blue-600 border-blue-500 ring-2 ring-blue-200" }
    ],
    analysis: "<strong>KI Entscheidung: JA.</strong> Es lohnt sich in 82% der Fälle, den eigenen Fortschritt zu opfern, wenn man den Gegner damit sicher blockieren kann. Das Blockieren des aktuellen Bedarfs des Gegners ist ein hoher Wert."
  },
  2: {
    title: "Hand-Management",
    desc: "Hand leer spielen vs. strategisches Abwerfen.",
    stacks: [
      { label: "Hand", value: "K", styleClass: "bg-gray-50 text-gray-800" },
      { label: "Hand", value: "2", styleClass: "bg-gray-50 text-gray-800" }
    ],
    analysis: "<strong>KI Entscheidung: LEER SPIELEN.</strong> Die Wahrscheinlichkeit, einen Joker oder eine nützliche Karte zu ziehen, steigt drastisch, wenn man 5 neue Karten zieht. Immer versuchen, die Hand in einem Zug komplett zu spielen, um 5 neue Karten zu erhalten."
  },
  3: {
    title: "Ablage-Priorität",
    desc: "Karten von der Hand oder vom Ablagestapel nutzen?",
    stacks: [
      { label: "Ablage", value: "5", styleClass: "bg-orange-50 text-orange-600 border-orange-300" },
      { label: "Hand", value: "5", styleClass: "bg-white text-gray-400 border-dashed" }
    ],
    analysis: "<strong>KI Entscheidung: ABLAGESTAPEL.</strong> Karten im Ablagestapel sind 'totes Kapital'. Befreie sie immer zuerst, um Zugriff auf die darunter liegenden Karten zu bekommen und die Vielfalt der Spielmöglichkeiten zu erhöhen."
  }
});

const activeScenarioId = ref(1);
const activeScenario = computed(() => scenarios[activeScenarioId.value]);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-10">
      <h2 class="text-2xl font-bold text-gray-900">Strategie-Labor</h2>
      <p class="text-gray-500">Interaktive Szenarien basierend auf den Tabellendaten</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button v-for="(scen, id) in scenarios" :key="id" @click="activeScenarioId = id"
        class="p-4 rounded-xl border text-left transition hover:shadow-md relative overflow-hidden group"
        :class="activeScenarioId === id ? 'bg-white border-red-500 ring-1 ring-red-500 shadow-md' : 'bg-white border-gray-200 hover:border-red-300'">
        <div v-if="activeScenarioId === id" class="absolute top-0 right-0 p-1">
          <div class="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
        <div class="font-bold text-sm" :class="activeScenarioId === id ? 'text-red-800' : 'text-gray-800'">{{ scen.title }}</div>
        <div class="text-xs mt-1 text-gray-500 line-clamp-2">{{ scen.desc }}</div>
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h4 class="text-lg font-bold text-gray-900 mb-2">{{ activeScenario.title }}</h4>
      <div class="flex justify-center gap-8 my-8">
        <div v-for="stack in activeScenario.stacks" :key="stack.label" class="text-center">
          <div class="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">{{ stack.label }}</div>
          <div class="w-16 h-24 rounded-lg flex items-center justify-center font-bold text-xl shadow-sm border"
            :class="stack.styleClass">
            {{ stack.value }}
          </div>
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed border-l-4 border-red-500"
        v-html="activeScenario.analysis"></div>
    </div>
  </div>
</template>
