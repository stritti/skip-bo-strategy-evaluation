<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Strategy } from '../../game/types';

const props = defineProps<{
  modelValue: Strategy;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Strategy];
}>();

const isOpen = ref(false);
const options: Strategy[] = ['Optimiert', 'Zufall', 'Spontan'];
const containerRef = ref<HTMLElement | null>(null);

const getIcon = (s: Strategy) => {
  switch (s) {
    case 'Optimiert': return 'ph-brain';
    case 'Zufall': return 'ph-dice-five';
    case 'Spontan': return 'ph-lightning';
    default: return 'ph-question';
  }
};

const getColor = (s: Strategy) => {
  switch (s) {
    case 'Optimiert': return 'text-skipbo-blue';
    case 'Zufall': return 'text-skipbo-green';
    case 'Spontan': return 'text-skipbo-red';
    default: return 'text-gray-400';
  }
};

const toggle = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const select = (option: Strategy) => {
  emit('update:modelValue', option);
  isOpen.value = false;
};

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- Trigger Button -->
    <button type="button" @click="toggle" :disabled="disabled"
      class="relative w-full bg-white border-2 border-skipbo-red/20 rounded-xl py-3 pl-3 pr-10 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-skipbo-red focus:border-skipbo-red sm:text-sm transition-all duration-200"
      :class="{ 'opacity-60 cursor-not-allowed': disabled, 'border-skipbo-red ring-2 ring-skipbo-red/20': isOpen }">
      <span class="flex items-center gap-3">
        <i :class="[getIcon(modelValue), getColor(modelValue)]" class="ph-bold text-xl"></i>
        <span class="block truncate font-bold text-gray-900">{{ modelValue }}</span>
      </span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <i class="ph-bold ph-caret-down text-skipbo-red transition-transform duration-200" :class="{ 'rotate-180': isOpen }"></i>
      </span>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <ul v-if="isOpen"
        class="absolute z-[100] mt-1 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
        <li v-for="option in options" :key="option"
          @click="select(option)"
          class="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-skipbo-red/5 transition-colors"
          :class="{ 'bg-skipbo-red/10': option === modelValue }">
          <div class="flex items-center gap-3">
            <i :class="[getIcon(option), getColor(option)]" 
               class="ph-bold text-xl"></i>
            <span class="font-medium block truncate"
                  :class="option === modelValue ? 'text-skipbo-red font-bold' : 'text-gray-900'">
              {{ option }}
            </span>
          </div>

          <span v-if="option === modelValue"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-skipbo-red">
            <i class="ph-bold ph-check text-lg"></i>
          </span>
        </li>
      </ul>
    </transition>
  </div>
</template>
