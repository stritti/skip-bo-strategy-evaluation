<script setup lang="ts">
import {ref } from 'vue';
import AppNavigation from './components/layout/AppNavigation.vue';
import AppFooter from './components/layout/AppFooter.vue';
import DashboardView from './views/DashboardView.vue';
import DataExplorerView from './views/DataExplorerView.vue';
import RulesView from './views/RulesView.vue';
import StrategyView from './views/StrategyView.vue';

const currentView = ref('dashboard');

const handleViewChange = (view: string) => {
  currentView.value = view;
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppNavigation v-model:current-view="currentView" />
    
    <main class="flex-grow">
      <DashboardView v-if="currentView === 'dashboard'" @change-view="handleViewChange" />
      <DataExplorerView v-else-if="currentView === 'data'" />
      <RulesView v-else-if="currentView === 'rules'" />
      <StrategyView v-else-if="currentView === 'strategy'" />
    </main>
    
    <AppFooter />
  </div>
</template>
