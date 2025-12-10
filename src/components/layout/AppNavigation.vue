<script setup lang="ts">
// No script needed for pure router links
</script>

<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center gap-2">
          <div class="bg-skipbo-red text-white p-1.5 rounded-lg shadow-sm">
            <i class="ph-bold ph-cards text-xl"></i>
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-gray-900 leading-tight">Skip-Bo Analyst</h1>
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Echte Simulation</div>
          </div>
        </div>
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
            class="px-3 py-2 rounded-md transition-colors hover:bg-gray-50 hover:text-skipbo-red">
            Strategie
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
