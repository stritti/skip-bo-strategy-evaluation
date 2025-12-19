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
import StatisticalSignificance from '../components/dashboard/StatisticalSignificance.vue';
import BoxPlotChart from '../components/dashboard/BoxPlotChart.vue';
import EffectSize from '../components/dashboard/EffectSize.vue';
import DataExport from '../components/dashboard/DataExport.vue';
import PowerAnalysis from '../components/dashboard/PowerAnalysis.vue';
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
    
    <!-- Welcome Introduction -->
    <div class="bg-gradient-to-r from-red-50 via-blue-50 to-green-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 p-6 shadow-sm">
      <div class="flex items-start gap-4 mb-6">
        <div class="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
          <i class="ph-fill ph-cards text-4xl text-red-600"></i>
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Willkommen beim Skip-Bo Strategy Analyzer</h2>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            Diese App simuliert <strong>echte Skip-Bo Spiele</strong> mit verschiedenen KI-Strategien und liefert 
            wissenschaftlich fundierte Analysen. Vergleichen Sie Gewinnraten, analysieren Sie Spielverläufe 
            und entdecken Sie optimale Strategien.
          </p>
          <div class="flex flex-wrap gap-3">
            <div class="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              <i class="ph-fill ph-check-circle text-green-600"></i>
              100% regelkonform
            </div>
            <div class="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              <i class="ph-fill ph-chart-line text-blue-600"></i>
              Statistische Signifikanz
            </div>
            <div class="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              <i class="ph-fill ph-database text-purple-600"></i>
              Persistente Historie
            </div>
          </div>
        </div>
      </div>

      <!-- Statistical Highlights -->
      <div v-if="simulation.cumulativeStats.value && simulation.history.value.length > 0"            class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-slate-700">
        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm text-center">
          <div class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1">Spiele Total</div>
          <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white">
            {{ simulation.cumulativeStats.value.totalGames.toLocaleString('de-DE') }}
          </div>
          <div class="text-xs text-gray-500 dark:text-slate-400 mt-1">Simuliert</div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm text-center">
          <div class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1">Simulationen</div>
          <div class="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {{ simulation.cumulativeStats.value.totalRuns }}
          </div>
          <div class="text-xs text-gray-500 dark:text-slate-400 mt-1">Durchläufe</div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm text-center">
          <div class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1">Ø Züge</div>
          <div class="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
            {{ simulation.cumulativeStats.value.avgTurns.toFixed(1) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-slate-400 mt-1">Pro Spiel</div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm text-center">
          <div class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1">Ø Joker</div>
          <div class="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
            {{ simulation.cumulativeStats.value.avgJokers.toFixed(1) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-slate-400 mt-1">Pro Spiel</div>
        </div>
      </div>

      <!-- Call to Action (if no data) -->
      <div v-else class="pt-6 border-t border-gray-200 dark:border-slate-700 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          <strong>Noch keine Simulationen durchgeführt.</strong> Starten Sie jetzt Ihre erste Analyse!
        </p>
        <div class="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-red-700 transition cursor-pointer">
          <i class="ph-bold ph-play-circle"></i>
          Erste Simulation starten
          <i class="ph-bold ph-arrow-down"></i>
        </div>
      </div>
    </div>

    <!-- Expert Tips Teaser -->
    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-yellow-300 dark:border-indigo-500/30 p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
         @click="router.push('/analysis')">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="bg-yellow-400 dark:bg-indigo-600 p-3 rounded-xl shadow-md">
            <i class="ph-fill ph-lightbulb text-3xl text-white"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              🏆 Die 8 Skip-Bo Expertentipps
              <span class="bg-yellow-400 dark:bg-indigo-600 text-yellow-900 dark:text-indigo-100 text-xs font-bold px-2 py-0.5 rounded-full">NEU</span>
            </h3>
            <p class="text-gray-700 dark:text-gray-300 text-sm">
              Entdecken Sie die optimalen Strategien basierend auf 1.000.000 simulierten Runden
            </p>
          </div>
        </div>
        <div class="hidden lg:flex items-center gap-2 text-yellow-700 dark:text-indigo-300 font-bold">
          Jetzt entdecken
          <i class="ph-bold ph-arrow-right text-xl"></i>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <span class="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
          📊 Vorratsstapel-Priorisierung
        </span>
        <span class="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
          🃏 Joker-Strategie
        </span>
        <span class="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
          📉 Absteigende Ablage
        </span>
        <span class="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
          ⚡ Maximale Aggression
        </span>
      </div>
    </div>

    <!-- Simulation Control Panel -->

    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
      <div class="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 px-6 py-4 flex justify-between items-center rounded-t-2xl">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ simulation.currentRunId.value === -1 ? 'Gesamtanalyse aller Simulationen' : 'Simulation Control Center' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ simulation.currentRunId.value === -1 
               ? 'Aggregierte Statistiken über ' + simulation.maxGamesConfig.value.toLocaleString('de-DE') + ' Spiele' 
               : 'Modellierung von ' + simulation.maxGamesConfig.value.toLocaleString('de-DE') + ' echten Spielrunden' 
            }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">Fortschritt</div>
          <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">
            {{ simulation.formattedCounter }}
            <span class="text-sm text-gray-400 font-normal">/ {{ simulation.maxGamesConfig.value.toLocaleString('de-DE') }}</span>
          </div>
        </div>
      </div>

      <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Settings -->
        <div class="lg:col-span-1 border-r pr-6 border-gray-100 dark:border-slate-700 hidden lg:block">
          <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <i class="ph-bold ph-gear-six text-xl text-skipbo-red"></i>Simulationseinstellungen
          </h3>
          <div class="bg-skipbo-red/5 dark:bg-skipbo-red/10 p-4 rounded-lg border border-skipbo-red/20">
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
          <p class="text-xs text-center text-gray-400 dark:text-gray-500 mt-3 px-4">
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
             <div class="p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <div class="flex items-center gap-3 mb-6">
                    <div class="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                        <i class="ph-bold ph-chart-pie-slice text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Globale Analyse</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Zusammenfassung aller gespeicherten Simulationen</p>
                    </div>
                </div>
                <!-- Stats Summary -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                        <div class="text-xs text-gray-400 uppercase font-bold">Gesamte Spiele</div>
                        <div class="text-3xl font-mono font-bold text-gray-900 dark:text-white">{{ simulation.maxGamesConfig.value.toLocaleString('de-DE') }}</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                        <div class="text-xs text-gray-400 uppercase font-bold">Ø Züge / Spiel</div>
                        <div class="text-3xl font-mono font-bold text-gray-900 dark:text-white">{{ simulation.cumulativeStats.value?.avgTurns.toFixed(1) }}</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                        <div class="text-xs text-gray-400 uppercase font-bold">Ø Joker / Spiel</div>
                        <div class="text-3xl font-mono font-bold text-gray-900 dark:text-white">{{ simulation.cumulativeStats.value?.avgJokers.toFixed(1) }}</div>
                    </div>
                </div>
                
                 <h4 class="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
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
            :winRateCI="simulation.winRateP1CI.value"
            :turnsCI="simulation.averageTurnsCI.value"
            />
            
            <!-- Statistical Significance Test -->
            <StatisticalSignificance
              :chiSquare="simulation.chiSquareResult.value.statistic"
              :pValue="simulation.chiSquareResult.value.pValue"
              :isSignificant="simulation.chiSquareResult.value.isSignificant"
              :applicable="simulation.chiSquareResult.value.applicable"
              :strategyA="simulation.strategyP1.value"
              :strategyB="simulation.strategyP2.value"
            />

            <!-- Distribution Analysis -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i class="ph-bold ph-chart-bar text-blue-600 dark:text-blue-400"></i>
                Verteilungsanalyse
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BoxPlotChart
                  :data="simulation.turnsDistribution.value"
                  label="Züge pro Spiel"
                  color="#3b82f6"
                  unit=""
                />
                <BoxPlotChart
                  :data="simulation.durationDistribution.value"
                  label="Dauer pro Spiel"
                  color="#8b5cf6"
                  unit="ms"
                />
              </div>
            </div>

            <!-- Advanced Statistical Metrics -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i class="ph-bold ph-flask text-purple-600 dark:text-purple-400"></i>
                Erweiterte Analysen
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Effect Size -->
                <EffectSize
                  v-if="simulation.effectSizeResult.value.applicable"
                  :effectSize="simulation.effectSizeResult.value.d"
                  :interpretation="simulation.effectSizeResult.value.interpretation"
                  :magnitude="simulation.effectSizeResult.value.magnitude"
                  label="Effektstärke (Züge)"
                />
                
                <!-- Data Export -->
                <DataExport
                  :data="simulation.rawData.value"
                  :strategyP1="simulation.strategyP1.value"
                  :strategyP2="simulation.strategyP2.value"
                />
              </div>

              <!-- Power Analysis -->
              <PowerAnalysis />
            </div>

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <WinRateChart ref="winRateChartComponent" />
            <DurationChart ref="durationChartComponent" />
            </div>
        </div>

        <div class="bg-skipbo-blue/5 dark:bg-skipbo-blue/10 border border-skipbo-blue/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <i class="ph-fill ph-database text-skipbo-blue dark:text-skipbo-blue/80 text-xl"></i>
            <span class="text-sm text-skipbo-blue dark:text-skipbo-blue/80 font-bold">Die Rohdaten der {{
              simulation.maxGamesConfig.value.toLocaleString('de-DE') }} Spiele wurden generiert und die Statistik
              hochgerechnet.</span>
          </div>
          <button @click="router.push('/data')"
            class="text-sm bg-white dark:bg-slate-800 text-skipbo-blue dark:text-blue-300 px-4 py-2 rounded-lg border border-skipbo-blue/20 dark:border-blue-900 font-bold hover:bg-skipbo-blue/10 dark:hover:bg-blue-900/30 shadow-sm transition w-full sm:w-auto">
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
