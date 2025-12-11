<script setup lang="ts">
import AppNavigation from './components/layout/AppNavigation.vue';
import AppFooter from './components/layout/AppFooter.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-skipbo-red/5 via-white to-skipbo-blue/5">
    <AppNavigation />
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <AppFooter />

    <!-- Floating Vibe Coded Badge -->
    <router-link to="/about"
      class="fixed bottom-6 right-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center group z-50"
      style="width: 72px; height: 72px;">
      <i class="ph-fill ph-sparkle text-xl mb-0.5 animate-pulse"></i>
      <span class="text-[9px] font-bold leading-tight text-center group-hover:animate-pulse">100%<br>vibe<br>coded</span>
      <i class="ph-bold ph-sparkle text-xs absolute -top-1 -right-1 animate-pulse"></i>
    </router-link>
  </div>
</template>
