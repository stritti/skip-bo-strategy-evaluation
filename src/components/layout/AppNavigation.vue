<script setup lang="ts">
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div class="bg-skipbo-red text-white p-1.5 rounded-lg shadow-sm">
            <i class="ph-bold ph-cards text-xl"></i>
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-gray-900 leading-tight">Skip-Bo Analyst</h1>
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Echte Simulation</div>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-500">
          <router-link to="/" active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 hover:text-skipbo-red">
            Dashboard
          </router-link>
          
          <router-link to="/data" active-class="bg-skipbo-blue/10 text-skipbo-blue font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 hover:text-skipbo-blue flex items-center gap-1">
            <i class="ph ph-table"></i> Datensätze
          </router-link>
          
          <router-link to="/rules" active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 hover:text-skipbo-red flex items-center gap-1">
            <i class="ph ph-scroll"></i> Regeln
          </router-link>
          
          <router-link to="/strategy" active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 hover:text-skipbo-red text-grey-500">
            Strategie
          </router-link>

          <router-link to="/analysis" active-class="bg-skipbo-blue/10 text-skipbo-blue font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 hover:text-skipbo-blue flex items-center gap-1">
            <i class="ph ph-lightbulb"></i> Analyse
          </router-link>

          <router-link to="/validation" active-class="bg-green-100 text-green-700 font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 hover:text-green-600 flex items-center gap-1">
            <i class="ph ph-seal-check"></i> Validierung
          </router-link>

          <router-link to="/about" active-class="bg-purple-100 text-purple-700 font-bold"
            class="px-3 py-2 rounded-md transition-colors hover:bg-purple-50 hover:text-purple-600 flex items-center gap-1 ml-2">
            <i class="ph ph-info"></i> Über
          </router-link>

          <a href="https://github.com/stritti/skip-bo-strategy-evaluation" target="_blank" rel="noopener noreferrer"
            class="ml-4 p-2 text-gray-400 hover:text-gray-900 transition-colors" title="GitHub Repository">
            <i class="ph-bold ph-github-logo text-2xl"></i>
          </a>
        </div>


        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button @click="toggleMobileMenu" 
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            :aria-label="mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'">
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
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white shadow-lg">
        <div class="px-4 py-3 space-y-1">
          <router-link to="/" @click="closeMobileMenu"
            active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-skipbo-red transition-colors">
            <i class="ph-bold ph-house mr-2"></i>Dashboard
          </router-link>
          
          <router-link to="/data" @click="closeMobileMenu"
            active-class="bg-skipbo-blue/10 text-skipbo-blue font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-skipbo-blue transition-colors">
            <i class="ph ph-table mr-2"></i>Datensätze
          </router-link>
          
          <router-link to="/rules" @click="closeMobileMenu"
            active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-skipbo-red transition-colors">
            <i class="ph ph-scroll mr-2"></i>Regeln
          </router-link>
          
          <router-link to="/strategy" @click="closeMobileMenu"
            active-class="bg-skipbo-red/10 text-skipbo-red font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-skipbo-red transition-colors">
            <i class="ph-bold ph-strategy mr-2"></i>Strategie
          </router-link>

          <router-link to="/analysis" @click="closeMobileMenu"
            active-class="bg-skipbo-blue/10 text-skipbo-blue font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-skipbo-blue transition-colors">
            <i class="ph ph-lightbulb mr-2"></i>Analyse
          </router-link>

          <router-link to="/validation" @click="closeMobileMenu"
            active-class="bg-green-100 text-green-700 font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
            <i class="ph ph-seal-check mr-2"></i>Validierung
          </router-link>

          <router-link to="/about" @click="closeMobileMenu"
            active-class="bg-purple-100 text-purple-700 font-bold"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
            <i class="ph ph-info mr-2"></i>Über
          </router-link>

          <div class="pt-3 mt-3 border-t border-gray-200">
            <a href="https://github.com/stritti/skip-bo-strategy-evaluation" target="_blank" rel="noopener noreferrer"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <i class="ph-bold ph-github-logo mr-2"></i>GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

