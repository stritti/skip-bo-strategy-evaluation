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
  </div>
</template>

