<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import LogDisplay from '../components/dashboard/LogDisplay.vue';
import ProgressBar from '../components/dashboard/ProgressBar.vue';
import KPICards from '../components/dashboard/KPICards.vue';
import WinRateChart from '../components/dashboard/WinRateChart.vue';
import DurationChart from '../components/dashboard/DurationChart.vue';
import HistoryTable from '../components/dashboard/HistoryTable.vue';
import AggregateAnalysis from '../components/dashboard/AggregateAnalysis.vue';
import StrategySelect from '../components/dashboard/StrategySelect.vue';
import { useSimulation } from '../composables/useSimulation';
import { useCharts } from '../composables/useCharts';

const router = useRouter();
const simulation = useSimulation();
const charts = useCharts();

const winRateChartComponent = ref<InstanceType<typeof WinRateChart> | null>(null);
const durationChartComponent = ref<InstanceType<typeof DurationChart> | null>(null);

// Watch for view changes to reinitialize charts
watch(() => computed(() => simulation.isFinished.value), (isFinished) => {
  if (isFinished) {
    nextTick(() => {
      if (winRateChartComponent.value?.canvasRef && durationChartComponent.value?.canvasRef) {
        charts.winRateChartRef.value = winRateChartComponent.value.canvasRef;
        charts.durationChartRef.value = durationChartComponent.value.canvasRef;
        charts.initCharts(simulation.winRateP1.value, simulation.averageTurns.value);
      }
    });
  }
});

// Watch for game count changes to auto-reset simulation
watch(() => simulation.maxGamesConfig.value, () => {
  if (!simulation.isSimulating.value && simulation.isFinished.value && simulation.currentRunId.value !== -1) {
    charts.destroyAllCharts();
    simulation.resetSimulation();
  }
});

// Watch for loaded run changes to update charts
watch(() => simulation.currentRunId.value, (newRunId) => {
  if (newRunId) {
    nextTick(() => {
      // Re-initialize charts with the loaded data
      if (winRateChartComponent.value?.canvasRef && durationChartComponent.value?.canvasRef) {
        charts.winRateChartRef.value = winRateChartComponent.value.canvasRef;
        charts.durationChartRef.value = durationChartComponent.value.canvasRef;
        charts.initCharts(simulation.winRateP1.value, simulation.averageTurns.value);
      }
    });
  }
});

const handleRunSimulation = () => {
  charts.destroyAllCharts();
  simulation.runSimulation();
};

