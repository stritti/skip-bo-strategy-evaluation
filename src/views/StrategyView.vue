<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import StrategyDuel from '../components/StrategyDuel.vue';

const { t, tm } = useI18n({ useScope: 'global' });

const cards = [
    { key: 'opt', icon: 'ph-fill ph-brain', color: 'text-skipbo-blue', bg: 'bg-skipbo-blue/10', border: 'hover:border-skipbo-blue/30' },
    { key: 'rnd', icon: 'ph-fill ph-dice-five', color: 'text-skipbo-green', bg: 'bg-skipbo-green/10', border: 'hover:border-skipbo-green/30' },
    { key: 'spo', icon: 'ph-fill ph-lightning', color: 'text-skipbo-red', bg: 'bg-skipbo-red/10', border: 'hover:border-skipbo-red/30' },
    { key: 'adv', icon: 'ph-fill ph-sword', color: 'text-purple-600', bg: 'bg-purple-100', border: 'hover:border-purple-300' }
] as const;

const strengths = (key: string) => tm(`strategy.${key}.strengths`) as string[];
const weaknesses = (key: string) => tm(`strategy.${key}.weaknesses`) as string[];
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ t('strategy.title') }}</h1>
      <p class="text-gray-500 dark:text-gray-400 text-lg">{{ t('strategy.subtitle') }}</p>
    </div>

    <div class="mb-16">
        <StrategyDuel />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <div v-for="card in cards" :key="card.key"
        class="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        :class="card.border">
        <div class="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
           <i :class="[card.icon, card.color, 'text-[120px] transform rotate-12']"></i>
        </div>

        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" :class="card.bg">
          <i :class="[card.icon, card.color, 'text-3xl']"></i>
        </div>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t(`strategy.${card.key}.name`) }}</h3>
        <span class="inline-block text-xs font-bold px-2 py-1 rounded mb-4" :class="[card.bg, card.color]">{{ t(`strategy.${card.key}.tag`) }}</span>

        <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{{ t(`strategy.${card.key}.desc`) }}</p>

        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-check text-green-500"></i> {{ t('strategy.strengths') }}
            </h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-6 list-disc">
              <li v-for="(s, i) in strengths(card.key)" :key="i">{{ s }}</li>
            </ul>
          </div>
           <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-x text-red-500"></i> {{ t('strategy.weaknesses') }}
            </h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-6 list-disc">
              <li v-for="(w, i) in weaknesses(card.key)" :key="i">{{ w }}</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
