<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ThemeToggle from './ThemeToggle.vue';
import { isEnPath, LOCALE_STORAGE_KEY } from '../../i18n';

const { t, locale } = useI18n({ useScope: 'global' });
const route = useRoute();
const router = useRouter();

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const lp = computed(() => (isEnPath(route.path) ? '/en' : ''));

const switchLocale = () => {
  const target = isEnPath(route.path)
    ? (route.path === '/en' ? '/' : route.path.slice(3))
    : (route.path === '/' ? '/en' : `/en${route.path}`);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, isEnPath(route.path) ? 'de' : 'en');
  }
  router.push(target);
};
</script>

<template>
  <nav class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <router-link :to="lp + '/'" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div class="bg-skipbo-red p-1.5 rounded-lg shadow-sm">
            <img src="/favicon.png" alt="Skip-Bo Logo" class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Skip-Bo Analyst</h1>
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{{ t('nav.subtitle') }}</div>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          <router-link :to="lp + '/'" active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-skipbo-red">
            {{ t('nav.dashboard') }}
          </router-link>

          <!-- Simulation Dropdown -->
          <div class="relative group">
              <button class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 group-hover:text-skipbo-blue">
                  {{ t('nav.simulation') }} <i class="ph-bold ph-caret-down text-xs mt-0.5"></i>
              </button>

              <div class="absolute left-0 mt-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                  <router-link :to="`${lp}/analysis`" active-class="bg-blue-50 dark:bg-blue-900/40 text-skipbo-blue dark:text-blue-400 font-bold"
                    class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-skipbo-blue dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                    <i class="ph ph-lightbulb"></i> {{ t('nav.analysis') }}
                  </router-link>
                  <router-link :to="`${lp}/data`" active-class="bg-blue-50 dark:bg-blue-900/40 text-skipbo-blue dark:text-blue-400 font-bold"
                    class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-skipbo-blue dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                    <i class="ph ph-table"></i> {{ t('nav.data') }}
                  </router-link>
              </div>
          </div>

          <!-- Wissen Dropdown -->
          <div class="relative group">
              <button class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 group-hover:text-skipbo-red">
                  {{ t('nav.knowledge') }} <i class="ph-bold ph-caret-down text-xs mt-0.5"></i>
              </button>

              <div class="absolute left-0 mt-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                   <router-link :to="`${lp}/strategy`" active-class="bg-red-50 dark:bg-red-900/40 text-skipbo-red dark:text-red-400 font-bold"
                    class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-skipbo-red dark:hover:text-red-400 flex items-center gap-2 transition-colors">
                    <i class="ph ph-strategy"></i> {{ t('nav.strategy') }}
                  </router-link>
                  <router-link :to="`${lp}/rules`" active-class="bg-red-50 dark:bg-red-900/40 text-skipbo-red dark:text-red-400 font-bold"
                    class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-skipbo-red dark:hover:text-red-400 flex items-center gap-2 transition-colors">
                    <i class="ph ph-scroll"></i> {{ t('nav.rules') }}
                  </router-link>
                   <router-link :to="`${lp}/validation`" active-class="bg-red-50 dark:bg-red-900/40 text-skipbo-red dark:text-red-400 font-bold"
                    class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-skipbo-red dark:hover:text-red-400 flex items-center gap-2 transition-colors">
                    <i class="ph ph-seal-check"></i> {{ t('nav.validation') }}
                  </router-link>
                  <router-link :to="`${lp}/references`" active-class="bg-red-50 dark:bg-red-900/40 text-skipbo-red dark:text-red-400 font-bold"
                    class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-skipbo-red dark:hover:text-red-400 flex items-center gap-2 transition-colors">
                    <i class="ph ph-books"></i> {{ t('nav.references') }}
                  </router-link>
              </div>
          </div>

          <router-link :to="`${lp}/about`" active-class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 flex items-center gap-1 ml-2">
            <i class="ph ph-info"></i> {{ t('nav.about') }}
          </router-link>

          <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

          <ThemeToggle />

          <button @click="switchLocale"
            class="px-2 py-1 rounded-md text-xs font-bold border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            :title="locale === 'en' ? 'Zu Deutsch wechseln' : 'Switch to English'">
            {{ locale === 'en' ? 'DE' : 'EN' }}
          </button>

          <a href="https://github.com/stritti/skip-bo-strategy-evaluation" target="_blank" rel="noopener noreferrer"
            class="ml-2 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" :title="t('nav.github')">
            <i class="ph-bold ph-github-logo text-2xl"></i>
          </a>
        </div>


        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button @click="switchLocale"
            class="px-2 py-1 rounded-md text-xs font-bold border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400"
            :title="locale === 'en' ? 'Zu Deutsch wechseln' : 'Switch to English'">
            {{ locale === 'en' ? 'DE' : 'EN' }}
          </button>

          <button @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :aria-label="mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')">
            <i v-if="!mobileMenuOpen" class="ph-bold ph-list text-2xl"></i>
            <i v-else class="ph-bold ph-x text-2xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2">
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto max-h-[85vh]">
        <div class="px-4 py-3 space-y-1">
          <router-link :to="lp + '/'" @click="closeMobileMenu"
            active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-skipbo-red transition-colors">
            <i class="ph-bold ph-house mr-2"></i>{{ t('nav.dashboard') }}
          </router-link>

          <!-- Simulation Group -->
          <div class="pt-2 pb-1">
              <div class="px-3 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">{{ t('nav.simulation') }}</div>
              <router-link :to="`${lp}/analysis`" @click="closeMobileMenu"
                active-class="bg-skipbo-blue/10 dark:bg-blue-900/30 text-skipbo-blue dark:text-blue-400 font-bold"
                class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-skipbo-blue dark:hover:text-blue-400 transition-colors ml-2 border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                {{ t('nav.analysis') }}
              </router-link>
              <router-link :to="`${lp}/data`" @click="closeMobileMenu"
                active-class="bg-skipbo-blue/10 dark:bg-blue-900/30 text-skipbo-blue dark:text-blue-400 font-bold"
                class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-skipbo-blue dark:hover:text-blue-400 transition-colors ml-2 border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                {{ t('nav.data') }}
              </router-link>
          </div>

          <!-- Wissen Group -->
          <div class="pt-2 pb-1">
              <div class="px-3 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">{{ t('nav.knowledge') }}</div>
               <router-link :to="`${lp}/strategy`" @click="closeMobileMenu"
                active-class="bg-skipbo-red/10 dark:bg-red-900/30 text-skipbo-red dark:text-red-400 font-bold"
                class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-skipbo-red dark:hover:text-red-400 transition-colors ml-2 border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                {{ t('nav.strategy') }}
              </router-link>
              <router-link :to="`${lp}/rules`" @click="closeMobileMenu"
                active-class="bg-skipbo-red/10 dark:bg-red-900/30 text-skipbo-red dark:text-red-400 font-bold"
                class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-skipbo-red dark:hover:text-red-400 transition-colors ml-2 border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                {{ t('nav.rules') }}
              </router-link>
               <router-link :to="`${lp}/validation`" @click="closeMobileMenu"
                active-class="bg-skipbo-red/10 dark:bg-red-900/30 text-skipbo-red dark:text-red-400 font-bold"
                class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-skipbo-red dark:hover:text-red-400 transition-colors ml-2 border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                {{ t('nav.validation') }}
              </router-link>
              <router-link :to="`${lp}/references`" @click="closeMobileMenu"
                active-class="bg-skipbo-red/10 dark:bg-red-900/30 text-skipbo-red dark:text-red-400 font-bold"
                class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-skipbo-red dark:hover:text-red-400 transition-colors ml-2 border-l-2 border-gray-100 dark:border-slate-800 pl-4">
                {{ t('nav.references') }}
              </router-link>
          </div>

          <div class="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
             <router-link :to="`${lp}/about`" @click="closeMobileMenu"
                active-class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold"
                class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-colors">
                <i class="ph ph-info mr-2"></i>{{ t('nav.about') }}
              </router-link>
            <a href="https://github.com/stritti/skip-bo-strategy-evaluation" target="_blank" rel="noopener noreferrer"
              class="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <i class="ph-bold ph-github-logo mr-2"></i>{{ t('nav.github') }}
            </a>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>
