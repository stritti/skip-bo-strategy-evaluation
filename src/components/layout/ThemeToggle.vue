<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme, type Theme } from '../../composables/useTheme';
import { onMounted } from 'vue';

const { theme, setTheme, initTheme } = useTheme();
const { t } = useI18n({ useScope: 'global' });

onMounted(() => {
    initTheme();
});

const cycleTheme = () => {
    if (theme.value === 'light') setTheme('dark');
    else if (theme.value === 'dark') setTheme('auto');
    else setTheme('light');
};

const icon: Record<Theme, string> = {
    light: 'ph-sun',
    dark: 'ph-moon',
    auto: 'ph-desktop'
};

const label = computed(() => t(`theme.${theme.value}`));
</script>

<template>
  <button @click="cycleTheme"
    class="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
    :title="t('theme.title', { mode: label })">
      <i class="ph-bold" :class="icon[theme]"></i>
       <span class="text-xs font-medium hidden md:inline-block">{{ label }}</span>
  </button>
</template>
