<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

      <!-- Header with Gradient -->
      <div class="bg-gradient-to-r from-skipbo-red to-skipbo-red/80 px-8 py-10 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
          <i class="ph-bold ph-robot text-[150px]"></i>
        </div>
        <h1 class="text-3xl font-bold mb-2 relative z-10">{{ t('about.title') }}</h1>
        <p class="text-red-100 text-lg relative z-10">{{ t('about.subtitle') }}</p>
      </div>

      <div class="p-8 space-y-8">
        <!-- Origin Story -->
        <section class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="bg-blue-50 p-3 rounded-xl">
              <i class="ph-fill ph-chat-teardrop-text text-2xl text-skipbo-blue"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('about.originH') }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ t('about.originP') }}</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="bg-green-50 p-3 rounded-xl">
              <i class="ph-fill ph-paint-brush-broad text-2xl text-skipbo-green"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('about.canvasH') }}</h3>
              <p class="text-gray-600 leading-relaxed">
                {{ t('about.canvasP1') }}
                <a href="https://github.com/stritti/skip-bo-strategy-evaluation/blob/main/SkipBo_Real_Simulation_App.html"
                   target="_blank" class="hover:opacity-80 transition-opacity">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border border-gray-200">
                    {{ t('about.fileName') }}
                    <i class="ph-bold ph-arrow-square-out inline-block ml-1 text-xs text-gray-400"></i>
                  </code>
                </a>
                {{ t('about.canvasP2') }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="bg-purple-50 p-3 rounded-xl">
              <i class="ph-fill ph-sparkle text-2xl text-purple-600"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('about.vibeH') }}</h3>
              <p class="text-gray-600 leading-relaxed" v-html="t('about.vibeP')"></p>
              <div class="mt-4 bg-purple-50 border border-purple-100 rounded-lg p-4">
                <p class="text-purple-900 font-medium italic">{{ t('about.vibeQuote') }}</p>
              </div>
            </div>
          </div>

          <!-- Academic Research -->
          <div class="flex items-start gap-4">
            <div class="bg-indigo-50 p-3 rounded-xl">
              <i class="ph-fill ph-graduation-cap text-2xl text-indigo-600"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('about.researchH') }}</h3>
              <p class="text-gray-600 leading-relaxed mb-4" v-html="t('about.researchP')"></p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/documents/Deterministic_SkipBo_HPVP_Agent_Analysis.pdf" target="_blank"
                   class="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div class="bg-indigo-50 p-2 rounded-lg mr-4 group-hover:bg-indigo-100 transition-colors">
                    <i class="ph-bold ph-file-pdf text-xl text-indigo-600"></i>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ t('about.paper') }}</div>
                    <div class="text-xs text-gray-500">{{ t('about.paperSub') }}</div>
                  </div>
                  <i class="ph-bold ph-download-simple ml-auto text-gray-300 group-hover:text-indigo-600"></i>
                </a>

              </div>
            </div>
          </div>
        </section>

        <!-- Disclaimer -->
        <div class="border-t border-gray-100 pt-8 mt-8 space-y-4">
          <div class="flex items-center gap-3 text-gray-400 justify-center">
            <i class="ph-bold ph-warning-circle text-xl"></i>
            <span class="font-medium">{{ t('about.disclaimer') }}</span>
          </div>

          <!-- KI-Transparenz (EU AI Act Art. 50) -->
          <div class="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start gap-3">
            <i class="ph-bold ph-robot text-2xl text-purple-600 mt-0.5"></i>
            <div class="text-sm text-purple-900">
              <strong>{{ t('about.aiTitle') }}</strong> {{ t('about.aiBody') }}
            </div>
          </div>

          <div class="text-center text-xs text-gray-400">{{ t('about.copyright') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
