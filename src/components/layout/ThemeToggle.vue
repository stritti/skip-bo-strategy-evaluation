<script setup lang="ts">
import { useTheme, type Theme } from '../../composables/useTheme';
import { onMounted } from 'vue';

const { theme, setTheme, initTheme } = useTheme();

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

const label: Record<Theme, string> = {
    light: 'Hell',
    dark: 'Dunkel',
    auto: 'Auto'
};
</script>

<template>
  <button @click="cycleTheme" 
    class="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
    :title="'Aktueller Modus: ' + label[theme]">
      <i class="ph-bold" :class="icon[theme]"></i>
       <span class="text-xs font-medium hidden md:inline-block">{{ label[theme] }}</span>
  </button>
</template>