const handleResetSimulation = () => {
  charts.destroyAllCharts();
  simulation.resetSimulation();
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-12">
    <!-- Simulation Control Panel -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center rounded-t-2xl">
        <div>
          <h2 class="text-lg font-bold text-gray-900">
            {{ simulation.currentRunId.value === -1 ? 'Gesamtanalyse aller Simulationen' : 'Simulation Control Center' }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ simulation.currentRunId.value === -1 
               ? 'Aggregierte Statistiken über ' + simulation.maxGamesConfig.value.toLocaleString('de-DE') + ' Spiele' 
               : 'Modellierung von ' + simulation.maxGamesConfig.value.toLocaleString('de-DE') + ' echten Spielrunden' 
            }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">Fortschritt</div>
          <div class="text-2xl font-mono font-bold text-gray-900 tabular-nums">
            {{ simulation.formattedCounter }}
            <span class="text-sm text-gray-400 font-normal">/ {{ simulation.maxGamesConfig.value.toLocaleString('de-DE') }}</span>
          </div>
        </div>
      </div>

      <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Settings -->
        <div class="lg:col-span-1 border-r pr-6 border-gray-100 hidden lg:block">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="ph-bold ph-gear-six text-xl text-skipbo-red"></i>Simulationseinstellungen
          </h3>
          <div class="bg-skipbo-red/5 p-4 rounded-lg border border-skipbo-red/20">
            <label for="gameCountSlider" class="block text-sm font-medium text-skipbo-red mb-2">
              Anzahl der Spielrunden:
              <span class="font-bold text-lg">{{ simulation.maxGamesConfig.value.toLocaleString('de-DE') }}</span>
            </label>
            <input id="gameCountSlider" type="range" v-model.number="simulation.maxGamesConfig.value"
              :min="simulation.minGames" :max="simulation.maxGamesLimit" :step="simulation.stepGames"
              :disabled="simulation.isSimulating.value">
            <div class="flex justify-between text-xs text-skipbo-red mt-2 font-mono font-bold">
              <span>{{ simulation.minGames }}</span>
              <span>{{ simulation.maxGamesLimit.toLocaleString('de-DE') }}</span>
            </div>
            <p class="text-xs text-skipbo-red/70 mt-2">
              Je höher die Zahl, desto genauer die Statistik (aber länger die Laufzeit).
            </p>

            <!-- Strategy Selectors -->
            <div class="mt-6 pt-6 border-t border-skipbo-red/10">
              <div class="space-y-5">
                <!-- P1 -->
                <div>
                  <label class="block text-xs font-bold text-skipbo-red uppercase tracking-wider mb-2">Strategie Spieler 1</label>
                  <StrategySelect 
                    v-model="simulation.strategyP1.value" 
                    :disabled="simulation.isSimulating.value" 
                  />
                </div>

                <!-- P2 -->
                <div>
                  <label class="block text-xs font-bold text-skipbo-red uppercase tracking-wider mb-2">Strategie Spieler 2</label>
                  <StrategySelect 
                    v-model="simulation.strategyP2.value" 
                    :disabled="simulation.isSimulating.value" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Log & Progress -->
        <div class="lg:col-span-2">
          <LogDisplay :logs="simulation.logs.value" />
          <ProgressBar :progress="simulation.progress.value" />

          <!-- Action Button -->
          <button 
            @click="simulation.isFinished.value ? handleResetSimulation() : handleRunSimulation()"
            :disabled="simulation.isSimulating.value"
            class="w-full h-16 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex justify-center items-center gap-3 transform hover:-translate-y-1 active:translate-y-0 disabled:transform-none disabled:opacity-70 disabled:cursor-not-allowed"
            :class="simulation.buttonClass.value">
            <i v-if="simulation.isSimulating.value" class="ph-bold ph-spinner animate-spin text-2xl"></i>
            <i v-else-if="simulation.isFinished.value" class="ph-bold ph-arrow-counter-clockwise text-2xl"></i>
            <i v-else class="ph-bold ph-play text-2xl"></i>
            {{ simulation.buttonText.value }}
          </button>
          <p class="text-xs text-center text-gray-400 mt-3 px-4">
            Klicken Sie, um die {{ simulation.maxGamesConfig.value.toLocaleString('de-DE') }} Spiele zu starten oder
            den Zustand zurückzusetzen.
          </p>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <transition name="fade">
      <div v-show="simulation.isFinished.value" class="space-y-8">
        
        <!-- Aggregate Analysis (Load All) -->
        <div v-if="simulation.currentRunId.value === -1" class="space-y-8">
             <div class="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div class="flex items-center gap-3 mb-6">
                    <div class="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <i class="ph-bold ph-chart-pie-slice text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900">Globale Analyse</h3>
                        <p class="text-sm text-gray-500">Zusammenfassung aller gespeicherten Simulationen</p>
                    </div>
                </div>
                <!-- Stats Summary -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                        <div class="text-xs text-gray-400 uppercase font-bold">Gesamte Spiele</div>
                        <div class="text-3xl font-mono font-bold text-gray-900">{{ simulation.maxGamesConfig.value.toLocaleString('de-DE') }}</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                        <div class="text-xs text-gray-400 uppercase font-bold">Ø Züge / Spiel</div>
                        <div class="text-3xl font-mono font-bold text-gray-900">{{ simulation.cumulativeStats.value?.avgTurns.toFixed(1) }}</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                        <div class="text-xs text-gray-400 uppercase font-bold">Ø Joker / Spiel</div>
                        <div class="text-3xl font-mono font-bold text-gray-900">{{ simulation.cumulativeStats.value?.avgJokers.toFixed(1) }}</div>
                    </div>
                </div>
                
                 <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i class="ph-bold ph-sword text-skipbo-red"></i> Matchup-Analyse
                 </h4>
                 <AggregateAnalysis :results="simulation.aggregatedResults.value" />
             </div>
        </div>

        <!-- Single Run Analysis -->
        <div v-else class="space-y-8">
            <KPICards 
            :averageTurns="simulation.averageTurns.value"
            :winRateP1="simulation.winRateP1.value"
            :averageJokers="simulation.averageJokers.value"
            />

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <WinRateChart ref="winRateChartComponent" />
            <DurationChart ref="durationChartComponent" />
            </div>
        </div>

        <div class="bg-skipbo-blue/5 border border-skipbo-blue/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <i class="ph-fill ph-database text-skipbo-blue text-xl"></i>
            <span class="text-sm text-skipbo-blue font-bold">Die Rohdaten der {{
              simulation.maxGamesConfig.value.toLocaleString('de-DE') }} Spiele wurden generiert und die Statistik
              hochgerechnet.</span>
          </div>
          <button @click="router.push('/data')"
            class="text-sm bg-white text-skipbo-blue px-4 py-2 rounded-lg border border-skipbo-blue/20 font-bold hover:bg-skipbo-blue/10 shadow-sm transition w-full sm:w-auto">
            Zur Datentabelle →
          </button>
        </div>
      </div>
    </transition>

    <!-- History Tables (Always visible if history exists) -->
    <HistoryTable 
      :history="simulation.history.value" 
      :currentRunId="simulation.currentRunId.value"
      @clearHistory="simulation.clearHistory()" 
      @loadRun="simulation.loadRun"
      @loadAll="simulation.loadAllRuns"
    />
  </div>
</template>
