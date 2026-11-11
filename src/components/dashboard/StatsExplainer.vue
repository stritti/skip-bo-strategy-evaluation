<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

const items = ['winrate', 'mcnemar', 'effect', 'power', 'boxplot', 'seed'] as const;
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
      <i class="ph-bold ph-question text-blue-600 dark:text-blue-400"></i>
      {{ t('dash.glossary.title') }}
    </h3>
    <p class="text-sm text-gray-500 dark:text-slate-400 mb-6">{{ t('dash.glossary.sub') }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="item in items" :key="item"
        class="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
        <h4 class="font-bold text-sm text-gray-900 dark:text-white mb-1.5">{{ t(`dash.glossary.${item}.h`) }}</h4>
        <p class="text-xs text-gray-600 dark:text-slate-300 leading-relaxed" v-html="t(`dash.glossary.${item}.p`)"></p>
      </div>
    </div>
  </div>
</template>
