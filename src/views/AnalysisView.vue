<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
// Analysis View - Displays the deep dive strategy analysis
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-16">
    
    <!-- Hero Header -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        <i class="ph-bold ph-brain"></i>
        {{ t('analysis.heroBadge') }}
      </div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
        {{ t('analysis.heroTitle') }}
      </h1>
      <p class="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
        {{ t('analysis.heroSub') }}
      </p>
    </div>

    <!-- 8 Expert Tips Cards -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <i class="ph-bold ph-star text-yellow-500"></i>
        {{ t('analysis.tipsTitle') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Tip 1 -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
          <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#1</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip1h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            {{ t('analysis.tip1p') }}
          </p>
        </div>

        <!-- Tip 2 -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#2</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip2h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            {{ t('analysis.tip2p') }}
          </p>
        </div>

        <!-- Tip 3 -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#3</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip3h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            {{ t('analysis.tip3p') }}
          </p>
        </div>

        <!-- Tip 4 -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#4</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip4h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            {{ t('analysis.tip4p') }}
          </p>
        </div>

        <!-- Tip 5 -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#5</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip5h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            <span v-html="t('analysis.tip5p')"></span>
          </p>
        </div>

        <!-- Tip 6 -->
         <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#6</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip6h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            {{ t('analysis.tip6p') }}
          </p>
        </div>

        <!-- Tip 7 -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#7</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip7h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            {{ t('analysis.tip7p') }}
          </p>
        </div>

        <!-- Tip 8 -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 dark:text-slate-700 absolute top-4 right-4 pointer-events-none">#8</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">{{ t('analysis.tip8h') }}</h3>
          <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
            {{ t('analysis.tip8p') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Deep Dive Content -->
    <section class="prose prose-blue max-w-none bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <i class="ph-bold ph-read-cv-logo text-blue-600 dark:text-blue-400"></i>
            {{ t('analysis.bgTitle') }}
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            <div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4">{{ t('analysis.cardSourceTitle') }}</h3>
                <p class="text-gray-600 dark:text-slate-400 mb-4">
                    <span v-html="t('analysis.cardSourceP')"></span>
                </p>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                        <span class="font-bold text-red-800 dark:text-red-300">{{ t('analysis.prioStock') }}</span>
                        <span class="text-xs font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded text-red-600 dark:text-red-400 shadow-sm">{{ t('analysis.prioHighest') }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <span class="font-bold text-blue-800 dark:text-blue-300">{{ t('analysis.prioHand') }}</span>
                        <span class="text-xs font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400 shadow-sm">{{ t('analysis.prioCatalyst') }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                        <span class="font-bold text-gray-800 dark:text-slate-300">{{ t('analysis.prioDiscard') }}</span>
                        <span class="text-xs font-bold bg-white dark:bg-slate-700 px-2 py-1 rounded text-gray-600 dark:text-slate-400 shadow-sm">{{ t('analysis.prioBuffer') }}</span>
                    </div>
                </div>
            </div>
            
            <div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4">{{ t('analysis.jokerTitle') }}</h3>
                <p class="text-gray-600 dark:text-slate-400 mb-4">
                    <span v-html="t('analysis.jokerP')"></span>
                </p>
                <ul class="space-y-3">
                    <li class="flex gap-3">
                        <div class="min-w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">A</div>
                        <span class="text-sm text-gray-700 dark:text-slate-300 pt-1">
                            <span v-html="t('analysis.jokerA')"></span>
                        </span>
                    </li>
                    <li class="flex gap-3">
                        <div class="min-w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">B</div>
                        <span class="text-sm text-gray-700 dark:text-slate-300 pt-1">
                            <span v-html="t('analysis.jokerB')"></span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <hr class="border-gray-100 dark:border-slate-800 my-12">

        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-6">
            <i class="ph-bold ph-sort-descending text-blue-600 dark:text-blue-400"></i>
            {{ t('analysis.discardTitle') }}
        </h2>
        <p class="text-gray-600 dark:text-slate-400">
            <span v-html="t('analysis.discardP')"></span>
        </p>
        <div class="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 mt-6 relative overflow-hidden">
             <div class="absolute right-0 top-0 opacity-10 dark:opacity-5">
                <i class="ph-fill ph-stack text-9xl"></i>
             </div>
             <h4 class="font-bold text-gray-800 dark:text-slate-200 mb-2">{{ t('analysis.whyDesc') }}</h4>
             <p class="text-sm text-gray-600 dark:text-slate-400 max-w-lg">
                {{ t('analysis.whyDescP') }}
             </p>
        </div>
    </section>

    <!-- Mathematical Background -->
    <section class="prose prose-blue max-w-none bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <i class="ph-bold ph-function text-blue-600 dark:text-blue-400"></i>
            {{ t('analysis.mathTitle') }}
        </h2>
        <div class="mt-6 space-y-6">
            <p class="text-gray-700 dark:text-slate-300">
                <span v-html="t('analysis.mathP')"></span>
            </p>
            
            <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-blue-200 dark:border-slate-700">
                <h3 class="text-lg font-bold text-gray-800 dark:text-slate-200 mb-3">{{ t('analysis.agentTitle') }}</h3>
                <p class="text-sm text-gray-600 dark:text-slate-400 mb-4">
                    {{ t('analysis.agentP') }}
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div class="font-bold text-blue-900 dark:text-blue-300 mb-2">{{ t('analysis.trainingScope') }}</div>
                        <div class="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">1.000.000</div>
                        <div class="text-xs text-blue-600 dark:text-blue-400">{{ t('analysis.trainingRuns') }}</div>
                    </div>
                    <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div class="font-bold text-green-900 dark:text-green-300 mb-2">{{ t('analysis.winVsBaseline') }}</div>
                        <div class="text-2xl font-mono font-bold text-green-600 dark:text-green-400">&gt; 90%</div>
                        <div class="text-xs text-green-600 dark:text-green-400">{{ t('analysis.confirmed') }}</div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-blue-200">
                <h3 class="text-lg font-bold text-gray-800 mb-3">{{ t('analysis.metricsTitle') }}</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li class="flex items-start gap-2">
                        <i class="ph-bold ph-arrow-up text-blue-600 mt-1"></i>
                        <span><strong>Vorratsstapel-Velocity (VSV):</strong> Durchschnittliche Anzahl der Karten, die pro Zug direkt vom Stockpile entfernt werden</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="ph-bold ph-link text-blue-600 mt-1"></i>
                        <span><strong>Maximale Zugkettenlänge (MZL):</strong> Gesamtanzahl der gespielten Karten vor dem obligatorischen Ablegen</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Statistical Tables -->
    <section class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-8">
            <i class="ph-bold ph-chart-bar text-blue-600 dark:text-blue-400"></i>
            {{ t('analysis.statsTitle') }}
        </h2>

        <!-- Card Source Priority Table -->
        <div class="mb-12">
            <h3 class="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4">{{ t('analysis.cardSourceTableH') }}</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
                            <th class="text-left p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colSource') }}</th>
                            <th class="text-center p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colPrio') }}</th>
                            <th class="text-center p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colShare') }}</th>
                            <th class="text-center p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colVsv') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <td class="p-3 font-medium text-gray-900 dark:text-slate-200">{{ t('analysis.stockRow') }}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs">{{ t('analysis.highest') }}</span>
                            </td>
                            <td class="p-3 text-center font-mono">25%</td>
                            <td class="p-3 text-center font-mono font-bold text-red-600">1.0</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <td class="p-3 font-medium text-gray-900 dark:text-slate-200">{{ t('analysis.handRow') }}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 px-2 py-1 rounded font-bold text-xs">2</span>
                            </td>
                            <td class="p-3 text-center font-mono dark:text-slate-400">50%</td>
                            <td class="p-3 text-center font-mono dark:text-slate-400">0.45</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                            <td class="p-3 font-medium text-gray-900 dark:text-slate-200">{{ t('analysis.discardRow') }}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-1 rounded font-bold text-xs">3</span>
                            </td>
                            <td class="p-3 text-center font-mono dark:text-slate-400">25%</td>
                            <td class="p-3 text-center font-mono dark:text-slate-400">0.25</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="text-xs text-gray-500 mt-3 italic">
                {{ t('analysis.handNote') }}
            </p>
        </div>

        <!-- Discard Strategy Table -->
        <div class="mb-12">
            <h3 class="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4">{{ t('analysis.discardTableH') }}</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
                            <th class="text-left p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colSchema') }}</th>
                            <th class="text-left p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colFeature') }}</th>
                            <th class="text-center p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colChain') }}</th>
                            <th class="text-center p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.winVsBaseline') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100 dark:border-slate-800 bg-green-50 dark:bg-green-900/10">
                            <td class="p-3 font-bold text-green-800 dark:text-green-300">{{ t('analysis.descRow') }}</td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.descFeat') }}</td>
                            <td class="p-3 text-center font-mono font-bold text-green-600 dark:text-green-400">1.05</td>
                            <td class="p-3 text-center font-mono font-bold text-green-600 dark:text-green-400">+15%</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                            <td class="p-3 font-medium text-gray-900 dark:text-slate-200">{{ t('analysis.clusterRow') }}</td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.clusterFeat') }}</td>
                            <td class="p-3 text-center font-mono dark:text-slate-400">0.95</td>
                            <td class="p-3 text-center font-mono text-yellow-600">+5%</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <td class="p-3 font-medium text-gray-900 dark:text-slate-200">{{ t('analysis.ascRow') }}</td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.ascFeat') }}</td>
                            <td class="p-3 text-center font-mono dark:text-slate-400">0.70</td>
                            <td class="p-3 text-center font-mono text-red-600">-10%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Joker Value Table -->
        <div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4">{{ t('analysis.jokerTableH') }}</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
                            <th class="text-left p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colValue') }}</th>
                            <th class="text-left p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colFunc') }}</th>
                            <th class="text-center p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colUsage') }}</th>
                            <th class="text-left p-3 font-bold text-gray-700 dark:text-slate-300">{{ t('analysis.colPurpose') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100 dark:border-slate-800 bg-green-50 dark:bg-green-900/10">
                            <td class="p-3 font-bold text-green-800 dark:text-green-300">{{ t('analysis.joker12') }}</td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.joker12Func') }}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">{{ t('analysis.high') }}</span>
                            </td>
                            <td class="p-3 text-gray-700">{{ t('analysis.tempo') }}</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-slate-800 bg-green-50 dark:bg-green-900/10">
                            <td class="p-3 font-bold text-green-800 dark:text-green-300">{{ t('analysis.jokerN') }}</td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.jokerNFunc') }}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">{{ t('analysis.high') }}</span>
                            </td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.mvsc') }}</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                            <td class="p-3 font-medium text-gray-900 dark:text-slate-200">{{ t('analysis.joker1') }}</td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.joker1Func') }}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">{{ t('analysis.midLow') }}</span>
                            </td>
                            <td class="p-3 text-gray-700">{{ t('analysis.unlock') }}</td>
                        </tr>
                        <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <td class="p-3 font-medium text-gray-900 dark:text-slate-200">{{ t('analysis.jokerOther') }}</td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.jokerOtherFunc') }}</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">{{ t('analysis.mid') }}</span>
                            </td>
                            <td class="p-3 text-gray-700 dark:text-slate-400">{{ t('analysis.handMin') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Offensive vs Defensive Strategy -->
    <section class="prose prose-blue max-w-none bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <i class="ph-bold ph-sword-cross text-red-600"></i>
            {{ t('analysis.offensiveTitle') }}
        </h2>
        <div class="mt-6 space-y-6">
            <div class="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-xl">
                <h3 class="text-lg font-bold text-red-900 dark:text-red-300 mb-3">{{ t('analysis.defEmpiricalH') }}</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    <span v-html="t('analysis.defEmpiricalP')"></span>
                </p>
                <div class="bg-white dark:bg-slate-900 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 dark:text-slate-400 font-medium mb-2">{{ t('analysis.defException') }}</p>
                    <p class="text-sm text-gray-600 dark:text-slate-400">
                        <span v-html="t('analysis.defExceptionP')"></span>
                    </p>
                </div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-6 rounded-r-xl">
                <h3 class="text-lg font-bold text-green-900 dark:text-green-300 mb-3">{{ t('analysis.offH') }}</h3>
                <p class="text-gray-700 dark:text-gray-300">
                    <span v-html="t('analysis.offP')"></span>
                </p>
            </div>
        </div>
    </section>

  </div>
</template>

<style scoped>
.card-gradient {
    position: relative;
    overflow: hidden;
}
.card-gradient::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444, #3b82f6);
    opacity: 0.5;
}
</style>
