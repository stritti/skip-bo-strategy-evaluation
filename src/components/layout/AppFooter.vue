<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-slate-800 mt-auto bg-white dark:bg-slate-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 dark:text-slate-500">
      <div>{{ t('footer.copyright') }}</div>
      <div class="mt-2 md:mt-0 flex items-center gap-1.5">
        <span>{{ t('footer.builtWith') }}</span>
        <span class="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded font-semibold" :title="t('footer.aiTitle')">
          <i class="ph-bold ph-robot"></i> {{ t('footer.aiLabel') }}
        </span>
      </div>
    </div>
  </footer>
</template>
